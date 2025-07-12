import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  LocalCafe as CoffeeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ThemeOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const FloatingStyleSwitcher: React.FC = () => {
  const { isDarkMode, currentTheme, setTheme, colors } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: <LightModeIcon />,
      description: 'Clean and bright interface'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: <DarkModeIcon />,
      description: 'Easy on the eyes'
    },
    {
      id: 'coffee',
      name: 'Coffee Theme',
      icon: <CoffeeIcon />,
      description: 'Warm coffee-inspired colors'
    }
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    handleClose();
  };

  const getCurrentThemeIcon = () => {
    if (isDarkMode) {
      return <DarkModeIcon />;
    }
    return <LightModeIcon />;
  };

  const getCurrentThemeName = () => {
    if (isDarkMode) {
      return 'Dark Mode';
    }
    return 'Light Mode';
  };

  return (
    <>
      {/* Floating Style Switcher Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          zIndex: 1000,
        }}
      >
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Tooltip
            title={`Current: ${getCurrentThemeName()}`}
            placement="left"
            arrow
          >
            <IconButton
              onClick={handleClick}
              sx={{
                backgroundColor: colors.accent,
                color: 'white',
                width: 56,
                height: 56,
                boxShadow: `0 4px 20px ${colors.shadow}`,
                border: `2px solid ${colors.border}`,
                '&:hover': {
                  backgroundColor: colors.accentDark,
                  transform: 'scale(1.1)',
                  boxShadow: `0 6px 25px ${colors.shadow}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isDarkMode ? 'dark' : 'light'}
                  initial={{ rotate: -180, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 180, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {getCurrentThemeIcon()}
                </motion.div>
              </AnimatePresence>
            </IconButton>
          </Tooltip>

          {/* Hover indicator */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  right: '70px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: colors.surface,
                  color: colors.text,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  boxShadow: `0 2px 10px ${colors.shadow}`,
                  border: `1px solid ${colors.border}`,
                }}
              >
                Switch Theme
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>

      {/* Theme Selection Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 8px 32px ${colors.shadow}`,
            borderRadius: '16px',
            minWidth: 200,
            mt: 1,
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${colors.border}` }}>
          <Typography
            variant="subtitle2"
            sx={{
              color: colors.text,
              fontWeight: 600,
              textAlign: 'center'
            }}
          >
            Choose Theme
          </Typography>
        </Box>
        
        {themeOptions.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleThemeChange(option.id)}
            sx={{
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: `${colors.accent}10`,
              },
              '&.Mui-selected': {
                backgroundColor: `${colors.accent}20`,
                '&:hover': {
                  backgroundColor: `${colors.accent}30`,
                },
              },
            }}
            selected={option.id === currentTheme}
          >
            <ListItemIcon
              sx={{
                color: colors.accent,
                minWidth: 40,
              }}
            >
              {option.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text,
                    fontWeight: 500,
                  }}
                >
                  {option.name}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.textSecondary,
                    fontSize: '11px',
                  }}
                >
                  {option.description}
                </Typography>
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default FloatingStyleSwitcher; 