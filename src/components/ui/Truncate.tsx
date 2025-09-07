import { useState, useRef, useEffect } from "react";

interface TruncateProps {
  children: string;
  className?: string;
  showTooltip?: boolean;
  tooltipPosition?: "top" | "bottom";
  maxWidth?: string; // e.g., "w-40" or "max-w-xs"
}

export function Truncate({
  children,
  className = "",
  showTooltip = true,
  tooltipPosition = "top",
  maxWidth = "max-w-xs",
}: TruncateProps) {
  const [showTooltipState, setShowTooltipState] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  // Check if the text overflows its container
  useEffect(() => {
    const el = textRef.current;
    if (el) {
      setIsOverflowing(el.scrollWidth > el.clientWidth);
    }
  }, [children, maxWidth]);

  const tooltipBaseClasses = `
    absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900
    rounded-lg shadow-sm whitespace-normal break-words left-1/2 transform -translate-x-1/2
    min-w-[170px] max-w-[170px]
    sm:min-w-[200px] sm:max-w-[200px]
    lg:min-w-[300px] lg:max-w-[300px]
  `;
  const tooltipPositionClasses =
    tooltipPosition === "top" ? "bottom-full mb-1" : "top-full mt-1";
  const arrowPositionClasses =
    tooltipPosition === "top"
      ? "top-full border-t-gray-900 -mt-[1px]"
      : "bottom-full border-b-gray-900 -mb-[1px]";

  return (
    <span className={`relative ${className}`}>
      <span
        ref={textRef}
        className={`block truncate ${maxWidth} ${
          isOverflowing ? "cursor-help" : ""
        }`}
        onMouseEnter={() =>
          isOverflowing && showTooltip && setShowTooltipState(true)
        }
        onMouseLeave={() => setShowTooltipState(false)}
        onFocus={() =>
          isOverflowing && showTooltip && setShowTooltipState(true)
        }
        onBlur={() => setShowTooltipState(false)}
        tabIndex={0}
        role="button"
        aria-label={children}
      >
        {children}
      </span>

      {showTooltip && showTooltipState && isOverflowing && (
        <div
          role="tooltip"
          className={`${tooltipBaseClasses} ${tooltipPositionClasses}`}
          onMouseEnter={() => setShowTooltipState(true)}
          onMouseLeave={() => setShowTooltipState(false)}
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
