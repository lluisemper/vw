import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormModal } from '../FormModal';
import { useModalStore } from '@/stores/modalStore';

// Mock dependencies
vi.mock('@/stores/modalStore');
interface MockModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title?: string;
  children: React.ReactNode;
}

vi.mock('@/components/ui/Modal', () => ({
  Modal: ({ isOpen, onRequestClose, title, children }: MockModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal">
        <h2>{title}</h2>
        <button onClick={onRequestClose} data-testid="close-button">
          Close
        </button>
        {children}
      </div>
    );
  },
}));

describe('FormModal', () => {
  const mockModalStore = {
    isOpen: false,
    modalType: null,
    closeModal: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useModalStore).mockReturnValue(mockModalStore);
  });

  it('should render modal when open and modal type matches', () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'createUser',
    });

    render(
      <FormModal modalType="createUser" title="Create User">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should not render when modal is closed', () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: false,
      modalType: 'createUser',
    });

    render(
      <FormModal modalType="createUser" title="Create User">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should not render when modal type does not match', () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'otherModal',
    });

    render(
      <FormModal modalType="createUser" title="Create User">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('should call closeModal when close button is clicked', async () => {
    const user = userEvent.setup();
    const mockCloseModal = vi.fn();

    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'createUser',
      closeModal: mockCloseModal,
    });

    render(
      <FormModal modalType="createUser" title="Create User">
        <div>Modal content</div>
      </FormModal>
    );

    const closeButton = screen.getByTestId('close-button');
    await user.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledOnce();
  });

  it('should not close modal when isSubmitting is true', async () => {
    const user = userEvent.setup();
    const mockCloseModal = vi.fn();

    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'createUser',
      closeModal: mockCloseModal,
    });

    render(
      <FormModal modalType="createUser" title="Create User" isSubmitting={true}>
        <div>Modal content</div>
      </FormModal>
    );

    const closeButton = screen.getByTestId('close-button');
    await user.click(closeButton);

    expect(mockCloseModal).not.toHaveBeenCalled();
  });

  it('should render with different sizes', () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'createUser',
    });

    const { rerender } = render(
      <FormModal modalType="createUser" title="Create User" size="sm">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();

    rerender(
      <FormModal modalType="createUser" title="Create User" size="lg">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('should use default size when not specified', () => {
    vi.mocked(useModalStore).mockReturnValue({
      ...mockModalStore,
      isOpen: true,
      modalType: 'createUser',
    });

    render(
      <FormModal modalType="createUser" title="Create User">
        <div>Modal content</div>
      </FormModal>
    );

    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});