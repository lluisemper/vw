import { describe, it, expect } from "vitest";
import { getSearchDelay } from "../debounce"; // adjust path if needed

describe("getSearchDelay", () => {
  it("returns 500 for items greater than 1000", () => {
    expect(getSearchDelay(1500)).toBe(500);
    expect(getSearchDelay(1001)).toBe(500);
  });

  it("returns 300 for items greater than 100 but less than or equal to 1000", () => {
    expect(getSearchDelay(500)).toBe(300);
    expect(getSearchDelay(101)).toBe(300);
    expect(getSearchDelay(1000)).toBe(300);
  });

  it("returns 0 for items 100 or fewer", () => {
    expect(getSearchDelay(100)).toBe(0);
    expect(getSearchDelay(50)).toBe(0);
    expect(getSearchDelay(0)).toBe(0);
  });
});
