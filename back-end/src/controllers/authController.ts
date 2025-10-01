import { Request, Response } from "express";
import { AppDataSource } from "../config/database.js";
import { User } from "../entity/User.js";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  try {
    let { firstName, lastName, email, password } = req.body;
    if (!email || !password || !firstName || !lastName)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase();

    const userRepo = AppDataSource.getRepository(User);

    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser)
      return res.status(409).json({ message: "Email already in use" });

    const user = userRepo.create({ email, password, firstName, lastName });
    await userRepo.save(user);

    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user;
    res.status(201).json({ user: userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    email = email.toLowerCase();
    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(401).json({ message: "User does not exist" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      {
        userId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = user;
    res.status(200).json({ user: userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
