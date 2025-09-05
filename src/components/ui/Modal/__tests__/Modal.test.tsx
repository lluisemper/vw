import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from '../Modal';

// Mock react-modal
interface MockModalProps {
  isOpen: boolean;
  className?: string;
  children: React.ReactNode;
}

vi.mock('react-modal', () => ({
  default: ({ isOpen, className, children }: MockModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal-overlay">
        <div className={className} data-testid="modal-content">
          {children}
        </div>
      </div>
    );
  },
}));

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onRequestClose: vi.fn(),
    children: <div>Modal content</div>,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal content when open', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Modal {...defaultProps} title="Test Title" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders close button by default', () => {
    render(<Modal {...defaultProps} title="Test" />);
    
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeInTheDocument();
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} title="Test" showCloseButton={false} />);
    
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('calls onRequestClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onRequestClose = vi.fn();
    
    render(<Modal {...defaultProps} title="Test" onRequestClose={onRequestClose} />);
    
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    
    expect(onRequestClose).toHaveBeenCalledOnce();
  });

  it('applies custom className', () => {
    render(<Modal {...defaultProps} className="custom-class" />);
    
    const modalContent = screen.getByTestId('modal-content');
    expect(modalContent).toHaveClass('custom-class');
  });

  it('applies size classes correctly', () => {
    render(<Modal {...defaultProps} size="lg" />);
    
    const modalContent = screen.getByTestId('modal-content');
    expect(modalContent).toHaveClass('max-w-2xl');
  });

  it('renders header only when title or close button are shown', () => {
    const { rerender } = render(<Modal {...defaultProps} />);
    
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} title="Test" />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
    
    rerender(<Modal {...defaultProps} showCloseButton={true} />);
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('handles all size options', () => {
    const sizes = [
      { size: 'sm' as const, class: 'max-w-md' },
      { size: 'md' as const, class: 'max-w-lg' },
      { size: 'lg' as const, class: 'max-w-2xl' },
      { size: 'xl' as const, class: 'max-w-4xl' },
    ];

    sizes.forEach(({ size, class: expectedClass }) => {
      const { unmount } = render(<Modal {...defaultProps} size={size} />);
      
      const modalContent = screen.getByTestId('modal-content');
      expect(modalContent).toHaveClass(expectedClass);
      
      unmount();
    });
  });
});