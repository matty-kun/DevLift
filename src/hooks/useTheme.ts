import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '../contexts/ThemeContext';

export const useTheme = () => {
  const context = useContext<ThemeContextType | undefined>(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
