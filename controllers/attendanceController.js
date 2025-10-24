import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();


/**
 *  @desc Generate QR Token
 *  @route /api/attendance/generate-token/:id
 *  @method POST
 *  @access public
 */
export const generateQRToken = async (req, res) => {
    try {
    const subjectId = req.params.id;
    const userId = req.body.userId;

    const user = await User.findById(userId);
    // check if user is instructor
    if (!user || user.role !== 2)
        return res.status(403).json({ message: "Only instructors can generate QR tokens" });

    const token = jwt.sign(
        {
        subjectId,
        instructorId: userId,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        process.env.JWT_SECRET_KEY
    );

    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};



/**
 *  @desc Mark Attendance
 *  @route /api/attendance/mark/:id
 *  @method POST
 *  @access public
 */
export const markAttendance = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.params.id;

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { subjectId } = decoded;
        
        // check if user is student
        const student = await User.findById(userId);
        if (!student || student.role !== 1)
            return res.status(403).send({ message: "Only students can mark attendance" });

        // check if attendance already marked today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const exists = await Attendance.findOne({
            student: student._id,
            subject: subjectId,
            date: { $gte: todayStart, $lte: todayEnd }
        });
        if (exists) return res.status(400).send({ message: "Already marked" });

        // mark attendance
        const attendance = new Attendance({
            student: student._id,
            subject: subjectId,
            status: "present"
        });

        await attendance.save();

        res.status(200).send({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(400).send({ message: "Invalid or expired QR code" });
    }
};