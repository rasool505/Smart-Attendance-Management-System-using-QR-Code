import express from "express";
import { AddUser, deleteUser, getAllInstructors, getAllStudents, getUserById, updateUser } from "../controllers/usersController.js";
import { verifyAdminToken } from "../middlewares/verifyToken.js";

const route = express.Router();

// /api/users
route.get("/students", verifyAdminToken, getAllStudents);
route.get("/instructors", verifyAdminToken, getAllInstructors);
route.post("/", verifyAdminToken, AddUser);

// /api/users/:id
route.route("/:id")
.put(verifyAdminToken, updateUser)
.delete(verifyAdminToken, deleteUser)
.get(verifyAdminToken, getUserById);

export default route;