import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchJSON, postJSON, putJSON, deleteJSON } from "../apiClient";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("apiClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchJSON", () => {
    it("makes GET request and returns JSON data", async () => {
      const mockData = { id: "1", name: "Test User" };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await fetchJSON<typeof mockData>("/users/1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/users/1");
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(mockData);
    });

    it("constructs correct URL with base URL", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({ data: "test" }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await fetchJSON("/api/test");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/api/test");
    });

    it("throws error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchJSON("/users/999")).rejects.toThrow(
        "HTTP error! status: 404"
      );
    });

    it("throws error when response is not ok with 500 status", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchJSON("/users")).rejects.toThrow(
        "HTTP error! status: 500"
      );
    });

    it("handles network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(fetchJSON("/users")).rejects.toThrow("Network error");
    });
  });

  describe("postJSON", () => {
    it("makes POST request with JSON body and returns response", async () => {
      const requestData = { name: "New User", email: "user@example.com" };
      const responseData = { id: "1", ...requestData };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await postJSON<typeof requestData, typeof responseData>(
        "/users",
        requestData
      );

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(responseData);
    });

    it("throws error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        text: vi.fn().mockResolvedValue("Bad Request"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(postJSON("/users", { name: "Test" })).rejects.toThrow(
        "HTTP error! status: 400, message: Bad Request"
      );
      expect(mockResponse.text).toHaveBeenCalled();
    });

    it("handles empty error message", async () => {
      const mockResponse = {
        ok: false,
        status: 422,
        text: vi.fn().mockResolvedValue(""),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(postJSON("/users", { name: "Test" })).rejects.toThrow(
        "HTTP error! status: 422, message: "
      );
    });

    it("handles network errors during POST", async () => {
      mockFetch.mockRejectedValue(new Error("Connection refused"));

      await expect(postJSON("/users", { name: "Test" })).rejects.toThrow(
        "Connection refused"
      );
    });
  });

  describe("putJSON", () => {
    it("makes PUT request with JSON body and returns response", async () => {
      const requestData = {
        id: "1",
        name: "Updated User",
        email: "updated@example.com",
      };
      const responseData = { ...requestData, updatedAt: "2024-01-01" };
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(responseData),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await putJSON<typeof requestData, typeof responseData>(
        "/users/1",
        requestData
      );

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/users/1", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      expect(mockResponse.json).toHaveBeenCalled();
      expect(result).toEqual(responseData);
    });

    it("throws error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue("User not found"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(putJSON("/users/999", { name: "Test" })).rejects.toThrow(
        "HTTP error! status: 404, message: User not found"
      );
      expect(mockResponse.text).toHaveBeenCalled();
    });

    it("handles server errors (500)", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue("Internal Server Error"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(putJSON("/users/1", { name: "Test" })).rejects.toThrow(
        "HTTP error! status: 500, message: Internal Server Error"
      );
    });

    it("handles network errors during PUT", async () => {
      mockFetch.mockRejectedValue(new Error("Timeout"));

      await expect(putJSON("/users/1", { name: "Test" })).rejects.toThrow(
        "Timeout"
      );
    });
  });

  describe("deleteJSON", () => {
    it("makes DELETE request successfully", async () => {
      const mockResponse = {
        ok: true,
      };
      mockFetch.mockResolvedValue(mockResponse);

      await deleteJSON("/users/1");

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3001/users/1", {
        method: "DELETE",
      });
    });

    it("throws error when response is not ok", async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        text: vi.fn().mockResolvedValue("User not found"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(deleteJSON("/users/999")).rejects.toThrow(
        "HTTP error! status: 404, message: User not found"
      );
      expect(mockResponse.text).toHaveBeenCalled();
    });

    it("handles authorization errors (403)", async () => {
      const mockResponse = {
        ok: false,
        status: 403,
        text: vi.fn().mockResolvedValue("Forbidden"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(deleteJSON("/users/1")).rejects.toThrow(
        "HTTP error! status: 403, message: Forbidden"
      );
    });

    it("handles server errors during DELETE", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        text: vi.fn().mockResolvedValue("Database error"),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(deleteJSON("/users/1")).rejects.toThrow(
        "HTTP error! status: 500, message: Database error"
      );
    });

    it("handles network errors during DELETE", async () => {
      mockFetch.mockRejectedValue(new Error("Network unavailable"));

      await expect(deleteJSON("/users/1")).rejects.toThrow(
        "Network unavailable"
      );
    });

    it("returns void on successful deletion", async () => {
      const mockResponse = {
        ok: true,
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await deleteJSON("/users/1");

      expect(result).toBeUndefined();
    });
  });

  describe("edge cases and error scenarios", () => {
    it("handles JSON parsing errors in fetchJSON", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error("Invalid JSON")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(fetchJSON("/users")).rejects.toThrow("Invalid JSON");
    });

    it("handles JSON parsing errors in postJSON", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error("Malformed JSON")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(postJSON("/users", { name: "Test" })).rejects.toThrow(
        "Malformed JSON"
      );
    });

    it("handles JSON parsing errors in putJSON", async () => {
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error("JSON parse error")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(putJSON("/users/1", { name: "Test" })).rejects.toThrow(
        "JSON parse error"
      );
    });

    it("handles text parsing errors for error responses", async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        text: vi.fn().mockRejectedValue(new Error("Text parse error")),
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(postJSON("/users", { name: "Test" })).rejects.toThrow(
        "Text parse error"
      );
    });
  });
});
