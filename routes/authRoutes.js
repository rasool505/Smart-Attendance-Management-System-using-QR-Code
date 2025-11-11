import express from "express";
import { login, verifyOTP } from "../controllers/authController.js";

const route = express.Router();

// /api/users/login
route.post("/login", login)

// /api/users/verify-otp
route.post("/verify-otp", verifyOTP)


export default route;