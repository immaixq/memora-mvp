import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { DarkModeProvider } from '../DarkModeProvider';

// Mock external dependencies
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ user: null, loading: false })
}));

vi.mock('@/lib/firebase', () => ({
  logout: vi.fn(),
}));

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <DarkModeProvider>
      {children}
    </DarkModeProvider>
  </BrowserRouter>
);

describe('Header', () => {
  it('renders all essential header elements', () => {
    render(<Header />, { wrapper: TestWrapper });
    
    // Check logo
    expect(screen.getByText('Memora')).toBeInTheDocument();
    
    // Check create memory buttons (desktop + mobile)
    const createButtons = screen.getAllByRole('button', { name: /create memory/i });
    expect(createButtons).toHaveLength(2);
    
    // Check communities link
    expect(screen.getByRole('link', { name: /communities/i })).toBeInTheDocument();
  });
});