import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/User.js";
import { Book } from "../entity/Book.js";
import { Order } from "../entity/Order.js";
import { Cart } from "../entity/Cart.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Book, Order, Cart],
  migrations: [],
  subscribers: [],
});

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB init error", err);
    process.exit(1);
  }
};
