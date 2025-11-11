import Attendance from "../models/Attendance.js";

/**
 *  @desc Get Monthly Attendance Report (Updated for students array)
 *  @route /api/report/monthly
 * @method GET
 * @access public
//  */
// export const getMonthlyReport = async (req, res) => {
//   try {
//     const { subjectId, month, year } = req.query;

//     if (!subjectId || !month || !year)
//       return res.status(400).json({ message: "subjectId, month, and year are required" });

//     const startDate = new Date(year, month - 1, 1);
//     const endDate = new Date(year, month, 0, 23, 59, 59, 999);

//     // get all attendance sessions for the subject in the specified month
//     const sessions = await Attendance.find({
//       subject: subjectId,
//       date: { $gte: startDate, $lte: endDate }
//     }).populate("students.student", "name");

//     const totalSessions = sessions.length; // total number of sessions in the month
//     // aggregate attendance data per student
//     const reportMap = new Map();

//     sessions.forEach(session => {
//       session.students.forEach(s => {
//         const id = s.student._id.toString();
//         if (!reportMap.has(id)) {
//           reportMap.set(id, {
//             studentId: id,
//             studentName: s.student.name,
//             present: 0,
//             leave: 0
//           });
//         }
//         if (s.status === "present") reportMap.get(id).present++;
//         if (s.status === "leave") reportMap.get(id).leave++;
//       });
//     });

//     const report = Array.from(reportMap.values()).map(r => ({
//       ...r,
//       absent: totalSessions - (r.present + r.leave) < 0 ? 0 : totalSessions - (r.present + r.leave)
//     }));

//     res.status(200).json({
//       subjectId,
//       month: Number(month),
//       year: Number(year),
//       totalSessions,
//       report
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: "Failed to generate report", error: error.message });
//   }
// };
export const getMonthlyReport = async (req, res) => {
  try {
    const { subjectId, month, year } = req.query;

    if (!subjectId || !month || !year)
      return res.status(400).json({ message: "subjectId, month, and year are required" });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    // الحصول على الجلسات مع بيانات المادة والمدرس
    const sessions = await Attendance.find({
      subject: subjectId,
      date: { $gte: startDate, $lte: endDate }
    })
      .populate({
        path: "subject",
        select: "name instructor department stage",
        populate: { path: "instructor", select: "name" }
      })
      .populate("students.student", "name");

    if (!sessions.length)
      return res.status(404).json({ message: "No attendance sessions found for this subject in the selected month." });

    const totalSessions = sessions.length;

    // بيانات المادة والمدرس
    const subjectData = sessions[0].subject;
    const subjectName = subjectData?.name || "Unknown";
    const instructorName = subjectData?.instructor?.name || "Unknown";
    const department = subjectData?.department || "Unknown";
    const stage = subjectData?.stage || "Unknown";

    // تجميع بيانات الطلاب
    const reportMap = new Map();
    sessions.forEach(session => {
      const sessionDate = session.date;
      const date = new Date(sessionDate);
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
      const formatted = `${day}/${month}/${year}`;
      session.students.forEach(s => {
        const id = s.student._id.toString();
        if (!reportMap.has(id)) {
          reportMap.set(id, {
            studentId: id,
            studentName: s.student.name,
            dates: []
          });
        }
      if (s.status === "present") {
        reportMap.get(id).present++;
        reportMap.get(id).dates.push({ date: formatted, status: "present" });
      }
      if (s.status === "leave") {
        reportMap.get(id).leave++;
        reportMap.get(id).dates.push({ date: formatted, status: "leave" });
      }
      if (s.status === "absent") {
        reportMap.get(id).dates.push({ date: formatted, status: "absent" });
      }
      });
          });

    const report = Array.from(reportMap.values()).map(r => ({
      ...r
    }));

    res.status(200).json({
      subjectId,
      subjectName,
      instructorName,
      department,
      stage,
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