import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import toast from "react-hot-toast";
import { useUsers } from "@/features/users/hooks/useUsers";
import App from "@/App";
import type { User } from "@/types";

// Mock the users hook
vi.mock("@/features/users/hooks/useUsers");

// Mock react-modal
interface MockModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title?: string;
}

vi.mock("react-modal", () => ({
  default: Object.assign(
    ({ isOpen, onRequestClose, children, title }: MockModalProps) => {
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
    {
      setAppElement: vi.fn(),
    }
  ),
}));

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => <div data-testid="toaster" />,
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Mail: () => <span data-testid="mail-icon">✉️</span>,
  ChevronUp: () => <span>↑</span>,
  ChevronDown: () => <span>↓</span>,
  Hash: () => <span>#</span>,
  Clock: () => <span>🕒</span>,
  RotateCcw: () => <span>↻</span>,
  Users: () => <span>👥</span>,
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  User: () => <span data-testid="user-icon">👤</span>,
  Calendar: () => <span data-testid="calendar-icon">📅</span>,
  Search: () => <span>🔍</span>,
  ChevronsLeft: () => <span>⇤</span>,
  ChevronLeft: () => <span>‹</span>,
  ChevronRight: () => <span>›</span>,
  ChevronsRight: () => <span>⇥</span>,
  Info: () => <span>ℹ️</span>,
  ArrowUpDown: () => <span>↕️</span>,
  ArrowUp: () => <span>↑</span>,
  ArrowDown: () => <span>↓</span>,
  X: () => <span>✕</span>,
  AlertTriangle: () => <span data-testid="alert-icon">⚠️</span>,
  UserPlus: () => <span data-testid="user-plus-icon">👤+</span>,
  Loader2: ({ className }: { className?: string }) => (
    <span data-testid="loader-icon" className={className}>
      ⟲
    </span>
  ),
  Edit2: () => <span data-testid="edit2-icon">✏️</span>,
  Trash2: () => <span data-testid="trash2-icon">🗑️</span>,
}));

// Mock fetch to simulate API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Create User Integration", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-20T15:30:00Z",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      createdAt: "2024-01-10T08:00:00Z",
      updatedAt: "2024-01-18T14:20:00Z",
    },
  ];

  const mockUseUsers = {
    users: mockUsers,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsers).mockReturnValue(mockUseUsers);
    mockFetch.mockClear();
  });

  it('should display the "Add User" button in the header', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    expect(addUserButton).toBeInTheDocument();
    expect(screen.getByTestId("user-plus-icon")).toBeInTheDocument();
  });

  it('should open create user modal when "Add User" button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
      expect(screen.getByText("Create New User")).toBeInTheDocument();
      expect(
        screen.getByText("Add a new user to your organization")
      ).toBeInTheDocument();
    });
  });

  it("should display the create user form with all fields", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    // Check form fields
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

    // Check required field indicators
    expect(screen.getAllByText("*")).toHaveLength(2); // Both fields are required
  });

  it("should validate form fields and show errors", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    // Try to submit without filling fields
    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeInTheDocument();
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    // Fill name but with invalid email
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "invalid-email");
    await user.click(createButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });

    // Errors should clear when user makes email valid
    await user.clear(emailInput);
    await user.type(emailInput, "test@example.com");
    expect(
      screen.queryByText("Please enter a valid email address")
    ).not.toBeInTheDocument();
  });

  it("should successfully create a user and update the list", async () => {
    const user = userEvent.setup();
    const newUser = {
      id: 3,
      name: "New User",
      email: "new.user@example.com",
      createdAt: "2024-01-25T10:00:00Z",
      updatedAt: "2024-01-25T10:00:00Z",
    };

    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newUser,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // Open modal
    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    // Fill form
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "New User");
    await user.type(emailInput, "new.user@example.com");

    // Submit form
    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Verify API call was made
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3001/users",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.stringContaining('"name":"New User"'),
        })
      );
      
      // Parse the body to verify timestamp fields are included
      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body).toMatchObject({
        name: "New User",
        email: "new.user@example.com",
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(body.createdAt).toBe(body.updatedAt); // Should be the same timestamp
    });

    // Verify success toast
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'User "New User" created successfully!'
      );
    });

    // Modal should close after successful creation
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("should handle API errors gracefully", async () => {
    const user = userEvent.setup();

    // Mock API error
    mockFetch.mockRejectedValueOnce(new Error("Server error"));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // Open modal and fill form
    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@example.com");

    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Verify error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to create user: Server error"
      );
    });

    // Modal should remain open after error
    expect(screen.getByTestId("modal")).toBeInTheDocument();

    // Form data should be preserved for retry
    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
  });

  it("should show loading state during user creation", async () => {
    const user = userEvent.setup();

    // Create a promise that we can control
    let resolvePromise: (value: unknown) => void;
    const controlledPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockFetch.mockReturnValueOnce(controlledPromise);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // Open modal and fill form
    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    const emailInput = screen.getByRole("textbox", { name: /email address/i });

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@example.com");

    // Submit form
    const createButton = screen.getByRole("button", { name: /create user/i });
    await user.click(createButton);

    // Check loading state
    await waitFor(() => {
      expect(screen.getByText("Creating...")).toBeInTheDocument();
      expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
    });

    // Form should be disabled during loading
    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(screen.getByRole("button", { name: /creating.../i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDisabled();

    // Resolve the promise to complete the test
    resolvePromise!({
      ok: true,
      json: async () => ({
        id: 3,
        name: "Test User",
        email: "test@example.com",
        createdAt: "2024-01-25T10:00:00Z",
        updatedAt: "2024-01-25T10:00:00Z",
      }),
    });
  });

  it("should close modal and reset form when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // Open modal
    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    // Fill some data
    const nameInput = screen.getByRole("textbox", { name: /full name/i });
    await user.type(nameInput, "Test User");

    // Cancel
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    // Modal should close
    await waitFor(() => {
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    // Reopen modal to check form is reset
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    const newNameInput = screen.getByRole("textbox", { name: /full name/i });
    expect(newNameInput).toHaveValue("");
  });

  it("should have proper accessibility attributes", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });

    // Open modal
    const addUserButton = screen.getByRole("button", { name: /add user/i });
    await user.click(addUserButton);

    await waitFor(() => {
      expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    // Check accessibility attributes
    expect(
      screen.getByRole("heading", { name: /create new user/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create user/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByTestId("close-button")).toBeInTheDocument();
  });
});
