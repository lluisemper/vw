import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../SearchBar";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
}));

describe("SearchBar", () => {
  const defaultProps = {
    value: "",
    onChange: vi.fn(),
  };

  // Helper to render the component with overrides
  const renderSearchBar = (props = {}) =>
    render(<SearchBar {...defaultProps} {...props} />);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search input with icon", () => {
    renderSearchBar();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("displays current value", () => {
    renderSearchBar({ value: "test search" });
    expect(screen.getByDisplayValue("test search")).toBeInTheDocument();
  });

  it("calls onChange after debounce delay when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderSearchBar({ onChange, delay: 100 });

    const input = screen.getByRole("textbox");
    await user.type(input, "abc");

    // onChange should not be called immediately
    expect(onChange).not.toHaveBeenCalled();

    // Wait for debounce delay
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );

    expect(onChange).toHaveBeenCalledWith("abc");
  });

  it("uses default placeholder", () => {
    renderSearchBar();
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("uses custom placeholder", () => {
    renderSearchBar({ placeholder: "Search users..." });
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    renderSearchBar({ className: "custom-search" });
    const container = screen.getByTestId("search-bar-container");
    expect(container).toHaveClass("custom-search");
  });

  it("has essential accessibility", () => {
    renderSearchBar();
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Search...");
    expect(input).toHaveAttribute("type", "text");
  });

  it("calls onChange immediately when delay is 0", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderSearchBar({ onChange, delay: 0 });

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    // With delay: 0, onChange should be called for each character + potentially initial empty value
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
      expect(onChange.mock.calls.length).toBeGreaterThanOrEqual(4);
    });

    // Should end with the final value
    expect(onChange).toHaveBeenLastCalledWith("test");
  });

  it("debounces multiple rapid changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderSearchBar({ onChange, delay: 100 });

    const input = screen.getByRole("textbox");
    
    // Type rapidly
    await user.type(input, "test");
    
    // Should not have called onChange yet
    expect(onChange).not.toHaveBeenCalled();
    
    // Wait for debounce
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledTimes(1);
      },
      { timeout: 200 }
    );
    
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("updates input value immediately while debouncing onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderSearchBar({ onChange, delay: 100 });

    const input = screen.getByRole("textbox");
    await user.type(input, "abc");

    // Input should show the value immediately
    expect(input).toHaveValue("abc");
    
    // But onChange should not be called yet
    expect(onChange).not.toHaveBeenCalled();

    // Wait for debounce
    await waitFor(
      () => {
        expect(onChange).toHaveBeenCalledWith("abc");
      },
      { timeout: 200 }
    );
  });
});
