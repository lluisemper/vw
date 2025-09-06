import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "../userService";
import type { User } from "@/types";

// Mock the API module
vi.mock("@/services/api", () => ({
  fetchJSON: vi.fn(),
  postJSON: vi.fn(),
  putJSON: vi.fn(),
  deleteJSON: vi.fn(),
}));

import { fetchJSON, postJSON, putJSON, deleteJSON } from "@/services/api";

const mockFetchJSON = vi.mocked(fetchJSON);
const mockPostJSON = vi.mocked(postJSON);
const mockPutJSON = vi.mocked(putJSON);
const mockDeleteJSON = vi.mocked(deleteJSON);

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUsers", () => {
    it("calls fetchJSON with correct endpoint", async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetchJSON.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(fetchJSON).toHaveBeenCalledWith("/users");
      expect(fetchJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });

    it("returns array of users when successful", async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          createdAt: "2024-01-02T00:00:00Z",
          updatedAt: "2024-01-02T00:00:00Z",
        },
      ];

      mockFetchJSON.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockUsers[0]);
      expect(result[1]).toEqual(mockUsers[1]);
    });

    it("returns empty array when no users found", async () => {
      mockFetchJSON.mockResolvedValue([]);

      const result = await userService.getUsers();

      expect(result).toEqual([]);
    });

    it("throws error when fetchJSON fails", async () => {
      const mockError = new Error("Network error");
      mockFetchJSON.mockRejectedValue(mockError);

      await expect(userService.getUsers()).rejects.toThrow("Network error");
    });

    it("throws error when API returns 404", async () => {
      const mockError = new Error("Not found");
      mockFetchJSON.mockRejectedValue(mockError);

      await expect(userService.getUsers()).rejects.toThrow("Not found");
    });

    it("throws error when API returns 500", async () => {
      const mockError = new Error("Internal server error");
      mockFetchJSON.mockRejectedValue(mockError);

      await expect(userService.getUsers()).rejects.toThrow(
        "Internal server error"
      );
    });

    it("maintains proper TypeScript typing", async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      mockFetchJSON.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      // TypeScript should infer the correct type
      expect(result[0].id).toBe(1);
      expect(result[0].name).toBe("John Doe");
      expect(result[0].email).toBe("john@example.com");
      expect(typeof result[0].createdAt).toBe("string");
      expect(typeof result[0].updatedAt).toBe("string");
    });
  });

  describe("createUser", () => {
    it("calls postJSON with correct endpoint and data including timestamps", async () => {
      const createData = {
        name: "John Doe",
        email: "john.doe@example.com",
      };

      const mockExistingUsers: User[] = [
        {
          id: 1,
          name: "Existing User",
          email: "existing@example.com",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      const mockCreatedUser: User = {
        id: 2,
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      mockFetchJSON.mockResolvedValue(mockExistingUsers);
      mockPostJSON.mockResolvedValue(mockCreatedUser);

      const result = await userService.createUser(createData);

      expect(fetchJSON).toHaveBeenCalledWith("/users");
      expect(postJSON).toHaveBeenCalledWith("/users", {
        id: 2,
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(postJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedUser);
    });

    it("should set createdAt and updatedAt to the same timestamp", async () => {
      const createData = {
        name: "Jane Smith",
        email: "jane.smith@example.com",
      };

      const mockExistingUsers: User[] = [
        {
          id: 1,
          name: "Existing User",
          email: "existing@example.com",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      const mockCreatedUser: User = {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      mockFetchJSON.mockResolvedValue(mockExistingUsers);
      mockPostJSON.mockResolvedValue(mockCreatedUser);

      await userService.createUser(createData);

      const callArgs = mockPostJSON.mock.calls[0][1] as User;
      expect(callArgs.createdAt).toBe(callArgs.updatedAt);
      expect(new Date(callArgs.createdAt).toISOString()).toBe(
        callArgs.createdAt
      );
    });

    it("throws error when postJSON fails", async () => {
      const createData = {
        name: "John Doe",
        email: "john.doe@example.com",
      };

      const mockExistingUsers: User[] = [
        {
          id: 1,
          name: "test",
          email: "test",
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];
      mockFetchJSON.mockResolvedValue(mockExistingUsers);

      const mockError = new Error("Creation failed");
      mockPostJSON.mockRejectedValue(mockError);

      await expect(userService.createUser(createData)).rejects.toThrow(
        "Creation failed"
      );
    });
  });

  describe("updateUser", () => {
    it("calls putJSON with correct endpoint and data", async () => {
      const updateData = {
        id: 1,
        name: "John Doe Updated",
        email: "john.updated@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const mockUpdatedUser: User = {
        id: 1,
        name: "John Doe Updated",
        email: "john.updated@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-02T00:00:00Z",
      };

      mockPutJSON.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(updateData);

      expect(putJSON).toHaveBeenCalledWith("/users/1", {
        name: "John Doe Updated",
        email: "john.updated@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: expect.any(String),
      });
      expect(putJSON).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedUser);
    });

    it("returns updated user when successful", async () => {
      const updateData = {
        id: 2,
        name: "Jane Smith Updated",
        email: "jane.updated@example.com",
        createdAt: "2024-01-02T00:00:00Z",
      };

      const mockUpdatedUser: User = {
        id: 2,
        name: "Jane Smith Updated",
        email: "jane.updated@example.com",
        createdAt: "2024-01-02T00:00:00Z",
        updatedAt: "2024-01-03T00:00:00Z",
      };

      mockPutJSON.mockResolvedValue(mockUpdatedUser);

      const result = await userService.updateUser(updateData);

      expect(result.id).toBe(2);
      expect(result.name).toBe("Jane Smith Updated");
      expect(result.email).toBe("jane.updated@example.com");
    });

    it("throws error when putJSON fails", async () => {
      const updateData = {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const mockError = new Error("Update failed");
      mockPutJSON.mockRejectedValue(mockError);

      await expect(userService.updateUser(updateData)).rejects.toThrow(
        "Update failed"
      );
    });

    it("handles different user IDs correctly", async () => {
      const updateData1 = {
        id: 5,
        name: "User Five",
        email: "user5@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };
      const updateData2 = {
        id: 10,
        name: "User Ten",
        email: "user10@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const mockUser1: User = {
        ...updateData1,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };
      const mockUser2: User = {
        ...updateData2,
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-01T00:00:00Z",
      };

      mockPutJSON.mockResolvedValueOnce(mockUser1);
      mockPutJSON.mockResolvedValueOnce(mockUser2);

      await userService.updateUser(updateData1);
      await userService.updateUser(updateData2);

      expect(putJSON).toHaveBeenNthCalledWith(1, "/users/5", {
        name: "User Five",
        email: "user5@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: expect.any(String),
      });
      expect(putJSON).toHaveBeenNthCalledWith(2, "/users/10", {
        name: "User Ten",
        email: "user10@example.com",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: expect.any(String),
      });
    });
  });

  describe("deleteUser", () => {
    it("calls deleteJSON with correct endpoint", async () => {
      mockDeleteJSON.mockResolvedValue(undefined);

      await userService.deleteUser(1);

      expect(deleteJSON).toHaveBeenCalledWith("/users/1");
      expect(deleteJSON).toHaveBeenCalledTimes(1);
    });

    it("handles different user IDs correctly", async () => {
      mockDeleteJSON.mockResolvedValue(undefined);

      await userService.deleteUser(5);
      await userService.deleteUser(10);

      expect(deleteJSON).toHaveBeenNthCalledWith(1, "/users/5");
      expect(deleteJSON).toHaveBeenNthCalledWith(2, "/users/10");
      expect(deleteJSON).toHaveBeenCalledTimes(2);
    });

    it("throws error when deleteJSON fails", async () => {
      const mockError = new Error("Delete failed");
      mockDeleteJSON.mockRejectedValue(mockError);

      await expect(userService.deleteUser(1)).rejects.toThrow("Delete failed");
    });

    it("returns void when successful", async () => {
      mockDeleteJSON.mockResolvedValue(undefined);

      const result = await userService.deleteUser(1);

      expect(result).toBeUndefined();
    });
  });
});
