export * from "./modal";

export interface User {
  id: string; // json-server updates this to a string to all the records after create
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
