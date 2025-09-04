import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";

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
    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Navigation Controls */}
      <div className="flex items-center justify-center sm:justify-start space-x-1">
        <button
          onClick={onFirstPage}
          disabled={!canPreviousPage}
          className="inline-flex items-center rounded-md bg-white px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">First page</span>
        </button>
        <button
          onClick={onPreviousPage}
          disabled={!canPreviousPage}
          className="inline-flex items-center rounded-md bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        <button
          onClick={onNextPage}
          disabled={!canNextPage}
          className="inline-flex items-center rounded-md bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
        <button
          onClick={onLastPage}
          disabled={!canNextPage}
          className="inline-flex items-center rounded-md bg-white px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Last page</span>
        </button>
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
            className="rounded-md border-0 py-1.5 pl-2 sm:pl-3 pr-6 sm:pr-8 text-xs sm:text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
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
    </div>
  );
}
