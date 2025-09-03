import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { 
  Search, 
  Users,
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

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
}

// NOTE: This component combines several responsibilities:
// - Table logic (sorting, filtering, pagination) via react-table
// - UI for search input and data count
// - Rendering empty state and optional expanded rows
// 
// If needed, we could further abstract concerns:
// 1. Search / Data Count → separate toolbar component
// 2. Expanded row rendering → provide a dedicated RowExpander component

export function GenericDataTable<TData>({
  data,
  columns,
  searchPlaceholder = 'Search...',
  showSearch = true,
  showPagination = true,
  showDataCount = true,
  dataCountLabel = 'items',
  initialPageSize = 10,
  className = '',
  emptyStateComponent: EmptyStateComponent,
  renderExpandedRow,
}: GenericDataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
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
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId);
      } else {
        newExpanded.add(rowId);
      }
      return newExpanded;
    });
  };

  return (
    <div className={className}>
      {/* Search and Data Count */}
      {(showSearch || showDataCount) && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {showSearch ? (
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
          
          {showDataCount && data.length > 0 && (
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
              <Users className="h-4 w-4 mr-1.5 text-gray-500" />
              <span className="hidden sm:inline">
                {table.getFilteredRowModel().rows.length} of {data.length} {dataCountLabel}
              </span>
              <span className="sm:hidden">
                {table.getFilteredRowModel().rows.length}/{data.length}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50 backdrop-blur-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors duration-200 group ${header.column.columnDef.meta?.responsiveClass || ''}`}
                      onClick={header.column.getToggleSortingHandler()}
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="group-hover:text-gray-700 transition-colors">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                        <span className="ml-2 flex-none rounded text-gray-400 group-hover:text-gray-500">
                          {header.column.getIsSorted() === 'desc' ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : header.column.getIsSorted() === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-20 text-center">
                    {EmptyStateComponent ? <EmptyStateComponent /> : (
                      <div className="text-gray-500">No data found</div>
                    )}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isExpanded = expandedRows.has(row.id);
                  
                  return (
                    <React.Fragment key={row.id}>
                      <tr 
                        className="hover:bg-gray-50/50 transition-colors duration-150 group"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className={`px-3 sm:px-6 py-4 whitespace-nowrap ${cell.column.columnDef.meta?.responsiveClass || ''}`}>
                            {flexRender(cell.column.columnDef.cell, {
                              ...cell.getContext(),
                              toggleRowExpansion: () => toggleRowExpansion(row.id),
                              isExpanded,
                            })}
                          </td>
                        ))}
                      </tr>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {showPagination && data.length > 0 && (
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center justify-center sm:justify-start space-x-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center rounded-md bg-white px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="inline-flex items-center rounded-md bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Previous</span>
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center rounded-md bg-white px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="inline-flex items-center rounded-md bg-white px-2 sm:px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white transition-all duration-200"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </button>
          </div>

          <div className="flex items-center justify-center sm:justify-end gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="page-size" className="text-xs sm:text-sm font-medium text-gray-700">Show</label>
              <select
                id="page-size"
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="rounded-md border-0 py-1.5 pl-2 sm:pl-3 pr-6 sm:pr-8 text-xs sm:text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600"
              >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-xs sm:text-sm text-gray-700">
              <span className="font-medium">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}