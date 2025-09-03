import { DataTable } from './components/DataTable/DataTable';
import { useUsers } from './hooks/useUsers';

function App() {
  const { users, isLoading, error, refetch } = useUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <DataTable
        users={users}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
      />
    </div>
  );
}

export default App;
