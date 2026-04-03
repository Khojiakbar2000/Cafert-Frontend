import React from 'react';
import { Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

/**
 * stitch.tsx — tokens from <style>: .ink-bleed-border (6px), .hard-shadow (6px), .hard-shadow-sm (4px)
 * Sections: py-24 px-6, gap-16, text-6xl/md:text-8xl hero scale (Tailwind defaults).
 */
const INK = '#1A0F0D';
const PRIMARY = '#a83100';
const SURFACE_BRIGHT = '#fcf6e8';
const SURFACE = '#fcf6e8';
const SURFACE_CONTAINER_HIGH = '#e8e2d1';
const SURFACE_CONTAINER_HIGHEST = '#e3ddcb';
const SURFACE_CONTAINER_LOW = '#f6f0e1';
const SURFACE_CONTAINER = '#eee8d8';
const TERTIARY_CONTAINER = '#fecc00';
const ON_SURFACE = '#312f26';
const ON_SURFACE_VARIANT = '#5f5b51';
const ON_SURFACE_TERT = '#584500';

const stitchHardShadowSm = (k: string) => `4px 4px 0 0 ${k}`;
const stitchHardShadow = (k: string) => `6px 6px 0 0 ${k}`;

/** Menu cards / panels — ink-bleed-border + hard-shadow-sm */
const stitchCardSm = (inkColor: string) => ({
  border: `6px solid ${inkColor}`,
  boxShadow: stitchHardShadowSm(inkColor),
});

/** Hero frame / emphasis — ink-bleed-border + hard-shadow */
const stitchCardLg = (inkColor: string) => ({
  border: `6px solid ${inkColor}`,
  boxShadow: stitchHardShadow(inkColor),
});

/** .ben-day-dots */
const halftoneBlock = {
  backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
  backgroundSize: '12px 12px',
  opacity: 0.05,
  pointerEvents: 'none' as const,
};

export type StitchArchiveTestimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
};

export type StitchArchiveTestimonialsSectionProps = {
  sectionRef?: React.Ref<HTMLDivElement>;
  isDarkMode?: boolean;
  testimonials: StitchArchiveTestimonial[];
  onSubmitReview?: () => void;
};

function StitchFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,400..700;1,400..700&display=swap');
    `}</style>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

export function StitchArchiveTestimonialsSection({
  sectionRef,
  isDarkMode = false,
  testimonials,
  onSubmitReview,
}: StitchArchiveTestimonialsSectionProps) {
  if (testimonials.length === 0) {
    return null;
  }
  const pad = [...testimonials];
  while (pad.length < 6) {
    const last = pad[pad.length - 1];
    pad.push({
      ...last,
      id: `${last.id}-dup-${pad.length}`,
    });
  }
  const [t0, t1, t2, t3, t4, t5] = pad;
  const ink = isDarkMode ? '#e8ddd4' : INK;
  const primary = PRIMARY;
  const surfaceBright = isDarkMode ? 'rgba(252, 246, 232, 0.07)' : SURFACE_BRIGHT;
  const surfaceHigh = isDarkMode ? 'rgba(227, 221, 203, 0.12)' : SURFACE_CONTAINER_HIGHEST;
  const surfaceLow = isDarkMode ? 'rgba(246, 240, 225, 0.1)' : SURFACE_CONTAINER_LOW;
  const surfaceMain = isDarkMode ? 'rgba(252, 246, 232, 0.05)' : SURFACE;
  const onSurface = isDarkMode ? '#f2ece4' : ON_SURFACE;
  const onSurfaceVar = isDarkMode ? 'rgba(242, 236, 228, 0.72)' : ON_SURFACE_VARIANT;
  const pageBg = isDarkMode ? 'rgba(18, 14, 12, 0.98)' : SURFACE_BRIGHT;
  const yellow = TERTIARY_CONTAINER;

  const starRow = (count: number, max = 5, size: 'sm' | 'md' = 'sm') => (
    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
      {Array.from({ length: max }).map((_, i) => {
        const Icon = i < count ? StarIcon : StarBorderIcon;
        return (
          <Icon
            key={i}
            sx={{
              fontSize: size === 'sm' ? 22 : 28,
              color: i < count ? primary : isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(49,47,38,0.25)',
            }}
          />
        );
      })}
    </Box>
  );

  return (
    <Box
      ref={sectionRef}
      component="section"
      sx={{
        bgcolor: pageBg,
        color: onSurface,
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        py: { xs: '5rem', md: '6rem' },
        px: '1.5rem',
      }}
    >
      <StitchFonts />
      <Box sx={{ maxWidth: '80rem', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: { xs: '3rem', md: '5rem' }, position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -32, md: -48 },
              left: { xs: -20, md: -40 },
              width: { xs: 128, md: 160 },
              height: { xs: 128, md: 160 },
              color: yellow,
              ...halftoneBlock,
            }}
          />
          <Box
            component="h1"
            sx={{
              m: 0,
              mb: '1.25rem',
              fontSize: { xs: '3.75rem', md: '6rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              letterSpacing: '-0.045em',
              color: onSurface,
              textShadow: `6px 6px 0 ${ink}`,
              transform: 'rotate(-1deg)',
              lineHeight: 1,
            }}
          >
            Voices From{' '}
            <Box component="span" sx={{ color: primary }}>
              The Archive
            </Box>
          </Box>
          <Box
            component="p"
            sx={{
              m: 0,
              maxWidth: '42rem',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700,
              color: onSurface,
              bgcolor: isDarkMode ? 'rgba(232, 226, 209, 0.12)' : SURFACE_CONTAINER_HIGH,
              p: '1rem',
              ...stitchCardSm(ink),
            }}
          >
            Unredacted transmissions from our most devoted alchemists and caffeine operatives.
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
          {/* Transmission 1 — large (hero image + body, stitch h-96 + p-8) */}
          <Box sx={{ gridColumn: { md: 'span 7' }, transform: { md: 'rotate(0.5deg)' } }}>
            <Box
              sx={{
                bgcolor: surfaceBright,
                position: 'relative',
                overflow: 'hidden',
                ...stitchCardLg(ink),
                transition: 'transform 200ms',
                '&:hover': { transform: { md: 'rotate(0deg)' } },
                '&:hover .stitch-t1-halftone': { opacity: 0.35 },
                '&:hover .stitch-t1-hero': { filter: 'grayscale(0) contrast(1.08)' },
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 280, sm: 320, md: 384 },
                  overflow: 'hidden',
                  borderBottom: `6px solid ${ink}`,
                }}
              >
                <Box
                  component="img"
                  className="stitch-t1-hero"
                  src={t0.avatar}
                  alt=""
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    filter: 'grayscale(1) contrast(1.12)',
                    transition: 'filter 300ms',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    color: primary,
                    opacity: 0.28,
                    ...halftoneBlock,
                  }}
                />
                <Box
                  className="stitch-t1-halftone"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    p: 2,
                    width: 112,
                    height: 112,
                    color: primary,
                    opacity: 0.22,
                    ...halftoneBlock,
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 24,
                    left: 24,
                    bgcolor: primary,
                    color: SURFACE_BRIGHT,
                    fontWeight: 900,
                    px: '0.85rem',
                    py: '0.45rem',
                    border: `6px solid ${ink}`,
                    textTransform: 'none',
                    fontStyle: 'italic',
                    fontSize: { xs: '0.68rem', sm: '0.78rem', md: '0.88rem' },
                    lineHeight: 1.15,
                    maxWidth: { xs: '10.5rem', md: '12.5rem' },
                    textAlign: 'center',
                    transform: 'rotate(-3deg)',
                    zIndex: 2,
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
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.03em',
                    color: onSurface,
                    lineHeight: 1.05,
                  }}
                >
                  {t0.author}
                </Box>
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    mb: 1,
                    fontWeight: 700,
                    color: primary,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    letterSpacing: '0.08em',
                  }}
                >
                  Designation: {t0.role || 'Guest'}
                </Box>
                {starRow(t0.rating)}
                <Box
                  component="blockquote"
                  sx={{
                    m: 0,
                    mt: '1.5rem',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: onSurface,
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{t0.quote}&rdquo;
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Transmission 2 — speech bubble */}
          <Box
            sx={{
              gridColumn: { md: 'span 5' },
              mt: { md: '3rem' },
              transform: { md: 'rotate(-1deg)' },
            }}
          >
            <Box
              sx={{
                bgcolor: surfaceHigh,
                p: '1.5rem',
                position: 'relative',
                ...stitchCardSm(ink),
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -22,
                  left: 48,
                  width: 0,
                  height: 0,
                  borderLeft: '20px solid transparent',
                  borderRight: '20px solid transparent',
                  borderTop: `28px solid ${onSurface}`,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -18,
                  left: 50,
                  width: 0,
                  height: 0,
                  borderLeft: '18px solid transparent',
                  borderRight: '18px solid transparent',
                  borderTop: `24px solid ${isDarkMode ? 'rgba(227, 221, 203, 0.25)' : SURFACE_CONTAINER_HIGHEST}`,
                  zIndex: 1,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Box
                  component="img"
                  src={t1.avatar}
                  alt=""
                  sx={{
                    width: 56,
                    height: 56,
                    objectFit: 'cover',
                    border: `6px solid ${onSurface}`,
                    filter: 'grayscale(1)',
                    boxShadow: stitchHardShadowSm(ink),
                  }}
                />
                <Box>
                  <Box
                    component="h3"
                    sx={{
                      m: 0,
                      fontSize: { xs: '1.125rem', md: '1.5rem' },
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: onSurface,
                      lineHeight: 1.1,
                    }}
                  >
                    {t1.author}
                  </Box>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      fontWeight: 700,
                      color: primary,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      letterSpacing: '0.06em',
                    }}
                  >
                    Designation: {t1.role || 'Guest'}
                  </Box>
                </Box>
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 500,
                  lineHeight: 1.375,
                }}
              >
                &ldquo;{t1.quote}&rdquo;
              </Box>
            </Box>
          </Box>

          {/* Transmission 3 — orange pop */}
          <Box sx={{ gridColumn: { md: 'span 4' }, transform: { md: 'rotate(1deg)' } }}>
            <Box
              sx={{
                bgcolor: primary,
                p: { xs: '1.5rem', md: '1.5rem' },
                border: `6px solid ${ink}`,
                boxShadow: `8px 8px 0 0 ${yellow}`,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
                <FormatQuoteIcon sx={{ color: SURFACE_BRIGHT, fontSize: { xs: 44, md: 52 } }} />
                <Box
                  sx={{
                    bgcolor: yellow,
                    color: ON_SURFACE_TERT,
                    px: 1,
                    py: 0.35,
                    fontWeight: 900,
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    textTransform: 'uppercase',
                    transform: 'rotate(-12deg)',
                    border: `6px solid ${onSurface}`,
                  }}
                >
                  Transmission: 092
                </Box>
              </Box>
              <Box
                component="p"
                sx={{
                  m: 0,
                  color: SURFACE_BRIGHT,
                  fontWeight: 700,
                  fontSize: { xs: '1.15rem', md: '1.35rem' },
                  mb: 3,
                  lineHeight: 1.35,
                }}
              >
                &ldquo;{t2.quote}&rdquo;
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: 44, md: 48 },
                    height: { xs: 44, md: 48 },
                    bgcolor: onSurface,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: SURFACE_BRIGHT,
                    fontWeight: 900,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                  }}
                >
                  {initials(t2.author)}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 900,
                    color: SURFACE_BRIGHT,
                    textTransform: 'uppercase',
                    fontSize: { xs: '0.9rem', md: '0.95rem' },
                    letterSpacing: '0.02em',
                  }}
                >
                  {t2.author} // Operative
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Transmission 4 — inset grid */}
          <Box
            sx={{
              gridColumn: { md: 'span 8' },
              mt: { md: '-2rem' },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: '2rem',
              }}
            >
              <Box
                sx={{
                  bgcolor: surfaceLow,
                  p: '1.5rem',
                  ...stitchCardSm(ink),
                  transform: { md: 'rotate(-0.5deg)' },
                  transition: 'transform 200ms',
                  '&:hover': { transform: { md: 'rotate(0deg)' } },
                }}
              >
                <Box sx={{ color: primary, display: 'flex', mb: 1.5 }}>{starRow(t3.rating, 5, 'md')}</Box>
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    fontWeight: 700,
                    color: onSurface,
                    lineHeight: 1.35,
                    mb: 2,
                    fontStyle: 'italic',
                    fontSize: { xs: '1.05rem', md: '1.2rem' },
                  }}
                >
                  &ldquo;{t3.quote}&rdquo;
                </Box>
                <Box sx={{ borderTop: `2px solid ${onSurface}`, pt: 2 }}>
                  <Box
                    component="p"
                    sx={{
                      m: 0,
                      fontSize: { xs: '0.75rem', md: '0.8rem' },
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      color: onSurfaceVar,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {t3.author} / {t3.role || 'Daily Brew Agent'}
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  bgcolor: surfaceMain,
                p: '1.5rem',
                ...stitchCardSm(ink),
                  transform: { md: 'rotate(1.2deg)' },
                  transition: 'transform 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  '&:hover': { transform: { md: 'rotate(0deg)' } },
                }}
              >
                <Box
                  sx={{
                    width: { xs: 72, md: 80 },
                    height: { xs: 72, md: 80 },
                    bgcolor: yellow,
                    border: `6px solid ${onSurface}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                    transform: 'rotate(12deg)',
                  }}
                >
                  <LocalCafeIcon sx={{ color: onSurface, fontSize: { xs: 40, md: 44 } }} />
                </Box>
                <Box
                  component="h4"
                  sx={{
                    m: 0,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontSize: { xs: '1.5rem', md: '1.5rem' },
                    color: onSurface,
                    fontStyle: 'italic',
                  }}
                >
                  Join the Ranks
                </Box>
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    mt: 1.5,
                    mb: 2.5,
                    fontSize: { xs: '0.95rem', md: '1rem' },
                    fontWeight: 700,
                    color: onSurfaceVar,
                    px: 1,
                    lineHeight: 1.4,
                  }}
                >
                  Have your transmission heard across the archive.
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={onSubmitReview}
                  sx={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: onSubmitReview ? 'pointer' : 'default',
                    bgcolor: primary,
                    color: SURFACE_BRIGHT,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    px: '1.5rem',
                    py: '0.5rem',
                    border: `6px solid ${onSurface}`,
                    boxShadow: stitchHardShadowSm(ink),
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    opacity: onSubmitReview ? 1 : 0.85,
                    '&:hover': onSubmitReview
                      ? { transform: 'translate(2px, 2px)', boxShadow: `2px 2px 0 0 ${ink}` }
                      : {},
                  }}
                >
                  Submit Review
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Transmission 5 — full width */}
          <Box
            sx={{
              gridColumn: { md: 'span 12' },
              mt: { xs: '2rem', md: '3rem' },
              mb: { md: '2.5rem' },
              position: 'relative',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -28, md: -44 },
                right: { xs: -20, md: -40 },
                width: { xs: 180, md: 220 },
                height: { xs: 180, md: 220 },
                color: '#edbe00',
                transform: 'rotate(45deg)',
                ...halftoneBlock,
              }}
            />
            <Box
              sx={{
                bgcolor: surfaceBright,
                p: { xs: '2rem', md: '3rem' },
                ...stitchCardLg(ink),
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                gap: { xs: 3, md: 5 },
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ flexShrink: 0, position: 'relative' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: primary,
                    opacity: 0.1,
                    transform: 'rotate(3deg)',
                  }}
                />
                <Box
                  component="img"
                  src={t5.avatar}
                  alt=""
                  sx={{
                    width: { xs: 220, sm: 256, md: 256 },
                    height: { xs: 220, sm: 256, md: 256 },
                    objectFit: 'cover',
                    border: `8px solid ${onSurface}`,
                    filter: 'grayscale(1)',
                    boxShadow: `12px 12px 0 0 ${ink}`,
                    position: 'relative',
                    zIndex: 1,
                    transition: 'filter 200ms',
                    '&:hover': { filter: 'grayscale(0)' },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -14,
                    right: -14,
                    bgcolor: yellow,
                    border: `6px solid ${onSurface}`,
                    px: 1.75,
                    py: 1,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    zIndex: 2,
                    transform: 'rotate(-5deg)',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  The Verdict
                </Box>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-block',
                    bgcolor: onSurface,
                    color: SURFACE_BRIGHT,
                    px: 1.25,
                    py: 0.35,
                    fontWeight: 900,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    mb: 2.5,
                  }}
                >
                  Certified Archive Entry #441
                </Box>
                <Box
                  component="h2"
                  sx={{
                    m: 0,
                    fontSize: { xs: '2.25rem', md: '3rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    lineHeight: 1.1,
                    color: onSurface,
                    mb: 2.5,
                  }}
                >
                  &ldquo;{t5.quote}&rdquo;
                </Box>
                <Box
                  component="p"
                  sx={{
                    m: 0,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 700,
                    color: onSurfaceVar,
                    mb: 2.5,
                    lineHeight: 1.45,
                  }}
                >
                  {t4.quote}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1, height: '1px', bgcolor: isDarkMode ? 'rgba(242,236,228,0.15)' : `${onSurface}33` }} />
                  <Box
                    component="span"
                    sx={{
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontStyle: 'italic',
                      color: onSurface,
                      lineHeight: 1.2,
                    }}
                  >
                    {t5.author} / {t5.role || 'The Lead Curator'}
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
