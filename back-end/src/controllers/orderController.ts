import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import { AppDataSource } from "../config/database.js";
import { Order } from "../entity/Order.js";
import { createPaymentIntent } from "../services/paymentService.js";
import { Book } from "../entity/Book.js";
import {
  calculateOrderTotal,
  validateOrderItems,
  validateStockAvailability,
} from "../services/orderRules.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.userId;

    let validIncomingItems;
    try {
      validIncomingItems = validateOrderItems(orderItems);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }

    if (!shippingAddress || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "Missing shipping address or payment method." });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    const bookRepo = AppDataSource.getRepository(Book);
    let validOrderItems = [];

    for (const item of validIncomingItems) {
      const { bookId, quantity } = item;

      const book = await bookRepo.findOneBy({ id: bookId });

      if (!book) {
        return res.status(400).json({
          message: `Book ${bookId} not found.`,
        });
      }

      try {
        validateStockAvailability(quantity, book.stockQuantity, bookId);
      } catch (error) {
        return res.status(400).json({
          message: (error as Error).message,
        });
      }

      const actualPrice = parseFloat(book.price.toString());

      validOrderItems.push({
        bookId: book.id,
        title: book.title,
        quantity: quantity,
        price: actualPrice,
      });
    }

    if (validOrderItems.length === 0)
      return res
        .status(400)
        .json({ message: "No valid items found in the order." });

    const calculatedTotalPrice = calculateOrderTotal(validOrderItems);

    const orderRepo = AppDataSource.getRepository(Order);
    const newOrder = orderRepo.create({
      user: { id: userId },
      orderItems: validOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
      isPaid: false,
      orderStatus: "Processing",
      isDelivered: false,
    });

    await orderRepo.save(newOrder);

    res.status(201).json({
      message: "Order initialized successfully. Awaiting payment confirmation.",
      orderId: newOrder.id,
      order: newOrder,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while attempting to create order." });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    return res.status(401).json({ message: "User not authenticated." });

  try {
    const orderRepo = AppDataSource.getRepository(Order);

    const allOrders = await orderRepo.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: "DESC",
      },
    });

    res.status(200).json({ orders: allOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: `Server error while fetching orders for user with ID ${userId}`,
    });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const orderId = parseInt(req.params.id, 10);

  if (!userId)
    return res.status(401).json({ message: "User not authenticated." });
  if (isNaN(orderId) || orderId <= 0)
    return res.status(400).json({ message: "Invalid order ID format." });

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const getOrder = await orderRepo.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
    });

    if (!getOrder) {
      res.status(404).json({ message: `Order of ID ${orderId} not found.` });
    }

    res.status(200).json({ order: getOrder });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Server error while fetching order of ID ${orderId}` });
  }
};

export const processPaymentIntent = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const orderId = parseInt(req.params.id, 10);

  if (!userId)
    return res.status(401).json({ message: "User not authenticated." });
  if (isNaN(orderId) || orderId <= 0)
    return res.status(400).json({ message: "Invalid order ID." });

  try {
    const orderRepo = AppDataSource.getRepository(Order);
    const bookRepo = AppDataSource.getRepository(Book);

    const order = await orderRepo.findOne({
      where: {
        id: orderId,
        user: { id: userId },
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found." });
    if (order.isPaid)
      return res.status(400).json({ message: "Order is already paid." });

    const { order: updatedOrder, clientSecret } =
      await createPaymentIntent(order);

    for (const item of updatedOrder.orderItems as any[]) {
      const book = await bookRepo.findOneBy({ id: item.bookId });

      if (!book)
        throw new Error(
          `Book ID ${item.bookId} not found during payment processing.`,
        );

      validateStockAvailability(item.quantity, book.stockQuantity, item.bookId);

      book.stockQuantity -= item.quantity;
      await bookRepo.save(book);
    }

    updatedOrder.isPaid = true;
    updatedOrder.paidAt = new Date();
    updatedOrder.orderStatus = "Payment Successful (MOCK)";

    await orderRepo.save(updatedOrder);

    res.status(200).json({
      message: "PaymentIntent created. Proceed to confirm payment.",
      orderId: updatedOrder.id,
      clientSecret: clientSecret,
      order: updatedOrder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while retrying payment." });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orderRepo = AppDataSource.getRepository(Order);

    const orders = await orderRepo.find({
      order: { createdAt: "DESC" },
      relations: ["user"],
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error while fetching orders from db." });
  }
};
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId) || orderId <= 0)
    return res.status(400).json({ message: "Invalid order ID format." });

  try {
    const { orderStatus } = req.body;

    const orderRepo = AppDataSource.getRepository(Order);

    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["user"],
    });

    if (!order)
      return res
        .status(404)
        .json({ message: `Order with ID ${orderId} not found.` });

    order.orderStatus = orderStatus;

    if (orderStatus === "Delivered" && !order.isDelivered) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await orderRepo.save(order);

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: `Server error while updating order ${orderId}` });
  }
};
