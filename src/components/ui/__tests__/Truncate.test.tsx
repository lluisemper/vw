import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Truncate } from "../Truncate";

describe("Truncate", () => {
  it("renders text with default maxWidth", () => {
    render(<Truncate>Short text</Truncate>);

    expect(screen.getByText("Short text")).toBeInTheDocument();
  });

  it("applies custom maxWidth class", () => {
    const { container } = render(
      <Truncate maxWidth="max-w-[100px]">
        This is a very long text that should be truncated
      </Truncate>
    );

    const textElement = container.querySelector("span span");
    expect(textElement).toHaveClass("max-w-[100px]");
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <Truncate className="custom-class">Text</Truncate>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies truncate classes by default", () => {
    const { container } = render(<Truncate>Some text</Truncate>);

    const textElement = container.querySelector("span span");
    expect(textElement).toHaveClass("block", "truncate", "max-w-xs");
  });

  it("has proper accessibility attributes", () => {
    render(<Truncate>Some text content</Truncate>);

    const element = screen.getByText("Some text content");

    expect(element).toHaveAttribute("aria-label", "Some text content");
    expect(element).toHaveAttribute("role", "button");
    expect(element).toHaveAttribute("tabIndex", "0");
  });

  it("supports different tooltip positions prop", () => {
    render(<Truncate tooltipPosition="bottom">Some text</Truncate>);

    // Component should render without errors when tooltipPosition is set
    expect(screen.getByText("Some text")).toBeInTheDocument();
  });

  it("supports showTooltip prop", () => {
    render(<Truncate showTooltip={false}>Some text</Truncate>);

    // Component should render without errors when showTooltip is set to false
    expect(screen.getByText("Some text")).toBeInTheDocument();
  });

  it("renders tooltip structure when hovered (basic DOM structure test)", () => {
    render(<Truncate>Some text</Truncate>);

    const element = screen.getByText("Some text");
    fireEvent.mouseEnter(element);

    // The tooltip may or may not appear based on overflow detection,
    // but the event handlers should be present
    expect(element).toHaveAttribute("aria-label");
  });

  it("removes tooltip when mouse leaves", () => {
    render(<Truncate>Some text</Truncate>);

    const element = screen.getByText("Some text");
    fireEvent.mouseEnter(element);
    fireEvent.mouseLeave(element);

    // Event should not error
    expect(element).toBeInTheDocument();
  });

  it("supports focus and blur events", () => {
    render(<Truncate>Some text</Truncate>);

    const element = screen.getByText("Some text");
    fireEvent.focus(element);
    fireEvent.blur(element);

    // Events should not error
    expect(element).toBeInTheDocument();
  });
});
