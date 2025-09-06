import type { ModalType, ModalDataMap } from "@/types";

export interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalData: ModalDataMap[ModalType] | null;
}

export interface ModalActions {
  openModal: <T extends ModalType>(type: T, data?: ModalDataMap[T]) => void;
  closeModal: () => void;
}

export type ModalStore = ModalState & ModalActions;
