import { X, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

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
      buttonClass:
        "bg-red-50 text-red-800 hover:bg-red-100 focus:ring-red-600",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200",
      icon: "text-yellow-400",
      title: "text-yellow-800",
      message: "text-yellow-700",
      buttonClass:
        "bg-yellow-50 text-yellow-800 hover:bg-yellow-100 focus:ring-yellow-600",
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onRetry}
                className={styles.buttonClass}
              >
                <RotateCcw className="-ml-0.5 mr-2 h-4 w-4" />
                Try again
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
