import { X, AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
  variant?: "error" | "warning";
  title?: string;
}

export const ErrorMessage = ({
  message,
  onRetry,
  className = "",
  variant = "error",
  title,
}: ErrorMessageProps) => {
  const variantStyles = {
    error: {
      container: "bg-red-50 border-red-200",
      icon: "text-red-400",
      title: "text-red-800",
      message: "text-red-700",
      button:
        "bg-red-50 text-red-800 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
      button:
        "bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600 focus:ring-offset-yellow-50",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-lg border p-4 shadow-sm ${styles.container} ${className}`}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          {variant === "error" ? (
            <X className={`h-5 w-5 ${styles.icon}`} />
          ) : (
            <AlertTriangle className={`h-5 w-5 ${styles.icon}`} />
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-semibold ${styles.title}`}>
            {title || (variant === "error" ? "Error" : "Warning")}
          </h3>
          <div className={`mt-2 text-sm ${styles.message}`}>
            <p>{message}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                type="button"
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles.button}`}
                onClick={onRetry}
              >
                <RotateCcw className="-ml-0.5 mr-2 h-4 w-4" />
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
