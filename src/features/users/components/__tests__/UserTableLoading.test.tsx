import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import UserTableLoading from "../UserTableLoading";

// Mock the UI components
vi.mock("@/components/ui", () => ({
  LoadingSkeleton: ({ rows }: { rows?: number }) => (
    <div data-testid="loading-skeleton" data-rows={rows}>
      Loading Skeleton
    </div>
  ),
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading Spinner
    </div>
  ),
}));

describe("UserTableLoading", () => {
  it("renders loading UI with spinner, skeleton, and message", () => {
    render(<UserTableLoading />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  it("renders spinner with correct size", () => {
    render(<UserTableLoading />);
    expect(screen.getByTestId("loading-spinner")).toHaveAttribute(
      "data-size",
      "lg"
    );
  });

  it("renders skeleton with correct number of rows", () => {
    render(<UserTableLoading />);
    expect(screen.getByTestId("loading-skeleton")).toHaveAttribute(
      "data-rows",
      "8"
    );
  });
});
