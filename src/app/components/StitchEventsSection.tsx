import React from 'react';
import { Box } from '@mui/material';

/**
 * Events section: halftone, ink borders, hard shadows.
 */
const INK = '#1A0F0D';
/** tailwind theme extend primary — stitch.tsx */
const PRIMARY = '#a83100';
const SURFACE = '#fcf6e8';
const SURFACE_CONTAINER = '#eee8d8';
const SURFACE_CONTAINER_HIGH = '#e8e2d1';
const TERTIARY_CONTAINER = '#fecc00';
const ON_TERTIARY_CONTAINER = '#584500';
const INVERSE_PRIMARY = '#ff5718';

const comicPop = {
  clipPath:
    'polygon(0% 15%, 15% 15%, 15% 0%, 85% 0%, 85% 15%, 100% 15%, 100% 85%, 85% 85%, 85% 100%, 15% 100%, 15% 85%, 0% 85%)',
} as const;

const halftoneAfter = (color: string) => ({
  content: '""',
  position: 'absolute' as const,
  inset: 0,
  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
  backgroundSize: '12px 12px',
  color,
  opacity: 0.12,
  pointerEvents: 'none' as const,
});

export type StitchEventsServiceItem = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export type StitchEventsSectionProps = {
  sectionRef?: React.Ref<HTMLDivElement>;
  isDarkMode?: boolean;
  services: StitchEventsServiceItem[];
  onEnlist?: () => void;
  onJoinDossier?: () => void;
  onSecureSpot?: () => void;
  onBookVault?: () => void;
};

function StitchEventsFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,300..700;1,300..700&display=swap');
    `}</style>
  );
}

export function StitchEventsSection({
  sectionRef,
  isDarkMode = false,
  services,
  onEnlist,
  onJoinDossier,
  onSecureSpot,
  onBookVault,
}: StitchEventsSectionProps) {
  const s0 = services[0];
  const s1 = services[1];
  const s2 = services[2];

  const ink = isDarkMode ? '#e8ddd4' : INK;
  const primary = PRIMARY;
  const surface = isDarkMode ? 'rgba(252, 246, 232, 0.08)' : SURFACE;
  const surfaceContainer = isDarkMode ? 'rgba(238, 232, 216, 0.12)' : SURFACE_CONTAINER;
  const pageBg = isDarkMode ? 'rgba(22, 18, 16, 0.97)' : SURFACE;
  const bodyMuted = isDarkMode ? 'rgba(248, 240, 232, 0.78)' : '#312f26';
  const titleColor = isDarkMode ? '#f5ebe3' : INK;

  if (!s0 || !s1 || !s2) {
    return null;
  }

  const cardHover = {
    transition: 'transform 300ms ease, box-shadow 300ms ease',
    '&:hover': {
      transform: 'rotate(0deg) translateY(-8px)',
    },
  };

  return (
    <Box
      ref={sectionRef}
      sx={{
        bgcolor: pageBg,
        color: bodyMuted,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <StitchEventsFonts />
      <Box
        component="main"
        sx={{
          pt: { xs: '5rem', md: '6rem' },
          pb: { xs: '5rem', md: '6rem' },
          px: '1.5rem',
          maxWidth: '80rem',
          mx: 'auto',
        }}
      >
        {/* Header — Events */}
        <Box
          component="header"
          sx={{
            mb: { xs: '3rem', md: '5rem' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'inline-block', position: 'relative', mb: '1rem' }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -16, md: -24 },
                right: { xs: -12, md: -24 },
                bgcolor: TERTIARY_CONTAINER,
                color: ON_TERTIARY_CONTAINER,
                fontWeight: 900,
                py: '0.35rem',
                px: '1rem',
                border: `6px solid ${ink}`,
                ...comicPop,
                transform: 'rotate(12deg)',
                zIndex: 2,
                fontSize: { xs: '1rem', md: '1.25rem' },
                fontStyle: 'italic',
                textTransform: 'uppercase',
              }}
            >
              LIVE!
            </Box>
            <Box
              component="h1"
              sx={{
                m: 0,
                fontSize: { xs: '3.75rem', md: '6rem' },
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                color: isDarkMode ? '#f0e8df' : '#312f26',
                textShadow: `6px 6px 0 ${ink}`,
                transform: 'rotate(-1deg)',
                lineHeight: 1.05,
              }}
            >
              Events
            </Box>
          </Box>
          <Box
            component="p"
            sx={{
              maxWidth: '42rem',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              mt: '1.5rem',
              bgcolor: isDarkMode ? surfaceContainer : SURFACE_CONTAINER_HIGH,
              p: '1rem',
              border: `6px solid ${ink}`,
              boxShadow: `4px 4px 0 0 ${ink}`,
              fontStyle: 'italic',
              color: bodyMuted,
            }}
          >
            Tastings, reservations, and events—straight from our bar to your crew.
          </Box>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
            gap: { xs: '2rem', md: '4rem' },
            alignItems: 'start',
          }}
        >
          {/* Card 1 — col 7 */}
          <Box
            sx={{
              gridColumn: { md: 'span 7' },
              position: 'relative',
              bgcolor: surface,
              border: `6px solid ${ink}`,
              boxShadow: `6px 6px 0 0 ${ink}`,
              transform: 'rotate(-1deg)',
              ...cardHover,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: 280, md: 384 },
                overflow: 'hidden',
                borderBottom: `6px solid ${ink}`,
                '&::after': halftoneAfter('rgba(255, 78, 0, 0.3)'),
              }}
            >
              <Box
                component="img"
                src={s0.image}
                alt={s0.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 24,
                  left: 24,
                  bgcolor: primary,
                  color: '#fff',
                  fontWeight: 900,
                  px: '1rem',
                  py: '0.4rem',
                  border: `6px solid ${ink}`,
                  fontStyle: 'italic',
                  fontSize: { xs: '0.72rem', md: '0.85rem' },
                  lineHeight: 1.15,
                  maxWidth: { xs: '11rem', md: '13rem' },
                  textAlign: 'center',
                  textTransform: 'none',
                  transform: 'rotate(-3deg)',
                  zIndex: 1,
                }}
              >
                Host your own Gathering in our cafe
              </Box>
            </Box>
            <Box sx={{ p: { xs: '1.5rem', md: '2rem' } }}>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  mb: '1rem',
                  fontSize: { xs: '2rem', md: '2.75rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  color: titleColor,
                  textShadow: `2px 2px 0 ${primary}`,
                  lineHeight: 1.1,
                }}
              >
                {s0.title}
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  mb: '2rem',
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  fontWeight: 500,
                  lineHeight: 1.35,
                  maxWidth: '40rem',
                }}
              >
                {s0.description}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: '1.25rem',
                  mb: '2rem',
                }}
              >
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: surfaceContainer,
                    p: '1rem',
                    border: `6px solid ${ink}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transform: 'rotate(1deg)',
                  }}
                >
                  <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Schedule:
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: primary, fontStyle: 'italic', fontSize: '1.05rem' }}
                  >
                    OCT 14 // 18:00
                  </Box>
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    bgcolor: surfaceContainer,
                    p: '1rem',
                    border: `6px solid ${ink}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Admission:
                  </Box>
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: primary, fontStyle: 'italic', fontSize: '1.05rem' }}
                  >
                    $45.00
                  </Box>
                </Box>
              </Box>
              <Box
                component="button"
                type="button"
                onClick={onEnlist}
                sx={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  bgcolor: primary,
                  color: '#fff',
                  py: '1.25rem',
                  fontWeight: 900,
                  fontSize: { xs: '1.35rem', md: '1.75rem' },
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  border: `6px solid ${ink}`,
                  boxShadow: `6px 6px 0 0 ${ink}`,
                  textAlign: 'center',
                  '&:active': {
                    boxShadow: 'none',
                    transform: 'translate(6px, 6px)',
                  },
                }}
              >
                Enlist now
              </Box>
            </Box>
          </Box>

          {/* Card 2 — col 5 */}
          <Box
            sx={{
              gridColumn: { md: 'span 5' },
              position: 'relative',
              bgcolor: surface,
              border: `6px solid ${ink}`,
              boxShadow: `6px 6px 0 0 ${ink}`,
              transform: 'rotate(2deg)',
              ...cardHover,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: { xs: 220, md: 288 },
                overflow: 'hidden',
                borderBottom: `6px solid ${ink}`,
                '&::after': halftoneAfter(isDarkMode ? 'rgba(232, 221, 212, 0.15)' : 'rgba(26, 15, 13, 0.2)'),
              }}
            >
              <Box
                component="img"
                src={s1.image}
                alt={s1.title}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  bgcolor: TERTIARY_CONTAINER,
                  color: ON_TERTIARY_CONTAINER,
                  fontWeight: 900,
                  px: '0.75rem',
                  py: '0.2rem',
                  border: `6px solid ${ink}`,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  transform: 'rotate(6deg)',
                  fontSize: '0.85rem',
                  zIndex: 1,
                }}
              >
                Deep Dive
              </Box>
            </Box>
            <Box sx={{ p: { xs: '1.25rem', md: '1.5rem' } }}>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  mb: '0.5rem',
                  fontSize: { xs: '1.5rem', md: '1.85rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  color: titleColor,
                  lineHeight: 1.15,
                }}
              >
                {s1.title}
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  mb: '1.5rem',
                  fontWeight: 500,
                  lineHeight: 1.35,
                  fontSize: '1rem',
                }}
              >
                {s1.description}
              </Box>
              <Box
                sx={{
                  mb: '2rem',
                  bgcolor: surfaceContainer,
                  p: '1rem',
                  border: `6px solid ${ink}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box component="span" sx={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Date:
                  </Box>
                  <Box component="span" sx={{ fontWeight: 700, color: primary, fontStyle: 'italic' }}>
                    OCT 21 // 19:30
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box component="span" sx={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    Fee:
                  </Box>
                  <Box component="span" sx={{ fontWeight: 700, color: primary, fontStyle: 'italic' }}>
                    $30.00
                  </Box>
                </Box>
              </Box>
              <Box
                component="button"
                type="button"
                onClick={onJoinDossier}
                sx={{
                  all: 'unset',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  display: 'block',
                  width: '100%',
                  bgcolor: isDarkMode ? '#2a201c' : INK,
                  color: SURFACE,
                  py: '1rem',
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  border: `4px solid ${primary}`,
                  boxShadow: `6px 6px 0 0 ${primary}`,
                  textAlign: 'center',
                  '&:active': {
                    boxShadow: 'none',
                    transform: 'translate(4px, 4px)',
                  },
                }}
              >
                Join the dossier
              </Box>
            </Box>
          </Box>

          {/* Card 3 — wide */}
          <Box
            sx={{
              gridColumn: { xs: '1 / -1', lg: '4 / -1' },
              mt: { xs: '0.5rem', md: '1rem' },
              position: 'relative',
              bgcolor: surface,
              border: `6px solid ${ink}`,
              boxShadow: `6px 6px 0 0 ${ink}`,
              transform: 'rotate(-1deg)',
              ...cardHover,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: { xs: '100%', md: '33.333%' },
                  minHeight: { xs: 220, md: 'auto' },
                  overflow: 'hidden',
                  borderBottom: { xs: `6px solid ${ink}`, md: 'none' },
                  borderRight: { xs: 'none', md: `6px solid ${ink}` },
                  '&::after': halftoneAfter('rgba(255, 78, 0, 0.2)'),
                }}
              >
                <Box
                  component="img"
                  src={s2.image}
                  alt={s2.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: { xs: 220, md: 280 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Box>
              <Box sx={{ p: { xs: '1.5rem', md: '2rem' }, flex: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    mb: '1rem',
                  }}
                >
                  <Box
                    component="h2"
                    sx={{
                      m: 0,
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.03em',
                      color: titleColor,
                      lineHeight: 1.1,
                      flex: '1 1 12rem',
                    }}
                  >
                    {s2.title}
                  </Box>
                  <Box
                    sx={{
                      bgcolor: INVERSE_PRIMARY,
                      color: '#fff',
                      fontWeight: 900,
                      px: '1.25rem',
                      py: '0.35rem',
                      border: `6px solid ${ink}`,
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                      ...comicPop,
                      fontSize: '0.9rem',
                      flexShrink: 0,
                    }}
                  >
                    Events
                  </Box>
                </Box>
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    mb: '2rem',
                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                    fontWeight: 500,
                    lineHeight: 1.35,
                  }}
                >
                  {s2.description}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'center' },
                    gap: '1.5rem',
                  }}
                >
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      gap: '2rem',
                      bgcolor: `${primary}1a`,
                      p: '1rem',
                      border: `2px dashed ${ink}`,
                      width: '100%',
                    }}
                  >
                    <Box>
                      <Box
                        component="span"
                        sx={{
                          display: 'block',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: isDarkMode ? 'rgba(245,235,225,0.55)' : 'rgba(26,15,13,0.55)',
                        }}
                      >
                        Timeframe
                      </Box>
                      <Box
                        component="span"
                        sx={{ fontSize: '1.35rem', fontWeight: 900, color: primary, fontStyle: 'italic' }}
                      >
                        OCT 28 // 17:00
                      </Box>
                    </Box>
                    <Box>
                      <Box
                        component="span"
                        sx={{
                          display: 'block',
                          fontSize: '0.7rem',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                          color: isDarkMode ? 'rgba(245,235,225,0.55)' : 'rgba(26,15,13,0.55)',
                        }}
                      >
                        Contribution
                      </Box>
                      <Box
                        component="span"
                        sx={{ fontSize: '1.35rem', fontWeight: 900, color: primary, fontStyle: 'italic' }}
                      >
                        $25.00
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={onSecureSpot}
                    sx={{
                      all: 'unset',
                      boxSizing: 'border-box',
                      cursor: 'pointer',
                      bgcolor: primary,
                      color: '#fff',
                      px: { xs: '1.5rem', sm: '2rem' },
                      py: '1.1rem',
                      fontWeight: 900,
                      fontSize: { xs: '1.2rem', md: '1.35rem' },
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                      border: `6px solid ${ink}`,
                      boxShadow: `6px 6px 0 0 ${ink}`,
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      width: { xs: '100%', sm: 'auto' },
                      '&:hover': { transform: 'scale(1.03)' },
                      '&:active': { boxShadow: 'none', transform: 'translate(4px, 4px) scale(1)' },
                    }}
                  >
                    Secure spot
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Callout */}
        <Box
          sx={{
            mt: { xs: '4rem', md: '6rem' },
            bgcolor: primary,
            p: { xs: '1.5rem', md: '2rem 3rem' },
            border: `6px solid ${ink}`,
            boxShadow: `6px 6px 0 0 ${ink}`,
            transform: 'rotate(1deg)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
          }}
        >
          <Box sx={{ position: 'relative', maxWidth: { md: '48rem' } }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -48, md: -56 },
                left: { xs: -4, md: -24 },
                bgcolor: SURFACE,
                color: ink,
                border: `6px solid ${ink}`,
                fontWeight: 900,
                px: '0.75rem',
                py: '0.25rem',
                textTransform: 'uppercase',
                transform: 'rotate(-12deg)',
                fontStyle: 'italic',
                fontSize: '0.75rem',
              }}
            >
              Classified
            </Box>
            <Box
              component="h3"
              sx={{
                m: 0,
                fontSize: { xs: '1.75rem', md: 'clamp(2rem, 4vw, 3.25rem)' },
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: '#fff',
                textShadow: `4px 4px 0 ${ink}`,
                lineHeight: 1.1,
                pt: { xs: '1.5rem', md: 0 },
              }}
            >
              Host your own Gathering in our cafe
            </Box>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={onBookVault}
            sx={{
              all: 'unset',
              boxSizing: 'border-box',
              cursor: 'pointer',
              bgcolor: isDarkMode ? '#2a201c' : INK,
              color: '#fff',
              px: { xs: '1.5rem', md: '2.5rem' },
              py: { xs: '1.25rem', md: '1.75rem' },
              fontWeight: 900,
              fontSize: { xs: '1.35rem', md: '1.65rem' },
              textTransform: 'uppercase',
              fontStyle: 'italic',
              border: '6px solid #fff',
              boxShadow: '6px 6px 0 0 #fff',
              flexShrink: 0,
              textAlign: 'center',
              '&:hover': { transform: 'skewX(-6deg)' },
            }}
          >
            Book the vault
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
