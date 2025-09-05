interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  variant?: "primary" | "secondary" | "white";
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
  variant = "primary",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    primary: "border-gray-200 border-t-blue-600",
    secondary: "border-gray-300 border-t-gray-600",
    white: "border-gray-400 border-t-white",
  };

  return (
    <div
      className={`animate-spin rounded-full border-2 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
