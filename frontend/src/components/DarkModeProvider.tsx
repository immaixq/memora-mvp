import React from 'react';
import { DarkModeContext, useDarkModeLogic } from '@/hooks/useDarkMode';

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