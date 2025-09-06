import type { User } from "@/types";

export type UserModalType =
  | "createUser"
  | "editUser"
  | "deleteUser"
  | "userDetails";

export type UserModalDataMap = {
  createUser: undefined;
  editUser: User;
  deleteUser: User;
  userDetails: User;
};
