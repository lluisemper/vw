import useSWR from 'swr';
import type { User } from '@/types';
import { fetchJSON } from '@/services/api';

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
    'users',
    () => fetchJSON<User[]>('/users'),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    }
  );

  return {
    users: data ?? [],
    isLoading,
    error: error ? (error as Error).message : null,
    refetch: mutate,
  };
}
