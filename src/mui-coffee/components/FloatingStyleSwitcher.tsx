import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemIcon,
  ListItemText,
  Typography,
  Switch,
  Divider
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  LocalCafe as CoffeeIcon,
  Star as WeatherIcon,
  ExpandMore as ExpandMoreIcon
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
  const [coffeeWidgetEnabled, setCoffeeWidgetEnabled] = useState(() => {
    const saved = localStorage.getItem('coffeeWidgetEnabled');
    return saved !== null ? saved === 'true' : true;
  });

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

  const handleCoffeeWidgetToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setCoffeeWidgetEnabled(newValue);
    localStorage.setItem('coffeeWidgetEnabled', String(newValue));
    // Also set visibility if enabling
    if (newValue) {
      localStorage.setItem('coffeeWidgetVisible', 'true');
    }
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('coffeeWidgetToggle'));
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

      {/* Theme Selection Accordion */}
      {anchorEl && (
        <Box
          sx={{
            position: 'fixed',
            bottom: '100px',
            right: '30px',
            width: 280,
            backgroundColor: colors.surface,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 8px 32px ${colors.shadow}`,
            borderRadius: '16px',
            overflow: 'hidden',
            zIndex: 999,
          }}
        >
          <Accordion
            defaultExpanded
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: colors.text }} />}
              sx={{
                px: 2,
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  alignItems: 'center',
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: colors.text,
                  fontWeight: 600,
                }}
              >
                Choose Theme
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 0, pb: 1 }}>
              {themeOptions.map((option) => (
                <Box
                  key={option.id}
                  onClick={() => handleThemeChange(option.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    cursor: 'pointer',
                    backgroundColor: option.id === currentTheme ? `${colors.accent}20` : 'transparent',
                    '&:hover': {
                      backgroundColor: `${colors.accent}10`,
                    },
                    transition: 'background-color 0.2s ease',
                  }}
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
                          fontWeight: option.id === currentTheme ? 600 : 500,
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
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
          
          <Divider sx={{ borderColor: colors.border }} />
          
          {/* Coffee Mood Widget Toggle */}
          <Accordion
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: colors.text }} />}
              sx={{
                px: 2,
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WeatherIcon sx={{ color: colors.accent, fontSize: 20 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.text,
                    fontWeight: 600,
                  }}
                >
                  Coffee Mood Widget
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 2, pb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.textSecondary,
                    fontSize: '11px',
                  }}
                >
                  Weather-based coffee suggestions
                </Typography>
                <Switch
                  checked={coffeeWidgetEnabled}
                  onChange={handleCoffeeWidgetToggle}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: colors.accent,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: colors.accent,
                    },
                  }}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      
      {/* Backdrop to close */}
      {anchorEl && (
        <Box
          onClick={handleClose}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998,
            backgroundColor: 'transparent',
          }}
        />
      )}
    </>
  );
};

export default FloatingStyleSwitcher; 