import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useUsers } from '@/features/users/hooks/useUsers';
import App from '@/App';
import type { User } from '@/types';

// Mock the users hook
vi.mock('@/features/users/hooks/useUsers');

// Mock react-modal
interface MockModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  title?: string;
}

vi.mock('react-modal', () => ({
  default: ({ isOpen, onRequestClose, children, title }: MockModalProps) => {
    if (!isOpen) return null;
    return (
      <div data-testid="modal" className="modal">
        <div className="modal-header">
          {title && <h2>{title}</h2>}
          <button onClick={onRequestClose} data-testid="close-button" aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    );
  },
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Mail: () => <span data-testid="mail-icon">✉️</span>,
  ChevronUp: () => <span>↑</span>,
  ChevronDown: () => <span>↓</span>,
  Hash: () => <span>#</span>,
  Clock: () => <span>🕒</span>,
  RotateCcw: () => <span>↻</span>,
  Users: () => <span>👥</span>,
  Eye: () => <span data-testid="eye-icon">👁️</span>,
  User: () => <span data-testid="user-icon">👤</span>,
  Calendar: () => <span data-testid="calendar-icon">📅</span>,
  Search: () => <span>🔍</span>,
  ChevronsLeft: () => <span>⇤</span>,
  ChevronLeft: () => <span>‹</span>,
  ChevronRight: () => <span>›</span>,
  ChevronsRight: () => <span>⇥</span>,
  Info: () => <span>ℹ️</span>,
  ArrowUpDown: () => <span>↕️</span>,
  ArrowUp: () => <span>↑</span>,
  ArrowDown: () => <span>↓</span>,
  X: () => <span>✕</span>,
  AlertTriangle: () => <span>⚠️</span>,
}));

describe('User Modal Integration', () => {
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T15:30:00Z',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      createdAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-18T14:20:00Z',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      createdAt: '2024-01-05T12:00:00Z',
      updatedAt: '2024-01-25T16:45:00Z',
    },
  ];

  const mockUseUsers = {
    users: mockUsers,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUsers).mockReturnValue(mockUseUsers);
  });

  it('should display user table with view buttons', async () => {
    render(<App />);

    // Wait for the table to load
    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Check that users are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane.smith@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();

    // Check that view buttons are present
    const eyeIcons = screen.getAllByTestId('eye-icon');
    expect(eyeIcons).toHaveLength(3);
  });

  it('should open modal when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for the table to load
    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Find and click the first user's view button
    const viewButtons = screen.getAllByLabelText(/View details for/);
    expect(viewButtons[0]).toHaveAttribute('aria-label', 'View details for John Doe');

    await user.click(viewButtons[0]);

    // Wait for the modal to appear (accounting for Suspense)
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check modal content
    expect(screen.getByText('User Details')).toBeInTheDocument();
    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Table and modal
    expect(screen.getByText('User ID: 1')).toBeInTheDocument();
    expect(screen.getAllByText('john.doe@example.com')).toHaveLength(2); // Table and modal
  });

  it('should display complete user information in modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Click on Jane Smith's view button
    const viewButtons = screen.getAllByLabelText(/View details for/);
    await user.click(viewButtons[1]);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check all user details are present
    expect(screen.getAllByText('Jane Smith')).toHaveLength(2); // Table and modal
    expect(screen.getByText('User ID: 2')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getAllByText('jane.smith@example.com')).toHaveLength(2); // Table and modal
    expect(screen.getAllByText('Created')).toHaveLength(2); // Table header and modal
    expect(screen.getAllByText('Last Updated')).toHaveLength(2); // Table header and modal

    // Check that icons are present
    expect(screen.getAllByTestId('user-icon')).toHaveLength(1); // Modal only
    expect(screen.getAllByTestId('mail-icon').length).toBeGreaterThanOrEqual(1); // Table and modal
    expect(screen.getAllByTestId('calendar-icon')).toHaveLength(1); // Modal only
  });

  it('should close modal when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Open modal
    const viewButtons = screen.getAllByLabelText(/View details for/);
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Close modal
    const closeButton = screen.getByTestId('close-button');
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });
  });

  it('should handle multiple users and show correct data for each', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByLabelText(/View details for/);

    // Test first user (John Doe)
    await user.click(viewButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    expect(screen.getAllByText('John Doe')).toHaveLength(2);
    expect(screen.getAllByText('john.doe@example.com')).toHaveLength(2);

    // Close modal
    await user.click(screen.getByTestId('close-button'));
    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    // Test third user (Bob Johnson)
    await user.click(viewButtons[2]);
    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });
    expect(screen.getAllByText('Bob Johnson')).toHaveLength(2);
    expect(screen.getAllByText('bob.johnson@example.com')).toHaveLength(2);
    expect(screen.getByText('User ID: 3')).toBeInTheDocument();
  });

  it('should work with search functionality', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Search for a specific user
    const searchInput = screen.getByPlaceholderText('Search users...');
    await user.type(searchInput, 'Jane');

    // Should still show the view button for filtered results
    await waitFor(() => {
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    const viewButton = screen.getByLabelText('View details for Jane Smith');
    await user.click(viewButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    expect(screen.getAllByText('Jane Smith')).toHaveLength(2); // Table and modal
    expect(screen.getAllByText('jane.smith@example.com')).toHaveLength(2); // Table and modal
  });

  it('should maintain table state after closing modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    // Search for users
    const searchInput = screen.getByPlaceholderText('Search users...');
    await user.type(searchInput, 'John');

    // Open modal
    const viewButton = screen.getByLabelText('View details for John Doe');
    await user.click(viewButton);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Close modal
    await user.click(screen.getByTestId('close-button'));

    await waitFor(() => {
      expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    // Check that search filter is still active
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('should handle loading state', () => {
    vi.mocked(useUsers).mockReturnValue({
      ...mockUseUsers,
      isLoading: true,
    });

    render(<App />);

    // Should show loading state
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Manage and view all users in your organization')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    vi.mocked(useUsers).mockReturnValue({
      ...mockUseUsers,
      error: 'Failed to load users',
    });

    render(<App />);

    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Failed to load users')).toBeInTheDocument();
  });

  it('should display formatted dates in modal', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('User Management')).toBeInTheDocument();
    });

    const viewButtons = screen.getAllByLabelText(/View details for/);
    await user.click(viewButtons[0]);

    await waitFor(() => {
      expect(screen.getByTestId('modal')).toBeInTheDocument();
    });

    // Check that dates are formatted (should not show raw ISO strings)
    expect(screen.queryByText('2024-01-15T10:00:00Z')).not.toBeInTheDocument();
    expect(screen.queryByText('2024-01-20T15:30:00Z')).not.toBeInTheDocument();
    
    // Should show formatted dates (exact format depends on dateUtils implementation)
    expect(screen.getAllByText('Created')).toHaveLength(2); // Table header and modal
    expect(screen.getAllByText('Last Updated')).toHaveLength(2); // Table header and modal
  });
});