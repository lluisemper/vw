import { object, string, number, type InferType } from "yup";

// Create schemas using Yup's native API
export const createUserSchema = object({
  name: string()
    .trim()
    .required("Name is required")
    .max(100, "Name must be less than 100 characters"),
  email: string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type CreateUserInput = InferType<typeof createUserSchema>;

// For editing users, we want full validation (not partial)
export const updateUserSchema = createUserSchema.concat(
  object({
    id: number().positive("User ID is required").required("User ID is required"),
    createdAt: string().required(),
  })
);

export type UpdateUserInput = InferType<typeof updateUserSchema>;

// For partial updates (if needed elsewhere)
export const partialUpdateUserSchema = object({
  name: string()
    .trim()
    .max(100, "Name must be less than 100 characters"),
  email: string()
    .trim()
    .lowercase()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
});

export type PartialUpdateUserInput = InferType<typeof partialUpdateUserSchema>;
