import express from "express";
import { addSubject, deleteSubject } from "../controllers/subjectController.js";
const route = express.Router();

// /api/subject
route.post("/", addSubject);
// /api/attendance/mark
route.delete("/:id", deleteSubject);


export default route;