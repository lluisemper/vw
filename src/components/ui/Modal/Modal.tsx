import ReactModal from 'react-modal';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onRequestClose,
  title,
  children,
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  size = 'md',
}: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      ariaHideApp={false}
      className={`
        bg-white rounded-xl shadow-xl border-0 outline-none
        w-full ${sizeClasses[size]} mx-4
        max-h-[90vh] overflow-y-auto
        ${className}
      `}
      overlayClassName={`
        fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center
        z-50 p-4
        ${overlayClassName}
      `}
    >
      <div className="flex flex-col">
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onRequestClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    </ReactModal>
  );
}