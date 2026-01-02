import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeColors {
  // Background colors
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  paper: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textLight: string;
  
  // Accent colors
  accent: string;
  accentLight: string;
  accentDark: string;
  
  // Coffee theme colors
  coffee: string;
  coffeeLight: string;
  coffeeDark: string;
  cream: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and shadow colors
  border: string;
  shadow: string;
  shadowLight: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  currentTheme: string;
  toggleTheme: () => void;
  setTheme: (theme: string) => void;
  colors: ThemeColors;
}

const lightTheme: ThemeColors = {
  // Background colors - Cafert colors
  primary: '#534931', // Cafert header color
  secondary: '#B38E6A', // Cafert accent color
  background: '#ffffff',
  surface: '#F7F7F7', // Cafert light color
  paper: '#ffffff',
  
  // Text colors - Cafert colors
  text: '#534931', // Cafert header color
  textSecondary: '#5C5C5C', // Cafert body color
  textLight: '#8a8a8a',
  
  // Accent colors - Cafert colors
  accent: '#B38E6A', // Cafert accent color
  accentLight: '#E5DCD2', // Cafert primary color
  accentDark: '#534931', // Cafert header color
  
  // Coffee theme colors - Cafert colors
  coffee: '#534931', // Cafert header color
  coffeeLight: '#B38E6A', // Cafert accent color
  coffeeDark: '#534931', // Cafert header color
  cream: '#E5DCD2', // Cafert primary color
  
  // Status colors
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
  info: '#2196f3',
  
  // Border and shadow colors
  border: '#E5DCD2', // Cafert primary color
  shadow: 'rgba(83, 73, 49, 0.1)', // Using Cafert header color
  shadowLight: 'rgba(83, 73, 49, 0.05)', // Using Cafert header color
};

const darkTheme: ThemeColors = {
  // Background colors - Cafert dark theme
  primary: '#B38E6A', // Cafert accent color
  secondary: '#E5DCD2', // Cafert primary color
  background: '#1a1a1a',
  surface: '#2c2c2c',
  paper: '#333333',
  
  // Text colors - Cafert dark theme
  text: '#E5DCD2', // Cafert primary color
  textSecondary: '#B38E6A', // Cafert accent color
  textLight: '#8a8a8a',
  
  // Accent colors - Cafert dark theme
  accent: '#B38E6A', // Cafert accent color
  accentLight: '#E5DCD2', // Cafert primary color
  accentDark: '#534931', // Cafert header color
  
  // Coffee theme colors - Cafert dark theme
  coffee: '#B38E6A', // Cafert accent color
  coffeeLight: '#E5DCD2', // Cafert primary color
  coffeeDark: '#534931', // Cafert header color
  cream: '#2c2c2c',
  
  // Status colors
  success: '#66bb6a',
  warning: '#ffb74d',
  error: '#ef5350',
  info: '#42a5f5',
  
  // Border and shadow colors
  border: '#404040',
  shadow: 'rgba(0,0,0,0.3)',
  shadowLight: 'rgba(0,0,0,0.2)',
};

const coffeeTheme: ThemeColors = {
  // Background colors - Warm coffee-inspired theme
  primary: '#8B4513', // Saddle brown
  secondary: '#D2691E', // Chocolate
  background: '#FDF5E6', // Old lace
  surface: '#FFF8DC', // Cornsilk
  paper: '#FAF0E6', // Linen
  
  // Text colors - Coffee theme
  text: '#3E2723', // Dark brown
  textSecondary: '#5D4037', // Brown grey
  textLight: '#8D6E63', // Brown
  
  // Accent colors - Coffee theme
  accent: '#D2691E', // Chocolate
  accentLight: '#FF8C42', // Dark orange
  accentDark: '#8B4513', // Saddle brown
  
  // Coffee theme colors
  coffee: '#8B4513', // Saddle brown
  coffeeLight: '#D2691E', // Chocolate
  coffeeDark: '#3E2723', // Dark brown
  cream: '#FFF8DC', // Cornsilk
  
  // Status colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Border and shadow colors
  border: '#DEB887', // Burlywood
  shadow: 'rgba(139, 69, 19, 0.15)',
  shadowLight: 'rgba(139, 69, 19, 0.08)',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('theme');
    if (saved !== null) {
      return saved;
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const isDarkMode = currentTheme === 'dark';
  
  const getColors = () => {
    switch (currentTheme) {
      case 'dark':
        return darkTheme;
      case 'coffee':
        return coffeeTheme;
      default:
        return lightTheme;
    }
  };

  const colors = getColors();

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
  };

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('theme', currentTheme);
    
    // Apply theme to document body
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
    
    // Set CSS variable for body background (for pseudo-element matching)
    document.documentElement.style.setProperty('--body-background', colors.background);
    
    // Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Add/remove dark class for global styling
    if (isDarkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [currentTheme, colors, isDarkMode]);

  const value: ThemeContextType = {
    isDarkMode,
    currentTheme,
    toggleTheme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 