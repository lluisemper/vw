import { LoadingSpinner, ErrorMessage } from "@/components/ui";

interface AsyncBoundaryProps {
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  loadingComponent?: React.ReactNode;
  children: React.ReactNode;
}

export const AsyncBoundary = ({
  isLoading,
  error,
  onRetry,
  loadingComponent,
  children,
}: AsyncBoundaryProps) => {
  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (isLoading) {
    return loadingComponent || <LoadingSpinner size="lg" />;
  }

  return <>{children}</>;
};
