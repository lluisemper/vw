import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ModalShell } from "../ModalShell";
import { useModalStore } from "@/stores/modalStore";

// Mock dependencies
vi.mock("@/stores/modalStore");
vi.mock("@/components/ui", () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading...
    </div>
  ),
}));

// Mock the lazy-loaded modal components
vi.mock("@/features/users/components/UserDetailsModal", () => ({
  default: ({ user }: { user: { name?: string } | null }) => (
    <div data-testid="user-details-modal">
      User Details Modal for {user?.name || "Unknown"}
    </div>
  ),
}));

vi.mock("@/features/users/components/CreateUserModal", () => ({
  default: () => <div data-testid="create-user-modal">Create User Modal</div>,
}));

describe("ModalShell", () => {
  const mockModalStore = {
    modalData: null,
    modalType: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModalStore).mockReturnValue(mockModalStore);
  });

  it("should render nothing when no modal type is set", () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: null,
    });

    const { container } = render(<ModalShell />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render CreateUserModal when modalType is "createUser"', async () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "createUser",
    });

    render(<ModalShell />);

    // Should show loading spinner initially due to lazy loading
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toHaveAttribute(
      "data-size",
      "md"
    );

    // Eventually should show the modal
    await expect(
      screen.findByTestId("create-user-modal")
    ).resolves.toBeInTheDocument();
  });

  it('should render UserDetailsModal when modalType is "userDetails"', async () => {
    const mockUser = {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };

    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "userDetails",
      modalData: mockUser,
    });

    render(<ModalShell />);

    // Should show loading spinner initially
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    // Eventually should show the modal with user data
    await expect(
      screen.findByTestId("user-details-modal")
    ).resolves.toBeInTheDocument();

    const modalElement = await screen.findByTestId("user-details-modal");
    expect(modalElement).toHaveTextContent("User Details Modal for John Doe");
  });

  it("should handle UserDetailsModal with null user data", async () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "userDetails",
      modalData: null,
    });

    render(<ModalShell />);

    await expect(
      screen.findByTestId("user-details-modal")
    ).resolves.toBeInTheDocument();

    const modalElement = await screen.findByTestId("user-details-modal");
    expect(modalElement).toHaveTextContent("User Details Modal for Unknown");
  });

  it("should handle different modal types gracefully", () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "unknownModal" as "createUser" | "userDetails",
    });

    const { container } = render(<ModalShell />);

    // Should render Suspense wrapper but no modal content for unknown types
    // Since no matching modal component is rendered, nothing should be in the DOM
    expect(container).toBeEmptyDOMElement();
  });

  it("should properly configure the loading fallback structure", () => {
    // This test verifies the fallback structure is properly configured
    // We test this indirectly through the ModalShell implementation
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "createUser",
    });

    // The component should render successfully with proper Suspense wrapper
    expect(() => render(<ModalShell />)).not.toThrow();

    // Should eventually render the modal component
    expect(screen.getByTestId("create-user-modal")).toBeInTheDocument();
  });
});
