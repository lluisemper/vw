import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AsyncBoundary } from "../AsyncBoundary";
import userEvent from "@testing-library/user-event";

// Mock the UI components
vi.mock("@/components/ui", () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading Spinner
    </div>
  ),
  ErrorMessage: ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry?: () => void;
  }) => (
    <div data-testid="error-message">
      <span>{message}</span>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  ),
}));

describe("AsyncBoundary", () => {
  const defaultProps = {
    isLoading: false,
    error: null,
  };

  it("renders children when not loading and no error", () => {
    render(
      <AsyncBoundary {...defaultProps}>
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByText("Content loaded")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("renders error message when error is present", () => {
    const onRetry = vi.fn();
    render(
      <AsyncBoundary
        {...defaultProps}
        error="Something went wrong"
        onRetry={onRetry}
      >
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("Content loaded")).not.toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });

  it("renders default loading spinner when loading", () => {
    render(
      <AsyncBoundary {...defaultProps} isLoading={true}>
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toHaveAttribute(
      "data-size",
      "lg"
    );
    expect(screen.queryByText("Content loaded")).not.toBeInTheDocument();
    expect(screen.queryByTestId("error-message")).not.toBeInTheDocument();
  });

  it("renders custom loading component when provided", () => {
    const customLoading = (
      <div data-testid="custom-loading">Custom Loading</div>
    );

    render(
      <AsyncBoundary
        {...defaultProps}
        isLoading={true}
        loadingComponent={customLoading}
      >
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByTestId("custom-loading")).toBeInTheDocument();
    expect(screen.getByText("Custom Loading")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.queryByText("Content loaded")).not.toBeInTheDocument();
  });

  it("prioritizes error over loading state", () => {
    render(
      <AsyncBoundary isLoading={true} error="Error occurred" onRetry={vi.fn()}>
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Error occurred")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    expect(screen.queryByText("Content loaded")).not.toBeInTheDocument();
  });

  it("calls onRetry when retry is triggered from error message", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <AsyncBoundary {...defaultProps} error="Network error" onRetry={onRetry}>
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    await user.click(screen.getByText("Retry"));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(
      <AsyncBoundary {...defaultProps} error="Network error">
        <div>Content loaded</div>
      </AsyncBoundary>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.queryByText("Retry")).not.toBeInTheDocument();
  });
});
