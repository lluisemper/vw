import React from "react";
import { Modal } from "@/components/ui";
import { useModalStore } from "@/stores/modalStore";
import type { ModalType } from "@/types";

interface FormModalProps {
  modalType: ModalType;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export function FormModal({
  modalType,
  title,
  size = "md",
  children,
  isSubmitting = false,
}: FormModalProps) {
  const { isOpen, modalType: currentModalType, closeModal } = useModalStore();

  const isThisModalOpen = isOpen && currentModalType === modalType;

  const handleClose = () => {
    if (!isSubmitting) {
      closeModal();
    }
  };

  return (
    <Modal
      isOpen={isThisModalOpen}
      onRequestClose={handleClose}
      title={title}
      size={size}
    >
      {children}
    </Modal>
  );
}
