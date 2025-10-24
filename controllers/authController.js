import User, {validateRegisterUser, validateOTP, validateLogin} from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

/**
 * @desc Register
 * @route /api/auth/register
 * @method POST
 * @access public 
 */
export const register = async (req, res) => {
    const {error} = validateRegisterUser(req.body)
    if(error)
        return res.status(400).json({message: error.details[0].message})

    try{

        let user = await User.findOne({email: req.body.email})
        if(user)
            return res.status(400).json({message: 'this is user already registered'})
        
        user = new User(req.body);
        await user.save();

        res.status(200).send("A verification code has been sent to your email. Please verify your account using the code.");
    } catch(error){
        res.status(500).json({message: error.message})
    }
}

/**
 * @desc verify OTP
 * @route /api/auth/verify-otp
 * @method POST
 * @access public 
 */
export const verifyOTP = async (req, res) => {
    try {
    const { error } = validateOTP(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("user not found.");

    if (!user.otp || !user.otp.code)
        return res.status(400).send("no OTP code found. Please request a new one.");

    if (new Date() > user.otp.expiresAt){
        user.otp = undefined; // نحذف الكود
        await user.save();
        return res.status(400).send("expired OTP code. Please request a new one.");
    }
    const maxAttempts = 5; // maximum number of allowed attempts
    if (user.otp.attempts >= maxAttempts){
            user.otp = undefined; // نحذف الكود
            await user.save();
            return res.status(400).send("too many incorrect attempts. Please request a new OTP code.");
    }

    if (user.otp.code !== code) {
        user.otp.attempts += 1;
        await user.save();
        return res.status(400).send("invalid OTP code.");
    }

    user.otp = undefined; // نحذف الكود
    await user.save();
    const token = user.generateToken(req.ip);
    res.status(200).send({message: "your account has been verified successfully.", token: token});
    } catch (error) {
    res.status(500).send({message: error.message});
    }
}

/**
 *  @desc Login User
 *  @route /api/auth/login
 *  @method POST
 *  @access public
 */
export const login = async (req, res)=>{
    const {error} = validateLogin(req.body)
    if (error)
        return res.status(400).json({message: error.details[0].message})

    try{
        let user = await User.findOne({email: req.body.email});
        if (!user)
            return res.status(400).json({message: "wrong data."});
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
        user.otp = { code: otpCode, expiresAt, attempts: 0 };
        await user.save();
        const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });

        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "OTP code for account verification",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
        <div style="max-width: 400px; margin: auto; background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #0f57ffff;">رمز التحقق (OTP)</h2>
            <p style="font-size: 16px; color: #333;">استخدم هذا الرمز لتأكيد تسجيل الدخول:</p>
            <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; margin: 20px 0; color: #000;">
            ${otpCode}
            </div>
            <p style="color: #888;">الرمز صالح لمدة 2 دقائق فقط.</p>
        </div>
        </div>
        `,
        });

        res.status(200).send("A verification code has been sent to your email. Please verify your account using the code.");
    } catch(error){
        res.status(500).json({message: error.message});
    }
}