import React from "react";

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  responsiveClass?: string;
}

export function TableCell({
  children,
  className = "",
  responsiveClass = "",
}: TableCellProps) {
  return (
    <td
      className={`px-3 sm:px-6 py-4 whitespace-nowrap ${responsiveClass} ${className}`}
    >
      {children}
    </td>
  );
}
