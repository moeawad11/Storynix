import { Response } from "express";
import { AppDataSource } from "../config/database.js";
import { Cart } from "../entity/Cart.js";
import { Book } from "../entity/Book.js";
import { AuthRequest } from "../middleware/auth.js";

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res.status(400).json({ message: "Book ID and quantity required" });
    }

    const cartRepo = AppDataSource.getRepository(Cart);
    const bookRepo = AppDataSource.getRepository(Book);

    const book = await bookRepo.findOne({ where: { id: bookId } });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let cartItem = await cartRepo.findOne({
      where: { user: { id: req.user!.userId }, book: { id: bookId } },
      relations: ["book", "user"],
    });

    const totalQuantity = (cartItem?.quantity || 0) + quantity;
    if (totalQuantity > book.stockQuantity) {
      return res.status(400).json({
        message: `Cannot add ${quantity} items. Only ${
          book.stockQuantity - (cartItem?.quantity || 0)
        } left in stock.`,
      });
    }

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartRepo.save(cartItem);
    } else {
      cartItem = cartRepo.create({
        user: { id: req.user!.userId } as any,
        book: { id: bookId } as any,
        quantity,
      });
      await cartRepo.save(cartItem);

      cartItem = await cartRepo.findOne({
        where: { id: cartItem.id },
        relations: ["book", "user"],
      });

      if (!cartItem) {
        return res
          .status(500)
          .json({ message: "Error retrieving saved cart item" });
      }
    }

    const flattenedCartItem = {
      bookId: cartItem.book.id,
      title: cartItem.book.title,
      price: cartItem.book.price,
      quantity: cartItem.quantity,
      stockQuantity: cartItem.book.stockQuantity,
      author: cartItem.book.author,
      image: cartItem.book.images,
    };

    res
      .status(200)
      .json({ message: "Item added to cart", cartItem: flattenedCartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart" });
  }
};

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);

    const cart = await cartRepo.find({
      where: { user: { id: req.user!.userId } },
      relations: ["book"],
    });

    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart" });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId } = req.params;

    const cartRepo = AppDataSource.getRepository(Cart);

    await cartRepo.delete({
      user: { id: req.user!.userId },
      book: { id: parseInt(bookId) },
    });

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item" });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res.status(400).json({ message: "Book ID and quantity required" });
    }

    const cartRepo = AppDataSource.getRepository(Cart);

    const cartItem = await cartRepo.findOne({
      where: { user: { id: req.user!.userId }, book: { id: bookId } },
      relations: ["book"],
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;

    await cartRepo.save(cartItem);

    res.status(200).json({ message: "Cart updated", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating cart" });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cartRepo = AppDataSource.getRepository(Cart);

    await cartRepo.delete({
      user: { id: req.user!.userId },
    });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error clearing cart" });
  }
};
