import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { AppDataSource } from "../config/database.js";
import { Book } from "../entity/Book.js";
import { FindManyOptions, ILike } from "typeorm";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 25;
const DEFAULT_PAGE = 1;

export const getBooks = async (req: Request, res: Response) => {
  try {
    const bookRepo = AppDataSource.getRepository(Book);
    const { limit: limitQuery, page: pageQuery, author, search } = req.query;

    let limit = parseInt(limitQuery as string, 10);
    let page = parseInt(pageQuery as string, 10);

    if (isNaN(limit) || limit < 1) limit = DEFAULT_LIMIT;
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    if (isNaN(page) || page < 1) page = DEFAULT_PAGE;

    const skip = (page - 1) * limit;

    const where: FindManyOptions<Book>["where"] = {};

    if (author && typeof author == "string") where.author = author;

    if (search && typeof search == "string") where.title = ILike(`%${search}%`);

    const [books, total] = await bookRepo.findAndCount({
      where,
      take: limit,
      skip,
      order: { title: "ASC" },
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data: books,
      meta: {
        totalItems: total,
        currentPage: page,
        itemsPerPage: limit,
        totalPages: totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid book ID format." });

  try {
    const bookRepo = AppDataSource.getRepository(Book);

    const book = await bookRepo.findOneBy({ id });

    if (!book)
      return res.status(404).json({ message: `Book with ID ${id} not found.` });

    res.status(200).json({ data: book });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Server failed to fetch book with id=${id}` });
  }
};

export const createBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, description, isbn, price, stockQuantity, images } =
      req.body;

    if (
      !title ||
      !author ||
      !isbn ||
      price === undefined ||
      stockQuantity === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bookRepo = AppDataSource.getRepository(Book);

    const existingBook = await bookRepo.findOneBy({ isbn });
    if (existingBook)
      return res
        .status(409)
        .json({ message: "A book with this ISBN already exists." });

    const newBook = bookRepo.create({
      title,
      author,
      description: description || "No description provided.",
      isbn,
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      images: images || [],
    });

    await bookRepo.save(newBook);

    res.status(201).json({
      message: "Book creation endpoint hit (ADMIN ACCESS GRANTED)",
      role: req.user?.role,
      bookData: req.body,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while attempting to create book." });
  }
};

export const updateBook = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid book ID format." });

  try {
    const { title, author, description, isbn, price, stockQuantity, images } =
      req.body;

    if (
      !title ||
      !author ||
      !isbn ||
      price === undefined ||
      stockQuantity === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const bookRepo = AppDataSource.getRepository(Book);

    const bookToUpdate = await bookRepo.findOneBy({ id });
    if (!bookToUpdate)
      return res.status(404).json({ message: `Book with ID ${id} not found` });

    if (bookToUpdate.isbn != isbn) {
      const existingBook = await bookRepo.findOneBy({ isbn });
      if (existingBook)
        return res
          .status(409)
          .json({ message: "The new ISBN is already in use by another book." });
    }

    bookToUpdate.title = title;
    bookToUpdate.author = author;
    bookToUpdate.description = description || "No description provided.";
    bookToUpdate.isbn = isbn;
    bookToUpdate.price = Number(price);
    bookToUpdate.stockQuantity = Number(stockQuantity);
    bookToUpdate.images = images || [];

    await bookRepo.save(bookToUpdate);

    res.status(200).json({
      message: "Book updated successfully.",
      book: bookToUpdate,
      role: req.user?.role,
    });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({
      message: `Server error while attempting to update book with id=${id}.`,
    });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0)
    return res.status(400).json({ message: "Invalid book ID format." });

  try {
    const bookRepo = AppDataSource.getRepository(Book);

    const bookToDelete = await bookRepo.findOneBy({ id });
    if (!bookToDelete)
      return res.status(404).json({ message: `Book with ID ${id} not found` });

    await bookRepo.delete(id);

    res.status(204).send();
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({
      message: `Server error while attempting to delete book with id=${id}.`,
    });
  }
};
