import { useMemo, useState, useCallback } from 'react';
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
  Mail, 
  Hash, 
  Clock, 
  RotateCcw, 
  ChevronUp, 
  ChevronDown, 
  ArrowUp, 
  ArrowDown, 
  ArrowUpDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Info
} from 'lucide-react';
import type { User } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { LoadingSpinner, LoadingSkeleton, ErrorMessage } from '../ui';

interface DataTableProps {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export const DataTable = ({ users, isLoading, error, onRetry }: DataTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = useCallback((rowId: string) => {
    setExpandedRows(prev => {
    const newExpanded = new Set(prev);
    if (newExpanded.has(rowId)) newExpanded.delete(rowId);
    else newExpanded.add(rowId);
    return newExpanded;
  });
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: ({ row }) => (
        <div className="font-mono text-sm text-gray-500 tabular-nums">
          #{row.getValue('id')}
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
              {(row.getValue('name') as string).charAt(0)}
            </div>
          </div>
          <div className="ml-3">
            <div className="font-semibold text-gray-900">{row.getValue('name')}</div>
          </div>
          {/* Mobile expand/collapse button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRowExpansion(row.id);
            }}
            className="ml-auto md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={expandedRows.has(row.id) ? 'Collapse details' : 'Expand details'}
          >
            {expandedRows.has(row.id) ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2 hidden sm:block" />
          <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm sm:text-base">
            {row.getValue('email')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 tabular-nums">
          <div>{formatDate(row.getValue('createdAt'))}</div>
        </div>
      ),
      sortingFn: 'datetime',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => (
        <div className="text-sm text-gray-500 tabular-nums">
          <div>{formatDate(row.getValue('updatedAt'))}</div>
        </div>
      ),
      sortingFn: 'datetime',
    },
  ], [expandedRows, toggleRowExpansion]);

  const table = useReactTable({
    data: users,
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
        pageSize: 10,
      },
    },
  });

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

  const renderMobileExpandedContent = (user: User) => (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
      <div className="space-y-3">
        <div className="flex items-center text-sm">
          <Hash className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 font-medium">ID:</span>
          <span className="ml-2 font-mono text-gray-700">#{user.id}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 font-medium">Created:</span>
          <span className="ml-2 text-gray-700 tabular-nums">{formatDate(user.createdAt)}</span>
        </div>
        <div className="flex items-center text-sm">
          <RotateCcw className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 font-medium">Last Updated:</span>
          <span className="ml-2 text-gray-700 tabular-nums">{formatDate(user.updatedAt)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              User Management
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and view all users in your organization
            </p>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search users..."
              className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all duration-200"
            />
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
          <Users className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="hidden sm:inline">
            {table.getFilteredRowModel().rows.length} of {users.length} users
          </span>
          <span className="sm:hidden">
            {table.getFilteredRowModel().rows.length}/{users.length}
          </span>
        </div>
      </div>

      {/* Responsive Information Card (Mobile only) */}
      <div className="mb-4 md:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center">
          <Info className="h-5 w-5 text-blue-600 mr-2" />
          <p className="text-sm text-blue-800">
            Tap the arrow next to a name to view additional details
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <div className="flex items-center justify-center py-8 mb-6">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-gray-600 font-medium">Loading users...</span>
            </div>
            <LoadingSkeleton rows={8} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const columnKey = header.column.id;
                      let responsiveClasses = '';
                      
                      // Apply responsive visibility classes
                      switch (columnKey) {
                        case 'id':
                          responsiveClasses = 'hidden lg:table-cell';
                          break;
                        case 'name':
                          responsiveClasses = ''; // Always visible
                          break;
                        case 'email':
                          responsiveClasses = ''; // Always visible
                          break;
                        case 'createdAt':
                          responsiveClasses = 'hidden lg:table-cell';
                          break;
                        case 'updatedAt':
                          responsiveClasses = 'hidden md:table-cell';
                          break;
                        default:
                          responsiveClasses = '';
                      }
                      
                      return (
                        <th
                          key={header.id}
                          className={`px-3 sm:px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none transition-colors duration-200 group ${responsiveClasses}`}
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
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-20 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <Users className="h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => {
                    const user = row.original;
                    const isExpanded = expandedRows.has(row.id);
                    
                    return (
                      <>
                        <tr 
                          key={row.id} 
                          className="hover:bg-gray-50/50 transition-colors duration-150 group"
                        >
                          {row.getVisibleCells().map((cell) => {
                            const columnKey = cell.column.id;
                            let responsiveClasses = '';
                            
                            // Apply responsive visibility classes
                            switch (columnKey) {
                              case 'id':
                                responsiveClasses = 'hidden lg:table-cell';
                                break;
                              case 'name':
                                responsiveClasses = ''; // Always visible
                                break;
                              case 'email':
                                responsiveClasses = ''; // Always visible
                                break;
                              case 'createdAt':
                                responsiveClasses = 'hidden lg:table-cell';
                                break;
                              case 'updatedAt':
                                responsiveClasses = 'hidden md:table-cell';
                                break;
                              default:
                                responsiveClasses = '';
                            }
                            
                            return (
                              <td key={cell.id} className={`px-3 sm:px-6 py-4 whitespace-nowrap ${responsiveClasses}`}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </td>
                            );
                          })}
                        </tr>
                        {/* Mobile expanded content */}
                        {isExpanded && (
                          <tr className="md:hidden">
                            <td colSpan={columns.length} className="p-0">
                              {renderMobileExpandedContent(user)}
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
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
};