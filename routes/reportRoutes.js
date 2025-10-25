import express from "express";
import { getStudentSubjectMonthlyReport } from "../controllers/reportController.js";

const router = express.Router();

//GET /api/reports/monthly?subjectId=68fb1e3&subjectId=39e4t2&month=10&year=2025
router.get("/monthly", getStudentSubjectMonthlyReport);

export default router;