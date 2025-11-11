import express from "express";
import { markAttendance, generateQRSession, markAttendanceForLeave } from "../controllers/attendanceController.js";
import { verifyInstructorToken, verifyUserToken } from "../middlewares/verifyToken.js";
const route = express.Router();
// /api/attendance/generate-session/:id
route.post("/generate-session/:id", verifyInstructorToken, generateQRSession);
// /api/attendance/mark
route.post("/mark", verifyUserToken, markAttendance);
// /api/attendance/mark/leave
route.post("/mark/leave", verifyInstructorToken, markAttendanceForLeave);
export default route;