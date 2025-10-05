import { useState, useEffect, createContext, useContext } from 'react';

type DarkModeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (darkMode: boolean) => void;
};

export const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const useDarkModeLogic = () => {
  // Initialize dark mode state with lazy initialization
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return JSON.parse(savedMode);
      }
      
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
      console.warn('Error accessing localStorage or matchMedia:', error);
      return false;
    }
  });

  // Apply dark mode class and save preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode === null) {
        setDarkModeState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setDarkModeState(!darkMode);
  };

  const setDarkMode = (mode: boolean) => {
    setDarkModeState(mode);
  };

  return {
    darkMode,
    toggleDarkMode,
    setDarkMode,
  };
};