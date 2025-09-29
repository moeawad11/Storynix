import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { initializeDB } from './config/database.js';
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api", orderRoutes);

app.use((req,res)=>{
  res.status(404).json({message:"Route not found"});
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

await initializeDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});