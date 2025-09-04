import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  const defaultProps = {
    columns: 3,
  };

  it("renders default empty message", () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByText("No data found")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders custom message", () => {
    render(<EmptyState {...defaultProps} message="Custom empty message" />);

    expect(screen.getByText("Custom empty message")).toBeInTheDocument();
  });

  it("renders custom empty state component", () => {
    const CustomEmptyState = () => (
      <div data-testid="custom-empty">Custom Empty Component</div>
    );

    render(
      <EmptyState {...defaultProps} emptyStateComponent={CustomEmptyState} />
    );

    expect(screen.getByTestId("custom-empty")).toBeInTheDocument();
    expect(screen.getByText("Custom Empty Component")).toBeInTheDocument();
    expect(screen.queryByText("No data found")).not.toBeInTheDocument();
  });

  it("spans correct number of columns", () => {
    render(<EmptyState columns={5} />);

    const cell = screen.getByText("No data found").closest("td");
    expect(cell).toHaveAttribute("colSpan", "5");
  });

  it("has proper table structure", () => {
    render(<EmptyState {...defaultProps} />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("row")).toBeInTheDocument();
    expect(screen.getByRole("cell")).toBeInTheDocument();
  });
});
