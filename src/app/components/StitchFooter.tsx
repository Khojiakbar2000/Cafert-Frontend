import React from 'react';
import { Box } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import { Link } from 'react-router-dom';

/** stitch.tsx "Simplified Footer": cream panel, 8px ink frame, two-line logo, nav, orange social tiles, credit bar */
const INK = '#1A0F0D';
const CREAM = '#FDF6E3';
const ORANGE = '#FF4E00';

export type StitchFooterProps = {
  isDarkMode?: boolean;
};

const NAV = [
  { label: 'Story', href: '#top' },
  { label: 'Menu', href: '#menu' },
  { label: 'Locations', href: '#services' },
  { label: 'Shop', to: '/products' as const },
];

export function StitchFooter({ isDarkMode = false }: StitchFooterProps) {
  const bg = isDarkMode ? INK : CREAM;
  const text = isDarkMode ? CREAM : INK;
  const pulpColor = ORANGE;
  const alchemistColor = isDarkMode ? CREAM : INK;
  const alchemistShadow = isDarkMode ? ORANGE : ORANGE;
  const pulpShadow = INK;

  const social = [
    { Icon: TwitterIcon, href: 'https://twitter.com', label: 'Twitter' },
    { Icon: InstagramIcon, href: 'https://instagram.com', label: 'Instagram' },
    { Icon: FacebookIcon, href: 'https://facebook.com', label: 'Facebook' },
  ];

  return (
    <Box
      component="footer"
      className="stitch-footer"
      sx={{
        width: '100%',
        maxWidth: '80rem',
        mx: 'auto',
        bgcolor: bg,
        color: text,
        border: `8px solid ${INK}`,
        mt: { xs: '3rem', md: '5rem' },
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          p: { xs: '2rem', md: '4rem' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box sx={{ mb: '3rem' }}>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              color: pulpColor,
              textShadow: `4px 4px 0 ${pulpShadow}`,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            THE PULP
          </Box>
          <Box
            component="span"
            sx={{
              display: 'block',
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              color: alchemistColor,
              textShadow: `4px 4px 0 ${alchemistShadow}`,
              lineHeight: 1,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
            }}
          >
            ALCHEMIST
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: { xs: '1.5rem', md: '3rem' },
            mb: '3rem',
          }}
        >
          {NAV.map((item) =>
            'to' in item ? (
              <Box
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  color: text,
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: ORANGE },
                }}
              >
                {item.label}
              </Box>
            ) : (
              <Box
                key={item.label}
                component="a"
                href={item.href}
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  color: text,
                  textDecoration: 'none',
                  transition: 'color 0.15s ease',
                  '&:hover': { color: ORANGE },
                }}
              >
                {item.label}
              </Box>
            )
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '2rem', mb: '3rem', flexWrap: 'wrap' }}>
          {social.map(({ Icon, href, label }) => (
            <Box
              key={label}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              sx={{
                width: 56,
                height: 56,
                bgcolor: ORANGE,
                color: INK,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `4px solid ${INK}`,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-4px)' },
              }}
            >
              <Icon sx={{ fontSize: '1.75rem', fontWeight: 700 }} />
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            pt: '2rem',
            borderTop: `4px solid ${INK}`,
            width: '100%',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <Box
            component="p"
            sx={{
              m: 0,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.8,
              color: text,
            }}
          >
            © 2024 THE PULP ALCHEMIST. ALL RIGHTS RESERVED.
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: ORANGE, flexShrink: 0 }} />
            <Box
              component="span"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                fontStyle: 'italic',
                color: text,
              }}
            >
              Transmitted from the Ink-Verse
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
