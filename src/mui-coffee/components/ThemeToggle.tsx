import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <Tooltip title={isDarkMode ? "Switch to Day Mode" : "Switch to Night Mode"}>
      <IconButton
        onClick={onToggle}
        sx={{
          position: 'relative',
          backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          color: isDarkMode ? '#ffd700' : '#2c2c2c',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backdropFilter: 'blur(10px)',
          border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
          transition: 'all 0.3s ease',
          animation: isDarkMode ? 'moonGlow 2s ease-in-out infinite alternate' : 'sunGlow 2s ease-in-out infinite alternate',
          '@keyframes moonGlow': {
            '0%': {
              boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
            },
            '100%': {
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
            },
          },
          '@keyframes sunGlow': {
            '0%': {
              boxShadow: '0 0 10px rgba(255, 193, 7, 0.3)',
            },
            '100%': {
              boxShadow: '0 0 20px rgba(255, 193, 7, 0.6)',
            },
          },
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            transform: 'scale(1.1) rotate(180deg)',
            boxShadow: isDarkMode 
              ? '0 0 25px rgba(255, 215, 0, 0.8)' 
              : '0 0 25px rgba(255, 193, 7, 0.8)',
          },
        }}
      >
        {isDarkMode ? (
          <DarkModeIcon sx={{ fontSize: '24px' }} />
        ) : (
          <LightModeIcon sx={{ fontSize: '24px' }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle; 