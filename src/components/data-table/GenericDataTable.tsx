import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Users } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  SearchBar,
  PaginationControls,
  EmptyState,
} from "@/components/ui/table";
import { getSearchDelay } from "@/utils/debounce";

interface GenericDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  searchPlaceholder?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  showDataCount?: boolean;
  dataCountLabel?: string;
  initialPageSize?: number;
  className?: string;
  emptyStateComponent?: React.ComponentType;
  renderExpandedRow?: (item: TData) => React.ReactNode;
  searchBarActions?: React.ReactNode;
}

export function GenericDataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  showSearch = true,
  showPagination = true,
  showDataCount = true,
  dataCountLabel = "items",
  initialPageSize = 10,
  className = "",
  emptyStateComponent,
  renderExpandedRow,
  searchBarActions,
}: GenericDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
  });

  const toggleRowExpansion = (rowId: string) => {
    setExpandedRows((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      return newExpanded;
    });
  };

  const filteredRowCount = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const pageSize = table.getState().pagination.pageSize;

  return (
    <div className={className}>
      {/* Search Bar with Actions */}
      {showSearch && (
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <SearchBar
            value={globalFilter ?? ""}
            onChange={setGlobalFilter}
            placeholder={searchPlaceholder}
            delay={getSearchDelay(data.length)}
          />
          {searchBarActions && (
            <div className="flex-shrink-0">{searchBarActions}</div>
          )}
        </div>
      )}

      {/* Data Count */}
      {showDataCount && (
        <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg w-fit">
          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="hidden sm:inline">
            {filteredRowCount} of {data.length} {dataCountLabel}
          </span>
          <span className="sm:hidden">
            {filteredRowCount}/{data.length}
          </span>
        </div>
      )}
      {data.length === 0 || filteredRowCount === 0 ? (
        <EmptyState
          columns={columns.length}
          emptyStateComponent={emptyStateComponent}
          message={data.length === 0 ? "No data available" : "No results found"}
        />
      ) : (
        <>
          {/* Table */}
          <Table>
            <thead className="bg-gray-50/50 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHeader key={header.id} header={header} />
                  ))}
                </tr>
              ))}
            </thead>
            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const isExpanded = expandedRows.has(row.id);

                return (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          responsiveClass={
                            cell.column.columnDef.meta?.responsiveClass || ""
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, {
                            ...cell.getContext(),
                            toggleRowExpansion: () =>
                              toggleRowExpansion(row.id),
                            isExpanded,
                          })}
                        </TableCell>
                      ))}
                    </TableRow>
                    {/* Mobile expanded content */}
                    {isExpanded && renderExpandedRow && (
                      <tr className="md:hidden">
                        <td colSpan={columns.length} className="p-0">
                          {renderExpandedRow(row.original)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          {showPagination && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={data.length}
              canPreviousPage={table.getCanPreviousPage()}
              canNextPage={table.getCanNextPage()}
              onFirstPage={() => table.setPageIndex(0)}
              onPreviousPage={() => table.previousPage()}
              onNextPage={() => table.nextPage()}
              onLastPage={() => table.setPageIndex(table.getPageCount() - 1)}
              onPageSizeChange={(newPageSize) => table.setPageSize(newPageSize)}
            />
          )}
        </>
      )}
    </div>
  );
}
