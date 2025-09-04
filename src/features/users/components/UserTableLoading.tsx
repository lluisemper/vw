import { LoadingSkeleton, LoadingSpinner } from "@/components/ui";

function UserTableLoading() {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden p-6">
      <div className="flex items-center justify-center py-8 mb-6">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600 font-medium">Loading users...</span>
      </div>
      <LoadingSkeleton rows={8} />
    </div>
  );
}

export default UserTableLoading;
