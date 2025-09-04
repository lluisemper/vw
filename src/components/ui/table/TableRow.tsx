import React from "react";

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function TableRow({ children, className = "", onClick }: TableRowProps) {
  return (
    <tr
      className={`hover:bg-gray-50/50 transition-colors duration-150 group ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}
