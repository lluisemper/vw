import React from "react";

interface EmptyStateProps {
  columns: number;
  emptyStateComponent?: React.ComponentType;
  message?: string;
}

export function EmptyState({
  columns,
  emptyStateComponent: EmptyStateComponent,
  message = "No data found",
}: EmptyStateProps) {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white">
            <tr>
              <td colSpan={columns} className="px-6 py-20 text-center">
                {EmptyStateComponent ? (
                  <EmptyStateComponent />
                ) : (
                  <div className="text-gray-500">{message}</div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
