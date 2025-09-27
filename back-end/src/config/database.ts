import "reflect-metadata";
import { DataSource } from "typeorm";
import {User} from "../entity/User.js";
import { Product } from "../entity/Product.js";
import { Order } from "../entity/Order.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [User, Product, Order],
  migrations:[],
  subscribers:[],
});