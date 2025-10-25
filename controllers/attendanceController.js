import jwt from "jsonwebtoken";
import Attendance from "../models/Attendance.js";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();


/**
 *  @desc Generate QR Token
 *  @route /api/attendance/generate-session/:id
 *  @method POST
 *  @access public
 */
export const generateQRSession = async (req, res) => {
    try {
    const subjectId = req.params.id; // get subject id from params
    const userId = req.body.userId;

    const user = await User.findById(userId);
    // check if user is instructor
    if (!user || user.role !== 2)
        return res.status(403).json({ message: "Only instructors can generate QR sessions" });

    // check if attendance already marked today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        //check if attendance record exists for today
        const exists = await Attendance.findOne({
            subject: subjectId,
            date: { $gte: todayStart, $lte: todayEnd }
        });
        if (exists) {
        return res.status(400).json({ message: "Attendance has already been marked for today" });
        }

        const getAllStudents = await User.find({ subjects: subjectId }); // get all students
        const students = getAllStudents.map(s =>(
        {
            student: s._id,
            status: "absent",

        }
        ));

    // create new attendance record
    const attendance = new Attendance({
        subject: subjectId,
        students: students
    });
    await attendance.save();

    // generate JWT token
    const session = jwt.sign(
        {
        instructorId: userId,
        attendanceId: attendance._id,
        exp: Math.floor(Date.now() / 1000) + 10 * 60,
        },
        process.env.JWT_SECRET_KEY
    );

    res.status(200).json({ session });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
};



/**
 *  @desc Mark Attendance
 *  @route /api/attendance/mark
 *  @method POST
 *  @access public
 */
export const markAttendance = async (req, res) => {
    try {
        const { session, userId } = req.body;

        const decoded = jwt.verify(session, process.env.JWT_SECRET_KEY);
        const { attendanceId } = decoded;
        
        // check if user is student
        const student = await User.findById(userId);
        if (!student || student.role !== 1)
            return res.status(403).send({ message: "Only students can mark attendance" });

        // check if attendance already marked today
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        //check if attendance record exists for today
        const exists = await Attendance.findById(attendanceId);

        // mark student in attendance
        if (exists){
            // add student to existing attendance record
            const studentRecord = exists.students.find(s => s.student.toString() === userId);
            if (!studentRecord)
                return res.status(404).send({ message: "Student not found in attendance record" });

            if (studentRecord.status === "present" || studentRecord.status === "leave") {
                return res.status(200).send({ message: "Attendance already marked for today" });
            }

            studentRecord.status = "present";
            await exists.save();
            return res.status(200).send({ message: "Attendance marked successfully" });
        }

    } catch (error) {
        res.status(400).send({ message: "Invalid or expired QR code" });
    }
};