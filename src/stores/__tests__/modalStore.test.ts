import { describe, it, expect, beforeEach } from "vitest";
import { useModalStore } from "../modalStore";

describe("modalStore", () => {
  beforeEach(() => {
    useModalStore.getState().closeModal();
  });

  it("should have correct initial state", () => {
    const state = useModalStore.getState();

    expect(state.isOpen).toBe(false);
    expect(state.modalType).toBe(null);
    expect(state.modalData).toBe(null);
  });

  it("should open modal with type and data", () => {
    const { openModal } = useModalStore.getState();
    const testData = {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };

    openModal("userDetails", testData);

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.modalType).toBe("userDetails");
    expect(state.modalData).toEqual(testData);
  });

  it("should close modal and reset state", () => {
    const { openModal, closeModal } = useModalStore.getState();

    openModal("userDetails", {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    });
    closeModal();

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.modalType).toBe(null);
    expect(state.modalData).toBe(null);
  });

  it("should handle multiple modal operations", () => {
    const { openModal, closeModal } = useModalStore.getState();

    const firstUser = {
      id: 1,
      name: "First User",
      email: "first@example.com",
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    };
    openModal("editUser", firstUser);
    let state = useModalStore.getState();
    expect(state.modalType).toBe("editUser");
    expect(state.modalData).toEqual(firstUser);

    const secondUser = {
      id: 2,
      name: "Second User",
      email: "second@example.com",
      createdAt: "2024-01-02T00:00:00Z",
      updatedAt: "2024-01-02T00:00:00Z",
    };
    openModal("deleteUser", secondUser);
    state = useModalStore.getState();
    expect(state.modalType).toBe("deleteUser");
    expect(state.modalData).toEqual(secondUser);

    closeModal();
    state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.modalType).toBe(null);
    expect(state.modalData).toBe(null);
  });
});
