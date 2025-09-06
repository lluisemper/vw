import ReactModal from "react-modal";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { IconButton } from "../IconButton";

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};
// Needed to lock background scroll on iOS when modal is open
// If this is removed, cleanup and remove package body-scroll-lock
export const Modal = ({
  isOpen,
  onRequestClose,
  title,
  children,
  className = "",
  overlayClassName = "",
  showCloseButton = true,
  size = "md",
}: ModalProps) => {
  const modalRef = useRef(null);
  const targetElementRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup: ensure body scroll is enabled when component unmounts
      if (targetElementRef.current) {
        enableBodyScroll(targetElementRef.current);
      }
    };
  }, []);

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      className={`
        bg-white rounded-xl shadow-xl border-0 outline-none
        w-full ${sizeClasses[size]} mx-4
        max-h-[90vh] overflow-y-auto
        ${className}
      `}
      overlayClassName={`
        fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center
        z-50 p-4
        ${overlayClassName}
      `}
      // Needed to lock background scroll on iOS when modal is open
      onAfterOpen={() => {
        if (modalRef.current) {
          // Copy reference to the modal ref
          targetElementRef.current = modalRef.current;
          disableBodyScroll(modalRef.current);
        }
      }}
      onAfterClose={() => {
        // modalRef.current is null here after close
        if (targetElementRef.current) {
          enableBodyScroll(targetElementRef.current);
          targetElementRef.current = null;
        }
      }}
      ref={modalRef}
    >
      <div className="flex flex-col">
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <IconButton onClick={onRequestClose} aria-label="Close modal">
                <X className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </IconButton>
            )}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </ReactModal>
  );
};
