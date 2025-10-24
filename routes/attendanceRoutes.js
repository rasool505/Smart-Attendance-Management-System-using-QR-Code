import express from "express";
import { markAttendance } from "../controllers/attendanceController.js";
const route = express.Router();
// /api/attendance/generate-token
route.post("/generate-token", markAttendance);
// /api/attendance/mark
route.post("/mark", markAttendance);
export default route;