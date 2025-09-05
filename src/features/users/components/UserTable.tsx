import { useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Mail,
  ChevronUp,
  ChevronDown,
  Hash,
  Clock,
  RotateCcw,
  Users,
  Eye,
} from "lucide-react";
import type { User } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { GenericDataTable } from "@/components/data-table/GenericDataTable";
import { useModalStore } from "@/stores/modalStore";

interface UserTableProps {
  users: User[];
  className?: string;
  searchBarActions?: React.ReactNode;
}

interface CellContext {
  toggleRowExpansion?: () => void;
  isExpanded?: boolean;
}

export const UserTable = ({ users, className, searchBarActions }: UserTableProps) => {
  const { openModal } = useModalStore();

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 80,
        cell: ({ row }) => (
          <div className="font-mono text-sm text-gray-500 tabular-nums">
            #{row.getValue("id")}
          </div>
        ),
        meta: {
          responsiveClass: "hidden lg:table-cell",
        },
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, ...context }) => {
          const cellContext = context as CellContext;
          return (
            <div className="flex items-center">
              <div className="flex-shrink-0 h-8 w-8">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {(row.getValue("name") as string).charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <div className="font-semibold text-gray-900">
                  {row.getValue("name")}
                </div>
              </div>
              {/* Mobile expand/collapse button */}
              {cellContext.toggleRowExpansion && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cellContext.toggleRowExpansion?.();
                  }}
                  className="ml-auto md:hidden p-1 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={
                    cellContext.isExpanded
                      ? "Collapse details"
                      : "Expand details"
                  }
                >
                  {cellContext.isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              )}
            </div>
          );
        },
        meta: {
          responsiveClass: "", // Always visible
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Mail className="h-4 w-4 text-gray-400 mr-2 hidden sm:block" />
            <span className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer text-sm sm:text-base">
              {row.getValue("email")}
            </span>
          </div>
        ),
        meta: {
          responsiveClass: "", // Always visible
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <div className="text-sm text-gray-500 tabular-nums">
            <div>{formatDate(row.getValue("createdAt"))}</div>
          </div>
        ),
        sortingFn: "datetime",
        meta: {
          responsiveClass: "hidden lg:table-cell",
        },
      },
      {
        accessorKey: "updatedAt",
        header: "Last Updated",
        cell: ({ row }) => (
          <div className="text-sm text-gray-500 tabular-nums">
            <div>{formatDate(row.getValue("updatedAt"))}</div>
          </div>
        ),
        sortingFn: "datetime",
        meta: {
          responsiveClass: "hidden md:table-cell",
        },
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <button
              onClick={() => openModal("userDetails", row.original)}
              className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label={`View details for ${row.original.name}`}
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        ),
        enableSorting: false,
        meta: {
          responsiveClass: "", // Always visible
        },
      },
    ],
    // This is not actually needed.
    // Currently it does not change, however if the behavior were to change in the future it will provide some safeguards.
    [openModal]
  );

  const renderExpandedRow = (user: User) => (
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
          <span className="ml-2 text-gray-700 tabular-nums">
            {formatDate(user.createdAt)}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <RotateCcw className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-500 font-medium">Last Updated:</span>
          <span className="ml-2 text-gray-700 tabular-nums">
            {formatDate(user.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center">
      <Users className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
      <p className="text-sm text-gray-500">
        Try adjusting your search criteria
      </p>
    </div>
  );

  return (
    <GenericDataTable
      data={users}
      columns={columns}
      searchPlaceholder="Search users..."
      dataCountLabel="users"
      className={className}
      emptyStateComponent={EmptyState}
      renderExpandedRow={renderExpandedRow}
      searchBarActions={searchBarActions}
    />
  );
};
