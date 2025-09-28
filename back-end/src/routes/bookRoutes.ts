import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { getBooks, createBook, getBookById, updateBook, deleteBook } from "../controllers/bookController.js";

const router = Router();

router.get("/books", getBooks);
router.get("/books/:id", getBookById);


router.post("/books", authenticate, authorize(["admin"]), createBook );
router.put("/books/:id", authenticate, authorize(["admin"]), updateBook);
router.delete("/books/:id", authenticate, authorize(["admin"]), deleteBook);

export default router;