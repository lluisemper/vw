import React from "react";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function TableRow({ children, className = "" }: TableRowProps) {
  return (
    <tr
      className={`hover:bg-gray-50/50 transition-colors duration-150 group ${className}`}
    >
      {children}
    </tr>
  );
}
