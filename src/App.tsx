import { Toaster } from "react-hot-toast";
import { UserPlus } from "lucide-react";
import { useUsers } from "@/features/users/hooks/useUsers";
import { DataTableShell } from "@/components/data-table/DataTableShell";
import { UserTable } from "@/features/users/components/UserTable";
import { useModalStore } from "@/stores/modalStore";
import { ModalShell, Button } from "@/components/ui";

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
    <Button onClick={handleCreateUser}>
      <UserPlus className="h-4 w-4 mr-2" />
      Add User
    </Button>
  );
  // #endregion
  return (
    <main className="min-h-screen bg-gray-50">
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
    </main>
  );
}

export default App;
