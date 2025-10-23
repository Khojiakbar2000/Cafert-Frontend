import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '../../mui-coffee/context/ThemeContext';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  onReservationClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onReservationClick }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isDarkMode } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const history = useHistory();

  // Use the original coffee placeholder image
  const heroImages = [
    '/img/coffee/coffee-placeholder.jpg',    // Original hero image
  ];



  const handleExploreMenu = () => {
    history.push('/coffees');
  };

  // No auto-rotation needed for single image
  useEffect(() => {
    // Keep the single image static
  }, []);

  // Ensure video is muted on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.volume = 0;
    }
  }, []);

  return (
    <Box
      className="hero-section"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundImage: `url('${heroImages[currentImageIndex]}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        transition: 'all 1.5s ease-in-out',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.2) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }
      }}
    >


      {/* Decorative SVG Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          zIndex: 1
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L1200 800" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <path d="M1200 0L0 800" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <circle cx="300" cy="200" r="50" fill="currentColor" opacity="0.1"/>
          <circle cx="900" cy="600" r="30" fill="currentColor" opacity="0.1"/>
          <circle cx="1000" cy="150" r="25" fill="currentColor" opacity="0.1"/>
        </svg>
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '80vh' }}>
          {/* Main Content */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ color: 'white', mb: 4 }}>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 500,
                    color: isDarkMode ? '#ffd700' : '#d4af37',
                    letterSpacing: '0.2em',
                    mb: 2,
                    display: 'block',
                    textShadow: isDarkMode ? '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)' : 'none',
                    animation: isDarkMode ? 'glowPulse 2s ease-in-out infinite alternate' : 'none',
                    '@keyframes glowPulse': {
                      '0%': {
                        textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)',
                      },
                      '100%': {
                        textShadow: '0 0 15px rgba(255, 215, 0, 1), 0 0 25px rgba(255, 215, 0, 0.6), 0 0 35px rgba(255, 215, 0, 0.3)',
                      },
                    },
                  }}
                >
                  {t('hero.welcome')}
                </Typography>
        
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.25rem', sm: '3rem', md: '3.5rem', lg: '4rem', xl: '4.5rem' },
                    fontWeight: 400,
                    fontFamily: '"Playfair Display", serif',
                    color: isDarkMode ? '#ffffff' : 'white',
                    mb: 3,
                    lineHeight: 1.1,
                    textShadow: isDarkMode 
                      ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4), 2px 2px 4px rgba(0,0,0,0.5)'
                      : '2px 2px 4px rgba(0,0,0,0.5)',
                    animation: isDarkMode ? 'titleGlow 3s ease-in-out infinite alternate' : 'none',
                    '@keyframes titleGlow': {
                      '0%': {
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4), 2px 2px 4px rgba(0,0,0,0.5)',
                      },
                      '100%': {
                        textShadow: '0 0 30px rgba(255, 255, 255, 1), 0 0 50px rgba(255, 255, 255, 0.6), 0 0 70px rgba(255, 255, 255, 0.3), 2px 2px 4px rgba(0,0,0,0.5)',
                      },
                    },
                  }}
                >
                  Cafert
                </Typography>
        
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem', lg: '1.375rem' },
                    color: isDarkMode ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.9)',
                    mb: 4,
                    lineHeight: 1.6,
                    maxWidth: '500px',
                    textShadow: isDarkMode 
                      ? '0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.3), 1px 1px 2px rgba(0,0,0,0.5)'
                      : '1px 1px 2px rgba(0,0,0,0.5)',
                    animation: isDarkMode ? 'textGlow 4s ease-in-out infinite alternate' : 'none',
                    '@keyframes textGlow': {
                      '0%': {
                        textShadow: '0 0 15px rgba(255, 255, 255, 0.6), 0 0 25px rgba(255, 255, 255, 0.3), 1px 1px 2px rgba(0,0,0,0.5)',
                      },
                      '100%': {
                        textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 35px rgba(255, 255, 255, 0.4), 0 0 50px rgba(255, 255, 255, 0.2), 1px 1px 2px rgba(0,0,0,0.5)',
                      },
                    },
                  }}
                >
                  {t('hero.description')}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleExploreMenu}
                      sx={{
                        backgroundColor: isDarkMode ? '#ffd700' : '#1a1a1a',
                        color: isDarkMode ? '#000' : 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#b8941f'
                        }
                      }}
                    >
                      {t('hero.cta')}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={onReservationClick}
                      sx={{
                        borderColor: 'rgba(255,255,255,0.8)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: 'white',
                          backgroundColor: 'rgba(255,255,255,0.1)'
                        }
                      }}
                    >
                      {t('hero.reservation')}
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Grid>

          {/* Video Frame */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: '400px', md: '600px' },
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
                  border: '3px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  maxWidth: { xs: '100%', md: '95%' }
                }}
              >
                {/* Video Player */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onLoadedData={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = true;
                      videoRef.current.volume = 0;
                    }
                  }}
                  onCanPlay={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = true;
                      videoRef.current.volume = 0;
                    }
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '17px'
                  }}
                >
                  <source src="/videos/mixkit-coffee-maker-making-coffee-3578-full-hd.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.02) 100%)',
                    borderRadius: '17px'
                  }}
                />





                {/* Decorative Elements */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    zIndex: 2
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Box
                      sx={{
                        width: 35,
                        height: 35,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(212, 175, 55, 0.3)',
                        border: '2px solid rgba(212, 175, 55, 0.6)'
                      }}
                    />
                  </motion.div>
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    zIndex: 2
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Box
                      sx={{
                        width: 25,
                        height: 25,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        border: '2px solid rgba(255, 255, 255, 0.4)'
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3
        }}
      >
        <Box
          sx={{
            width: 2,
            height: 40,
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: 1
          }}
        />
      </motion.div>
    </Box>
  );
};

export default HeroSection; 