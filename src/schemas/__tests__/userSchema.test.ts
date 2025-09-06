import { describe, it, expect } from "vitest";
import { createUserSchema, updateUserSchema } from "../userSchema";

describe("userSchema", () => {
  describe("createUserSchema", () => {
    it("should validate a valid user input", async () => {
      const validInput = {
        name: "John Doe",
        email: "john.doe@example.com",
      };
      
      const result = await createUserSchema.validate(validInput);
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john.doe@example.com");
    });

    it("should trim and lowercase email", async () => {
      const input = {
        name: "  John Doe  ",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
      };

      const result = await createUserSchema.validate(input);
      expect(result.name).toBe("John Doe");
      expect(result.email).toBe("john.doe@example.com");
    });

    it("should reject empty name", async () => {
      const input = {
        name: "",
        email: "john.doe@example.com",
      };

      await expect(createUserSchema.validate(input)).rejects.toThrow("Name is required");
    });

    it("should accept name that is 1 character", async () => {
      const input = {
        name: "J",
        email: "john.doe@example.com",
      };

      const result = await createUserSchema.validate(input);
      expect(result.name).toBe("J");
      expect(result.email).toBe("john.doe@example.com");
    });

    it("should reject name that is too long", async () => {
      const input = {
        name: "A".repeat(101),
        email: "john.doe@example.com",
      };

      await expect(createUserSchema.validate(input)).rejects.toThrow(
        "Name must be less than 100 characters"
      );
    });

    it("should reject empty email", async () => {
      const input = {
        name: "John Doe",
        email: "",
      };

      await expect(createUserSchema.validate(input)).rejects.toThrow(
        "Please enter a valid email address"
      );
    });

    it("should reject invalid email format", async () => {
      const input = {
        name: "John Doe",
        email: "invalid-email",
      };

      await expect(createUserSchema.validate(input)).rejects.toThrow(
        "Please enter a valid email address"
      );
    });

    it("should reject email that is too long", async () => {
      const input = {
        name: "John Doe",
        email: `${"a".repeat(250)}@example.com`,
      };

      await expect(createUserSchema.validate(input)).rejects.toThrow(
        "Email must be less than 255 characters"
      );
    });

    it("should reject missing fields", async () => {
      const input = {};

      try {
        await createUserSchema.validate(input, { abortEarly: false });
      } catch (error: unknown) {
        if (error && typeof error === 'object' && 'inner' in error) {
          expect((error as { inner: unknown[] }).inner).toHaveLength(2);
        }
      }
    });
  });

  describe("updateUserSchema", () => {
    it("should require all fields for user update", async () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        email: "jane@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      };

      const result = await updateUserSchema.validate(input);
      expect(result.name).toBe("Jane Smith");
      expect(result.id).toBe(1);
      expect(result.email).toBe("jane@example.com");
      expect(result.createdAt).toBe("2024-01-01T00:00:00Z");
    });

    it("should fail validation when missing required fields", async () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        // missing email and createdAt
      };

      await expect(updateUserSchema.validate(input)).rejects.toThrow();
    });

    it("should validate email format in update schema", async () => {
      const input = {
        id: 1,
        name: "Jane Smith",
        email: "invalid-email",
        createdAt: "2024-01-01T00:00:00Z",
      };

      await expect(updateUserSchema.validate(input)).rejects.toThrow(
        "Please enter a valid email address"
      );
    });
  });
});
