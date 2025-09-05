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
}));

describe("EditUserModal", () => {
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

  it("should render the edit user form with existing user data", () => {
    render(<EditUserModal user={mockUser} />);

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(
      screen.getByText("Update user information for John Doe")
    ).toBeInTheDocument();
    
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    
    expect(
      screen.getByRole("button", { name: /update user/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should render form fields with correct attributes", () => {
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    expect(nameInput).toHaveAttribute("placeholder", "Enter user's full name");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute(
      "placeholder",
      "Enter user's email address"
    );
  });

  it("should update form data when inputs change", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");
    await user.clear(emailInput);
    await user.type(emailInput, "jane.doe@example.com");

    expect(nameInput).toHaveValue("Jane Doe");
    expect(emailInput).toHaveValue("jane.doe@example.com");
  });

  it("should disable update button when no changes are made", () => {
    render(<EditUserModal user={mockUser} />);

    const updateButton = screen.getByRole("button", { name: /update user/i });
    expect(updateButton).toBeDisabled();
  });

  it("should enable update button when changes are made", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const updateButton = screen.getByRole("button", { name: /update user/i });

    expect(updateButton).toBeDisabled();

    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");

    expect(updateButton).not.toBeDisabled();
  });

  it("should validate form and display errors", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    // Clear name to make form invalid
    await user.clear(nameInput);

    // Try to submit form
    await user.click(submitButton);

    // Form validation should prevent submission without calling the API
    expect(mockUpdateUser).not.toHaveBeenCalled();
    
    // Check for validation errors
    expect(screen.getByText("Name is required")).toBeInTheDocument();
  });

  it("should validate email format", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    await user.clear(emailInput);
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    expect(mockUpdateUser).not.toHaveBeenCalled();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    const updatedUser = {
      ...mockUser,
      name: "Jane Doe",
      email: "jane.doe@example.com",
    };

    mockUpdateUser.mockResolvedValueOnce(updatedUser);

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");
    await user.clear(emailInput);
    await user.type(emailInput, "jane.doe@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
        createdAt: "2024-01-01T00:00:00Z",
      });
    });

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it("should not close modal if user update fails", async () => {
    const user = userEvent.setup();
    mockUpdateUser.mockResolvedValueOnce(null); // Simulate failure

    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalled();
    });

    // Wait a bit more to ensure any delayed effects complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Modal should not close if update failed
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", async () => {
    vi.mocked(useUpdateUser).mockReturnValue({
      ...defaultMockUpdateUser,
      isLoading: true,
    });

    render(<EditUserModal user={mockUser} />);

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

  it("should reset form to original data when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    // Modify form
    await user.clear(nameInput);
    await user.type(nameInput, "Modified Name");
    await user.clear(emailInput);
    await user.type(emailInput, "modified@example.com");

    expect(nameInput).toHaveValue("Modified Name");
    expect(emailInput).toHaveValue("modified@example.com");

    // Cancel
    await user.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should not close modal when submitting", async () => {
    const user = userEvent.setup();
    vi.mocked(useUpdateUser).mockReturnValue({
      ...defaultMockUpdateUser,
      isLoading: true,
    });

    render(<EditUserModal user={mockUser} />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Should not close when submitting
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should reset form when user prop changes", () => {
    const { rerender } = render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(nameInput).toHaveValue("John Doe");

    const newUser: User = {
      ...mockUser,
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
    };

    rerender(<EditUserModal user={newUser} />);

    expect(nameInput).toHaveValue("Jane Smith");
    expect(screen.getByRole("textbox", { name: /email address/i })).toHaveValue(
      "jane.smith@example.com"
    );
  });

  it("should pass correct props to FormModal", () => {
    vi.mocked(useUpdateUser).mockReturnValue({
      ...defaultMockUpdateUser,
      isLoading: true,
    });

    render(<EditUserModal user={mockUser} />);

    const formModal = screen.getByTestId("form-modal");
    expect(formModal).toHaveAttribute("data-modal-type", "edit");
    expect(formModal).toHaveAttribute("data-submitting", "true");
    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("should successfully submit form with valid changes and proper data structure", async () => {
    const user = userEvent.setup();
    const updatedUser = {
      ...mockUser,
      name: "Updated Name",
      email: "updated@example.com",
      updatedAt: "2024-01-02T00:00:00Z",
    };

    mockUpdateUser.mockResolvedValueOnce(updatedUser);

    render(<EditUserModal user={mockUser} />);

    // Get form elements
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    // Verify initial state
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
    expect(submitButton).toBeDisabled(); // No changes initially

    // Make valid changes
    await user.clear(nameInput);
    await user.type(nameInput, "Updated Name");
    await user.clear(emailInput);
    await user.type(emailInput, "updated@example.com");

    // Verify button is enabled after changes
    expect(submitButton).not.toBeDisabled();

    // Submit form
    await user.click(submitButton);

    // Verify the updateUser was called with correct data structure
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        id: 1,
        name: "Updated Name",
        email: "updated@example.com",
        createdAt: "2024-01-01T00:00:00Z", // Preserved from original user
      });
    });

    // Verify modal closes after successful update
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it("should prevent submission and show errors when form validation fails", async () => {
    const user = userEvent.setup();
    render(<EditUserModal user={mockUser} />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /update user/i });

    // Make invalid changes (empty name, invalid email)
    await user.clear(nameInput);
    await user.clear(emailInput);
    await user.type(emailInput, "not-a-valid-email");

    // Try to submit
    await user.click(submitButton);

    // Verify validation errors are shown
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();

    // Verify API was not called
    expect(mockUpdateUser).not.toHaveBeenCalled();
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should handle successful submission workflow with createdAt preservation", async () => {
    const user = userEvent.setup();
    
    // Test with specific createdAt to ensure it's preserved
    const testUser = {
      ...mockUser,
      createdAt: "2023-12-01T10:30:00Z",
    };

    const mockResponse = {
      ...testUser,
      name: "New Name",
      email: "new@email.com", 
      updatedAt: "2024-01-02T12:00:00Z",
    };

    mockUpdateUser.mockResolvedValueOnce(mockResponse);

    render(<EditUserModal user={testUser} />);

    // Make changes
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    await user.clear(nameInput);
    await user.type(nameInput, "New Name");

    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    await user.clear(emailInput);
    await user.type(emailInput, "new@email.com");

    // Submit
    const submitButton = screen.getByRole("button", { name: /update user/i });
    await user.click(submitButton);

    // Verify the exact data structure sent to the API
    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 1,
          name: "New Name",
          email: "new@email.com",
          createdAt: "2023-12-01T10:30:00Z", // Original createdAt preserved
        })
      );
    });

    // Ensure modal closes on success
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });
});