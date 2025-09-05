import { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { userService } from "@/features/users/services/userService";
import type { CreateUserInput } from "@/schemas/userSchema";
import type { User } from "@/types";

interface UseCreateUserReturn {
  createUser: (userData: CreateUserInput) => Promise<User | null>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateUser(): UseCreateUserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const createUser = async (userData: CreateUserInput): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const newUser = await userService.createUser(userData);
      
      // Revalidate the users cache to show the updated list
      await mutate("users");
      
      toast.success(`User "${newUser.name}" created successfully!`);
      
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create user";
      setError(errorMessage);
      toast.error(`Failed to create user: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    isLoading,
    error,
  };
}