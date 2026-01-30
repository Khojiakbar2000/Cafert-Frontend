import React, { useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ImageRightSectionProps {
  imageSrc?: string;
  className?: string;
  copyVariant?: 1 | 2 | 3;
}

const copyVariants = [
  {
    headline: 'Crafted with intention',
    body: 'Each detail thoughtfully considered, every element purposefully placed.'
  },
  {
    headline: 'Where quality meets care',
    body: 'Thoughtful selection, meticulous preparation, exceptional results.'
  },
  {
    headline: 'Designed to elevate',
    body: 'A commitment to excellence reflected in every choice we make.'
  }
];

const ImageRightSection: React.FC<ImageRightSectionProps> = ({
  imageSrc = '/penguin.png',
  className,
  copyVariant = 1
}) => {
  const { isDarkMode } = useCoffeeTheme();
  const copy = copyVariants[copyVariant - 1] || copyVariants[0];
  const [textRef, isInView] = useInView({ 
    triggerOnce: true, 
    threshold: 0.3 
  });

  return (
    <Box
      component="section"
      className={className}
      sx={{
        backgroundColor: isDarkMode 
          ? 'rgba(26, 26, 26, 0.4)' 
          : 'rgba(250, 250, 250, 0.6)',
        borderTop: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'}`,
        borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'}`,
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '1200px',
            py: { xs: '2.5rem', md: '3rem' },
            px: { xs: 2, sm: 3, md: 4 },
            mb: { xs: 4, sm: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: '1rem', md: '1.25rem' },
              alignItems: 'center',
            }}
          >
            {/* Left column - Text content */}
            <Box
              ref={textRef}
              component="div"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: { xs: 'center', md: 'flex-start' },
                textAlign: { xs: 'center', md: 'left' },
                order: { xs: 1, md: 1 },
                maxWidth: { xs: '100%', md: '280px' },
                mx: { xs: 'auto', md: 0 },
                pr: { md: 2 },
                position: 'relative',
              }}
            >
              {/* Vertical line anchor */}
              <Box
                component={motion.div}
                initial={{ scaleY: 0 }}
                animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                sx={{
                  position: 'absolute',
                  left: { xs: '50%', md: '-24px' },
                  top: 0,
                  height: '64px',
                  width: '1px',
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(26, 26, 26, 0.06)',
                  transformOrigin: 'top',
                  display: { xs: 'none', md: 'block' },
                }}
              />

              <Typography
                component={motion.h2}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                sx={{
                  fontSize: { xs: '2rem', sm: '2.25rem', md: '2.5rem' },
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.1,
                  color: isDarkMode ? '#ffffff' : '#1a1a1a',
                  mb: { xs: 1.5, md: 2 },
                  letterSpacing: '-0.015em',
                  maxWidth: { md: '260px' },
                }}
              >
                {copy.headline}
              </Typography>
              <Typography
                component={motion.p}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.35,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  fontFamily: '"Inter", sans-serif',
                  lineHeight: 1.75,
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(26, 26, 26, 0.55)',
                  maxWidth: { xs: '100%', md: '280px' },
                  letterSpacing: '0.01em',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {copy.body}
              </Typography>
            </Box>

            {/* Right column - Image with visual anchor */}
            <Box
              component="figure"
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                alignItems: 'center',
                margin: 0,
                order: { xs: 2, md: 2 },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100%', sm: '500px' },
                  maxWidth: { xs: '100%', sm: '500px' },
                  aspectRatio: '4/5',
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.02)' 
                    : 'rgba(246, 241, 234, 0.5)',
                  borderRadius: '80px 80px 18px 18px',
                  overflow: 'hidden',
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.05)' 
                    : '1px solid rgba(0, 0, 0, 0.04)',
                  transition: 'border-radius 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderRadius: '9999px 9999px 24px 24px',
                  },
                }}
              >
                <Box
                  component="img"
                  src={imageSrc}
                  alt="Product image"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ImageRightSection;

