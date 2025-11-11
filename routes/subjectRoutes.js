import express from "express";
import { addSubject, deleteSubject, getAllSubjects, getAllSubjectsOfInstructor } from "../controllers/subjectController.js";
import { StudentsAssignedToSubject } from "../controllers/subjectController.js";
import { verifyAdminToken, verifyInstructorToken } from "../middlewares/verifyToken.js";

const route = express.Router();


// /api/subject/instructor/:id
route.get("/instructor/:id", verifyInstructorToken, getAllSubjectsOfInstructor);
// /api/subject
route.get("/", verifyAdminToken, getAllSubjects);
// /api/subject
route.post("/", verifyAdminToken, addSubject);
// /api/subject/mark
route.delete("/:id", verifyAdminToken, deleteSubject);
// /api/subject/studentsAssignedToSubject
route.patch("/studentsAssignedToSubject", verifyAdminToken, StudentsAssignedToSubject);


export default route;