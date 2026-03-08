import { z } from "zod";

export const CreateOrderSchema = z.object({
  body: z.object({
    orderItems: z
      .array(
        z.object({
          bookId: z.int().min(1),
          quantity: z.int().min(1),
        }),
      )
      .min(1),
    shippingAddress: z.string().trim().min(1),
    paymentMethod: z.string().trim().min(1),
  }),
});

export const UpdateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(["Processing", "Shipped", "Delivered", "Cancelled"]),
  }),
});
