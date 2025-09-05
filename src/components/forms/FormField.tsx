import React from "react";
import { AlertTriangle } from "lucide-react";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  required = false,
  children,
  className = "",
  htmlFor,
}: FormFieldProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 mr-1 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function TextInput({ error, className = "", ...props }: TextInputProps) {
  const baseClasses =
    "block w-full rounded-lg border-0 px-3 py-2.5 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition-colors";
  const normalClasses = "ring-gray-300 focus:ring-blue-600";
  const errorClasses = "ring-red-300 focus:ring-red-600";

  return (
    <input
      className={`${baseClasses} ${
        error ? errorClasses : normalClasses
      } ${className}`}
      {...props}
    />
  );
}
