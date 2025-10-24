import express from "express";
import { markAttendance, generateQRToken } from "../controllers/attendanceController.js";
const route = express.Router();
// /api/attendance/generate-token/:id
route.post("/generate-token/:id", generateQRToken);
// /api/attendance/mark
route.post("/mark", markAttendance);
export default route;