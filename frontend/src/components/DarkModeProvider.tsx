import React from 'react';
import { DarkModeContext, useDarkModeLogic } from '@/hooks/useDarkMode';
// Import to ensure dark mode classes are included in build
import '@/dark-mode-classes';

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const darkModeValue = useDarkModeLogic();

  return (
    <DarkModeContext.Provider value={darkModeValue}>
      {children}
    </DarkModeContext.Provider>
  );
};