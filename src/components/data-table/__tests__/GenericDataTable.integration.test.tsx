import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenericDataTable } from "../GenericDataTable";
import { DataTableShell } from "../DataTableShell";
import type { ColumnDef } from "@tanstack/react-table";

// Mock the API service
const mockFetch = vi.fn();
global.fetch = mockFetch;

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// Generate test data - 75 users to test pagination with large datasets
const generateUsers = (count: number): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${String(i + 1).padStart(2, "0")}`,
    email: `user${i + 1}@company.com`,
    createdAt: new Date(2024, 0, 1 + i).toISOString(),
    updatedAt: new Date(2024, 0, 1 + i).toISOString(),
  }));
};

const mockUsers = generateUsers(75);

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: true,
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
  {
    accessorKey: "createdAt",
    header: "Created",
    enableSorting: true,
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    enableSorting: true,
    cell: ({ getValue }) => {
      const date = new Date(getValue<string>());
      return date.toLocaleDateString();
    },
  },
];

// Mock LoadingSkeleton and ErrorMessage components
vi.mock("@/components/ui", () => ({
  LoadingSkeleton: ({ rows }: { rows?: number }) => (
    <div data-testid="loading-skeleton" data-rows={rows}>
      Loading Skeleton
    </div>
  ),
}));

vi.mock("@/components/feedback", () => ({
  AsyncBoundary: ({
    isLoading,
    error,
    onRetry,
    loadingComponent,
    children,
  }: {
    isLoading: boolean;
    error: string | null;
    onRetry?: () => void;
    loadingComponent?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <div
      data-testid="async-boundary"
      data-loading={isLoading}
      data-error={error}
    >
      {error ? (
        <div data-testid="error-state">
          <p>Error: {error}</p>
          {onRetry && (
            <button onClick={onRetry} data-testid="retry-button">
              Retry
            </button>
          )}
        </div>
      ) : isLoading ? (
        loadingComponent || <div data-testid="default-loading">Loading...</div>
      ) : (
        children
      )}
    </div>
  ),
}));

vi.mock("@/features/users/components", () => ({
  UserTableLoading: () => (
    <div data-testid="user-table-loading">User Table Loading</div>
  ),
}));

// Mock Lucide React icons
vi.mock("lucide-react", () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
  Users: () => <div data-testid="users-icon">👥</div>,
  ArrowUp: () => <div data-testid="arrow-up">↑</div>,
  ArrowDown: () => <div data-testid="arrow-down">↓</div>,
  ArrowUpDown: () => <div data-testid="arrow-up-down">↕</div>,
  ChevronsLeft: () => <div data-testid="chevrons-left">⇤</div>,
  ChevronLeft: () => <div data-testid="chevron-left">‹</div>,
  ChevronRight: () => <div data-testid="chevron-right">›</div>,
  ChevronsRight: () => <div data-testid="chevrons-right">⇥</div>,
  Info: () => <div data-testid="info-icon">ℹ️</div>,
}));

describe("GenericDataTable Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Data Loading Scenarios", () => {
    it("loads and displays large dataset with 50+ users", async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
      });

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Verify table structure
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getAllByRole("columnheader")).toHaveLength(5);

      // Verify data count shows large dataset
      expect(screen.getByText("75 of 75 items")).toBeInTheDocument();

      // Verify pagination shows multiple pages (75 users / 10 per page = 8 pages)
      expect(screen.getByText(/Page\s+1\s+of\s+8/)).toBeInTheDocument();

      // Verify first page shows first 10 users
      expect(screen.getByText("User 01")).toBeInTheDocument();
      expect(screen.getByText("User 10")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();
    });

    it("handles loading state properly", () => {
      render(
        <DataTableShell title="Users" isLoading={true} error={null}>
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      expect(screen.getByTestId("async-boundary")).toHaveAttribute(
        "data-loading",
        "true"
      );
      expect(screen.getByTestId("user-table-loading")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });

    it("handles API errors with retry functionality", async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      render(
        <DataTableShell
          title="Users"
          isLoading={false}
          error="Failed to load users"
          onRetry={onRetry}
        >
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      // Verify error state
      expect(screen.getByTestId("error-state")).toBeInTheDocument();
      expect(
        screen.getByText("Error: Failed to load users")
      ).toBeInTheDocument();

      // Test retry functionality
      const retryButton = screen.getByTestId("retry-button");
      await user.click(retryButton);

      expect(onRetry).toHaveBeenCalledOnce();
    });
  });

  describe("Search Functionality", () => {
    it("filters large dataset by search term", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Initial state - all users visible
      expect(screen.getByText("75 of 75 items")).toBeInTheDocument();

      // Search for users with "User 1" in their name
      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "User 1");

      // Wait for filtering to apply
      await waitFor(() => {
        expect(screen.getByText(/\d+\s+of\s+75\s+items/)).toBeInTheDocument();
      });

      // Verify filtered results (User 10-19: 10 total)
      const filteredCountText = screen.getByText(
        /\d+\s+of\s+75\s+items/
      ).textContent;
      expect(filteredCountText).toMatch(/10\s+of\s+75\s+items/);
    });

    it("handles no search results gracefully", async () => {
      const user = userEvent.setup();
      const EmptyState = () => (
        <div data-testid="no-results">No results found</div>
      );

      render(
        <GenericDataTable
          data={mockUsers}
          columns={userColumns}
          emptyStateComponent={EmptyState}
        />
      );

      // Search for non-existent term
      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "NonExistentTerm");

      // Verify empty state is shown
      await waitFor(() => {
        expect(screen.getByTestId("no-results")).toBeInTheDocument();
      });
    });

    it("clears search and restores full dataset", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      const searchInput = screen.getByPlaceholderText(
        "Search..."
      ) as HTMLInputElement;

      // Apply search
      await user.type(searchInput, "User 1");
      await waitFor(() => {
        expect(screen.getByText(/10\s+of\s+75\s+items/)).toBeInTheDocument();
      });

      // Clear search
      await user.clear(searchInput);
      await waitFor(() => {
        expect(screen.getByText("75 of 75 items")).toBeInTheDocument();
      });
    });
  });

  describe("Sorting Functionality", () => {
    it("sorts large dataset by different columns", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Sort by Name (ascending)
      const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
      await user.click(nameHeader);

      // Verify sort icon appears
      expect(screen.getByTestId("arrow-up")).toBeInTheDocument();

      // Verify sorting order - first user should be "User 01"
      const rows = screen.getAllByRole("row");
      const firstDataRow = rows[1]; // Skip header
      expect(firstDataRow).toHaveTextContent("User 01");

      // Sort by Email
      const emailHeader = screen.getByRole("columnheader", { name: /Email/i });
      await user.click(emailHeader);

      // Verify first email is "user1@company.com" (alphabetically first)
      await waitFor(() => {
        const sortedRows = screen.getAllByRole("row");
        const firstSortedRow = sortedRows[1];
        expect(firstSortedRow).toHaveTextContent("user1@company.com");
      });
    });

    it("maintains sort state during pagination", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Sort by Email
      const emailHeader = screen.getByRole("columnheader", { name: /Email/i });
      await user.click(emailHeader);

      // Navigate to next page
      const nextButton = screen.getByTestId("chevron-right").closest("button")!;
      await user.click(nextButton);

      // Verify sort is maintained on page 2
      expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
      expect(screen.getByText(/Page\s+2\s+of\s+8/)).toBeInTheDocument();
    });
  });

  describe("Pagination Functionality", () => {
    it("navigates through multiple pages with large dataset", async () => {
      const user = userEvent.setup();

      render(
        <GenericDataTable
          data={mockUsers}
          columns={userColumns}
          initialPageSize={10}
        />
      );

      // Verify initial pagination state
      expect(screen.getByText(/Page\s+1\s+of\s+8/)).toBeInTheDocument();
      expect(screen.getByText("User 01")).toBeInTheDocument();
      expect(screen.queryByText("User 11")).not.toBeInTheDocument();

      // Navigate to next page
      const nextButton = screen.getByTestId("chevron-right").closest("button")!;
      await user.click(nextButton);

      // Verify page 2 content
      expect(screen.getByText(/Page\s+2\s+of\s+8/)).toBeInTheDocument();
      expect(screen.getByText("User 11")).toBeInTheDocument();
      expect(screen.getByText("User 20")).toBeInTheDocument();

      // Jump to last page
      const lastButton = screen
        .getByTestId("chevrons-right")
        .closest("button")!;
      await user.click(lastButton);

      // Verify last page (75 users, page 8 has 5 users: 71-75)
      expect(screen.getByText(/Page\s+8\s+of\s+8/)).toBeInTheDocument();
      expect(screen.getByText("User 71")).toBeInTheDocument();
      expect(screen.getByText("User 75")).toBeInTheDocument();
    });

    it("changes page size and recalculates pagination", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Initial: 10 per page = 8 pages
      expect(screen.getByText(/Page\s+1\s+of\s+8/)).toBeInTheDocument();

      // Change to 20 per page
      const pageSizeSelect = screen.getByLabelText("Show");
      await user.selectOptions(pageSizeSelect, "20");

      // Should now have 4 pages (75 / 20 = 3.75 → 4 pages)
      expect(screen.getByText(/Page\s+1\s+of\s+4/)).toBeInTheDocument();

      // Verify more items visible
      expect(screen.getByText("User 01")).toBeInTheDocument();
      expect(screen.getByText("User 20")).toBeInTheDocument();
      expect(screen.queryByText("User 21")).not.toBeInTheDocument();
    });

    it("handles pagination with filtered results", async () => {
      const user = userEvent.setup();

      render(<GenericDataTable data={mockUsers} columns={userColumns} />);

      // Filter by "User 1" (10 results: User 10-19)
      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "User 1");

      await waitFor(() => {
        // 10 filtered users / 10 per page = 1 page
        expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeInTheDocument();
      });

      // Verify all 10 results fit on one page
      expect(screen.getByText("User 10")).toBeInTheDocument();
      expect(screen.getByText("User 19")).toBeInTheDocument();
    });
  });

  describe("Error Recovery Scenarios", () => {
    it("handles API timeout and allows retry", async () => {
      const user = userEvent.setup();

      const onRetry = vi.fn();

      const { rerender } = render(
        <DataTableShell
          title="Users"
          isLoading={false}
          error="Request timeout - please try again"
          onRetry={onRetry}
        >
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      // Verify error state
      expect(
        screen.getByText("Error: Request timeout - please try again")
      ).toBeInTheDocument();

      // Click retry
      await user.click(screen.getByTestId("retry-button"));
      expect(onRetry).toHaveBeenCalledOnce();

      // Simulate successful retry by updating props
      rerender(
        <DataTableShell title="Users" isLoading={false} error={null}>
          <GenericDataTable
            data={mockUsers.slice(0, 10)}
            columns={userColumns}
          />
        </DataTableShell>
      );

      // Verify data is now shown
      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("10 of 10 items")).toBeInTheDocument();
    });

    it("handles network error with proper error message", () => {
      render(
        <DataTableShell
          title="Users"
          isLoading={false}
          error="Network error - check your connection"
        >
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      expect(
        screen.getByText("Error: Network error - check your connection")
      ).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    });
  });

  describe("Full User Journey", () => {
    it("completes full user workflow: load → search → sort → paginate → retry", async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();

      const { rerender } = render(
        <DataTableShell title="Users" isLoading={true} error={null}>
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      // 1. Initial loading state
      expect(screen.getByTestId("user-table-loading")).toBeInTheDocument();

      // 2. Data loaded successfully
      rerender(
        <DataTableShell title="Users" isLoading={false} error={null}>
          <GenericDataTable data={mockUsers} columns={userColumns} />
        </DataTableShell>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("75 of 75 items")).toBeInTheDocument();

      // 3. Search functionality
      const searchInput = screen.getByPlaceholderText("Search...");
      await user.type(searchInput, "User 2");

      await waitFor(() => {
        expect(screen.getByText(/10\s+of\s+75\s+items/)).toBeInTheDocument();
      });

      // 4. Sort the filtered results
      const nameHeader = screen.getByRole("columnheader", { name: /Name/i });
      await user.click(nameHeader);
      expect(screen.getByTestId("arrow-up")).toBeInTheDocument();

      // 5. Verify pagination (only 1 page with 10 results)
      expect(screen.getByText(/Page\s+1\s+of\s+1/)).toBeInTheDocument();

      // Verify next button is disabled since all results fit on one page
      const nextButton = screen.getByTestId("chevron-right").closest("button")!;
      expect(nextButton).toBeDisabled();

      // 6. Simulate error scenario
      rerender(
        <DataTableShell
          title="Users"
          isLoading={false}
          error="Connection lost - please retry"
          onRetry={onRetry}
        >
          <GenericDataTable data={[]} columns={userColumns} />
        </DataTableShell>
      );

      expect(
        screen.getByText("Error: Connection lost - please retry")
      ).toBeInTheDocument();

      // 7. Retry action
      await user.click(screen.getByTestId("retry-button"));
      expect(onRetry).toHaveBeenCalledOnce();

      // 8. Successful recovery
      rerender(
        <DataTableShell title="Users" isLoading={false} error={null}>
          <GenericDataTable data={mockUsers} columns={userColumns} />
        </DataTableShell>
      );

      expect(screen.getByRole("table")).toBeInTheDocument();
      expect(screen.getByText("75 of 75 items")).toBeInTheDocument();
    });
  });
});
