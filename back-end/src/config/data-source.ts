import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { User } from "../entity/User.js";
import { Book } from "../entity/Book.js";
import { Order } from "../entity/Order.js";
import { Cart } from "../entity/Cart.js";
import { Initial1772755945265 } from "../migration/1772755945265-InitialSchema.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== "production",
  entities: [User, Book, Order, Cart],
  migrations: [Initial1772755945265],
  subscribers: [],
});
