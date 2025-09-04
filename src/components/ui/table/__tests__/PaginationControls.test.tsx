import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaginationControls } from "../PaginationControls";

// Mock lucide-react
vi.mock("lucide-react", () => ({
  ChevronsLeft: () => <div data-testid="chevrons-left">⇤</div>,
  ChevronLeft: () => <div data-testid="chevron-left">‹</div>,
  ChevronRight: () => <div data-testid="chevron-right">›</div>,
  ChevronsRight: () => <div data-testid="chevrons-right">⇥</div>,
}));

describe("PaginationControls", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 3,
    pageSize: 10,
    totalItems: 25,
    canPreviousPage: false,
    canNextPage: true,
    onFirstPage: vi.fn(),
    onPreviousPage: vi.fn(),
    onNextPage: vi.fn(),
    onLastPage: vi.fn(),
    onPageSizeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pagination controls", () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByTestId("chevrons-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-left")).toBeInTheDocument();
    expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
    expect(screen.getByTestId("chevrons-right")).toBeInTheDocument();
  });

  it("displays current page information", () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  it("disables previous buttons when on first page", () => {
    render(<PaginationControls {...defaultProps} />);

    const firstButton = screen.getByRole("button", { name: /first page/i });
    const prevButton = screen.getByRole("button", { name: /previous/i });

    expect(firstButton).toBeDisabled();
    expect(prevButton).toBeDisabled();
  });

  it("disables next buttons when on last page", () => {
    render(
      <PaginationControls
        {...defaultProps}
        currentPage={3}
        canPreviousPage={true}
        canNextPage={false}
      />
    );

    const nextButton = screen.getByRole("button", { name: /next/i });
    const lastButton = screen.getByRole("button", { name: /last page/i });

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it("calls navigation handlers", async () => {
    const user = userEvent.setup();
    const props = {
      ...defaultProps,
      currentPage: 2,
      canPreviousPage: true,
      canNextPage: true,
    };

    render(<PaginationControls {...props} />);

    await user.click(screen.getByRole("button", { name: /first page/i }));
    expect(props.onFirstPage).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /previous/i }));
    expect(props.onPreviousPage).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(props.onNextPage).toHaveBeenCalledOnce();

    await user.click(screen.getByRole("button", { name: /last page/i }));
    expect(props.onLastPage).toHaveBeenCalledOnce();
  });

  it("renders page size selector", () => {
    render(<PaginationControls {...defaultProps} />);

    expect(screen.getByLabelText("Show")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();
  });

  it("calls onPageSizeChange when page size changes", async () => {
    const user = userEvent.setup();

    render(<PaginationControls {...defaultProps} />);

    const select = screen.getByLabelText("Show");
    await user.selectOptions(select, "20");

    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it("uses custom page size options", () => {
    render(
      <PaginationControls {...defaultProps} pageSizeOptions={[5, 15, 25]} />
    );

    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.queryByText("10")).not.toBeInTheDocument();
  });

  it("does not render when totalItems is 0", () => {
    const { container } = render(
      <PaginationControls {...defaultProps} totalItems={0} />
    );

    expect(container.firstChild).toBeNull();
  });
});
