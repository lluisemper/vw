import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDeleteUser } from "@/features/users/hooks/useDeleteUser";
import { useModalStore } from "@/stores/modalStore";
import DeleteUserModal from "../DeleteUserModal";
import type { User } from "@/types";

// Mock dependencies
vi.mock("@/features/users/hooks/useDeleteUser");
vi.mock("@/stores/modalStore");

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  UserMinus: () => <span data-testid="user-minus-icon">👤-</span>,
  AlertTriangle: () => <span data-testid="alert-triangle-icon">⚠️</span>,
  X: () => <span>✕</span>,
}));

// Mock react-modal
interface MockModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title?: string;
}

vi.mock("react-modal", () => ({
  default: ({ isOpen, onRequestClose, children, title }: MockModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" className="modal">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button
            onClick={onRequestClose}
            data-testid="close-button"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    );
  },
  setAppElement: vi.fn(),
}));

describe("DeleteUserModal", () => {
  const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  };

  const mockDeleteUser = vi.fn();
  const mockCloseModal = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: false,
      error: null,
    });

    vi.mocked(useModalStore).mockReturnValue({
      isOpen: true,
      modalType: "deleteUser",
      modalData: mockUser,
      openModal: vi.fn(),
      closeModal: mockCloseModal,
    });
  });

  it("should render delete confirmation modal", () => {
    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getByRole("heading", { name: /delete user/i })).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete this user?")
    ).toBeInTheDocument();
    expect(screen.getByText("This action cannot be undone.")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("should display warning message", () => {
    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getByText("Warning")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Once you delete this user, all their data will be permanently removed from the system. This action cannot be undone."
      )
    ).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete user/i })
    ).toBeInTheDocument();
  });

  it("should display user icons", () => {
    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getAllByTestId("alert-triangle-icon")).toHaveLength(2);
    expect(screen.getAllByTestId("user-minus-icon")).toHaveLength(2); // One in user info, one in button
  });

  it("should handle cancel button click", async () => {
    const user = userEvent.setup();
    render(<DeleteUserModal user={mockUser} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("should handle delete button click and close modal on success", async () => {
    mockDeleteUser.mockResolvedValueOnce(true);
    const user = userEvent.setup();

    render(<DeleteUserModal user={mockUser} />);

    const deleteButton = screen.getByRole("button", { name: /delete user/i });
    await user.click(deleteButton);

    expect(mockDeleteUser).toHaveBeenCalledWith(mockUser);

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalledTimes(1);
    });
  });

  it("should not close modal on delete failure", async () => {
    mockDeleteUser.mockResolvedValueOnce(false);
    const user = userEvent.setup();

    render(<DeleteUserModal user={mockUser} />);

    const deleteButton = screen.getByRole("button", { name: /delete user/i });
    await user.click(deleteButton);

    expect(mockDeleteUser).toHaveBeenCalledWith(mockUser);
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should show loading state during delete", () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: true,
      error: null,
    });

    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getByText("Deleting...")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("should disable buttons when loading", () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: true,
      error: null,
    });

    render(<DeleteUserModal user={mockUser} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /deleting/i })).toBeDisabled();
  });

  it("should not close modal when loading via close button", async () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: true,
      error: null,
    });

    const user = userEvent.setup();
    render(<DeleteUserModal user={mockUser} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should handle modal close via X button", () => {
    render(<DeleteUserModal user={mockUser} />);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("should not close modal via X button when loading", () => {
    vi.mocked(useDeleteUser).mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: true,
      error: null,
    });

    render(<DeleteUserModal user={mockUser} />);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should have proper accessibility attributes", () => {
    render(<DeleteUserModal user={mockUser} />);

    expect(
      screen.getByRole("heading", { name: /delete user/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete user/i })
    ).toBeInTheDocument();
  });

  it("should display danger variant button", () => {
    render(<DeleteUserModal user={mockUser} />);

    const deleteButton = screen.getByRole("button", { name: /delete user/i });
    expect(deleteButton).toHaveClass("bg-red-600");
  });
});