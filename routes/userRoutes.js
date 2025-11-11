import express from "express";
import { AddUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/usersController.js";
import { verifyAdminToken } from "../middlewares/verifyToken.js";

const route = express.Router();

// /api/users
route.get("/", verifyAdminToken, getAllUsers);
route.post("/", verifyAdminToken, AddUser);

// /api/users/:id
route.route("/:id")
.put(verifyAdminToken, updateUser)
.delete(verifyAdminToken, deleteUser)
.get(verifyAdminToken, getUserById);

export default route;