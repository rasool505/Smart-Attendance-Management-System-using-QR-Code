import express from "express";
import { logger } from "./middlewares/logger.js";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import {notFound, errorHandler} from "./middlewares/errors.js";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import attendanceRouter from "./routes/attendanceRoutes.js";
import subjectRouter from "./routes/subjectRoutes.js";



// init env
dotenv.config();

//connect to db
connectDB();

// init app
const app = express();

// Apply middlaweres
app.use(express.json());
app.use(logger);

// Helmet
app.use(helmet());

// Cores policy
app.use(cors())

//Routes
app.use("/api/auth", authRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/subject", subjectRouter);


// Error middlawere
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, "0.0.0.0",()=>{
    console.log(`server runing in ${process.env.MODE_ENV} mode on: http://localhost:${process.env.PORT}/`);
})
