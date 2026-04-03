import React from 'react';
import { Box, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useTheme } from '../../mui-coffee/context/ThemeContext';
import { STITCH_THEME } from '../../components/stitchUi';

const INK = STITCH_THEME.ink;
const SURFACE = STITCH_THEME.surface;
/** Darkened body ink for stronger hierarchy (light mode). */
const HEADLINE_INK = '#1a1714';
/** Burnt orange — richer, less neon than flat brand hex. */
const HERO_ACCENT = '#c94a18';
const ON_PRIMARY = STITCH_THEME.onPrimary;
const TERTIARY_BADGE_BG = STITCH_THEME.tertiaryContainer;
const TERTIARY_BADGE_FG = STITCH_THEME.onTertiary;
const SURFACE_CONTAINER_HIGH = STITCH_THEME.surfaceContainer;

const COMIC_FRAME_PX = 8;
const easeSpring = [0.34, 1.56, 0.64, 1] as const;

interface HeroSectionProps {
  onReservationClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onReservationClick }) => {
  const history = useHistory();
  const { isDarkMode } = useTheme();

  const bg = isDarkMode ? INK : SURFACE;
  const headlineMain = isDarkMode ? SURFACE : HEADLINE_INK;
  const inkBorder = isDarkMode ? SURFACE : INK;
  const subtitleBg = isDarkMode ? 'rgba(252,246,232,0.12)' : SURFACE_CONTAINER_HIGH;
  const dotsOpacity = isDarkMode ? 0.085 : 0.055;
  const halftoneFineOpacity = isDarkMode ? 0.04 : 0.032;

  const handleInitiateBrew = () => {
    if (onReservationClick) {
      onReservationClick();
      return;
    }
    history.push('/coffees');
  };

  const headlineShadow = isDarkMode
    ? `8px 8px 0 rgba(252, 246, 232, 0.12), 10px 10px 0 rgba(252, 246, 232, 0.06)`
    : `8px 8px 0 ${INK}, 10px 10px 0 rgba(26, 15, 13, 0.18)`;

  const accentShadow = isDarkMode
    ? `4px 4px 0 rgba(252, 246, 232, 0.2)`
    : `5px 5px 0 rgba(26, 15, 13, 0.35)`;

  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        flex: 1,
        minHeight: '100%',
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        py: { xs: '5.75rem', md: `clamp(5.5rem, 11vw, 8.75rem)` },
        px: { xs: '1.25rem', md: 'clamp(1.35rem, 4vw, 2.25rem)' },
        bgcolor: bg,
        color: headlineMain,
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700;1,800;1,900&display=swap');
      `}</style>

      {/* Halftone — coarse */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(${inkBorder} 1px, transparent 1px)`,
          backgroundSize: '12px 12px',
          opacity: dotsOpacity,
        }}
      />
      {/* Halftone — fine (subtle comic print) */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `radial-gradient(${inkBorder} 0.5px, transparent 0.5px)`,
          backgroundSize: '5px 5px',
          opacity: halftoneFineOpacity,
          mixBlendMode: isDarkMode ? 'soft-light' : 'multiply',
        }}
      />

      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: '2.75rem', md: `clamp(3.25rem, 5.5vw, 4.75rem)` },
            alignItems: 'center',
            columnGap: { md: `clamp(2rem, 4vw, 3.5rem)` },
          }}
        >
          {/* Left column — slant-1 */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{ transform: 'rotate(-1deg)' }}
          >
            <Box
              component="h1"
              sx={{
                m: 0,
                mb: '1.35rem',
                fontSize: { xs: 'clamp(3.05rem, 12.5vw, 4.35rem)', md: 'clamp(4.5rem, 7.5vw, 7.35rem)' },
                lineHeight: 0.88,
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.038em',
                color: headlineMain,
                textShadow: headlineShadow,
              }}
            >
              <Box component="span" sx={{ display: 'block' }}>
                WAKE UP
              </Box>
              <Box
                component="span"
                sx={{
                  display: 'block',
                  mt: '-0.04em',
                  color: HERO_ACCENT,
                  textShadow: accentShadow,
                }}
              >
                OR ELSE!
              </Box>
            </Box>

            <Box
              sx={{
                maxWidth: '30rem',
                mb: '2.25rem',
                p: { xs: '1.35rem', md: '1.85rem' },
                bgcolor: subtitleBg,
                color: isDarkMode ? SURFACE : HEADLINE_INK,
                border: `${COMIC_FRAME_PX}px solid ${inkBorder}`,
                boxShadow: `12px 12px 0 0 ${inkBorder}`,
                fontSize: { xs: '1.125rem', md: '1.4rem' },
                fontWeight: 700,
                lineHeight: 1.45,
                transition: `transform 0.3s cubic-bezier(${easeSpring.join(',')}), box-shadow 0.3s cubic-bezier(${easeSpring.join(',')})`,
                '@media (hover: hover) and (min-width: 900px)': {
                  '&:hover': {
                    transform: 'scale(1.015) translateY(-3px)',
                    boxShadow: `16px 16px 0 0 ${inkBorder}`,
                  },
                },
              }}
            >
              Hyper-concentrated alchemy for the restless mind. We don&apos;t just brew
              coffee; we initiate nuclear reactions in porcelain.
            </Box>

            <Box sx={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button
                onClick={handleInitiateBrew}
                sx={{
                  bgcolor: HERO_ACCENT,
                  color: ON_PRIMARY,
                  fontSize: { xs: '1.05rem', md: '1.3rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  px: { xs: '2.1rem', md: '3.1rem' },
                  py: { xs: '1.1rem', md: '1.4rem' },
                  border: `${COMIC_FRAME_PX}px solid ${inkBorder}`,
                  boxShadow: `10px 10px 0 0 ${inkBorder}`,
                  borderRadius: 0,
                  fontFamily: '"Space Grotesk", sans-serif',
                  transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease',
                  '&:hover': {
                    bgcolor: '#b44115',
                    transform: 'translateY(-5px)',
                    boxShadow: `14px 14px 0 0 ${inkBorder}`,
                  },
                  '&:active': {
                    transform: 'translateY(-1px)',
                    boxShadow: `6px 6px 0 0 ${inkBorder}`,
                  },
                }}
              >
                Initiate Brew
              </Button>
            </Box>
          </motion.div>

          {/* Right column — comic tilt */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ transform: 'rotate(1.35deg)', position: 'relative' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.3, rotate: 12 }}
              animate={{ opacity: 1, scale: 1, rotate: 10 }}
              transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.35 }}
              style={{
                position: 'absolute',
                top: '-1.35rem',
                right: '-1rem',
                zIndex: 20,
              }}
            >
              <Box
                sx={{
                  bgcolor: TERTIARY_BADGE_BG,
                  color: TERTIARY_BADGE_FG,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  p: { xs: '1.1rem', md: '1.35rem' },
                  border: `${COMIC_FRAME_PX}px solid ${inkBorder}`,
                  boxShadow: `10px 10px 0 0 ${inkBorder}`,
                  fontSize: { xs: '1.25rem', md: '1.55rem' },
                  fontFamily: '"Space Grotesk", sans-serif',
                  transform: 'rotate(-18deg)',
                }}
              >
                BOOM!
              </Box>
            </motion.div>

            <Box
              sx={{
                border: `${COMIC_FRAME_PX}px solid ${inkBorder}`,
                boxShadow: `14px 14px 0 0 ${inkBorder}`,
                bgcolor: isDarkMode ? 'rgba(252,246,232,0.08)' : '#eee8d8',
                overflow: 'hidden',
                transition: `transform 0.3s cubic-bezier(${easeSpring.join(',')}), box-shadow 0.3s cubic-bezier(${easeSpring.join(',')})`,
                '@media (hover: hover) and (min-width: 900px)': {
                  '&:hover': {
                    transform: 'scale(1.02) translateY(-5px)',
                    boxShadow: `18px 18px 0 0 ${inkBorder}`,
                  },
                  '&:hover .hero-stitch-main-img': {
                    transform: 'scale(1.08)',
                  },
                },
              }}
            >
              <Box
                component="img"
                className="hero-stitch-main-img"
                src="/coffeemaker.png"
                alt="Coffee maker"
                sx={{
                  width: '100%',
                  height: {
                    xs: 'min(46svh, 420px)',
                    md: 'min(58svh, 620px)',
                  },
                  minHeight: { xs: 300, md: 400 },
                  objectFit: 'cover',
                  display: 'block',
                  mixBlendMode: isDarkMode ? 'normal' : 'multiply',
                  opacity: 0.92,
                  transition: 'transform 700ms ease',
                }}
              />
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
