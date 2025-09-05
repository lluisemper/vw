import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField, TextInput } from "../FormField";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  AlertTriangle: () => <span data-testid="alert-icon">⚠️</span>,
}));

describe("FormField", () => {
  it("should render label and children", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should show required asterisk when required", () => {
    render(
      <FormField label="Test Label" required>
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should not show asterisk when not required", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("should display error message with icon when error is provided", () => {
    render(
      <FormField label="Test Label" error="This field is required">
        <input type="text" />
      </FormField>
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("should not display error message when no error", () => {
    render(
      <FormField label="Test Label">
        <input type="text" />
      </FormField>
    );

    expect(screen.queryByTestId("alert-icon")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    render(
      <FormField label="Test Label" className="custom-class">
        <input type="text" />
      </FormField>
    );

    const fieldContainer = screen.getByText("Test Label").closest("div");
    expect(fieldContainer).toHaveClass("custom-class");
  });
});

describe("TextInput", () => {
  it("should render input with correct base classes", () => {
    render(<TextInput placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("block", "w-full", "rounded-lg");
  });

  it("should apply normal styles when no error", () => {
    render(<TextInput placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("ring-gray-300", "focus:ring-blue-600");
  });

  it("should apply error styles when error prop is true", () => {
    render(<TextInput placeholder="Enter text" error={true} />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("ring-red-300", "focus:ring-red-600");
  });

  it("should pass through HTML input props", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <TextInput
        placeholder="Enter text"
        value="test value"
        onChange={handleChange}
        disabled={false}
      />
    );

    const input = screen.getByPlaceholderText("Enter text") as HTMLInputElement;
    expect(input.value).toBe("test value");

    await user.type(input, "more text");
    expect(handleChange).toHaveBeenCalled();
  });

  it("should be disabled when disabled prop is true", () => {
    render(<TextInput placeholder="Enter text" disabled={true} />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeDisabled();
  });

  it("should apply custom className", () => {
    render(<TextInput placeholder="Enter text" className="custom-input" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toHaveClass("custom-input");
  });

  it("should support different input types", () => {
    render(<TextInput type="email" placeholder="Enter email" />);

    const input = screen.getByPlaceholderText("Enter email");
    expect(input).toHaveAttribute("type", "email");
  });
});
