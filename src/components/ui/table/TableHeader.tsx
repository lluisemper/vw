import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import type { Header } from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";

interface TableHeaderProps<TData> {
  header: Header<TData, unknown>;
}

export function TableHeader<TData>({ header }: TableHeaderProps<TData>) {
  const getSortIcon = () => {
    const sortDirection = header.column.getIsSorted();

    if (sortDirection === "desc") {
      return (
        <ArrowDown
          className="h-4 w-4"
          aria-hidden="true"
          data-testid="arrow-down"
        />
      );
    }
    if (sortDirection === "asc") {
      return (
        <ArrowUp
          className="h-4 w-4"
          aria-hidden="true"
          data-testid="arrow-up"
        />
      );
    }
    return (
      <ArrowUpDown
        className="h-4 w-4 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        data-testid="arrow-up-down"
      />
    );
  };

  const canSort = header.column.getCanSort();
  const toggleSorting = header.column.getToggleSortingHandler();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!canSort || !toggleSorting) return;

    // Handle Enter and Space keys for accessibility
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleSorting(event);
    }
  };

  const getSortAriaLabel = () => {
    const columnName = header.column.columnDef.header?.toString() || "Column";
    const sortDirection = header.column.getIsSorted();

    if (sortDirection === "asc") {
      return `${columnName}, sorted ascending. Click to sort descending.`;
    } else if (sortDirection === "desc") {
      return `${columnName}, sorted descending. Click to sort ascending.`;
    } else {
      return `${columnName}, not sorted. Click to sort ascending.`;
    }
  };

  if (canSort) {
    return (
      <th
        className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 focus-within:bg-gray-100 select-none transition-colors duration-200 group ${
          header.column.columnDef.meta?.responsiveClass || ""
        }`}
        scope="col"
        style={{ width: header.getSize() }}
        onClick={toggleSorting}
        aria-sort={
          header.column.getIsSorted() === "asc"
            ? "ascending"
            : header.column.getIsSorted() === "desc"
            ? "descending"
            : "none"
        }
      >
        <button
          className="w-full h-full flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-sm p-1 -m-1"
          onClick={(e) => {
            e.stopPropagation();
            toggleSorting?.(e);
          }}
          onKeyDown={handleKeyDown}
          aria-label={getSortAriaLabel()}
        >
          <span className="group-hover:text-gray-700 group-focus-within:text-gray-700 transition-colors">
            {header.isPlaceholder
              ? null
              : flexRender(header.column.columnDef.header, header.getContext())}
          </span>
          <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500 group-focus-within:text-gray-500">
            {getSortIcon()}
          </span>
        </button>
      </th>
    );
  }

  return (
    <th
      className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider transition-colors duration-200 ${
        header.column.columnDef.meta?.responsiveClass || ""
      }`}
      scope="col"
      style={{ width: header.getSize() }}
    >
      <span>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
    </th>
  );
}
