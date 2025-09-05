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

// For editing users, we want full validation (not partial)
export const updateUserSchema = createUserSchema.extend({
  id: z.number().positive("User ID is required"),
  createdAt: z.string(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// For partial updates (if needed elsewhere)
export const partialUpdateUserSchema = createUserSchema.partial();
export type PartialUpdateUserInput = z.infer<typeof partialUpdateUserSchema>;
