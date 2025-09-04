import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Table } from "../Table";

describe("Table", () => {
  it("renders table with semantic markup", () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>Test content</td>
          </tr>
        </tbody>
      </Table>
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Table className="custom-table">
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveClass("custom-table");
  });

  it("wraps table in container with overflow handling", () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>Content</td>
          </tr>
        </tbody>
      </Table>
    );

    const wrapper = container.querySelector(".overflow-x-auto");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveClass("overflow-x-auto");
  });
});
