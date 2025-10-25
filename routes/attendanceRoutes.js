import express from "express";
import { markAttendance, generateQRSession } from "../controllers/attendanceController.js";
const route = express.Router();
// /api/attendance/generate-session/:id
route.post("/generate-session/:id", generateQRSession);
// /api/attendance/mark
route.post("/mark", markAttendance);
export default route;