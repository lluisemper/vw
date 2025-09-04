import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTableShell } from "../DataTableShell";
import userEvent from "@testing-library/user-event";

// Mock the dependencies
vi.mock("@/components/feedback", () => ({
  AsyncBoundary: ({
    isLoading,
    error,
    onRetry,
    loadingComponent,
    children,
  }: {
    isLoading: boolean;
    error: string | null;
    onRetry?: () => void;
    loadingComponent?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="async-boundary"
      data-loading={isLoading}
      data-error={error}
    >
      {error ? (
        <div data-testid="error-state">
          Error: {error}
          {onRetry && <button onClick={onRetry}>Retry</button>}
        </div>
      ) : isLoading ? (
        loadingComponent || <div data-testid="default-loading">Loading...</div>
      ) : (
        children
      )}
    </div>
  ),
}));

vi.mock("@/features/users/components", () => ({
  UserTableLoading: () => (
    <div data-testid="user-table-loading">User Table Loading</div>
  ),
}));

vi.mock("lucide-react", () => ({
  Info: () => <div data-testid="info-icon">Info Icon</div>,
}));

describe("DataTableShell", () => {
  const defaultProps = {
    title: "Test Title",
    isLoading: false,
    error: null,
  };

  it("renders title correctly", () => {
    render(
      <DataTableShell {...defaultProps}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Test Title"
    );
  });

  it("renders subtitle when provided", () => {
    render(
      <DataTableShell {...defaultProps} subtitle="Test Subtitle">
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    render(
      <DataTableShell {...defaultProps}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.queryByText("Test Subtitle")).not.toBeInTheDocument();
  });

  it("renders mobile info card by default when not loading", () => {
    render(
      <DataTableShell {...defaultProps}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(
      screen.getByText(
        "Tap the arrow next to a name to view additional details"
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("renders custom mobile info text", () => {
    render(
      <DataTableShell {...defaultProps} mobileInfoText="Custom mobile info">
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByText("Custom mobile info")).toBeInTheDocument();
  });

  it("hides mobile info when showMobileInfo is false", () => {
    render(
      <DataTableShell {...defaultProps} showMobileInfo={false}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(
      screen.queryByText(
        "Tap the arrow next to a name to view additional details"
      )
    ).not.toBeInTheDocument();
  });

  it("hides mobile info when loading", () => {
    render(
      <DataTableShell {...defaultProps} isLoading={true}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(
      screen.queryByText(
        "Tap the arrow next to a name to view additional details"
      )
    ).not.toBeInTheDocument();
  });

  it("passes loading state to AsyncBoundary", () => {
    render(
      <DataTableShell {...defaultProps} isLoading={true}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByTestId("async-boundary")).toHaveAttribute(
      "data-loading",
      "true"
    );
    expect(screen.getByTestId("user-table-loading")).toBeInTheDocument();
  });

  it("passes error state to AsyncBoundary", () => {
    render(
      <DataTableShell {...defaultProps} error="Test error">
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByTestId("async-boundary")).toHaveAttribute(
      "data-error",
      "Test error"
    );
    expect(screen.getByTestId("error-state")).toBeInTheDocument();
    expect(screen.getByText("Error: Test error")).toBeInTheDocument();
  });

  it("passes onRetry to AsyncBoundary", async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTableShell {...defaultProps} error="Test error" onRetry={onRetry}>
        <div>Content</div>
      </DataTableShell>
    );

    await user.click(screen.getByText("Retry"));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders children when not loading and no error", () => {
    render(
      <DataTableShell {...defaultProps}>
        <div data-testid="table-content">Table Content</div>
      </DataTableShell>
    );

    expect(screen.getByTestId("table-content")).toBeInTheDocument();
    expect(screen.getByText("Table Content")).toBeInTheDocument();
  });

  it("uses UserTableLoading as the loading component", () => {
    render(
      <DataTableShell {...defaultProps} isLoading={true}>
        <div>Content</div>
      </DataTableShell>
    );

    expect(screen.getByTestId("user-table-loading")).toBeInTheDocument();
    expect(screen.queryByTestId("default-loading")).not.toBeInTheDocument();
  });

  it("applies correct container styling classes", () => {
    render(
      <DataTableShell {...defaultProps}>
        <div>Content</div>
      </DataTableShell>
    );

    const container = document.querySelector(".max-w-7xl.mx-auto.px-4");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      "max-w-7xl",
      "mx-auto",
      "px-4",
      "sm:px-6",
      "lg:px-8",
      "py-8"
    );
  });
});
