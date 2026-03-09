import cors from "cors";
import express, { Router } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const securityMiddleWare = Router();

securityMiddleWare.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

securityMiddleWare.use(helmet());
securityMiddleWare.use(cookieParser());
securityMiddleWare.use(express.json({ limit: "10kb" }));

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later." },
  skip: () => process.env.NODE_ENV === "test",
});

export default securityMiddleWare;
