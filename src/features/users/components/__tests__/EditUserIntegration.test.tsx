import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditUserModal from "../EditUserModal";
import { useUpdateUser } from "../../hooks/useUpdateUser";
import { useModalStore } from "@/stores/modalStore";
import type { User } from "@/types";

// Mock dependencies
vi.mock("../../hooks/useUpdateUser");
vi.mock("@/stores/modalStore");
vi.mock("react-hot-toast");

const mockMutate = vi.fn();

vi.mock("swr", () => ({
  useSWRConfig: () => ({
    mutate: mockMutate,
  }),
}));

interface MockFormModalProps {
  modalType: string;
  title: string;
  children: React.ReactNode;
  isSubmitting?: boolean;
}

vi.mock("@/components/forms/FormModal", () => ({
  FormModal: ({
    modalType,
    title,
    children,
    isSubmitting,
  }: MockFormModalProps) => (
    <div
      data-testid="form-modal"
      data-modal-type={modalType}
      data-submitting={isSubmitting}
    >
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  UserPen: () => <span data-testid="user-pen-icon">✏️👤</span>,
  Loader2: () => (
    <span data-testid="loader-icon" className="animate-spin">
      ⟲
    </span>
  ),
  AlertTriangle: () => <span data-testid="alert-triangle-icon">⚠️</span>,
  Edit2: () => <span data-testid="edit2-icon">✏️</span>,
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  Mail: () => <span data-testid="mail-icon">✉️</span>,
  ChevronUp: () => <span data-testid="chevron-up-icon">▲</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">▼</span>,
  Hash: () => <span data-testid="hash-icon">#</span>,
  Clock: () => <span data-testid="clock-icon">🕐</span>,
  RotateCcw: () => <span data-testid="rotate-ccw-icon">↺</span>,
  Users: () => <span data-testid="users-icon">👥</span>,
}));

describe("EditUserModal Integration", () => {
  const mockUpdateUser = vi.fn();
  const mockCloseModal = vi.fn();

  const mockUser: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const defaultMockUpdateUser = {
    updateUser: mockUpdateUser,
    isLoading: false,
    error: null,
  };

  const defaultMockModalStore = {
    closeModal: mockCloseModal,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUpdateUser).mockReturnValue(defaultMockUpdateUser);
    vi.mocked(useModalStore).mockReturnValue(defaultMockModalStore);
  });

  it("should complete the full edit user workflow successfully", async () => {
    const user = userEvent.setup();
    const updatedUser = {
      ...mockUser,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      updatedAt: "2024-01-02T00:00:00Z",
    };

    mockUpdateUser.mockResolvedValueOnce(updatedUser);

    render(<EditUserModal user={mockUser} />);

    // Verify initial state
    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(
      screen.getByText("Update user information for John Doe")
    ).toBeInTheDocument();

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const updateButton = screen.getByRole("button", { name: /update user/i });

    // Verify initial form values
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    expect(updateButton).toBeDisabled(); // No changes yet

    // Make changes to the form
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Smith");
    await user.clear(emailInput);
    await user.type(emailInput, "jane.smith@example.com");

    // Verify button is enabled after changes
    expect(updateButton).not.toBeDisabled();

    // Submit the form
    await user.click(updateButton);

    // Verify the update was called with correct data
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 1,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    });

    // Verify modal closed after successful update
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it("should handle validation errors and prevent submission", async () => {
    const user = userEvent.setup();

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const updateButton = screen.getByRole("button", { name: /update user/i });

    // Clear name field (make it invalid)
    await user.clear(nameInput);

    // Try to submit
    await user.click(updateButton);

    // Verify validation error appears
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    // Verify API was not called
    expect(mockUpdateUser).not.toHaveBeenCalled();

    // Test email validation
    await user.type(nameInput, "Valid Name"); // Fix name
    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");
    await user.click(updateButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully and allow retry", async () => {
    const userInteraction = userEvent.setup();

    // First attempt fails - the hook should return null for failures
    mockUpdateUser.mockResolvedValueOnce(null);

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const updateButton = screen.getByRole("button", { name: /update user/i });

    // Make a change
    await userInteraction.clear(nameInput);
    await userInteraction.type(nameInput, "Jane Doe");

    // Submit and expect failure
    await userInteraction.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 1,
        name: "Jane Doe",
        email: "john.doe@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    });

    // Modal should not close on error
    expect(mockCloseModal).not.toHaveBeenCalled();

    // Form should still have the data for retry
    expect(nameInput).toHaveValue("Jane Doe");

    // Set up successful response for retry
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
      updatedAt: "2024-01-02T00:00:00Z",
    };
    mockUpdateUser.mockResolvedValueOnce(updatedUser);

    // Retry the submission
    await userInteraction.click(updateButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledTimes(2);
    });

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it("should show loading state during submission", async () => {

    // Mock loading state
    vi.mocked(useUpdateUser).mockReturnValue({
      ...defaultMockUpdateUser,
      isLoading: true,
    });

    render(<EditUserModal user={mockUser} />);

    // Verify loading state UI
    const submitButton = screen.getByRole("button", { name: /updating.../i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.getByText("Updating...")).toBeInTheDocument();
  });

  it("should reset form when cancelled and allow modal to close", async () => {
    const user = userEvent.setup();

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    // Make changes
    await user.clear(nameInput);
    await user.type(nameInput, "Modified Name");
    await user.clear(emailInput);
    await user.type(emailInput, "modified@example.com");

    // Verify changes
    expect(nameInput).toHaveValue("Modified Name");
    expect(emailInput).toHaveValue("modified@example.com");

    // Cancel
    await user.click(cancelButton);

    // Verify modal close was called
    expect(mockCloseModal).toHaveBeenCalled();

    // Verify no API call was made
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("should handle form changes and track dirty state correctly", async () => {
    const user = userEvent.setup();

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const updateButton = screen.getByRole("button", { name: /update user/i });

    // Initially disabled (no changes)
    expect(updateButton).toBeDisabled();

    // Make a change
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");
    expect(updateButton).not.toBeDisabled();

    // Revert change back to original
    await user.clear(nameInput);
    await user.type(nameInput, "John Doe");
    expect(updateButton).toBeDisabled();

    // Change email
    await user.clear(emailInput);
    await user.type(emailInput, "new@example.com");
    expect(updateButton).not.toBeDisabled();

    // Change both fields
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");
    expect(updateButton).not.toBeDisabled();
  });

  it("should prevent form submission when already submitting", async () => {
    const user = userEvent.setup();

    // Mock loading state
    vi.mocked(useUpdateUser).mockReturnValue({
      ...defaultMockUpdateUser,
      isLoading: true,
    });

    render(<EditUserModal user={mockUser} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    // Try to cancel while submitting - should not work
    await user.click(cancelButton);

    // Modal should not close while submitting
    expect(mockCloseModal).not.toHaveBeenCalled();
  });
});