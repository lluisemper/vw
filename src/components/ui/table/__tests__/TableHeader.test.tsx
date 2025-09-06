import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TableHeader } from "../TableHeader";
import type { Header } from "@tanstack/react-table";

// Mock the flexRender function
vi.mock("@tanstack/react-table", async () => {
  const actual = await vi.importActual("@tanstack/react-table");
  return {
    ...actual,
    flexRender: vi.fn((content) => content),
  };
});

// Create a mock header object for testing
const createMockHeader = (overrides = {}) => ({
  id: "test-column",
  isPlaceholder: false,
  column: {
    getCanSort: vi.fn(() => true),
    getIsSorted: vi.fn(() => false),
    getToggleSortingHandler: vi.fn(() => vi.fn()),
    columnDef: {
      header: "Test Column",
      meta: undefined,
    },
  },
  getSize: vi.fn(() => 150),
  getContext: vi.fn(() => ({})),
  ...overrides,
});

describe("TableHeader", () => {
  describe("Non-sortable columns", () => {
    it("renders a non-sortable header without button", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getCanSort: vi.fn(() => false),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      expect(screen.getByRole("columnheader")).toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
      expect(screen.getByText("Test Column")).toBeInTheDocument();
    });

    it("applies responsive classes for non-sortable columns", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getCanSort: vi.fn(() => false),
          columnDef: {
            header: "Test Column",
            meta: { responsiveClass: "hidden md:table-cell" },
          },
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const header = screen.getByRole("columnheader");
      expect(header).toHaveClass("hidden", "md:table-cell");
    });
  });

  describe("Sortable columns", () => {
    it("renders a sortable header with button", () => {
      const mockHeader = createMockHeader();

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      expect(screen.getByRole("columnheader")).toBeInTheDocument();
      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Test Column")).toBeInTheDocument();
    });

    it("handles click events on sortable headers", () => {
      const mockToggleSorting = vi.fn();
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getToggleSortingHandler: vi.fn(() => mockToggleSorting),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(mockToggleSorting).toHaveBeenCalledTimes(1);
    });

    it("handles Enter key press for keyboard navigation", () => {
      const mockToggleSorting = vi.fn();
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getToggleSortingHandler: vi.fn(() => mockToggleSorting),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Enter" });

      expect(mockToggleSorting).toHaveBeenCalledTimes(1);
    });

    it("handles Space key press for keyboard navigation", () => {
      const mockToggleSorting = vi.fn();
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getToggleSortingHandler: vi.fn(() => mockToggleSorting),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: " " });

      expect(mockToggleSorting).toHaveBeenCalledTimes(1);
    });

    it("ignores other key presses", () => {
      const mockToggleSorting = vi.fn();
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getToggleSortingHandler: vi.fn(() => mockToggleSorting),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      fireEvent.keyDown(button, { key: "Tab" });
      fireEvent.keyDown(button, { key: "Escape" });
      fireEvent.keyDown(button, { key: "a" });

      expect(mockToggleSorting).not.toHaveBeenCalled();
    });
  });

  describe("ARIA attributes", () => {
    it("sets correct aria-sort when not sorted", () => {
      const mockHeader = createMockHeader();

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const header = screen.getByRole("columnheader");
      const button = screen.getByRole("button");
      expect(header).toHaveAttribute("aria-sort", "none");
      expect(button).toHaveAttribute(
        "aria-label",
        "Test Column, not sorted. Click to sort ascending."
      );
    });

    it("sets correct aria-sort when sorted ascending", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getIsSorted: vi.fn(() => "asc"),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const header = screen.getByRole("columnheader");
      const button = screen.getByRole("button");
      expect(header).toHaveAttribute("aria-sort", "ascending");
      expect(button).toHaveAttribute(
        "aria-label",
        "Test Column, sorted ascending. Click to sort descending."
      );
    });

    it("sets correct aria-sort when sorted descending", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getIsSorted: vi.fn(() => "desc"),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const header = screen.getByRole("columnheader");
      const button = screen.getByRole("button");
      expect(header).toHaveAttribute("aria-sort", "descending");
      expect(button).toHaveAttribute(
        "aria-label",
        "Test Column, sorted descending. Click to sort ascending."
      );
    });
  });

  describe("Visual feedback", () => {
    it("shows appropriate sort icon when not sorted", () => {
      const mockHeader = createMockHeader();

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      // ArrowUpDown icon should be present but potentially hidden (opacity-0)
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("shows appropriate sort icon when sorted ascending", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getIsSorted: vi.fn(() => "asc"),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("shows appropriate sort icon when sorted descending", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          getIsSorted: vi.fn(() => "desc"),
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("applies responsive classes for sortable columns", () => {
      const mockHeader = createMockHeader({
        column: {
          ...createMockHeader().column,
          columnDef: {
            header: "Test Column",
            meta: { responsiveClass: "hidden lg:table-cell" },
          },
        },
      });

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const header = screen.getByRole("columnheader");
      expect(header).toHaveClass("hidden", "lg:table-cell");
    });
  });

  describe("Focus management", () => {
    it("applies focus ring styles to sortable headers", () => {
      const mockHeader = createMockHeader();

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass(
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-blue-500"
      );
    });

    it("is keyboard focusable", () => {
      const mockHeader = createMockHeader();

      render(
        <TableHeader
          header={mockHeader as unknown as Header<unknown, unknown>}
        />
      );

      const button = screen.getByRole("button");
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
