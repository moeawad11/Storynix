import { Router } from "express";
import { getBooks, getBookById } from "../controllers/bookController.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);

export default router;
