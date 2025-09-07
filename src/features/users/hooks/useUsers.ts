import useSWR from "swr";
import type { User } from "@/types";
import { userService } from "@/features/users/services/userService";

const fetcher = () => userService.getUsers();

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>("users", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // Safeguards against duplicate requests
  });

  return {
    users: data ?? [],
    isLoading,
    error: error ? (error as Error).message : null,
    refetch: mutate,
  };
}
