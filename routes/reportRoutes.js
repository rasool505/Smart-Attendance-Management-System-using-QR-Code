import express from "express";
import { getMonthlyReport0 } from "../controllers/reportController.js";

const router = express.Router();

//GET /api/reports?subjectId=39e4t2&month=10&year=2025
router.get("/", getMonthlyReport0);


export default router;