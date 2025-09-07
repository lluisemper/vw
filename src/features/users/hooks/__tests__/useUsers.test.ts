import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUsers } from "../useUsers";
import type { User } from "@/types";

// Mock SWR
vi.mock("swr", () => ({
  default: vi.fn(),
}));

// Mock the userService
vi.mock("@/features/users/services/userService", () => ({
  userService: {
    getUsers: vi.fn(),
  },
}));

import useSWR from "swr";
import { userService } from "@/features/users/services/userService";

describe("useUsers", () => {
  const mockUseSWR = vi.mocked(useSWR);
  const mockGetUsers = vi.mocked(userService.getUsers);

  // Helper function to create complete SWR response
  const createSWRResponse = (
    overrides: Partial<ReturnType<typeof useSWR>> = {}
  ) => ({
    data: undefined,
    error: null,
    isLoading: false,
    isValidating: false,
    mutate: vi.fn(),
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls useSWR with correct key and fetcher", () => {
    mockUseSWR.mockReturnValue(createSWRResponse());

    renderHook(() => useUsers());

    expect(mockUseSWR).toHaveBeenCalledWith("users", expect.any(Function), {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 5000,
    });
  });

  it("returns empty array when no data", () => {
    mockUseSWR.mockReturnValue(createSWRResponse());

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("returns users array when data is available", () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      },
    ];

    mockUseSWR.mockReturnValue(createSWRResponse({ data: mockUsers }));

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual(mockUsers);
    expect(result.current.users).toHaveLength(2);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("returns loading state correctly", () => {
    mockUseSWR.mockReturnValue(createSWRResponse({ isLoading: true }));

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it("returns error message when error occurs", () => {
    const mockError = new Error("Network error");
    mockUseSWR.mockReturnValue(createSWRResponse({ error: mockError }));

    const { result } = renderHook(() => useUsers());

    expect(result.current.users).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Network error");
  });

  it("handles non-Error objects in error state", () => {
    const mockError = { message: "String error" } as Error;
    mockUseSWR.mockReturnValue(createSWRResponse({ error: mockError }));

    const { result } = renderHook(() => useUsers());

    expect(result.current.error).toBe("String error");
  });

  it("provides refetch function", () => {
    const mockMutate = vi.fn();
    mockUseSWR.mockReturnValue(
      createSWRResponse({ data: [], mutate: mockMutate })
    );

    const { result } = renderHook(() => useUsers());

    expect(result.current.refetch).toBe(mockMutate);
  });

  it("calls userService.getUsers through the fetcher", async () => {
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      },
    ];

    mockGetUsers.mockResolvedValue(mockUsers);

    // Get the fetcher function that was passed to useSWR
    mockUseSWR.mockReturnValue(createSWRResponse({ data: mockUsers }));

    renderHook(() => useUsers());

    // Get the fetcher function from the useSWR call
    const fetcherFn = mockUseSWR.mock.calls[0]?.[1];

    // Call the fetcher function
    const result = await fetcherFn?.();

    expect(mockGetUsers).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it("configures SWR with correct options", () => {
    mockUseSWR.mockReturnValue(createSWRResponse());

    renderHook(() => useUsers());

    const swrOptions = mockUseSWR.mock.calls[0]?.[2];
    expect(swrOptions?.revalidateOnFocus).toBe(false);
    expect(swrOptions?.revalidateOnReconnect).toBe(true);
    expect(swrOptions?.dedupingInterval).toBe(5000);
  });
});
