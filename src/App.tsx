import { Toaster } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import Modal from "react-modal";

import { useUsers } from "@/features/users/hooks/useUsers";
import { DataTableShell } from "@/components/data-table/DataTableShell";
import { UserTable } from "@/features/users/components/UserTable";
import { useModalStore } from "@/stores/modalStore";
import { ModalShell } from "@/components/ui/modal";

Modal.setAppElement("#root");

function App() {
  const { users, isLoading, error, refetch } = useUsers();
  const { openModal } = useModalStore();

  // This could be move into a User Management page.
  // This being a SPA, the APP is the page itself and this would cause unnecessary abstraction
  // #region
  const handleCreateUser = () => {
    openModal("createUser");
  };

  const addUserButton = (
    <button
      onClick={handleCreateUser}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      <UserPlus className="h-4 w-4 mr-2" />
      Add User
    </button>
  );
  // #endregion
  return (
    <div className="min-h-screen bg-gray-50">
      <DataTableShell
        title="User Management"
        subtitle="Manage and view all users in your organization"
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      >
        <UserTable users={users} searchBarActions={addUserButton} />
      </DataTableShell>
      <ModalShell />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: "#10b981",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
