import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "../userSchema";

describe("userSchema", () => {
  describe("createUserSchema", () => {
    it("should validate a valid user input", () => {
      const validInput = {
        name: "John Doe",
        email: "john.doe@example.com",
      };
      // Throws on invalid input
      const result = createUserSchema.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john.doe@example.com");
      }
    });

    it("should trim and lowercase email", () => {
      const input = {
        name: "  John Doe  ",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
        expect(result.data.email).toBe("john.doe@example.com");
      }
    });

    it("should reject empty name", () => {
      const input = {
        name: "",
        email: "john.doe@example.com",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Name is required");
      }
    });

    it("should accept name that is 1 character", () => {
      const input = {
        name: "J",
        email: "john.doe@example.com",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("J");
        expect(result.data.email).toBe("john.doe@example.com");
      }
    });

    it("should reject name that is too long", () => {
      const input = {
        name: "A".repeat(101),
        email: "john.doe@example.com",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Name must be less than 100 characters"
        );
      }
    });

    it("should reject empty email", () => {
      const input = {
        name: "John Doe",
        email: "",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });

    it("should reject invalid email format", () => {
      const input = {
        name: "John Doe",
        email: "invalid-email",
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });

    it("should reject email that is too long", () => {
      const input = {
        name: "John Doe",
        email: `${"a".repeat(250)}@example.com`,
      };

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Email must be less than 255 characters"
        );
      }
    });

    it("should reject missing fields", () => {
      const input = {};

      const result = createUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2);
      }
    });
  });

  describe("updateUserSchema", () => {
    it("should require all fields for user update", () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const result = updateUserSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Jane Smith");
        expect(result.data.id).toBe(1);
        expect(result.data.email).toBe("jane@example.com");
        expect(result.data.createdAt).toBe("2024-01-01T00:00:00Z");
      }
    });

    it("should fail validation when missing required fields", () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        // missing email and createdAt
      };

      const result = updateUserSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should validate email format in update schema", () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        email: "invalid-email",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const result = updateUserSchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Please enter a valid email address"
        );
      }
    });
  });
});
