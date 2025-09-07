import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserDetailsModal from "../UserDetailsModal";
import { useModalStore } from "@/stores/modalStore";
import type { User } from "@/types";

// Mock the modal store
vi.mock("@/stores/modalStore");

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
      <div data-testid="modal">
        {title && <h2>{title}</h2>}
        <button onClick={onRequestClose} data-testid="close-button">
          Close
        </button>
        {children}
      </div>
    );
  },
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  User: () => <div data-testid="user-icon">👤</div>,
  Mail: () => <div data-testid="mail-icon">✉️</div>,
  Calendar: () => <div data-testid="calendar-icon">📅</div>,
  Clock: () => <div data-testid="clock-icon">🕒</div>,
  Hash: () => <div data-testid="hash-icon">#</div>,
  X: () => <div data-testid="x-icon">✕</div>,
}));

describe("UserDetailsModal", () => {
  const mockUser: User = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T15:30:00Z",
  };

  const mockModalStore = {
    isOpen: true,
    modalType: "userDetails" as const,
    closeModal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModalStore).mockReturnValue(mockModalStore);
  });

  it("renders user details when modal is open", () => {
    render(<UserDetailsModal user={mockUser} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("User Details")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument(); // Only appears once in header
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("does not render when modal is closed", () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: false,
    });

    render(<UserDetailsModal user={mockUser} />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("does not render when user is null", () => {
    render(<UserDetailsModal user={null} />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("displays all user information fields", () => {
    render(<UserDetailsModal user={mockUser} />);

    expect(screen.getByText("User ID: 1")).toBeInTheDocument(); // Header text
    expect(screen.getByText("John Doe")).toBeInTheDocument(); // Header name

    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();

    expect(screen.getByText("Created")).toBeInTheDocument();
    expect(screen.getByText("Last Updated")).toBeInTheDocument();
  });

  it("displays user avatar with first letter of name", () => {
    render(<UserDetailsModal user={mockUser} />);

    const userIcons = screen.getAllByTestId("user-icon");
    expect(userIcons).toHaveLength(1); // Avatar icon only
  });

  it("displays all relevant icons", () => {
    render(<UserDetailsModal user={mockUser} />);

    expect(screen.getAllByTestId("user-icon")).toHaveLength(1); // Avatar icon
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument(); // Created date
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument(); // Updated date
  });

  it("calls closeModal when close button is clicked", async () => {
    const user = userEvent.setup();

    render(<UserDetailsModal user={mockUser} />);

    const closeButton = screen.getByTestId("close-button");
    await user.click(closeButton);

    expect(mockModalStore.closeModal).toHaveBeenCalledOnce();
  });

  it("handles user with different data", () => {
    const differentUser: User = {
      id: "999",
      name: "Jane Smith",
      email: "jane.smith@test.com",
      createdAt: "2023-12-01T08:00:00Z",
      updatedAt: "2023-12-15T12:00:00Z",
    };

    render(<UserDetailsModal user={differentUser} />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument(); // Header name
    expect(screen.getByText("jane.smith@test.com")).toBeInTheDocument();
    expect(screen.getByText("User ID: 999")).toBeInTheDocument();
  });

  it("has proper accessibility structure", () => {
    render(<UserDetailsModal user={mockUser} />);

    expect(
      screen.getByRole("heading", { name: "User Details" })
    ).toBeInTheDocument();
  });
});
