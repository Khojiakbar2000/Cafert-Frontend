import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import SignupButton from './SignupButton';

const SignupButtonDemo: React.FC = () => {
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleSignupClick = () => {
    alert('Signup button clicked! This would open the signup modal.');
  };

  const buttonVariants = [
    {
      name: 'Primary',
      variant: 'primary' as const,
      description: 'Standard primary signup button with accent color'
    },
    {
      name: 'Secondary',
      variant: 'secondary' as const,
      description: 'Outlined button with accent color border'
    },
    {
      name: 'Hero',
      variant: 'hero' as const,
      description: 'Large hero button with blue gradient for main CTAs'
    },
    {
      name: 'Floating',
      variant: 'floating' as const,
      description: 'Elevated button with shadow and scale effects'
    }
  ];

  const sizeVariants = [
    { name: 'Small', size: 'small' as const },
    { name: 'Medium', size: 'medium' as const },
    { name: 'Large', size: 'large' as const }
  ];

  return (
    <Box sx={{ 
      backgroundColor: colors.background,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: colors.text,
                fontWeight: 700,
                mb: 2
              }}
            >
              Signup Button Components
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: colors.textSecondary,
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: '1.125rem'
              }}
            >
              Explore different signup button variants with modern animations and responsive design
            </Typography>
          </Box>
        </motion.div>

        {/* Button Variants */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: colors.text,
              fontWeight: 600,
              mb: 4,
              textAlign: 'center'
            }}
          >
            Button Variants
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 8 }}>
            {buttonVariants.map((button, index) => (
              <Box key={button.name}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Paper 
                    elevation={isDarkMode ? 8 : 2}
                    sx={{ 
                      p: 3,
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '16px',
                      textAlign: 'center'
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: colors.text,
                        fontWeight: 600,
                        mb: 2
                      }}
                    >
                      {button.name}
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <SignupButton
                        onClick={handleSignupClick}
                        variant={button.variant}
                        size="medium"
                      />
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.textSecondary,
                        fontSize: '0.875rem',
                        lineHeight: 1.5
                      }}
                    >
                      {button.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Box>
            ))}
          </Box>
        </motion.div>

        {/* Size Variants */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: colors.text,
              fontWeight: 600,
              mb: 4,
              textAlign: 'center'
            }}
          >
            Size Variants
          </Typography>
          
          <Paper 
            elevation={isDarkMode ? 8 : 2}
            sx={{ 
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '16px',
              mb: 8
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              {sizeVariants.map((size, index) => (
                <motion.div
                  key={size.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: colors.textSecondary,
                        mb: 2,
                        fontWeight: 500
                      }}
                    >
                      {size.name}
                    </Typography>
                    <SignupButton
                      onClick={handleSignupClick}
                      variant="primary"
                      size={size.size}
                    />
                  </Box>
                </motion.div>
              ))}
            </Box>
          </Paper>
        </motion.div>

        {/* Special Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: colors.text,
              fontWeight: 600,
              mb: 4,
              textAlign: 'center'
            }}
          >
            Special Features
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Paper 
                elevation={isDarkMode ? 8 : 2}
                sx={{ 
                  p: 4,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: colors.text,
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  With Stats
                </Typography>
                
                <SignupButton
                  onClick={handleSignupClick}
                  variant="hero"
                  size="large"
                  showStats={true}
                />
              </Paper>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <Paper 
                elevation={isDarkMode ? 8 : 2}
                sx={{ 
                  p: 4,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '16px',
                  textAlign: 'center'
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: colors.text,
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  Without Icon
                </Typography>
                
                <SignupButton
                  onClick={handleSignupClick}
                  variant="floating"
                  size="large"
                  showIcon={false}
                />
              </Paper>
            </motion.div>
          </Box>
        </motion.div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <Paper 
            elevation={isDarkMode ? 8 : 2}
            sx={{ 
              p: 4,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '16px',
              mt: 8
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: colors.text,
                fontWeight: 600,
                mb: 3
              }}
            >
              Usage Instructions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body1" sx={{ color: colors.text }}>
                <strong>Basic Usage:</strong> Import and use the SignupButton component with an onClick handler.
              </Typography>
              
              <Typography variant="body1" sx={{ color: colors.text }}>
                <strong>Props:</strong> variant, size, fullWidth, showIcon, showStats, className
              </Typography>
              
              <Typography variant="body1" sx={{ color: colors.text }}>
                <strong>Variants:</strong> primary, secondary, hero, floating
              </Typography>
              
              <Typography variant="body1" sx={{ color: colors.text }}>
                <strong>Sizes:</strong> small, medium, large
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignupButtonDemo; 