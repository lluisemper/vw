import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import { useCreateUser } from "../useCreateUser";
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

describe("useCreateUser", () => {
  const mockUserService = vi.mocked(userService);
  const mockToast = vi.mocked(toast);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default values", () => {
    const { result } = renderHook(() => useCreateUser());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.createUser).toBe("function");
  });

  it("should create user successfully", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockUserService.createUser.mockResolvedValueOnce(mockUser);

    const { result } = renderHook(() => useCreateUser());

    let createdUser: unknown;
    await act(async () => {
      createdUser = await result.current.createUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    });

    expect(mockUserService.createUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john.doe@example.com",
    });
    expect(mockMutate).toHaveBeenCalledWith("users");
    expect(mockToast.success).toHaveBeenCalledWith(
      'User "John Doe" created successfully!'
    );
    expect(createdUser).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should handle creation error", async () => {
    const errorMessage = "Failed to create user";
    mockUserService.createUser.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCreateUser());

    let createdUser: unknown;
    await act(async () => {
      createdUser = await result.current.createUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    });

    expect(mockUserService.createUser).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john.doe@example.com",
    });
    expect(mockMutate).not.toHaveBeenCalled();
    expect(mockToast.error).toHaveBeenCalledWith(
      `Failed to create user: ${errorMessage}`
    );
    expect(createdUser).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it("should handle non-Error rejection", async () => {
    const errorMessage = "Unknown error";
    mockUserService.createUser.mockRejectedValueOnce(errorMessage);

    const { result } = renderHook(() => useCreateUser());

    let createdUser: unknown;
    await act(async () => {
      createdUser = await result.current.createUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Failed to create user: Failed to create user"
    );
    expect(createdUser).toBe(null);
    expect(result.current.error).toBe("Failed to create user");
  });

  it("should set loading state during creation", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    // Create a promise that we can control
    let resolvePromise: (value: unknown) => void = () => {};
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockUserService.createUser.mockReturnValueOnce(
      controlledPromise as Promise<typeof mockUser>
    );

    const { result } = renderHook(() => useCreateUser());

    // Start the creation process without waiting
    let createUserPromise: Promise<unknown>;
    act(() => {
      createUserPromise = result.current.createUser({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    });

    // Check that loading is true during the request
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    resolvePromise(mockUser);
    await act(async () => {
      await createUserPromise;
    });

    // Check that loading is false after completion
    expect(result.current.isLoading).toBe(false);
  });

  it("should clear error on successful creation after previous error", async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    const { result } = renderHook(() => useCreateUser());

    // First, cause an error
    mockUserService.createUser.mockRejectedValueOnce(new Error("First error"));
    await act(async () => {
      try {
        await result.current.createUser({
          name: "John Doe",
          email: "john.doe@example.com",
        });
      } catch {
        // Expected to fail
      }
    });

    expect(result.current.error).toBe("First error");

    // Then, succeed
    mockUserService.createUser.mockResolvedValueOnce(mockUser);
    await act(async () => {
      await result.current.createUser({
        name: "Jane Smith",
        email: "jane.smith@example.com",
      });
    });

    expect(result.current.error).toBe(null);
  });
});
