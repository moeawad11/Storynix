import { z } from "zod";

const BookBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(100),
  description: z.string().trim().optional(),
  isbn: z.string().trim().min(1),
  price: z.number().positive(),
  stockQuantity: z.int().min(0),
  images: z.array(z.string()).optional(),
});

export const CreateBookSchema = z.object({
  body: BookBodySchema,
});

export const UpdateBookSchema = z.object({
  body: BookBodySchema,
});
