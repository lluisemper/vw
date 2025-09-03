
export const LoadingSkeleton = ({ className = '', rows = 5 }: { className?: string; rows?: number }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <div className="h-4 bg-gray-200 rounded w-12 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded flex-1 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-48 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
        </div>
      ))}
    </div>
  );
};