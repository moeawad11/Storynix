import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

interface DecodedToken{
  userId: number;
  email: string;
  role: string;
}

export interface AuthRequest extends Request{
  user?: DecodedToken;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction)=>{
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({message: "Authorization header missing"});
  }

  const token = authHeader.split(" ")[1];  
  if(!token){
    return res.status(401).json({message: "Token missing"});
  }
 
  try{
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    req.user = decodedToken;

    next();
  }catch(err){
    res.status(403).json({message: "Invalid or expired token"});
  }
};


export const authorize = (roles: string[])=>{
  return (req: AuthRequest, res: Response, next: NextFunction)=>{
    if(!req.user){
      return res.status(401).json({message: "User not authenticated"})
    }

    if(!roles.includes(req.user.role)){
      return res.status(403).json({message: "User not authorized to access this resource"});
    }
    next();
  }
}


