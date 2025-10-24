import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";
import dotenv from "dotenv";
dotenv.config();



export const generateQRToken = async (req, res) => {
    try {
    const { subjectId } = req.body;

    const token = jwt.sign(
        {
        subjectId,
        instructorId: req.user.id,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        process.env.JWT_SECRET_KEY
    );

    res.status(200).json({ token });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};

export const markAttendance = async (req, res) => {
    try {
        const { token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { subjectId } = decoded;

        // check if user is student
        const student = await User.findById(req.user.id);
        if (!student || student.role !== 1)
            return res.status(403).send({ message: "Only students can mark attendance" });

        // check if attendance already marked
        const exists = await Attendance.findOne({
            student: student._id,
            subject: subjectId,
            sessionId: token
        });
        if (exists) return res.status(400).send({ message: "Already marked" });

        // mark attendance
        const attendance = new Attendance({
            student: student._id,
            subject: subjectId,
            sessionId: token,
            status: "present"
        });

        await attendance.save();

        res.status(200).send({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(400).send({ message: "Invalid or expired QR code" });
    }
};