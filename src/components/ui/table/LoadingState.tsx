interface LoadingStateProps {
  rows?: number;
  columns?: number;
}

export function LoadingState({ rows = 5, columns = 3 }: LoadingStateProps) {
  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50 backdrop-blur-sm">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-3 sm:px-6 py-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-3 sm:px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
