import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";

/**
 *  @desc Get Monthly Attendance Report
 *  @route /api/report/monthly
 * @method GET
 * @access public
 * */
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

/**
 *  @desc Get Monthly Attendance Report (Updated for students array)
 *  @route /api/report/monthly
 * @method GET
 * @access public
 */
export const getMonthlyReport0 = async (req, res) => {
  try {
    const { subjectId, month, year } = req.query;

    if (!subjectId || !month || !year)
      return res.status(400).send({ message: "subjectId, month, and year are required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // جلب كل الجلسات للمادة ضمن الشهر
    const sessions = await Attendance.find({
      subject: subjectId,
      date: { $gte: startDate, $lte: endDate }
    }).populate("students.student", "name");

    const totalSessions = sessions.length; // عدد الجلسات الكلي

    // تجميع الحضور والإجازات لكل طالب
    const reportMap = new Map();

    sessions.forEach(session => {
      session.students.forEach(s => {
        const id = s.student._id.toString();
        if (!reportMap.has(id)) {
          reportMap.set(id, {
            studentId: id,
            studentName: s.student.name,
            present: 0,
            leave: 0
          });
        }
        if (s.status === "present") reportMap.get(id).present++;
        if (s.status === "leave") reportMap.get(id).leave++;
      });
    });

    const report = Array.from(reportMap.values()).map(r => ({
      ...r,
      absent: totalSessions - (r.present + r.leave) < 0 ? 0 : totalSessions - (r.present + r.leave)
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