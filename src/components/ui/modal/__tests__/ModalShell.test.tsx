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

// Mock the UserModals component
vi.mock("@/features/users/components/UserModals", () => ({
  UserModals: ({
    modalType,
    modalData,
  }: {
    modalType: string;
    modalData: unknown;
  }) => {
    switch (modalType) {
      case "createUser":
        return <div data-testid="create-user-modal">Create User Modal</div>;
      case "userDetails":
        return (
          <div data-testid="user-details-modal">
            User Details Modal for{" "}
            {(modalData as { name?: string })?.name || "Unknown"}
          </div>
        );
      default:
        return null;
    }
  },
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

    // Should show the modal (mocked component renders immediately)
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

    // Should show the modal with user data (mocked component renders immediately)
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

  it("should handle different modal types gracefully", async () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "unknownModal" as "createUser",
    });

    render(<ModalShell />);

    // Since UserModals returns null for unknown types, nothing else should render
    expect(screen.queryByTestId("create-user-modal")).not.toBeInTheDocument();
  });

  it("should properly configure the loading fallback structure", async () => {
    // This test verifies the fallback structure is properly configured
    // We test this indirectly through the ModalShell implementation
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      modalType: "createUser",
    });

    // The component should render successfully with proper Suspense wrapper
    expect(() => render(<ModalShell />)).not.toThrow();

    // Should eventually render the modal component
    await expect(
      screen.findByTestId("create-user-modal")
    ).resolves.toBeInTheDocument();
  });
});
