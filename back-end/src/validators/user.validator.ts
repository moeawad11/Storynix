import { z } from "zod";

export const UpdateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().trim().min(1).max(50),
    lastName: z.string().trim().min(1).max(50),
    email: z.email().trim().toLowerCase(),
    currentPassword: z.string().min(1).optional(),
    newPassword: z.string().min(8).optional(),
  }),
});
