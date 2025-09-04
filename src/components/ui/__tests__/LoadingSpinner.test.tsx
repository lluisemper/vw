import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
  });

  it("applies correct size and variant classes", () => {
    render(<LoadingSpinner size="lg" variant="primary" />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass(
      "h-8",
      "w-8",
      "border-gray-200",
      "border-t-blue-600"
    );
  });
});
