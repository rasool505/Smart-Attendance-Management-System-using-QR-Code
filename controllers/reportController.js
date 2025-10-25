import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";

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
      studentId,
      subjectId,
      date: { $gte: startDate, $lte: endDate }
    });

    const totalSessions = records.length;
    const present = records.filter(r => r.status === "present").length;
    const absent = totalSessions - present;

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
      absent,
      attendancePercentage: totalSessions ? (present / totalSessions) * 100 : 0,
      records
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating report", error });
  }
};