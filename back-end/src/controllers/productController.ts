import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
export const createProduct = (req: AuthRequest, res: Response) =>{
  res.json({message: "Product created successfully", user: req.user});
};