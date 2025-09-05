import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
