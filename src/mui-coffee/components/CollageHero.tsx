import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useHistory } from 'react-router-dom';

/** Pulp Alchemist / StitchEvents comic tokens */
const INK = '#1A0F0D';
const PRIMARY = '#a83100';
const TERTIARY_CONTAINER = '#fecc00';
const ON_TERTIARY_CONTAINER = '#584500';
const BODY_MUTED = '#312f26';
const ALCHEMIST_ORANGE = '#FF4E00';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function CollageComicFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,300..700;1,300..700&family=Bangers&display=swap');
    `}</style>
  );
}

const CollageHero: React.FC = () => {
  const history = useHistory();
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const handleExploreMenu = () => {
    history.push('/products');
  };

  // GSAP animations
  useGSAP(() => {
    if (!sectionRef.current) return;

    // Text animation - slide in from left
    if (textRef.current) {
      const textElements = textRef.current.querySelectorAll(
        '.season-text .comic-animate-in > *',
      );
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
  }, { scope: sectionRef });

  return (
    <Box
      component="section"
      ref={sectionRef}
      className="season-picks"
      sx={{
        position: 'relative',
        minHeight: { xs: 'min(1280px, 120vh)', md: 'min(1680px, 118vh)' },
        py: { xs: '3rem', md: '5rem' },
        // Fixed background with lighter overlay
        backgroundImage: {
          xs: 'linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.28)), url(/codegrid-3d-crt-display/coffeesunset.png)',
          md: 'linear-gradient(rgba(0,0,0,0.22), rgba(0,0,0,0.28)), url(/codegrid-3d-crt-display/coffeesunset.png)',
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        px: { xs: '1.25rem', md: '2.5rem' },
      }}
    >
      <CollageComicFonts />

      {/* Comic panel on parallax background */}
      <Box
        ref={textRef}
        className="season-text"
        sx={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '56rem',
          mx: { xs: 0, md: '8%' },
        }}
      >
        <Box
          className="comic-animate-in"
          sx={{
            position: 'relative',
            bgcolor: 'rgba(252, 246, 232, 0.94)',
            border: `6px solid ${INK}`,
            boxShadow: `14px 14px 0 0 ${INK}`,
            p: { xs: '2.25rem', md: '3.25rem', lg: '4rem' },
            transform: 'rotate(-0.75deg)',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle, currentColor 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              color: INK,
              opacity: 0.08,
              pointerEvents: 'none',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -8, md: -18 },
              right: { xs: 8, md: -12 },
              bgcolor: TERTIARY_CONTAINER,
              color: ON_TERTIARY_CONTAINER,
              fontWeight: 900,
              py: '0.35rem',
              px: { xs: '0.75rem', md: '1rem' },
              border: `5px solid ${INK}`,
              boxShadow: `6px 6px 0 0 ${INK}`,
              transform: 'rotate(11deg)',
              zIndex: 2,
              fontSize: { xs: '0.95rem', md: '1.15rem' },
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontStyle: 'italic',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Fresh drop!
          </Box>

          <Typography
            className="season-title"
            component="h2"
            variant="h1"
            sx={{
              position: 'relative',
              zIndex: 1,
              m: 0,
              mb: { xs: 2, md: 2.5 },
              fontSize: {
                xs: 'clamp(2.75rem, 10vw, 3.75rem)',
                md: 'clamp(3.5rem, 5vw, 4.75rem)',
              },
              fontWeight: 900,
              fontFamily: '"Bangers", "Space Grotesk", system-ui, sans-serif',
              fontStyle: 'normal',
              letterSpacing: '0.02em',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: INK,
              textShadow: `4px 4px 0 ${ALCHEMIST_ORANGE}`,
            }}
          >
            Season Picks
          </Typography>
          <Typography
            className="season-description"
            sx={{
              position: 'relative',
              zIndex: 1,
              m: 0,
              mb: { xs: 3, md: 4 },
              fontSize: { xs: '1.125rem', md: '1.35rem' },
              fontWeight: 700,
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontStyle: 'italic',
              color: BODY_MUTED,
              lineHeight: 1.55,
              maxWidth: '36rem',
            }}
          >
            Discover seasonal favorites through texture, aroma, and craft.
          </Typography>
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Button
              className="season-button"
              variant="contained"
              onClick={handleExploreMenu}
              disableElevation
              sx={{
                py: 1.35,
                px: { xs: 3, md: 4 },
                borderRadius: 0,
                bgcolor: PRIMARY,
                color: '#ffefeb',
                fontFamily: '"Space Grotesk", system-ui, sans-serif',
                fontWeight: 900,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                border: `4px solid ${INK}`,
                boxShadow: `5px 5px 0 0 ${INK}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                '&:hover': {
                  bgcolor: ALCHEMIST_ORANGE,
                  color: INK,
                  transform: 'translate(3px, 3px)',
                  boxShadow: `2px 2px 0 0 ${INK}`,
                },
              }}
            >
              Explore Menu
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CollageHero;

