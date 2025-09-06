import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IconButton } from "../IconButton";

const TestIcon = () => (
  <svg data-testid="test-icon">
    <circle />
  </svg>
);

describe("IconButton", () => {
  it("renders with default props", () => {
    render(
      <IconButton>
        <TestIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
    expect(button).toHaveClass("text-gray-700", "hover:bg-gray-100");
  });

  it("applies correct variant classes", () => {
    render(
      <IconButton variant="primary">
        <TestIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-blue-600", "text-white");
  });

  it("applies correct size classes", () => {
    render(
      <IconButton size="lg">
        <TestIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("p-3");
  });

  it("shows loading spinner when loading and hides icon", () => {
    render(
      <IconButton loading>
        <TestIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toContainElement(screen.getByRole("status"));
    expect(screen.queryByTestId("test-icon")).not.toBeInTheDocument();
  });

  it("uses correct spinner variant based on button variant", () => {
    render(
      <IconButton variant="primary" loading>
        <TestIcon />
      </IconButton>
    );
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("border-gray-400", "border-t-white");
  });

  it("is disabled when disabled prop is true", () => {
    render(
      <IconButton disabled>
        <TestIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(
      <IconButton onClick={handleClick}>
        <TestIcon />
      </IconButton>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <IconButton className="custom-class">
        <TestIcon />
      </IconButton>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(
      <IconButton ref={ref}>
        <TestIcon />
      </IconButton>
    );
    expect(ref).toHaveBeenCalled();
  });
});
