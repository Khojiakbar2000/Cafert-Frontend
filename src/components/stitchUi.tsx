import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { SxProps, Theme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const GROTESK = '"Space Grotesk", system-ui, sans-serif';

/** Pulp / comic-book palette — same hex values as your static checkout HTML mockup (Space Grotesk / #FF4E00 / #1A0F0D). */
export const STITCH_THEME = {
  ink: '#1A0F0D',
  surface: '#FDF6E8',
  primary: '#FF4E00',
  onPrimary: '#FDF6E8',
  primaryContainer: '#FF9E6C',
  tertiaryContainer: '#F4D35E',
  onTertiary: '#1A0F0D',
  surfaceContainer: '#EDE3D1',
  navbarBorderPx: 6,
} as const;

export const STITCH_PULP_THEME = {
  ink: STITCH_THEME.ink,
  cream: STITCH_THEME.surface,
  surfaceVariant: STITCH_THEME.surfaceContainer,
  orange: STITCH_THEME.primary,
  grotesk: GROTESK,
  error: '#C62828',
} as const;

export type StitchComicStripAccent = 'primary' | 'tertiary' | 'primaryDark';

export type StitchComicStripItem = {
  imageSrc: string;
  imageAlt: string;
  label: string;
  accent?: StitchComicStripAccent;
};

function accentBg(accent: StitchComicStripAccent, isDark: boolean): string {
  if (isDark) return 'rgba(252, 246, 232, 0.14)';
  switch (accent) {
    case 'primary':
      return STITCH_THEME.primary;
    case 'tertiary':
      return STITCH_THEME.tertiaryContainer;
    case 'primaryDark':
      return '#CC3D00';
    default:
      return STITCH_THEME.surfaceContainer;
  }
}

export function stitchComicStripGridRotation(index: number): string {
  const deg = [-2.5, 1.8, -1.6, 2.2][index % 4];
  return `rotate(${deg}deg)`;
}

export function getStitchStripCardShellSx(isDarkMode: boolean): SxProps<Theme> {
  const ink = isDarkMode ? '#f5ebe3' : STITCH_THEME.ink;
  return {
    borderRadius: 0,
    border: `4px solid ${ink}`,
    boxShadow: `6px 6px 0 0 ${ink}`,
    backgroundColor: isDarkMode ? 'rgba(42, 38, 32, 0.95)' : STITCH_THEME.surface,
    backdropFilter: 'none',
    WebkitBackdropFilter: 'none',
  };
}

export function getStitchStripCardContentBandSx(isDarkMode: boolean): SxProps<Theme> {
  const ink = isDarkMode ? '#f5ebe3' : STITCH_THEME.ink;
  return {
    position: 'relative',
    borderTop: `4px solid ${ink}`,
    bgcolor: isDarkMode ? 'rgba(26, 22, 18, 0.55)' : STITCH_THEME.surfaceContainer,
  };
}

export function getStitchComicStripLabelSx(
  accent: StitchComicStripAccent,
  isDarkMode: boolean,
): SxProps<Theme> {
  const ink = isDarkMode ? '#f5ebe3' : STITCH_THEME.ink;
  return {
    position: 'absolute',
    bottom: { xs: 12, md: 16 },
    left: { xs: 12, md: 16 },
    zIndex: 2,
    px: 1.25,
    py: 0.5,
    fontFamily: GROTESK,
    fontWeight: 900,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    fontSize: { xs: '0.68rem', sm: '0.72rem' },
    letterSpacing: '0.08em',
    color: isDarkMode ? STITCH_THEME.ink : STITCH_THEME.onPrimary,
    bgcolor: accentBg(accent, isDarkMode),
    border: `3px solid ${ink}`,
    boxShadow: `4px 4px 0 0 ${ink}`,
    transform: 'rotate(-8deg)',
    maxWidth: 'calc(100% - 48px)',
  };
}

const GRAIN =
  'radial-gradient(rgba(26,15,13,0.07) 1px, transparent 1px) 0 0 / 4px 4px';

export type StitchPageShellProps = {
  isDarkMode: boolean;
  children: React.ReactNode;
};

export function StitchPageShell({ isDarkMode, children }: StitchPageShellProps) {
  const bg = isDarkMode ? '#1a1614' : STITCH_THEME.surface;
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: bg,
        color: isDarkMode ? '#f5ebe3' : STITCH_THEME.ink,
        fontFamily: GROTESK,
        position: 'relative',
        '&::before': {
          content: '""',
          pointerEvents: 'none',
          position: 'fixed',
          inset: 0,
          backgroundImage: GRAIN,
          opacity: isDarkMode ? 0.35 : 1,
          mixBlendMode: isDarkMode ? 'soft-light' : 'multiply',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </Box>
    </Box>
  );
}

export function StitchHandPaintedHero() {
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        py: { xs: 4, md: 6 },
        px: { xs: 2, md: 3 },
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Typography
        sx={{
          fontFamily: GROTESK,
          fontWeight: 900,
          fontStyle: 'italic',
          textTransform: 'uppercase',
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
          lineHeight: 0.95,
          letterSpacing: '-0.04em',
          color: STITCH_THEME.primary,
          textShadow: `4px 4px 0 ${STITCH_THEME.ink}`,
        }}
      >
        The Board
      </Typography>
      <Typography
        sx={{
          mt: 1,
          fontFamily: GROTESK,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          fontSize: '0.75rem',
          color: STITCH_THEME.ink,
        }}
      >
        Live menu · Archive picks
      </Typography>
    </Box>
  );
}

