import { z } from "zod";

export const CartItemSchema = z.object({
  body: z.object({
    bookId: z.int().min(1),
    quantity: z.int().min(1),
  }),
});
