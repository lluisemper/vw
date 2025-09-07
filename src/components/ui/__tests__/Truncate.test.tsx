import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Truncate } from "../Truncate";

describe("Truncate", () => {
  it("renders full text when below max length", () => {
    render(<Truncate maxLength={20}>Short text</Truncate>);
    
    expect(screen.getByText("Short text")).toBeInTheDocument();
    expect(screen.queryByText("Short text...")).not.toBeInTheDocument();
  });

  it("truncates text when over max length", () => {
    render(<Truncate maxLength={10}>This is a very long text that should be truncated</Truncate>);
    
    expect(screen.getByText("This is a ...")).toBeInTheDocument();
    expect(screen.queryByText("This is a very long text that should be truncated")).not.toBeInTheDocument();
  });

  it("uses default max length of 20", () => {
    render(<Truncate>This is a very long text that should be truncated with default length</Truncate>);
    
    expect(screen.getByText("This is a very long ...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Truncate className="custom-class">Text</Truncate>);
    
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("shows tooltip on hover when text is truncated", async () => {
    render(<Truncate maxLength={5}>This is long text</Truncate>);
    
    const truncatedElement = screen.getByText("This ...");
    
    fireEvent.mouseEnter(truncatedElement);
    
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("This is long text");
    
    fireEvent.mouseLeave(truncatedElement);
    
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows tooltip on focus when text is truncated", () => {
    render(<Truncate maxLength={5}>This is long text</Truncate>);
    
    const truncatedElement = screen.getByText("This ...");
    
    fireEvent.focus(truncatedElement);
    
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    expect(screen.getByRole("tooltip")).toHaveTextContent("This is long text");
    
    fireEvent.blur(truncatedElement);
    
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not show tooltip when showTooltip is false", () => {
    render(<Truncate maxLength={5} showTooltip={false}>This is long text</Truncate>);
    
    const truncatedElement = screen.getByText("This ...");
    
    fireEvent.mouseEnter(truncatedElement);
    
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("does not show tooltip when text is not truncated", () => {
    render(<Truncate maxLength={20}>Short</Truncate>);
    
    const element = screen.getByText("Short");
    
    fireEvent.mouseEnter(element);
    
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    render(<Truncate maxLength={5}>This is long text</Truncate>);
    
    const truncatedElement = screen.getByText("This ...");
    
    expect(truncatedElement).toHaveAttribute("aria-label", "This is long text");
    expect(truncatedElement).toHaveAttribute("role", "button");
    expect(truncatedElement).toHaveAttribute("tabIndex", "0");
  });

  it("maintains accessibility when text is not truncated", () => {
    render(<Truncate>Short text</Truncate>);
    
    const element = screen.getByText("Short text");
    
    expect(element).not.toHaveAttribute("aria-label");
    expect(element).not.toHaveAttribute("role");
    expect(element).not.toHaveAttribute("tabIndex");
  });
});