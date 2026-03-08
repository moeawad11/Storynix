import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";
import bcrypt from "bcrypt";

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId)
      return res.status(401).json({ message: "User not authenticated" });

    const user = await AppDataSource.getRepository(User).findOneBy({
      id: userId,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const { password: _, ...userData } = user;
    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { firstName, lastName, email, currentPassword, newPassword } =
      req.body;

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.id = :id", { id: userId })
      .getOne();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email !== user.email) {
      const existingUser = await userRepo.findOneBy({ email });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return res
          .status(400)
          .json({ message: "Current password is required to change password" });
      }

      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect" });
      }

      const rounds = process.env.NODE_ENV === "test" ? 1 : 12;
      user.password = await bcrypt.hash(newPassword, rounds);
    }

    await userRepo.save(user);

    const { password: _, ...userData } = user;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userData,
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
