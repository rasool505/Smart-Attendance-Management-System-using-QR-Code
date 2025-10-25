import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import mongoose from "mongoose";

export const getStudentSubjectMonthlyReport = async (req, res) => {
    try {
        const { studentId, subjectId, month, year } = req.query;

        // تحقق من القيم المطلوبة
        if (!studentId || !subjectId || !month || !year) {
            return res.status(400).send({
                message: "student, subject, month, and year are required"
            });
        }

        // تحقق من وجود الطالب والمادة
        const studentExists = await User.findById(studentId);
        const subjectExists = await Subject.findById(subjectId);

        if (!studentExists || !subjectExists) {
            return res.status(404).send({
            message: "Student or Subject not found"
            });
        }

        // حساب بداية ونهاية الشهر
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // البحث في سجلات الحضور
        const records = await Attendance.find({
            student: studentId,
            subject: subjectId,
            date: { $gte: startDate, $lte: endDate }
        });

        const totalSessions = records.length;
        const present = records.filter(r => r.status === "present").length;
        const leave = records.filter(r => r.status === "leave").length;
        const absent = totalSessions - (present + leave);
        console.log(records)

        // إرسال التقرير
        res.status(200).send({
        student: {
            id: studentExists._id,
            name: studentExists.name
        },
            subject: {
            id: subjectExists._id,
            name: subjectExists.name
        },
            year,
            month,
            totalSessions,
            present,
            leave,
            absent,
            attendancePercentage: totalSessions ? (present / totalSessions) * 100 : 0,
            records
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error generating report", error });
    }
};
export const getMonthlyReport = async (req, res) => {
    try {
        const { subjectId, month, year } = req.query;

        if (!subjectId || !month || !year)
            return res.status(400).send({ message: "subjectId, month, and year are required" });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const records = await Attendance.find({
            subject: subjectId,
            date: { $gte: startDate, $lte: endDate }
        }).populate("student", "name");

        // عدد الجلسات الكلي (الأيام التي أقيمت فيها جلسة)
        const totalSessions = [...new Set(records.map(r => r.date.toDateString()))].length;

        // تجميع حسب الطالب
        const reportMap = new Map();

        records.forEach(r => {
        const id = r.student._id.toString();
        if (!reportMap.has(id)) {
            reportMap.set(id, { 
            studentId: id, 
            studentName: r.student.name, 
            present: 0, 
            leave: 0 
            });
        }
        if (r.status === "present") reportMap.get(id).present++;
        if (r.status === "leave") reportMap.get(id).leave++;
        });

        const report = Array.from(reportMap.values()).map(r => ({
            ...r,
            absent: totalSessions - (r.present + r.leave)
        }));

        res.status(200).send({
            subjectId,
            month: Number(month),
            year: Number(year),
            totalSessions,
            report
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to generate report", error: error.message });
    }
};