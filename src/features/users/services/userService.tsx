// services/userService.ts
import { fetchJSON, postJSON, putJSON, deleteJSON } from "@/services/api";
import type { User } from "@/types";
import type { CreateUserInput, UpdateUserInput } from "@/schemas/userSchema";

export const userService = {
  getUsers: () => fetchJSON<User[]>("/users"),
  createUser: async (userData: CreateUserInput) => {
    const now = new Date().toISOString();
    const users = await fetchJSON<User[]>("/users");
    console.log(users[users.length - 1].id);
    const nextId = Number(users[users.length - 1].id) + 1;
    return postJSON<
      CreateUserInput & { id: number; createdAt: string; updatedAt: string },
      User
    >("/users", {
      id: nextId,
      ...userData,
      createdAt: now,
      updatedAt: now,
    });
  },
  updateUser: (userData: UpdateUserInput) =>
    putJSON<Omit<UpdateUserInput, "id"> & { updatedAt: string }, User>(
      `/users/${userData.id}`,
      {
        name: userData.name,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: new Date().toISOString(),
      }
    ),
  deleteUser: (userId: number) => deleteJSON(`/users/${userId}`),
};
