import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { AppDataSource } from "../config/database.js";
import { Order } from "../entity/Order.js";
import { User } from "../entity/User.js";
import { Book } from "../entity/Book.js";

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const userRepo = AppDataSource.getRepository(User);
    const bookRepo = AppDataSource.getRepository(Book);

    const orders = await orderRepo.find({ where: { isPaid: true } });
    const totalSales = orders.reduce(
      (sum, order) => sum + Number(order.totalPrice),
      0
    );

    const totalOrders = await orderRepo.count();
    const totalUsers = await userRepo.count();
    const totalBooks = await bookRepo.count();

    const recentOrders = await orderRepo.find({
      take: 5,
      order: { createdAt: "DESC" },
      relations: ["user"],
    });

    res.status(200).json({
      totalSales: totalSales.toFixed(2),
      totalOrders,
      totalUsers,
      totalBooks,
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
        customerName: `${order.user.firstName} ${order.user.lastName}`,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard statistics" });
  }
};
