import type { ModalStore, ModalType } from "@/types";
import { create } from "zustand";

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: (type: ModalType, data?: unknown) =>
    set({ isOpen: true, modalType: type, modalData: data }),
  closeModal: () => set({ isOpen: false, modalType: null, modalData: null }),
}));
