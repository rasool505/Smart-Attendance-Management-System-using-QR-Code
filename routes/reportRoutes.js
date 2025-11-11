import express from "express";
import { getMonthlyReport } from "../controllers/reportController.js";
import { verifyInstructorToken } from "../middlewares/verifyToken.js";
const router = express.Router();

//GET /api/reports?subjectId=39e4t2&month=10&year=2025
router.get("/", verifyInstructorToken, getMonthlyReport);


export default router;