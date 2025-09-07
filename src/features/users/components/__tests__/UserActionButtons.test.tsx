import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserActionButtons } from "../UserActionButtons";
import { useModalStore } from "@/stores/modalStore";

// Mock the modal store
vi.mock("@/stores/modalStore", () => ({
  useModalStore: vi.fn(),
}));

const mockUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
};

describe("UserActionButtons", () => {
  const mockOpenModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModalStore).mockReturnValue({
      openModal: mockOpenModal,
    });
  });

  it("renders all action buttons", () => {
    render(<UserActionButtons user={mockUser} />);

    expect(
      screen.getByLabelText(`View details for ${mockUser.name}`)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(`Edit ${mockUser.name}`)).toBeInTheDocument();
    expect(
      screen.getByLabelText(`Delete ${mockUser.name}`)
    ).toBeInTheDocument();
  });

  it("calls openModal with userDetails when view button is clicked", () => {
    render(<UserActionButtons user={mockUser} />);

    const viewButton = screen.getByLabelText(
      `View details for ${mockUser.name}`
    );
    fireEvent.click(viewButton);

    expect(mockOpenModal).toHaveBeenCalledWith("userDetails", mockUser);
  });

  it("calls openModal with editUser when edit button is clicked", () => {
    render(<UserActionButtons user={mockUser} />);

    const editButton = screen.getByLabelText(`Edit ${mockUser.name}`);
    fireEvent.click(editButton);

    expect(mockOpenModal).toHaveBeenCalledWith("editUser", mockUser);
  });

  it("calls openModal with deleteUser when delete button is clicked", () => {
    render(<UserActionButtons user={mockUser} />);

    const deleteButton = screen.getByLabelText(`Delete ${mockUser.name}`);
    fireEvent.click(deleteButton);

    expect(mockOpenModal).toHaveBeenCalledWith("deleteUser", mockUser);
  });

  it("applies correct classes for table variant", () => {
    const { container } = render(
      <UserActionButtons user={mockUser} variant="table" />
    );

    const buttonGroup = container.querySelector('[role="group"]');
    expect(buttonGroup).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "space-x-1"
    );
  });

  it("applies correct classes for expanded variant", () => {
    const { container } = render(
      <UserActionButtons user={mockUser} variant="expanded" />
    );

    const buttonGroup = container.querySelector('[role="group"]');
    expect(buttonGroup).toHaveClass("flex", "items-center", "space-x-2");
  });

  it("has proper accessibility attributes", () => {
    render(<UserActionButtons user={mockUser} />);

    const buttonGroup = screen.getByRole("group");
    expect(buttonGroup).toHaveAttribute(
      "aria-label",
      `Actions for ${mockUser.name}`
    );
  });
});
