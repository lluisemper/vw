import React, { Suspense } from "react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { DataTableShell } from "@/components/data-table/DataTableShell";
import { UserTable } from "@/features/users/components/UserTable";
import { useModalStore } from "@/stores/modalStore";
import type { User } from "@/types";
import { LoadingSpinner } from "@/components/ui";

const UserDetailsModal = React.lazy(
  () => import("@/features/users/components/UserDetailsModal")
);

function App() {
  const { users, isLoading, error, refetch } = useUsers();
  const { modalData } = useModalStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <DataTableShell
        title="User Management"
        subtitle="Manage and view all users in your organization"
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      >
        <UserTable users={users} />
      </DataTableShell>

      {Boolean(modalData) && (
        <Suspense
          fallback={
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-4 shadow">
                <LoadingSpinner size="md" />
              </div>
            </div>
          }
        >
          <UserDetailsModal user={modalData as User} />
        </Suspense>
      )}
    </div>
  );
}

export default App;
