import { useState } from "react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { userService } from "@/features/users/services/userService";
import type { User } from "@/types";

interface UseDeleteUserReturn {
  deleteUser: (user: User) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export function useDeleteUser(): UseDeleteUserReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate } = useSWRConfig();

  const deleteUser = async (user: User): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await userService.deleteUser(Number(user.id));

      // Revalidate the users cache to show the updated list
      await mutate("users");

      toast.success(`User "${user.name}" deleted successfully!`);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(errorMessage);
      toast.error(`Failed to delete user: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteUser,
    isLoading,
    error,
  };
}