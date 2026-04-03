import React from 'react';
import { Box, Typography, Link as MuiLink } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import { STITCH_AUTH, HERO_BG } from './stitchAuthTokens';

const headline = '"Space Grotesk", system-ui, sans-serif';
const body = '"Work Sans", system-ui, sans-serif';

type StitchAuthShellProps = {
  children: React.ReactNode;
};

/**
 * Stitch auth layout (hero + form + footer). Site `OtherNavbar` is rendered by App above this shell.
 */
export default function StitchAuthShell({ children }: StitchAuthShellProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: STITCH_AUTH.bg,
        color: STITCH_AUTH.ink,
        fontFamily: body,
        overflowX: 'hidden',
        scrollbarGutter: 'stable',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,300..700;1,300..700&family=Work+Sans:wght@300;400;500;600;700&display=swap');
      `}</style>

      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          /** Extra space below global floating navbar spacer (OtherNavbar). */
          pt: { xs: 3, sm: 4, md: 5 },
          minHeight: 0,
        }}
      >
        {/* Hero half */}
        <Box
          component="section"
          sx={{
            position: 'relative',
            width: { xs: '100%', md: '50%' },
            height: { xs: 409, md: 'auto' },
            minHeight: { xs: 409, md: 'min(calc(100vh - 140px), 900px)' },
            bgcolor: STITCH_AUTH.surfaceContainer,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
              backgroundImage: `radial-gradient(${STITCH_AUTH.ink} 1px, transparent 0)`,
              backgroundSize: '10px 10px',
              opacity: 0.05,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${HERO_BG})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: 'multiply',
              opacity: 0.9,
              transform: 'scale(1.1)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Typography
                sx={{
                  fontFamily: headline,
                  fontSize: { xs: '4.5rem', md: '8rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: STITCH_AUTH.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  transform: 'rotate(-6deg)',
                  textShadow: `10px 10px 0px ${STITCH_AUTH.ink}`,
                }}
              >
                CRAFTED
              </Typography>
              <Typography
                sx={{
                  position: 'absolute',
                  top: 48,
                  left: 48,
                  fontFamily: headline,
                  fontSize: { xs: '4.5rem', md: '8rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: STITCH_AUTH.surfaceBright,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.06em',
                  lineHeight: 1,
                  transform: 'rotate(3deg)',
                  opacity: 0.8,
                  textShadow: `10px 10px 0px ${STITCH_AUTH.ink}`,
                }}
              >
                EXCELLENCE
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              bottom: 48,
              left: 48,
              transform: 'rotate(-12deg)',
              bgcolor: STITCH_AUTH.tertiaryContainer,
              p: 2,
              border: `6px solid ${STITCH_AUTH.ink}`,
              boxShadow: `8px 8px 0px 0px ${STITCH_AUTH.ink}`,
              zIndex: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: headline,
                fontWeight: 900,
                fontStyle: 'italic',
                color: STITCH_AUTH.surface,
                fontSize: '1.5rem',
                textTransform: 'uppercase',
              }}
            >
              Limited Batch 004
            </Typography>
          </Box>
        </Box>

        {/* Form half */}
        <Box
          component="section"
          sx={{
            width: { xs: '100%', md: '50%' },
            minHeight: { xs: 'auto', md: 'auto' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, md: 6 },
            pb: { xs: 4, md: 6 },
            bgcolor: STITCH_AUTH.surface,
            position: 'relative',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: STITCH_AUTH.ink,
          width: '100%',
          py: 6,
          px: 2,
          borderTop: `8px solid ${STITCH_AUTH.primary}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, gap: 0.5 }}>
          <Typography
            sx={{
              color: STITCH_AUTH.bg,
              fontFamily: headline,
              fontWeight: 700,
              fontStyle: 'italic',
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
            }}
          >
            Cafert
          </Typography>
          <Typography sx={{ fontFamily: body, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,248,246,0.7)' }}>
            © 2024 Cafert - The Kinetic Alchemist
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((label) => (
            <MuiLink
              key={label}
              component={RouterLink}
              to="/help"
              sx={{
                fontFamily: body,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(255,248,246,0.7)',
                textDecoration: 'none',
                '&:hover': { color: STITCH_AUTH.bg },
              }}
            >
              {label}
            </MuiLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/** Floating coffee sticker (absolute to form column `relative` wrapper) */
export function StitchAuthFloatingCoffeeSticker() {
  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        position: 'absolute',
        top: -32,
        right: -32,
        width: 96,
        height: 96,
        bgcolor: STITCH_AUTH.surfaceVariant,
        border: `6px solid ${STITCH_AUTH.ink}`,
        transform: 'rotate(12deg)',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `8px 8px 0px 0px ${STITCH_AUTH.ink}`,
        pointerEvents: 'none',
      }}
    >
      <LocalCafeOutlinedIcon sx={{ fontSize: 40, color: STITCH_AUTH.onSurface }} />
    </Box>
  );
}
