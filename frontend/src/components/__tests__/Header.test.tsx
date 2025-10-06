import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';
import { DarkModeProvider } from '../DarkModeProvider';

// Mock Firebase auth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: vi.fn(),
    signInWithEmail: vi.fn(),
    signUpWithEmail: vi.fn(),
  })
}));

// Mock Firebase functions
vi.mock('@/lib/firebase', () => ({
  logout: vi.fn(),
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderHeader = () => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <DarkModeProvider>
        <Header />
      </DarkModeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders the Memora logo', () => {
    renderHeader();
    expect(screen.getByText('Memora')).toBeInTheDocument();
  });

  it('renders the create memory buttons', () => {
    renderHeader();
    const createButtons = screen.getAllByRole('button', { name: /create memory/i });
    expect(createButtons).toHaveLength(2); // Desktop and mobile versions
  });

  it('renders the communities link', () => {
    renderHeader();
    expect(screen.getByRole('link', { name: /communities/i })).toBeInTheDocument();
  });
});