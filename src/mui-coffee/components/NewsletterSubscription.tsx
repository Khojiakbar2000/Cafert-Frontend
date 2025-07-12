import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  LocalCafe as CafeIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsletterSubscriptionProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({ colors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default colors if not provided
  const defaultColors = {
    primary: '#2C1810',
    secondary: '#8B4513',
    accent: '#D2691E',
    background: '#FDF6F0',
    text: '#2C1810',
    textSecondary: '#6B4423',
    border: '#E8D5C4',
    surface: '#F8F4F0'
  };

  const componentColors = colors || defaultColors;

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      setShowAlert(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSubscribed(true);
      setEmail('');
      setShowAlert(true);
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
        setShowAlert(false);
      }, 5000);
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setError('');
  };

  return (
    <Box
      sx={{
        backgroundColor: componentColors.background,
        borderTop: `1px solid ${componentColors.border}`,
        borderBottom: `1px solid ${componentColors.border}`,
        padding: { xs: '3rem 0', md: '4rem 0' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${componentColors.primary} 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, ${componentColors.primary} 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
      />

      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: componentColors.accent,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: `0 8px 32px rgba(210, 105, 30, 0.3)`
                }}
              >
                <CafeIcon sx={{ color: 'white', fontSize: 36 }} />
              </Box>
            </motion.div>

            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                color: componentColors.text,
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Playfair Display, serif',
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Stay Brewed In
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="h6"
              sx={{
                color: componentColors.textSecondary,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              Subscribe to our newsletter and be the first to know about new coffee blends, 
              special events, and exclusive offers. Join our coffee-loving community!
            </Typography>
          </Box>

          {/* Alert Messages */}
          <AnimatePresence>
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{ mb: 3 }}>
                  <Alert
                    severity={isSubscribed ? 'success' : 'error'}
                    icon={isSubscribed ? <CheckCircleIcon /> : undefined}
                    action={
                      <IconButton
                        color="inherit"
                        size="small"
                        onClick={handleCloseAlert}
                      >
                        <CloseIcon />
                      </IconButton>
                    }
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: isSubscribed ? '#4caf50' : '#f44336',
                      color: 'white',
                      '& .MuiAlert-icon': {
                        color: 'white'
                      }
                    }}
                  >
                    {isSubscribed 
                      ? 'Thank you for subscribing! Welcome to our coffee community! ☕'
                      : error
                    }
                  </Alert>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subscription Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                maxWidth: '500px',
                mx: 'auto',
                position: 'relative'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  backgroundColor: componentColors.surface,
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: `1px solid ${componentColors.border}`
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <EmailIcon 
                        sx={{ 
                          color: componentColors.textSecondary, 
                          mr: 1,
                          fontSize: 20
                        }} 
                      />
                    ),
                    sx: {
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      '& fieldset': {
                        border: 'none'
                      },
                      '&:hover': {
                        backgroundColor: '#fafafa'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: { xs: '0.9rem', md: '1rem' }
                    }
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    backgroundColor: componentColors.accent,
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    minWidth: { xs: '100%', sm: '140px' },
                    '&:hover': {
                      backgroundColor: componentColors.secondary,
                      transform: 'translateY(-2px)',
                      boxShadow: `0 6px 20px rgba(210, 105, 30, 0.4)`
                    },
                    '&:disabled': {
                      backgroundColor: componentColors.border,
                      color: componentColors.textSecondary
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </Box>
            </Box>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography
                variant="body2"
                sx={{
                  color: componentColors.textSecondary,
                  fontSize: { xs: '0.8rem', md: '0.9rem' },
                  maxWidth: '400px',
                  mx: 'auto'
                }}
              >
                We respect your privacy. Unsubscribe at any time. 
                No spam, just coffee love! ☕
              </Typography>
            </Box>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 2, md: 4 },
                mt: 4,
                flexWrap: 'wrap'
              }}
            >
              {[
                { text: 'Weekly Coffee Tips', icon: '☕' },
                { text: 'Exclusive Offers', icon: '🎁' },
                { text: 'Event Updates', icon: '📅' }
              ].map((benefit, index) => (
                <Box
                  key={benefit.text}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: `${componentColors.accent}08`,
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: `1px solid ${componentColors.accent}20`
                  }}
                >
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {benefit.icon}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: componentColors.text,
                      fontWeight: 500,
                      fontSize: { xs: '0.8rem', md: '0.9rem' }
                    }}
                  >
                    {benefit.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NewsletterSubscription; 