import { useState } from "react";

interface TruncateProps {
  children: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
  tooltipPosition?: "top" | "bottom";
}

export function Truncate({
  children,
  maxLength = 20,
  className = "",
  showTooltip = true,
  tooltipPosition = "top",
}: TruncateProps) {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const shouldTruncate = children.length > maxLength;
  const truncatedText = shouldTruncate
    ? `${children.slice(0, maxLength)}...`
    : children;

  if (!shouldTruncate) {
    return <span className={className}>{children}</span>;
  }

  // Tooltip base classes
  const tooltipBaseClasses =
    "absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm min-w-[170px] max-w-[170px] sm:max-w-xs md:max-w-sm whitespace-normal break-words [overflow-wrap:anywhere] left-1/2 transform -translate-x-1/2";

  // Position-specific classes
  const tooltipPositionClasses =
    tooltipPosition === "top" ? "bottom-full mb-1" : "top-full mt-1";

  const arrowPositionClasses =
    tooltipPosition === "top"
      ? "top-full border-t-gray-900 -mt-[1px]"
      : "bottom-full border-b-gray-900 -mb-[1px]";

  // Handlers to keep tooltip open when hovering text or tooltip
  const handleMouseEnter = () => showTooltip && setShowTooltipState(true);
  const handleMouseLeave = () => showTooltip && setShowTooltipState(false);

  return (
    <span
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <span
        className="cursor-help"
        tabIndex={0}
        aria-label={children}
        role="button"
      >
        {truncatedText}
      </span>

      {showTooltip && showTooltipState && (
        <div
          role="tooltip"
          className={`${tooltipBaseClasses} ${tooltipPositionClasses}`}
        >
          {children}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 border-4 border-transparent ${arrowPositionClasses}`}
          />
        </div>
      )}
    </span>
  );
}
