import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingSkeleton } from "../LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders with default number of rows", () => {
    render(<LoadingSkeleton />);

    // Each row has multiple skeleton elements, so we count the rows by the container divs
    const containers = document.querySelectorAll(".flex.space-x-4");
    expect(containers).toHaveLength(5); // default rows
  });

  it("renders correct number of rows when specified", () => {
    render(<LoadingSkeleton rows={3} />);

    const containers = document.querySelectorAll(".flex.space-x-4");
    expect(containers).toHaveLength(3);
  });

  it("renders correct number of rows when 8 is specified", () => {
    render(<LoadingSkeleton rows={8} />);

    const containers = document.querySelectorAll(".flex.space-x-4");
    expect(containers).toHaveLength(8);
  });

  it("applies custom className", () => {
    render(<LoadingSkeleton className="custom-skeleton" />);

    const container = document.querySelector(".animate-pulse");
    expect(container).toHaveClass("custom-skeleton");
  });

  it("has pulse animation class", () => {
    render(<LoadingSkeleton />);

    const container = document.querySelector(".animate-pulse");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("animate-pulse");
  });
});
