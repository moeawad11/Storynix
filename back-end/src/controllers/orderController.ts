import {Response} from "express";
import { AuthRequest } from "../middleware/auth.js";
import { AppDataSource } from "../config/database.js";
import { Order } from "../entity/Order.js";
import { createPaymentIntent } from "../services/paymentService.js";
import { Book } from "../entity/Book.js";

export const createOrder = async (req: AuthRequest, res: Response)=>{
  try{
    const {orderItems, shippingAddress, paymentMethod} = req.body;
    const userId = req.user?.userId;

    if(!orderItems || orderItems.length===0){
      return res.status(400).json({message: "Order must contain at least one item."});
    }
    
    if(!shippingAddress || !paymentMethod){
      return res.status(400).json({message: "Missing shipping address or payment method."});
    }

    if(!userId){
      return res.status(401).json({message: "User not authenticated."});
    }

    const bookRepo = AppDataSource.getRepository(Book);
    let calculatedTotalPrice = 0;
    let validOrderItems = [];

    for(const item of orderItems){
      const {bookId, quantity} = item;

      if(!bookId || quantity<=0) continue;

      const book = await bookRepo.findOneBy({id: bookId});

      if(!book || bookId.stockQuantity < quantity){
        return res.status(400).json({message: `Book ${bookId} is out of stock or requested quantity (${quantity}) exceeds available stock (${book?.stockQuantity || 0}).`});
      }

      const actualPrice = parseFloat(book.price.toString());
      calculatedTotalPrice += actualPrice * quantity;

      validOrderItems.push({
        bookId: book.id,
        title: book.title,
        quantity: quantity,
        price: actualPrice
      });
    }

    if(validOrderItems.length===0) return res.status(400).json(
      {message: "No valid items found in the order."}
    );

    const orderRepo = AppDataSource.getRepository(Order);
    const newOrder = orderRepo.create({
      user: {id: userId},
      orderItems: validOrderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: calculatedTotalPrice,
      isPaid: false,
      orderStatus: "Processing",
      isDelivered: false
    });

    await orderRepo.save(newOrder);

    res.status(201).json({
      message: "Order initialized successfully. Awaiting payment confirmation.",
      orderId: newOrder.id,
      order: newOrder
    });

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error while attempting to create order." });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response)=>{
  const userId = req.user?.userId;
  if(!userId) return res.status(401).json({message: "User not authenticated."});

  try{
    const orderRepo = AppDataSource.getRepository(Order);

    const allOrders = await orderRepo.find({
      where: {
        user: {id: userId}
      }, 
      order: {
        createdAt: "DESC"
      }    
    });

    res.status(200).json({orders: allOrders});

  }catch(err){
    console.error(err);
    res.status(500).json({ message: `Server error while fetching orders for user with ID ${userId}`});
  }
}

export const getOrderById = async (req: AuthRequest, res: Response)=>{
  const userId = req.user?.userId;
  const orderId = parseInt(req.params.id,10);

  if(!userId) return res.status(401).json({message: "User not authenticated."});
  if(isNaN(orderId) || orderId<=0) return res.status(400).json({message: "Invalid order ID format."});

  try{
    const orderRepo = AppDataSource.getRepository(Order);
    const getOrder = await orderRepo.findOne({
      where: {
        id: orderId,
        user: {id: userId}
      }
    });

    if(!getOrder){
      res.status(404).json({message: `Order of ID ${orderId} not found.`});
    }

    res.status(200).json({order: getOrder});
  }catch(err){
    console.error(err);
    res.status(500).json({ message: `Server error while fetching order of ID ${orderId}`});
  }
}

export const processPaymentIntent = async (req: AuthRequest, res: Response)=>{
  const userId = req.user?.userId;
  const orderId = parseInt(req.params.id,10);

  if (!userId) return res.status(401).json({ message: "User not authenticated." });
  if (isNaN(orderId) || orderId <= 0) return res.status(400).json({ message: "Invalid order ID." });

  try{
    const orderRepo = AppDataSource.getRepository(Order);
    const bookRepo = AppDataSource.getRepository(Book);

    const order = await orderRepo.findOne({
      where: {
        id: orderId,
        user: {id: userId}
      }
    });

    if(!order) return res.status(404).json({message: "Order not found."});
    if(order.isPaid) return res.status(400).json({message: "Order is already paid."});

    const {order: updatedOrder, clientSecret} = await createPaymentIntent(order);

    for(const item of updatedOrder.orderItems as any[]){
      const book = await bookRepo.findOneBy({id: item.bookId});

      if(!book) throw new Error(`Book ID ${item.bookId} not found during payment processing.`);
      
      if(book.stockQuantity < item.quantity) throw new Error(`Insufficient stock for book ID ${item.bookId}. Stock is now ${book.stockQuantity}`);

      book.stockQuantity-=item.quantity;
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
      order: updatedOrder
    });

  }catch(err) {
    console.error(err);
    res.status(500).json({ message: "Server error while retrying payment." });
  }
}