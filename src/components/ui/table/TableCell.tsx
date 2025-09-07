import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-3 sm:px-6 py-4 whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
