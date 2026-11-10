import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme as useCoffeeTheme } from '../../mui-coffee/context/ThemeContext';

interface LoadingSpinnerProps {
  message?: string;
  /** Kept for existing callers; sets the small docket seal size. */
  size?: number;
}

/** Shared page-level loader: a Cafert counter docket being prepared for service. */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'The counter is getting things ready.',
  size = 60,
}) => {
  const { isDarkMode } = useCoffeeTheme();
  const colors = isDarkMode
    ? { background: '#211d17', paper: '#30271f', ink: '#f0e3d1', muted: '#c1aa8d', line: '#756047', accent: '#c6a27b', shadow: 'rgba(0,0,0,.24)' }
    : { background: '#f3eee5', paper: '#fffaf1', ink: '#534931', muted: '#806f5c', line: '#cbb99e', accent: '#9a6842', shadow: 'rgba(72,49,27,.12)' };

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-label={message}
      sx={{
        minHeight: 'min(70vh, 620px)',
        display: 'grid',
        placeItems: 'center',
        px: { xs: 2, sm: 4 },
        py: { xs: 5, sm: 8 },
        overflow: 'hidden',
        position: 'relative',
        isolation: 'isolate',
        backgroundColor: colors.background,
        backgroundImage: isDarkMode
          ? `linear-gradient(rgba(33,29,23,.82), rgba(33,29,23,.82)), url('/img/coffee/cafert-loading-counter.webp')`
          : `linear-gradient(rgba(255,250,241,.16), rgba(255,250,241,.16)), url('/img/coffee/cafert-loading-counter.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '&::before': {
          content: '""', position: 'absolute', zIndex: -1, left: '-8%', right: '-8%', bottom: '12%', height: 18,
          backgroundColor: isDarkMode ? '#3a3025' : '#e6d7c1', borderTop: `1px solid ${colors.line}`,
          boxShadow: `0 -5px 18px ${colors.shadow}`,
        },
      }}
    >
      <Box
        sx={{
          width: 'min(100%, 700px)', minHeight: { xs: 280, sm: 300 }, position: 'relative',
          display: 'flex', alignItems: 'center', p: { xs: 2.5, sm: 4 }, pr: { xs: 13, sm: 19 },
          color: colors.ink, backgroundColor: colors.paper,
          border: `1px solid ${colors.line}`,
          boxShadow: `0 4px 0 ${isDarkMode ? '#17130f' : '#ddcdb4'}, 0 18px 44px ${colors.shadow}`,
          transform: 'rotate(-.6deg)',
          clipPath: 'polygon(0 0, 100% 0, 100% 18%, calc(100% - 8px) 22%, 100% 26%, 100% 72%, calc(100% - 8px) 76%, 100% 80%, 100% 100%, 0 100%)',
          '&::before': {
            content: '""', position: 'absolute', inset: 10, border: `1px dashed ${colors.line}`, pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 420 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <Box aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.accent }} />
            <Typography sx={{ color: colors.muted, fontSize: '.74rem', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
              Cafert · Counter docket
            </Typography>
          </Box>
          <Typography component="p" sx={{ color: colors.ink, fontFamily: 'Georgia, "Times New Roman", serif', fontSize: { xs: '1.7rem', sm: '2.25rem' }, fontWeight: 600, lineHeight: 1.12, mb: 1.5 }}>
            One moment, please.
          </Typography>
          <Typography sx={{ color: colors.muted, fontSize: { xs: '.98rem', sm: '1.08rem' }, lineHeight: 1.6, maxWidth: '36ch' }}>
            {message}
          </Typography>
          <Box sx={{ mt: 3, pt: 2, borderTop: `1px dashed ${colors.line}`, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              aria-hidden="true"
              sx={{
                width: size * .32, height: size * .32, border: `2px solid ${colors.accent}`, borderTopColor: 'transparent', borderRadius: '50%',
                animation: 'cafert-docket-turn 1.6s linear infinite',
                '@keyframes cafert-docket-turn': { to: { transform: 'rotate(360deg)' } },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none', borderTopColor: colors.accent, opacity: .55 },
              }}
            />
            <Typography sx={{ color: colors.muted, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.88rem' }}>
              Freshly setting your place…
            </Typography>
          </Box>
        </Box>
        <Box
          component="img"
          src="/img/coffee/cafert-counter-barista.webp"
          alt=""
          aria-hidden="true"
          sx={{
            position: 'absolute', right: { xs: -7, sm: 4 }, bottom: -2,
            width: { xs: 128, sm: 190 }, height: { xs: 184, sm: 252 }, objectFit: 'contain', objectPosition: 'bottom center',
            filter: `drop-shadow(0 8px 6px ${colors.shadow})`, pointerEvents: 'none',
          }}
        />
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute', top: { xs: 18, sm: 25 }, right: { xs: 14, sm: 28 },
            width: { xs: 50, sm: 62 }, height: { xs: 50, sm: 62 }, borderRadius: '50%',
            border: `1px dashed ${colors.accent}`, display: 'grid', placeItems: 'center',
            color: colors.accent, fontFamily: 'Georgia, serif', fontSize: '.65rem', fontWeight: 700,
            letterSpacing: '.08em', textAlign: 'center', transform: 'rotate(11deg)', opacity: .88,
          }}
        >
          IN<br />PREP
        </Box>
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
