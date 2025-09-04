import { describe, it, expect, vi, beforeEach } from "vitest";
import { userService } from "../userService";
import type { User } from "@/types";

// Mock the API module
vi.mock("@/services/api", () => ({
  fetchJSON: vi.fn(),
}));

import { fetchJSON } from "@/services/api";

const mockFetchJSON = vi.mocked(fetchJSON);

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
});
