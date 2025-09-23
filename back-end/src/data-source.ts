import "reflect-metadata";
import { DataSource } from "typeorm";
import {User} from "./models/User";
import { Product } from "./models/Product";
import { Order } from "./models/Order";

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