import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useTheme as useCoffeeTheme } from '../../mui-coffee/context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface PostSignupNavigationProps {
  onClose?: () => void;
}

const PostSignupNavigation: React.FC<PostSignupNavigationProps> = ({ onClose }) => {
  const history = useHistory();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const colors = {
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

  const handleNavigateToProfile = () => {
    history.push('/my-page');
    onClose?.();
  };

  const handleNavigateToOrders = () => {
    history.push('/orders');
    onClose?.();
  };

  const handleContinueShopping = () => {
    history.push('/');
    onClose?.();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        p: 2
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={isDarkMode ? 16 : 8}
            sx={{
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '24px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 3,
                  boxShadow: `0 8px 25px rgba(76, 175, 80, 0.3)`
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 40, color: '#ffffff' }} />
              </Box>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: colors.text,
                  fontWeight: 700,
                  mb: 2
                }}
              >
                {t('signup.success', 'Welcome!')}
              </Typography>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: colors.textSecondary,
                  mb: 4,
                  fontSize: '1.1rem'
                }}
              >
                {t('signup.successMessage', 'Your account has been created successfully! What would you like to do next?')}
              </Typography>
            </motion.div>

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleNavigateToProfile}
                  startIcon={<PersonIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: colors.accent,
                    color: colors.background,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      backgroundColor: colors.accentDark,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${colors.shadow}`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t('signup.setupProfile', 'Setup Your Profile')}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleNavigateToOrders}
                  startIcon={<ReceiptIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderColor: colors.accent,
                    color: colors.accent,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    borderWidth: 2,
                    '&:hover': {
                      borderColor: colors.accentDark,
                      backgroundColor: 'rgba(179, 142, 106, 0.1)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${colors.shadow}`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t('signup.viewOrders', 'View Your Orders')}
                </Button>
              </motion.div>
            </Box>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Button
                variant="text"
                onClick={handleContinueShopping}
                sx={{
                  color: colors.textSecondary,
                  textDecoration: 'underline',
                  '&:hover': {
                    color: colors.accent,
                    backgroundColor: 'transparent'
                  }
                }}
              >
                {t('signup.continueShopping', 'Continue Shopping')}
              </Button>
            </motion.div>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default PostSignupNavigation; 