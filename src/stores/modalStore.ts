import { create } from "zustand";
import type { ModalType, ModalDataMap } from "@/types";
import type { ModalStore } from "./types";

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalType: null,
  modalData: null,
  openModal: <T extends ModalType>(type: T, data?: ModalDataMap[T]) =>
    set({ isOpen: true, modalType: type, modalData: data ?? null }),

  closeModal: () => set({ isOpen: false, modalType: null, modalData: null }),
}));
