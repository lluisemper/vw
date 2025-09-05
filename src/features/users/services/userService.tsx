// services/userService.ts
import { fetchJSON, postJSON } from "@/services/api";
import type { User } from "@/types";
import type { CreateUserInput } from "@/schemas/userSchema";

export const userService = {
  getUsers: () => fetchJSON<User[]>("/users"),
  createUser: (userData: CreateUserInput) =>
    postJSON<CreateUserInput, User>("/users", userData),
};
