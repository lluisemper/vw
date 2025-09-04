// services/userService.ts
import { fetchJSON } from "@/services/api";
import type { User } from "@/types";

export const userService = {
  getUsers: () => fetchJSON<User[]>("/users"),
};
