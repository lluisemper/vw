import { Info } from 'lucide-react';
import { LoadingSpinner, LoadingSkeleton, ErrorMessage } from '../ui';

interface DataTableShellProps {
  title: string;
  subtitle?: string;
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  showMobileInfo?: boolean;
  mobileInfoText?: string;
  children: React.ReactNode;
}

// TODO / NOTE: This could be abstracted further into an AsyncBoundary (or QueryBoundary) component.
// The AsyncBoundary would handle fetching states (loading spinner, error message, empty state) 
// and allow any child component to render once data is ready.
export const DataTableShell = ({
  title,
  subtitle,
  isLoading,
  error,
  onRetry,
  showMobileInfo = true,
  mobileInfoText = "Tap the arrow next to a name to view additional details",
  children,
}: DataTableShellProps) => {
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorMessage message={error} onRetry={onRetry} />
      </div>
    );
  }

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
              <p className="mt-2 text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Information Card */}
      {showMobileInfo && !isLoading && (
        <div className="mb-4 md:hidden bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center">
            <Info className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-blue-800">
              {mobileInfoText}
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden p-6">
          <div className="flex items-center justify-center py-8 mb-6">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-600 font-medium">Loading users...</span>
          </div>
          <LoadingSkeleton rows={8} />
        </div>
      ) : (
        children
      )}
    </div>
  );
};