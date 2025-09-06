import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { IconButton } from "../IconButton";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  onFirstPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onLastPage: () => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function PaginationControls({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  canPreviousPage,
  canNextPage,
  onFirstPage,
  onPreviousPage,
  onNextPage,
  onLastPage,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30, 40, 50],
}: PaginationControlsProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <nav
      className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      aria-label="Pagination"
    >
      {/* Navigation Controls */}
      <div className="flex items-center justify-center sm:justify-start space-x-1">
        <IconButton
          onClick={onFirstPage}
          disabled={!canPreviousPage}
          variant="outline"
          size="sm"
        >
          <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">First page</span>
        </IconButton>
        <IconButton
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          variant="outline"
          size="md"
          className="px-3"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          <span className="sr-only sm:not-sr-only text-xs sm:text-sm">
            Previous
          </span>
        </IconButton>
        <IconButton
          onClick={onNextPage}
          disabled={!canNextPage}
          variant="outline"
          size="md"
          className="px-3"
        >
          <span className="sr-only sm:not-sr-only text-xs sm:text-sm">
            Next
          </span>
          <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </IconButton>
        <IconButton
          onClick={onLastPage}
          disabled={!canNextPage}
          variant="outline"
          size="sm"
        >
          <ChevronsRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Last page</span>
        </IconButton>
      </div>

      {/* Page Info and Size Controls */}
      <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor="page-size"
            className="text-xs sm:text-sm font-medium text-gray-700"
          >
            Show
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border-0 py-2 pl-3 pr-8 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 transition-colors bg-white shadow-sm hover:ring-gray-400"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs sm:text-sm text-gray-700">
          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>
    </nav>
  );
}
