import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import { useUpdateUser } from "../useUpdateUser";
import { userService } from "../../services/userService";

// Mock dependencies
const mockMutate = vi.fn();

vi.mock("react-hot-toast");
vi.mock("swr", () => ({
  useSWRConfig: () => ({
    mutate: mockMutate,
  }),
}));
vi.mock("../../services/userService");

describe("useUpdateUser", () => {
  const mockUserService = vi.mocked(userService);
  const mockToast = vi.mocked(toast);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useUpdateUser());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.updateUser).toBe("function");
  });

  it("should update user successfully", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe Updated",
      email: "john.updated@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    };

    const updateData = {
      id: 1,
      name: "John Doe Updated",
      email: "john.updated@example.com",
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUserService.updateUser.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useUpdateUser());

    let updatedUser;
    await act(async () => {
      updatedUser = await result.current.updateUser(updateData);
    });

    expect(mockUserService.updateUser).toHaveBeenCalledWith(updateData);
    expect(mockMutate).toHaveBeenCalledWith("users");
    expect(mockToast.success).toHaveBeenCalledWith(
      'User "John Doe Updated" updated successfully!'
    );
    expect(updatedUser).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle update error", async () => {
    const updateData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUserService.updateUser.mockRejectedValueOnce(new Error("Update failed"));

    const { result } = renderHook(() => useUpdateUser());

    let updatedUser;
    await act(async () => {
      updatedUser = await result.current.updateUser(updateData);
    });

    expect(mockUserService.updateUser).toHaveBeenCalledWith(updateData);
    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith(
      "Failed to update user: Update failed"
    );
    expect(updatedUser).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Update failed");
  });

  it("should handle non-Error rejection", async () => {
    const updateData = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
    };

    mockUserService.updateUser.mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useUpdateUser());

    let updatedUser;
    await act(async () => {
      updatedUser = await result.current.updateUser(updateData);
    });

    expect(result.current.error).toBe("Failed to update user");
    expect(mockToast.error).toHaveBeenCalledWith(
      "Failed to update user: Failed to update user"
    );
    expect(updatedUser).toBe(null);
  });

  it("should set loading state during update", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    // Create a promise that we can control
    let resolvePromise: (value: unknown) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockUserService.updateUser.mockReturnValueOnce(
      controlledPromise as Promise<typeof mockUser>
    );

    const { result } = renderHook(() => useUpdateUser());

    // Start the update process without waiting
    let updateUserPromise: Promise<unknown>;
    act(() => {
      updateUserPromise = result.current.updateUser({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    });

    // Check that loading is true during the request
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    resolvePromise!(mockUser);
    await act(async () => {
      await updateUserPromise;
    });

    // Check that loading is false after completion
    expect(result.current.isLoading).toBe(false);
  });

  it("should clear error on successful update after previous error", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    const { result } = renderHook(() => useUpdateUser());

    // First, cause an error
    mockUserService.updateUser.mockRejectedValueOnce(new Error("First error"));
    await act(async () => {
      try {
        await result.current.updateUser({
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          createdAt: "2024-01-01T00:00:00Z",
        });
      } catch {
        // Expected to fail
      }
    });

    expect(result.current.error).toBe("First error");

    // Then, succeed
    mockUserService.updateUser.mockResolvedValueOnce(mockUser);
    await act(async () => {
      await result.current.updateUser({
        id: 1,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    });

    expect(result.current.error).toBe(null);
  });
});