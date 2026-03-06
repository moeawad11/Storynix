import { AppDataSource } from "./data-source.js";

export const initializeDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("DB init error", err);
    process.exit(1);
  }
};
