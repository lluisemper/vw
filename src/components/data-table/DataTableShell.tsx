import { Info } from "lucide-react";
import { AsyncBoundary } from "@/components/feedback";
import { UserTableLoading } from "@/features/users/components";

interface DataTableShellProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  showMobileInfo?: boolean;
  mobileInfoText?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const DataTableShell = ({
  title,
  subtitle,
  isLoading,
  error,
  onRetry,
  showMobileInfo = true,
  mobileInfoText = "Tap the arrow next to a name to view additional details",
  actions,
  children,
}: DataTableShellProps) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 lg:text-4xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Information Card */}
      {showMobileInfo && !isLoading && (
        <div className="mb-4 md:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">{mobileInfoText}</p>
          </div>
        </div>
      )}

      <AsyncBoundary
        isLoading={isLoading}
        error={error}
        onRetry={onRetry}
        loadingComponent={<UserTableLoading />}
      >
        {children}
      </AsyncBoundary>
    </div>
  );
};
