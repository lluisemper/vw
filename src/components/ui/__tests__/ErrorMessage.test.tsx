import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message with default props", () => {
    render(<ErrorMessage message="Something went wrong" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.queryByText("Try again")).not.toBeInTheDocument();
  });

  it("renders custom title when provided", () => {
    render(<ErrorMessage message="Test error" title="Custom Error" />);

    expect(screen.getByText("Custom Error")).toBeInTheDocument();
    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);

    expect(
      screen.getByRole("button", { name: "Try again" })
    ).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorMessage message="Test error" onRetry={onRetry} />);

    const retryButton = screen.getByRole("button", { name: "Try again" });
    await user.click(retryButton);

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("renders warning variant correctly", () => {
    render(<ErrorMessage message="Warning message" variant="warning" />);

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(screen.getByText("Warning message")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<ErrorMessage message="Test" className="custom-class" />);

    const container = screen.getByText("Test").closest(".custom-class");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("custom-class");
  });

  it("has proper accessibility attributes", () => {
    render(<ErrorMessage message="Test error" />);

    // The message container should be properly structured
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("marks warning as status for accessibility", () => {
    render(<ErrorMessage message="Be careful" variant="warning" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
