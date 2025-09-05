export type ModalType = "userDetails" | "edit" | "delete";

export interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  modalData: unknown;
}

export interface ModalActions {
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;
}

export type ModalStore = ModalState & ModalActions;
