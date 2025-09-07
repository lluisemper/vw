import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSWRConfig } from "swr";
import toast from "react-hot-toast";
import { useDeleteUser } from "../useDeleteUser";
import { userService } from "@/features/users/services/userService";
import type { User } from "@/types";

// Mock dependencies
vi.mock("swr");
vi.mock("react-hot-toast");
vi.mock("@/features/users/services/userService");

describe("useDeleteUser", () => {
  const mockMutate = vi.fn();
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSWRConfig).mockReturnValue({
      mutate: mockMutate,
    } as unknown as ReturnType<typeof useSWRConfig>);
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useDeleteUser());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.deleteUser).toBe("function");
  });

  it("should successfully delete a user", async () => {
    vi.mocked(userService.deleteUser).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteUser());

    let deleteResult: boolean | undefined;

    await act(async () => {
      deleteResult = await result.current.deleteUser(mockUser);
    });

    expect(deleteResult).toBe(true);
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(mockMutate).toHaveBeenCalledWith("users");
    expect(toast.success).toHaveBeenCalledWith(
      'User "John Doe" deleted successfully!'
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle API errors", async () => {
    const errorMessage = "Server error";
    vi.mocked(userService.deleteUser).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useDeleteUser());

    let deleteResult: boolean | undefined;

    await act(async () => {
      deleteResult = await result.current.deleteUser(mockUser);
    });

    expect(deleteResult).toBe(false);
    expect(userService.deleteUser).toHaveBeenCalledWith(1);
    expect(mockMutate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith(
      `Failed to delete user: ${errorMessage}`
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle unknown errors", async () => {
    vi.mocked(userService.deleteUser).mockRejectedValueOnce("Unknown error");

    const { result } = renderHook(() => useDeleteUser());

    let deleteResult: boolean | undefined;

    await act(async () => {
      deleteResult = await result.current.deleteUser(mockUser);
    });

    expect(deleteResult).toBe(false);
    expect(toast.error).toHaveBeenCalledWith(
      "Failed to delete user: Failed to delete user"
    );
    expect(result.current.error).toBe("Failed to delete user");
  });

  it("should set loading state during delete operation", async () => {
    let resolvePromise: () => void;
    const deletePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(userService.deleteUser).mockReturnValueOnce(deletePromise);

    const { result } = renderHook(() => useDeleteUser());

    // Start delete operation
    act(() => {
      result.current.deleteUser(mockUser);
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Complete the operation
    await act(async () => {
      resolvePromise!();
      await deletePromise;
    });

    // Should no longer be loading
    expect(result.current.isLoading).toBe(false);
  });

  it("should convert string id to number", async () => {
    vi.mocked(userService.deleteUser).mockResolvedValueOnce(undefined);

    const userWithStringId = { ...mockUser, id: "123" };
    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(userWithStringId as unknown as User);
    });

    expect(userService.deleteUser).toHaveBeenCalledWith(123);
  });

  it("should clear error state on new delete attempt", async () => {
    // First call fails
    vi.mocked(userService.deleteUser).mockRejectedValueOnce(
      new Error("Server error")
    );

    const { result } = renderHook(() => useDeleteUser());

    await act(async () => {
      await result.current.deleteUser(mockUser);
    });

    expect(result.current.error).toBe("Server error");

    // Second call succeeds
    vi.mocked(userService.deleteUser).mockResolvedValueOnce(undefined);

    await act(async () => {
      await result.current.deleteUser(mockUser);
    });

    expect(result.current.error).toBe(null);
  });
});
