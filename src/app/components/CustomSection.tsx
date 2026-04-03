import React from 'react';
import { Box, Typography } from '@mui/material';

interface CustomSectionProps {
  children?: React.ReactNode;
  images?: string[];
  title?: string;
  description?: string;
}

/**
 * Custom Section Component matching ekomia.de design
 * Displays two large pictures side by side with text content below
 */
const CustomSection: React.FC<CustomSectionProps> = ({ 
  children, 
  images,
  title,
  description
}) => {
  const defaultImages = [
    '/img/coffee/Just.png',
    '/img/coffee/Just1.png'
  ];
  
  const displayImages = images || defaultImages;
  
  return (
    <Box
      className="custom-section"
      sx={{
        position: 'relative',
        paddingTop: '240px',
        paddingBottom: '160px',
        fontFamily: 'var(--bs-body-font-family)',
        fontSize: 'var(--bs-body-font-size)',
        fontWeight: 'var(--bs-body-font-weight)',
        lineHeight: 'var(--bs-body-line-height)',
        color: 'var(--bs-body-color)',
        WebkitTextSizeAdjust: '100%',
        WebkitTapHighlightColor: 'transparent',
        WebkitFontSmoothing: 'antialiased',
        boxSizing: 'border-box',
        width: '100%',
        background: 'linear-gradient(to bottom, #8FAEC7 0%, #8FAEC7 60%, #FBFAF3 60%, #FBFAF3 100%)',
        overflow: 'hidden' // Allow images to overlap slightly
      }}
    >
      {/* Centered Container with Staggered Layout */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: { xs: '2rem', md: '300px' },
          '@media (max-width: 768px)': {
            flexDirection: 'column',
            gap: '2rem',
            alignItems: 'stretch'
          }
        }}
      >
        {/* Left column: image + quote (quote appears on hover) */}
        <Box
          sx={{
            flex: '0 0 auto',
            position: 'relative',
            alignSelf: 'flex-start',
            maxWidth: '100%',
            width: { xs: '100%', md: 'calc(50% - 150px)' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            '@media (max-width: 768px)': {
              width: '100%',
              alignItems: 'center'
            },
            '& .custom-section-quote': {
              opacity: 0,
              transition: 'opacity 0.35s ease'
            },
            '&:hover .custom-section-quote': {
              opacity: 1
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '150%',
              overflow: 'hidden',
              backgroundColor: '#6663'
            }}
          >
            <Box
              component="img"
              src={displayImages[0]}
              alt="Image 1"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
          </Box>
          <Typography
            className="custom-section-quote"
            component="blockquote"
            sx={{
              maxWidth: 450,
              width: '100%',
              mt: 3,
              textAlign: { xs: 'center', md: 'left' },
              fontFamily: 'var(--heading-family, "Poppins", serif)',
              fontSize: { xs: '1.35rem', md: '1.6rem' },
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.45,
              color: 'inherit',
              letterSpacing: '0.02em'
            }}
          >
            Quality over quantity.
          </Typography>
        </Box>

        {/* Right column: image + quote (quote appears on hover) */}
        <Box
          sx={{
            flex: '0 0 auto',
            position: 'relative',
            alignSelf: 'flex-start',
            maxWidth: '100%',
            width: { xs: '100%', md: 'calc(50% - 150px)' },
            transform: 'translateY(-120px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            '@media (max-width: 768px)': {
              width: '100%',
              transform: 'none',
              alignItems: 'center'
            },
            '& .custom-section-quote': {
              opacity: 0,
              transition: 'opacity 0.35s ease'
            },
            '&:hover .custom-section-quote': {
              opacity: 1
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: '150%',
              overflow: 'hidden',
              backgroundColor: '#6663'
            }}
          >
            <Box
              component="img"
              src={displayImages[1]}
              alt="Image 2"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block'
              }}
            />
          </Box>
          <Typography
            className="custom-section-quote"
            component="blockquote"
            sx={{
              maxWidth: 450,
              width: '100%',
              mt: 3,
              pr: { xs: 0, md: 0 },
              textAlign: { xs: 'center', md: 'right' },
              fontFamily: 'var(--heading-family, "Poppins", serif)',
              fontSize: { xs: '1.35rem', md: '1.6rem' },
              fontWeight: 300,
              fontStyle: 'italic',
              lineHeight: 1.45,
              color: 'inherit',
              letterSpacing: '0.02em'
            }}
          >
            Where every morning begins with a perfect cup.
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};

export default CustomSection;


