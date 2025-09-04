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
      return <ArrowDown className="h-4 w-4" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />;
    }
    return (
      <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    );
  };

  const canSort = header.column.getCanSort();
  const toggleSorting = header.column.getToggleSortingHandler();

  return (
    <th
      className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider ${
        canSort ? "cursor-pointer hover:bg-gray-100 select-none" : ""
      } transition-colors duration-200 group ${
        header.column.columnDef.meta?.responsiveClass || ""
      }`}
      onClick={canSort ? toggleSorting : undefined}
      style={{ width: header.getSize() }}
    >
      <div className="flex items-center justify-between">
        <span className="group-hover:text-gray-700 transition-colors">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </span>
        {canSort && (
          <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
            {getSortIcon()}
          </span>
        )}
      </div>
    </th>
  );
}
