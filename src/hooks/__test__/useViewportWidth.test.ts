// src/hooks/__tests__/useViewportWidth.test.tsx
import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useViewportWidth } from "../useViewportWidth";

describe("useViewportWidth", () => {
  it("returns the initial window width", () => {
    // Mock window.innerWidth
    window.innerWidth = 1024;

    const { result } = renderHook(() => useViewportWidth());
    expect(result.current).toBe(1024);
  });

  it("updates width on window resize", () => {
    window.innerWidth = 800;

    const { result } = renderHook(() => useViewportWidth());

    act(() => {
      window.innerWidth = 500;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(500);

    act(() => {
      window.innerWidth = 1200;
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toBe(1200);
  });
});
