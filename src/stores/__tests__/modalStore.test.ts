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
    const testData = { id: 1, name: "Test User" };

    openModal("userDetails", testData);

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(true);
    expect(state.modalType).toBe("userDetails");
    expect(state.modalData).toEqual(testData);
  });

  it("should close modal and reset state", () => {
    const { openModal, closeModal } = useModalStore.getState();

    openModal("userDetails", { id: 1 });
    closeModal();

    const state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.modalType).toBe(null);
    expect(state.modalData).toBe(null);
  });

  it("should handle multiple modal operations", () => {
    const { openModal, closeModal } = useModalStore.getState();

    openModal("edit", { data: "first" });
    let state = useModalStore.getState();
    expect(state.modalType).toBe("edit");
    expect(state.modalData).toEqual({ data: "first" });

    openModal("delete", { data: "second" });
    state = useModalStore.getState();
    expect(state.modalType).toBe("delete");
    expect(state.modalData).toEqual({ data: "second" });

    closeModal();
    state = useModalStore.getState();
    expect(state.isOpen).toBe(false);
    expect(state.modalType).toBe(null);
    expect(state.modalData).toBe(null);
  });
});
