import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateUserModal from "../CreateUserModal";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useModalStore } from "@/stores/modalStore";

// Mock dependencies
vi.mock("../../hooks/useCreateUser");
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
  UserPlus: () => <span data-testid="user-plus-icon">👤+</span>,
  Loader2: () => (
    <span data-testid="loader-icon" className="animate-spin">
      ⟲
    </span>
  ),
  AlertTriangle: () => <span data-testid="alert-icon">⚠️</span>,
}));

describe("CreateUserModal", () => {
  const mockCreateUser = vi.fn();
  const mockCloseModal = vi.fn();

  const defaultMockCreateUser = {
    createUser: mockCreateUser,
    isLoading: false,
    error: null,
  };

  const defaultMockModalStore = {
    closeModal: mockCloseModal,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useCreateUser).mockReturnValue(defaultMockCreateUser);
    vi.mocked(useModalStore).mockReturnValue(defaultMockModalStore);
  });

  it("should render the create user form", () => {
    render(<CreateUserModal />);

    expect(screen.getByText("Create New User")).toBeInTheDocument();
    expect(
      screen.getByText("Add a new user to your organization")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /full name/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create user/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("should render form fields with correct attributes", () => {
    render(<CreateUserModal />);

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
    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john.doe@example.com");
  });

  it("should validate form and display errors", async () => {
    const user = userEvent.setup();
    render(<CreateUserModal />);

    const submitButton = screen.getByRole("button", { name: /create user/i });

    // Try to submit empty form
    await user.click(submitButton);

    // Form validation should prevent submission without calling the API
    expect(mockCreateUser).not.toHaveBeenCalled();

    // Check for validation errors (they should appear immediately)
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(
      screen.getByText("Please enter a valid email address")
    ).toBeInTheDocument();
  });

  it("should validate email format", async () => {
    const user = userEvent.setup();
    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /create user/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it("should clear field errors when user starts typing", async () => {
    const user = userEvent.setup();
    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const submitButton = screen.getByRole("button", { name: /create user/i });

    // Submit empty form to get error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
    });

    // Start typing in name field
    await user.type(nameInput, "J");

    // Error should be cleared
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    mockCreateUser.mockResolvedValueOnce(mockUser);

    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /create user/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john.doe@example.com",
      });
    });

    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it("should not close modal if user creation fails", async () => {
    const user = userEvent.setup();
    mockCreateUser.mockResolvedValueOnce(null); // Simulate failure

    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const submitButton = screen.getByRole("button", { name: /create user/i });

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCreateUser).toHaveBeenCalled();
    });

    // Modal should not close if creation failed
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should show loading state during submission", async () => {
    vi.mocked(useCreateUser).mockReturnValue({
      ...defaultMockCreateUser,
      isLoading: true,
    });

    render(<CreateUserModal />);

    const submitButton = screen.getByRole("button", { name: /creating.../i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    expect(screen.getByText("Creating...")).toBeInTheDocument();
  });

  it("should reset form and close modal when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateUserModal />);

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });
    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    // Fill form
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john.doe@example.com");

    // Cancel
    await user.click(cancelButton);

    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should not close modal when submitting", async () => {
    const user = userEvent.setup();
    vi.mocked(useCreateUser).mockReturnValue({
      ...defaultMockCreateUser,
      isLoading: true,
    });

    render(<CreateUserModal />);

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Should not close when submitting
    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it("should pass correct props to FormModal", () => {
    vi.mocked(useCreateUser).mockReturnValue({
      ...defaultMockCreateUser,
      isLoading: true,
    });

    render(<CreateUserModal />);

    const formModal = screen.getByTestId("form-modal");
    expect(formModal).toHaveAttribute("data-modal-type", "createUser");
    expect(formModal).toHaveAttribute("data-submitting", "true");
    expect(screen.getByText("Create New User")).toBeInTheDocument();
  });
});
