import { describe, it, expect } from "vitest";
import { formatDate } from "../dateUtils";

describe("formatDate", () => {
  it("formats valid ISO date string correctly", () => {
    const result = formatDate("2024-01-15T10:30:00Z");
    expect(result).toMatch(/Jan 15, 2024/);
  });

  it("returns original string for invalid or empty dates", () => {
    expect(formatDate("invalid-date")).toBe("invalid-date");
    expect(formatDate("")).toBe("");
    expect(formatDate("2024-13-45")).toBe("2024-13-45");
  });

  it("handles leap year dates", () => {
    expect(formatDate("2024-02-29T12:00:00Z")).toMatch(/Feb 29, 2024/);
  });
});
