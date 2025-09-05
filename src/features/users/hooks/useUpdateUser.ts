import { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { userService } from "@/features/users/services/userService";
import type { User } from "@/types";
import type { UpdateUserInput } from "@/schemas/userSchema";

interface UseUpdateUserReturn {
  updateUser: (userData: UpdateUserInput) => Promise<User | null>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateUser(): UseUpdateUserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const updateUser = async (
    userData: UpdateUserInput
  ): Promise<User | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const updatedUser = await userService.updateUser(userData);

      // Revalidate the users cache to show updated state
      await mutate("users");

      // Show success toast
      toast.success(`User "${updatedUser.name}" updated successfully!`);

      return updatedUser;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update user";
      setError(errorMessage);

      // Show error toast
      toast.error(`Failed to update user: ${errorMessage}`);

      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateUser,
    isLoading,
    error,
  };
}
