import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";


export const getProfile = (req: AuthRequest, res: Response) =>{
  res.json({message: "Protected route", user: req.user});
};