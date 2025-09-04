import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
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

  it("calls onChange correctly when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderSearchBar({ onChange });

    const input = screen.getByRole("textbox");
    await user.type(input, "abc");

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenNthCalledWith(1, "a");
    expect(onChange).toHaveBeenNthCalledWith(2, "b");
    expect(onChange).toHaveBeenNthCalledWith(3, "c");
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
});
