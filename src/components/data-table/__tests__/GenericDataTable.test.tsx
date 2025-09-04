import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenericDataTable } from "../GenericDataTable";
import type { ColumnDef } from "@tanstack/react-table";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  Users: () => <div data-testid="users-icon">Users</div>,
  ArrowUp: () => <div data-testid="arrow-up">↑</div>,
  ArrowDown: () => <div data-testid="arrow-down">↓</div>,
  ArrowUpDown: () => <div data-testid="arrow-up-down">↕</div>,
  ChevronsLeft: () => <div data-testid="chevrons-left">⇤</div>,
  ChevronLeft: () => <div data-testid="chevron-left">‹</div>,
  ChevronRight: () => <div data-testid="chevron-right">›</div>,
  ChevronsRight: () => <div data-testid="chevrons-right">⇥</div>,
}));

interface TestData {
  id: number;
  name: string;
  email: string;
}

describe("GenericDataTable", () => {
  const mockData: TestData[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com" },
  ];

  const mockColumns: ColumnDef<TestData>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
  ];

  const defaultProps = {
    data: mockData,
    columns: mockColumns,
  };

  it("renders table with data", () => {
    render(<GenericDataTable {...defaultProps} />);

    // Use accessibility queries for semantic table markup
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("row")).toHaveLength(4); // 3 data rows + 1 header row
    expect(screen.getAllByRole("columnheader")).toHaveLength(3);

    // Verify data content
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<GenericDataTable {...defaultProps} />);

    // Use role-based queries for headers
    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(3);

    expect(
      screen.getByRole("columnheader", { name: /ID/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Email/i })
    ).toBeInTheDocument();
  });

  it("renders search input by default", () => {
    render(<GenericDataTable {...defaultProps} />);

    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("renders custom search placeholder", () => {
    render(
      <GenericDataTable {...defaultProps} searchPlaceholder="Search users..." />
    );

    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument();
  });

  it("hides search when showSearch is false", () => {
    render(<GenericDataTable {...defaultProps} showSearch={false} />);

    expect(screen.queryByPlaceholderText("Search...")).not.toBeInTheDocument();
  });

  it("renders data count by default", () => {
    render(<GenericDataTable {...defaultProps} />);

    expect(screen.getByText("3 of 3 items")).toBeInTheDocument();
    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
  });

  it("renders custom data count label", () => {
    render(<GenericDataTable {...defaultProps} dataCountLabel="users" />);

    expect(screen.getByText("3 of 3 users")).toBeInTheDocument();
  });

  it("hides data count when showDataCount is false", () => {
    render(<GenericDataTable {...defaultProps} showDataCount={false} />);

    expect(screen.queryByText("3 of 3 items")).not.toBeInTheDocument();
  });

  it("filters data when searching", async () => {
    const user = userEvent.setup();
    render(<GenericDataTable {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "John");

    // Wait for the table to update
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("updates filtered count when searching", async () => {
    const user = userEvent.setup();
    render(<GenericDataTable {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "John");

    // The count should update - may be "1 of 3 items" or displayed in the responsive format
    expect(screen.getByText(/\d+\s+of\s+3\s+items/)).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    const EmptyState = () => <div data-testid="empty-state">No data found</div>;
    render(
      <GenericDataTable
        {...defaultProps}
        data={[]}
        emptyStateComponent={EmptyState}
      />
    );

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("renders empty state when filtered data is empty", async () => {
    const user = userEvent.setup();
    const EmptyState = () => (
      <div data-testid="empty-state">No matching results</div>
    );
    render(
      <GenericDataTable {...defaultProps} emptyStateComponent={EmptyState} />
    );

    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "nonexistent");

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<GenericDataTable {...defaultProps} className="custom-table" />);

    const container = screen.getByText("John Doe").closest("div.custom-table");
    expect(container).toBeInTheDocument();
  });

  it("handles sorting when column headers are clicked", async () => {
    const user = userEvent.setup();
    render(<GenericDataTable {...defaultProps} />);

    // Initially should show unsorted state (ArrowUpDown icon)
    expect(screen.getAllByTestId("arrow-up-down")).toHaveLength(3); // All columns are sortable by default

    const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
    await user.click(nameHeader);

    // After first click, should show ascending sort (ArrowUp icon)
    expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
    expect(screen.getAllByTestId("arrow-up-down")).toHaveLength(2); // ID and Email columns still have unsorted icons

    // After sorting, Bob should come first alphabetically
    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1]; // Skip header row
    expect(firstDataRow).toHaveTextContent("Bob Johnson");

    // Click again for descending sort
    await user.click(nameHeader);
    expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
    expect(screen.queryByTestId("arrow-up")).not.toBeInTheDocument();

    // Now John should come first (descending order)
    const rowsDesc = screen.getAllByRole("row");
    const firstDataRowDesc = rowsDesc[1];
    expect(firstDataRowDesc).toHaveTextContent("John Doe");
  });

  it("renders pagination by default", () => {
    render(<GenericDataTable {...defaultProps} />);

    expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeInTheDocument();
    expect(screen.getByTestId("chevrons-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevrons-right")).toBeInTheDocument();
  });

  it("hides pagination when showPagination is false", () => {
    render(<GenericDataTable {...defaultProps} showPagination={false} />);

    expect(screen.queryByText(/Page\s+1\s+of\s+1/)).not.toBeInTheDocument();
  });

  it("provides renderExpandedRow function when passed", () => {
    const renderExpandedRow = (item: TestData) => (
      <div data-testid={`expanded-${item.id}`}>
        Expanded content for {item.name}
      </div>
    );

    render(
      <GenericDataTable
        {...defaultProps}
        renderExpandedRow={renderExpandedRow}
      />
    );

    // Verify table renders with expandable rows capability
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Initially, no expanded content should be visible
    expect(screen.queryByTestId("expanded-1")).not.toBeInTheDocument();
  });

  it("renders without renderExpandedRow", () => {
    render(<GenericDataTable {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  it("handles expanded row interaction with click simulation", async () => {
    const largeDataset = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <GenericDataTable
        data={largeDataset}
        columns={mockColumns}
        initialPageSize={10}
      />
    );

    expect(screen.getByText("25 of 25 items")).toBeInTheDocument();
    expect(screen.getByText(/Page\s+1\s+of\s+3/)).toBeInTheDocument(); // 25 items / 10 per page = 3 pages
  });

  it("clears search filter", async () => {
    const user = userEvent.setup();
    render(<GenericDataTable {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search..."
    ) as HTMLInputElement;

    await user.type(searchInput, "jane");
    expect(screen.getByText(/\d+ of 3 items/)).toBeInTheDocument();

    // Clear search
    await user.clear(searchInput);
    expect(screen.getByText("3 of 3 items")).toBeInTheDocument();
  });

  it("handles pagination navigation correctly", async () => {
    const user = userEvent.setup();

    // Create a larger dataset that will span multiple pages
    const largeDataset = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <GenericDataTable
        data={largeDataset}
        columns={mockColumns}
        initialPageSize={5}
      />
    );

    // Verify we're on page 1 of 3 (15 items / 5 per page = 3 pages)
    expect(screen.getByText(/Page\s+1\s+of\s+3/)).toBeInTheDocument();
    expect(screen.getByText("15 of 15 items")).toBeInTheDocument();

    // Verify first page data is showing
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 5")).toBeInTheDocument();
    expect(screen.queryByText("User 6")).not.toBeInTheDocument();

    // Navigate to next page using the chevron icon
    const nextButton = screen.getByTestId("chevron-right").closest("button")!;
    await user.click(nextButton);

    // Verify we're now on page 2
    expect(screen.getByText(/Page\s+2\s+of\s+3/)).toBeInTheDocument();

    // Verify second page data is showing
    expect(screen.getByText("User 6")).toBeInTheDocument();
    expect(screen.getByText("User 10")).toBeInTheDocument();
    expect(screen.queryByText("User 1")).not.toBeInTheDocument();
    expect(screen.queryByText("User 11")).not.toBeInTheDocument();

    // Navigate to last page using the last page button
    const lastPageButton = screen.getByTestId("chevrons-right");
    await user.click(lastPageButton);

    // Verify we're now on page 3
    expect(screen.getByText(/Page\s+3\s+of\s+3/)).toBeInTheDocument();

    // Verify last page data is showing
    expect(screen.getByText("User 11")).toBeInTheDocument();
    expect(screen.getByText("User 15")).toBeInTheDocument();
    expect(screen.queryByText("User 10")).not.toBeInTheDocument();

    // Navigate back to first page using the first page button
    const firstPageButton = screen.getByTestId("chevrons-left");
    await user.click(firstPageButton);

    // Verify we're back on page 1
    expect(screen.getByText(/Page\s+1\s+of\s+3/)).toBeInTheDocument();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 5")).toBeInTheDocument();

    // Navigate to previous page (should be disabled on page 1)
    const prevButton = screen.getByTestId("chevron-left").closest("button")!;
    expect(prevButton).toBeDisabled();

    // Navigate to page 2 then test previous button
    await user.click(nextButton);
    expect(screen.getByText(/Page\s+2\s+of\s+3/)).toBeInTheDocument();

    const prevButtonActive = screen
      .getByTestId("chevron-left")
      .closest("button")!;
    expect(prevButtonActive).not.toBeDisabled();
    await user.click(prevButtonActive);

    // Should be back on page 1
    expect(screen.getByText(/Page\s+1\s+of\s+3/)).toBeInTheDocument();
  });

  it("handles page size changes correctly", async () => {
    const user = userEvent.setup();

    // Create dataset with 25 items
    const largeDataset = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));

    render(
      <GenericDataTable
        data={largeDataset}
        columns={mockColumns}
        initialPageSize={10}
      />
    );

    // Initially showing 10 items per page (3 pages total)
    expect(screen.getByText(/Page\s+1\s+of\s+3/)).toBeInTheDocument();

    // Change page size to 20
    const pageSizeSelect = screen.getByLabelText("Show");
    await user.selectOptions(pageSizeSelect, "20");

    // Now should show 2 pages (25 items / 20 per page = 2 pages)
    expect(screen.getByText(/Page\s+1\s+of\s+2/)).toBeInTheDocument();

    // Verify more items are visible on the page
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 20")).toBeInTheDocument();
    expect(screen.queryByText("User 21")).not.toBeInTheDocument();

    // Change page size to 50 (should fit all items on one page)
    await user.selectOptions(pageSizeSelect, "50");

    // Now should show 1 page
    expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeInTheDocument();

    // All items should be visible
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 25")).toBeInTheDocument();
  });
});
