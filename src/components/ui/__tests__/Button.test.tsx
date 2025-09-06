import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveClass("bg-blue-600", "text-white");
  });

  it("applies correct variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-600", "text-white");
  });

  it("applies correct size classes", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-base");
  });

  it("shows loading spinner when loading", () => {
    render(<Button loading>Loading Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toContainElement(screen.getByRole("status"));
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("handles click events", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref).toHaveBeenCalled();
  });
});