/** Full-viewport kinetic hero from `stitch.md` — parallax-style bg, halftone, ink-outline CTAs. */
export type StitchKineticProductsHeroProps = {
  isDarkMode?: boolean;
  heroImageSrc?: string;
};

export function StitchKineticProductsHero({
  isDarkMode = false,
  heroImageSrc = '/coffeemaker.png',
}: StitchKineticProductsHeroProps) {
  const history = useHistory();
  const ink = STITCH_THEME.ink;
  const orange = STITCH_THEME.primary;

  const scrollToShop = () => {
    document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        height: '100vh',
        minHeight: '520px',
        maxHeight: '1200px',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        pb: { xs: '5rem', md: '8rem' },
        color: '#fff',
      }}
    >
      <style>{`
        @keyframes stitchSubtleParallax {
          from { transform: scale(1.1) translateY(-2%); }
          to { transform: scale(1.1) translateY(2%); }
        }
      `}</style>

      {/* Background */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <Box
          component="img"
          src={heroImageSrc}
          alt=""
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: isDarkMode ? 'brightness(0.55) contrast(1.1)' : 'brightness(0.85) contrast(1.1)',
            animation: 'stitchSubtleParallax 20s ease-in-out infinite alternate',
            transform: 'translateZ(0)',
            willChange: 'transform',
          }}
        />
        {/* Halftone */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(${ink} 10%, transparent 11%)`,
            backgroundSize: '8px 8px',
            opacity: isDarkMode ? 0.2 : 0.3,
            pointerEvents: 'none',
          }}
        />
        {/* Gradient overlay */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isDarkMode
              ? `linear-gradient(to top, ${ink} 55%, transparent)`
              : `linear-gradient(to top, rgba(26, 15, 13, 0.4), transparent)`,
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Copy + CTAs */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '80rem',
          mx: 'auto',
          width: '100%',
          px: { xs: 4, md: 6 },
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ maxWidth: '56rem' }}>
          <Box
            component="span"
            sx={{
              display: 'inline-block',
              mb: 2,
              bgcolor: orange,
              px: 2,
              py: 0.5,
              border: `2px solid ${ink}`,
              boxShadow: `4px 4px 0 0 ${ink}`,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontFamily: GROTESK,
                fontWeight: 900,
                color: '#fff',
                fontSize: '0.75rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontStyle: 'italic',
              }}
            >
              Est. 1982 — Kinetic Roastery
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              m: 0,
              mb: 4,
              fontFamily: GROTESK,
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              lineHeight: 0.9,
              fontSize: { xs: '3rem', md: '4.5rem', lg: '6rem' },
              letterSpacing: '-0.04em',
              color: '#fff',
              textShadow: `6px 6px 0 ${ink}`,
            }}
          >
            The Perfect Blend of{' '}
            <Box component="span" sx={{ color: orange }}>
              Tradition
            </Box>{' '}
            and Innovation
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 3,
            }}
          >
            <Button
              type="button"
              onClick={scrollToShop}
              sx={{
                px: 4,
                py: 2,
                bgcolor: orange,
                color: '#fff',
                fontFamily: GROTESK,
                fontWeight: 900,
                fontSize: '1.25rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                border: `2px solid ${ink}`,
                borderRadius: 0,
                boxShadow: `4px 4px 0 0 ${ink}`,
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                '&:hover': {
                  bgcolor: orange,
                  transform: 'translate(-4px, -4px)',
                  boxShadow: `8px 8px 0 0 ${ink}`,
                },
                '&:active': {
                  transform: 'translate(0, 0)',
                  boxShadow: `4px 4px 0 0 ${ink}`,
                },
              }}
            >
              Explore Our Menu
            </Button>
            <Button
              type="button"
              onClick={() => history.push('/help')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                color: '#fff',
                fontFamily: GROTESK,
                fontWeight: 800,
                fontSize: '1.125rem',
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                textDecoration: 'none',
                bgcolor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                p: 0,
                '&:hover': {
                  color: orange,
                  bgcolor: 'transparent',
                  '& .MuiBox-root': { transform: 'scale(1.1)' },
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                  border: '2px solid #fff',
                  borderRadius: '50%',
                  transition: 'transform 0.2s ease',
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 28 }} />
              </Box>
              Our Story
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Scroll indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          opacity: 0.5,
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            width: '2px',
            height: 48,
            bgcolor: 'rgba(255,255,255,0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '50%',
              bgcolor: orange,
              animation: 'stitchBounce 1.2s ease-in-out infinite',
              '@keyframes stitchBounce': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(100%)' },
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export type StitchBrutalistTopNavProps = {
  isDarkMode: boolean;
};

export function StitchBrutalistTopNav({ isDarkMode }: StitchBrutalistTopNavProps) {
  const ink = isDarkMode ? '#f5ebe3' : STITCH_THEME.ink;
  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/coffees', label: 'Menu' },
  ];
  return (
    <Box
      component="nav"
      sx={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 1, sm: 2 },
        py: 2,
        px: 2,
        borderBottom: `4px solid ${ink}`,
        bgcolor: isDarkMode ? 'rgba(26,22,18,0.9)' : STITCH_THEME.surfaceContainer,
      }}
    >
      {links.map(({ to, label }) => (
        <Button
          key={to}
          component={Link}
          to={to}
          sx={{
            fontFamily: GROTESK,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: ink,
            borderRadius: 0,
            border: `2px solid ${ink}`,
            px: 2,
            '&:hover': { bgcolor: STITCH_THEME.primary, color: STITCH_THEME.onPrimary },
          }}
        >
          {label}
        </Button>
      ))}
    </Box>
  );
}

export type StitchMainNoNavProps = {
  isDarkMode: boolean;
  topBar?: React.ReactNode;
  comicProps?: {
    continuedTitle: string;
    continuedSubtitle: string;
    continuedHref: string;
  };
};

export function StitchMainNoNav({
  isDarkMode,
  topBar,
  comicProps,
}: StitchMainNoNavProps) {
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: isDarkMode ? '#1a1614' : STITCH_THEME.surface,
        color: isDarkMode ? '#f5ebe3' : STITCH_THEME.ink,
        fontFamily: GROTESK,
        position: 'relative',
      }}
    >
      {topBar}
      <Box sx={{ maxWidth: '90rem', mx: 'auto', px: { xs: 2, md: 3 } }}>
        {comicProps && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Button
              component={Link}
              to={comicProps.continuedHref}
              variant="contained"
              sx={{
                borderRadius: 0,
                fontFamily: GROTESK,
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                px: 4,
                py: 1.5,
                bgcolor: STITCH_THEME.primary,
                color: STITCH_THEME.onPrimary,
                boxShadow: `6px 6px 0 0 ${isDarkMode ? '#f5ebe3' : STITCH_THEME.ink}`,
                '&:hover': { bgcolor: '#e04300' },
              }}
            >
              <Box component="span" sx={{ display: 'block', fontSize: '0.7rem', opacity: 0.95 }}>
                {comicProps.continuedTitle}
              </Box>
              <Box component="span" sx={{ display: 'block', fontSize: '1rem', mt: 0.5 }}>
                {comicProps.continuedSubtitle}
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export type StitchFindYourStationSectionProps = {
  isDarkMode: boolean;
};

export function StitchFindYourStationSection({ isDarkMode }: StitchFindYourStationSectionProps) {
  const ink = isDarkMode ? '#f5ebe3' : STITCH_THEME.ink;
  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        py: { xs: 5, md: 7 },
        px: { xs: 2, md: 4 },
        bgcolor: isDarkMode ? 'rgba(26,22,18,0.94)' : STITCH_THEME.surfaceContainer,
        borderTop: `4px solid ${ink}`,
        borderBottom: `4px solid ${ink}`,
      }}
    >
      <Box sx={{ maxWidth: '48rem', mx: 'auto', textAlign: 'center' }}>
        <LocationOnIcon sx={{ fontSize: 40, color: STITCH_THEME.primary, mb: 1 }} />
        <Typography
          sx={{
            fontFamily: GROTESK,
            fontWeight: 900,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            fontSize: { xs: '1.5rem', md: '2rem' },
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          Find your station
        </Typography>
        <Typography
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.6,
            mb: 3,
            color: isDarkMode ? 'rgba(245,235,227,0.8)' : '#4a423c',
          }}
        >
          Pull up a stool — we’re pouring daily. Hit the map for hours and the fastest route in.
        </Typography>
        <Button
          component={Link}
          to="/help"
          variant="outlined"
          sx={{
            borderRadius: 0,
            borderWidth: 3,
            borderColor: ink,
            color: ink,
            fontFamily: GROTESK,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            px: 3,
            boxShadow: `4px 4px 0 0 ${ink}`,
            '&:hover': {
              borderWidth: 3,
              borderColor: ink,
              bgcolor: STITCH_THEME.primary,
              color: STITCH_THEME.onPrimary,
            },
          }}
        >
          Hours & directions
        </Button>
      </Box>
    </Box>
  );
}
