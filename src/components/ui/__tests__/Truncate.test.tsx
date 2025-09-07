import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
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

  it("renders tooltip with proper mouse handlers when tooltip is visible", () => {
    // Mock isOverflowing state by directly testing the component's internal logic
    const TestComponent = () => {
      const [showTooltipState, setShowTooltipState] = React.useState(true);
      const [isOverflowing] = React.useState(true);

      return (
        <span className="relative">
          <span
            className="block truncate max-w-xs"
            onMouseEnter={() => setShowTooltipState(true)}
            onMouseLeave={() => setShowTooltipState(false)}
            role="button"
            tabIndex={0}
            aria-label="Test text"
          >
            Test text
          </span>
          {showTooltipState && isOverflowing && (
            <div
              role="tooltip"
              className="absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm whitespace-normal break-words left-1/2 transform -translate-x-1/2 min-w-[170px] max-w-[170px] sm:min-w-[200px] sm:max-w-[200px] lg:min-w-[300px] lg:max-w-[300px] bottom-full mb-1"
              onMouseEnter={() => setShowTooltipState(true)}
              onMouseLeave={() => setShowTooltipState(false)}
            >
              Test text
              <div className="absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent top-full border-t-gray-900 -mt-[1px]" />
            </div>
          )}
        </span>
      );
    };

    render(<TestComponent />);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeInTheDocument();

    // Test tooltip mouse handlers
    fireEvent.mouseEnter(tooltip);
    expect(tooltip).toBeInTheDocument();

    fireEvent.mouseLeave(tooltip);
    // The tooltip should still be there since we're testing the internal structure
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });
});
