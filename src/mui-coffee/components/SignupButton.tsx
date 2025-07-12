import React from 'react';
import {
  Button,
  Box,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  PersonAdd as PersonAddIcon,
  Coffee as CoffeeIcon,
  Star as StarIcon
} from '@mui/icons-material';

interface SignupButtonProps {
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'hero' | 'floating';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  showIcon?: boolean;
  showStats?: boolean;
  className?: string;
}

const SignupButton: React.FC<SignupButtonProps> = ({
  onClick,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  showIcon = true,
  showStats = false,
  className
}) => {
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const colors: {
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
    accentDark: string;
    cream: string;
    shadow: string;
    border: string;
  } = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#2c2c2c',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    accent: isDarkMode ? '#ffd700' : '#b38e6a',
    accentDark: isDarkMode ? '#ffed4e' : '#8b6b4a',
    cream: isDarkMode ? '#2c2c2c' : '#f8f8ff',
    shadow: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    border: isDarkMode ? '#404040' : '#e0e0e0'
  };

  const getButtonStyles = () => {
    const baseStyles = {
      position: 'relative' as const,
      overflow: 'hidden' as const,
      fontWeight: 600,
      textTransform: 'none' as const,
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        transition: 'left 0.6s ease',
      },
      '&:hover::before': {
        left: '100%',
      }
    };

    switch (variant) {
      case 'hero':
        return {
          ...baseStyles,
          backgroundColor: '#3776CC',
          color: colors.cream,
          fontSize: '1.125rem',
          padding: '20px 40px',
          '&:hover': {
            backgroundColor: '#2d5aa0',
            transform: 'translateY(-3px)',
            boxShadow: '0 12px 25px rgba(0,0,0,0.2)'
          }
        };
      case 'floating':
        return {
          ...baseStyles,
          backgroundColor: colors.accent,
          color: colors.background,
          fontSize: '1rem',
          padding: '16px 32px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
          '&:hover': {
            backgroundColor: colors.accentDark,
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.25)'
          }
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          color: colors.accent,
          border: `2px solid ${colors.accent}`,
          fontSize: '1rem',
          padding: '16px 32px',
          '&:hover': {
            backgroundColor: colors.accent,
            color: colors.background,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        };
      default: // primary
        return {
          ...baseStyles,
          backgroundColor: colors.accent,
          color: colors.background,
          fontSize: '1rem',
          padding: '16px 32px',
          '&:hover': {
            backgroundColor: colors.accentDark,
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
          }
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: '0.875rem',
          padding: '8px 16px',
          minHeight: '36px'
        };
      case 'large':
        return {
          fontSize: '1.25rem',
          padding: '24px 48px',
          minHeight: '60px'
        };
      default: // medium
        return {
          fontSize: '1rem',
          padding: '16px 32px',
          minHeight: '48px'
        };
    }
  };

  const buttonContent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {showIcon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <PersonAddIcon sx={{ fontSize: size === 'large' ? '1.5rem' : '1.25rem' }} />
        </motion.div>
      )}
      <Typography variant="button" sx={{ fontWeight: 600 }}>
        {t('common.signup', 'Sign Up')}
      </Typography>
    </Box>
  );

  if (showStats) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            onClick={onClick}
            variant="contained"
            fullWidth={fullWidth}
            sx={{
              ...getButtonStyles(),
              ...getSizeStyles(),
              mb: 3
            }}
            className={className}
          >
            {buttonContent}
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 700, mb: 0.5 }}>
                5000+
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Members
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 700, mb: 0.5 }}>
                50+
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Events/Year
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: colors.accent, fontWeight: 700, mb: 0.5 }}>
                24/7
              </Typography>
              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                Support
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        onClick={onClick}
        variant="contained"
        fullWidth={fullWidth}
        sx={{
          ...getButtonStyles(),
          ...getSizeStyles()
        }}
        className={className}
      >
        {buttonContent}
      </Button>
    </motion.div>
  );
};

export default SignupButton; 