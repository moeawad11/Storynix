import { z } from "zod";

export const RegisterSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.email().trim().toLowerCase(),
    password: z.string().min(8),
  }),
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.email().trim().toLowerCase(),
    password: z.string().min(1),
  }),
});
