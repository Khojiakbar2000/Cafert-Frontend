import React, { useRef } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme as useThemeContext } from '../context/ThemeContext';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type Card = {
  src: string;
  alt: string;
  top: string;
  left: string;
  rotation: number;
  className: string;
};

const cards: Card[] = [
  {
    src: '/img/coffee/coffee-latte.jpg',
    alt: 'Latte Art',
    top: '0',
    left: '0',
    rotation: -6,
    className: 'one',
  },
  {
    src: '/img/coffee/coffee-2.webp',
    alt: 'Cappuccino',
    top: '40px',
    left: '180px',
    rotation: 3,
    className: 'two',
  },
  {
    src: '/img/coffee/coffee-beans.jpg',
    alt: 'Coffee Beans',
    top: '120px',
    left: '60px',
    rotation: -2,
    className: 'three',
  },
  {
    src: '/img/coffee/coffee-espresso.jpg',
    alt: 'Espresso',
    top: '80px',
    left: '320px',
    rotation: 6,
    className: 'four',
  },
];

const CollageHero: React.FC = () => {
  const { colors } = useThemeContext();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // GSAP animations
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Text animation - slide in from left
    if (textRef.current) {
      const textElements = textRef.current.querySelectorAll('.season-text > *');
      gsap.from(textElements, {
        x: -80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });
    }

    // Card animation - soft entrance
    const polaroids = sectionRef.current.querySelectorAll('.polaroid');
    gsap.from(polaroids, {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <Box
      component="section"
      ref={sectionRef}
      className="season-picks"
      sx={{
        position: 'relative',
        height: { xs: '75vh', md: '80vh' },
        minHeight: { xs: '500px', md: '600px' },
        // Fixed background with lighter overlay
        backgroundImage: {
          xs: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(/justcoffee.png)',
          md: 'linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(/justcoffee.png)',
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '45% 55%' },
        alignItems: 'center',
        padding: { xs: '2rem', md: '4rem' },
      }}
    >

      {/* Text block - Left column */}
      <Box
        ref={textRef}
        className="season-text"
        sx={{
          position: 'relative',
          zIndex: 2,
          color: '#fff',
          padding: { xs: '2rem', md: '0 2rem' },
        }}
      >
        <Typography
          className="season-title"
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
            fontWeight: 700,
            mb: 2,
            fontFamily: 'Playfair Display, serif',
            lineHeight: 1.1,
            color: '#fff',
          }}
        >
          Season Picks
        </Typography>
          <Typography
            className="season-description"
            variant="h5"
            sx={{
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              fontWeight: 400,
              mb: 4,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.6,
            }}
          >
            Discover seasonal favorites through texture, aroma, and craft.
          </Typography>
        <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-start' } }}>
          <Button
            className="season-button"
            variant="contained"
            sx={{
              padding: '12px 32px',
              borderRadius: '12px',
              background: '#fff',
              color: '#111',
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 14px rgba(255,255,255,0.2)',
              '&:hover': {
                background: 'rgba(255,255,255,0.95)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px rgba(255,255,255,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Explore Menu
          </Button>
        </Box>
      </Box>

      {/* Polaroid Collage - Right column, NO overlap */}
      <Box
        className="polaroid-collage"
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '300px', sm: '350px', md: '380px' },
          zIndex: 2,
          padding: { xs: '2rem', md: '0 2rem' },
        }}
      >
        {cards.map((card, idx) => (
          <Box
            key={idx}
            className={`polaroid ${card.className}`}
            component="figure"
            sx={{
              position: 'absolute',
              width: { xs: '200px', sm: '260px', md: '300px' },
              padding: '12px',
              background: '#fff',
              borderRadius: '14px',
              boxShadow: '0 18px 40px rgba(0,0,0,0.2)',
              transform: `rotate(${card.rotation}deg)`,
              transformOrigin: 'center',
              top: card.top,
              left: card.left,
              transition: 'transform 0.4s ease',
              zIndex: 1,
              '&:hover': {
                transform: `translateY(-8px) scale(1.03) rotate(${card.rotation}deg)`,
                zIndex: 10,
              },
              '& img': {
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                objectFit: 'cover',
              },
            }}
          >
            <Box
              component="img"
              src={card.src}
              alt={card.alt}
              sx={{
                display: 'block',
                width: '100%',
                height: 'auto',
                borderRadius: '10px',
                objectFit: 'cover',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CollageHero;

