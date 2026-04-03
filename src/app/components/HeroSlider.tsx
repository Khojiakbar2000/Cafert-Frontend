import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper';
import { Box, IconButton } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

interface HeroSliderProps {
  images?: string[];
}

/**
 * Hero Slider Component with Swiper.js
 * Features:
 * - Navigation arrows (left/right, circular, vertically centered)
 * - Infinite loop
 * - Fade transition
 * - Mobile swipe support
 * - Dark gradient overlay for readability
 */
const HeroSlider: React.FC<HeroSliderProps> = ({ 
  images = [
    '/img/coffee/Just.png',
    '/img/coffee/Just1.png'
  ]
}) => {
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [prevEl, setPrevEl] = React.useState<HTMLElement | null>(null);
  const [nextEl, setNextEl] = React.useState<HTMLElement | null>(null);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Navigation, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl,
          nextEl,
        }}
        speed={1000}
        className="hero-swiper"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }
              }}
            >
              <Box
                component="img"
                src={image}
                alt={`Slide ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows - Circular, Vertically Centered */}
      <IconButton
        ref={(node) => setPrevEl(node)}
        className="swiper-button-prev-custom"
        sx={{
          position: 'absolute',
          left: { xs: '20px', md: '40px' },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: { xs: '48px', md: '56px' },
          height: { xs: '48px', md: '56px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)'
          },
          '& svg': {
            fontSize: { xs: '24px', md: '28px' }
          }
        }}
      >
        <KeyboardArrowLeft />
      </IconButton>

      <IconButton
        ref={(node) => setNextEl(node)}
        className="swiper-button-next-custom"
        sx={{
          position: 'absolute',
          right: { xs: '20px', md: '40px' },
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10,
          width: { xs: '48px', md: '56px' },
          height: { xs: '48px', md: '56px' },
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'translateY(-50%) scale(1.1)',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)'
          },
          '&:active': {
            transform: 'translateY(-50%) scale(0.95)'
          },
          '& svg': {
            fontSize: { xs: '24px', md: '28px' }
          }
        }}
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  );
};

export default HeroSlider;



