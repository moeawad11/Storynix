import cors from "cors";
import express, { Router } from "express";

const securityMiddleWare = Router();

securityMiddleWare.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

securityMiddleWare.use(express.json());

export default securityMiddleWare;
