// services/userService.ts
import { fetchJSON, postJSON, putJSON } from "@/services/api";
import type { User } from "@/types";
import type { CreateUserInput, UpdateUserInput } from "@/schemas/userSchema";

export const userService = {
  getUsers: () => fetchJSON<User[]>("/users"),
  createUser: (userData: CreateUserInput) => {
    const now = new Date().toISOString();
    return postJSON<CreateUserInput & { createdAt: string; updatedAt: string }, User>("/users", {
      ...userData,
      createdAt: now,
      updatedAt: now,
    });
  },
  updateUser: (userData: UpdateUserInput) =>
    putJSON<Omit<UpdateUserInput, "id"> & { updatedAt: string }, User>(`/users/${userData.id}`, {
      name: userData.name,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: new Date().toISOString(),
    }),
};
