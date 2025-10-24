import express from "express";
import { login, register, verifyOTP } from "../controllers/authController.js";
import { verifyAdminToken } from "../middlewares/verifyToken.js";

const route = express.Router();

// /api/users/register
route.post("/register", verifyAdminToken, register)

// /api/users/login
route.post("/login", login)

// /api/users/verify-otp
route.post("/verify-otp", verifyOTP)


export default route;