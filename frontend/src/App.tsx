import { useUsers } from './features/users/hooks/useUsers';
import { DataTableShell } from './components/DataTable/DataTableShell';
import { UserTable } from './features/users/components/UserTable';

function App() {
  const { users, isLoading, error, refetch } = useUsers();

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
    </div>
  );
}

export default App;