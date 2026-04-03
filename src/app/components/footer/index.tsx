import React from 'react';
import { Box } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { Link } from 'react-router-dom';

/** stitch.md — Pulp Alchemist tokens */
const INK = '#1A0F0D';
const CREAM = '#FDF6E3';
const ORANGE = '#FF4E00';
const SURFACE = '#fcf6e8';
const SURFACE_CONTAINER = '#eee8d8';
const PRIMARY_CONTAINER = '#ff784d';
const TERTIARY_CONTAINER = '#fecc00';
const PRIMARY = '#a83100';
const ON_PRIMARY = '#ffefeb';

const COMIC_IMAGES = {
  roast:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAC2cfKjNmSxyeolgGZ3jNpuztJrRrhvd7eS6pf9kcnDvrwX-JLxlsofVEomUWOwtkF4Plz14Kj71ErqfRgKvB8UYHuBNdhWcWpSLFS3TzsubbEaxx9o4jKpaoorgDxv42Jd9zvYFHFRA8IxXiE6XrD6L8uP0auKSG68-aSIWUooy0gffaYemz7cd1LtLmvcHtxapIM0gYcVNbpf5H4YNLe0SbBmyF7R1-rlEKMa1WluLxWGByFkG5TBjfwBIP-QkqwA1llQiMU_4ti',
  pour:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC39dxm1QmeCk9zUMk60Fua5zSo2icQgtSW-zYJe1cumr_iqWdS7vLm21r5chF-oTdvQjaOwPssq_yra87sPSFKM8xFLGDh8XMFFuZrGrX3FYHPt41c1GtclQAmUdRJ6CKpPEN8a7xvqpMscTL6mr8cVzm8FhDDd0Vb0mVEaR_bx98jS6uY44x6tzY4tixIwQRoXfwnZPR1e1BWsGKEfrL0Axgu2x5PnUGDIiYU6_WAWFi82GVP5H3-HIgoXYVhuYdeotAUkJhmCWB7',
  script:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD3I83R1mG1gh5obmbXRFTyu4cicAgWMTuoORN-3C7UDIO8DDXnbc14rce9Esb_xekQ6JeI5JkzddlN6yRmtOhb-r0YmnZiQdZ_Sn-EI-YlAslLYYSWuIYFUEA3Tzs170Y1jDOFBP5tI6RgMQjzYiKEd5W-1N4Rj41pDVgzS_Rx-YnkYjfG9ehe437Y_bqTYSNj33nufhBLmKGFDVipgh7KmsUjt1dIFmNsTv9BEbgZOIfofVjp9YGIj9P1yEudIxUtlS5GL_-Psp1b',
} as const;

const NAV_ITEMS: { label: string; to?: string; href?: string }[] = [
  { label: 'Story', to: '/help' },
  { label: 'Menu', to: '/products' },
  { label: 'Locations', to: '/help' },
  { label: 'Shop', to: '/products' },
];

const SOCIAL = [
  { Icon: ShareOutlinedIcon, href: 'https://twitter.com', label: 'Share' },
  { Icon: CampaignOutlinedIcon, href: 'https://instagram.com', label: 'News' },
  { Icon: GroupsOutlinedIcon, href: 'https://facebook.com', label: 'Community' },
];

function StitchFooterFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,300..700;1,300..700&display=swap');
    `}</style>
  );
}

const halftoneLayer = (tint: string) => ({
  content: '""',
  position: 'absolute' as const,
  inset: 0,
  pointerEvents: 'none' as const,
  backgroundImage: 'radial-gradient(#1A0F0D 10%, transparent 11%)',
  backgroundSize: '10px 10px',
  color: tint,
  opacity: 0.2,
});

export type FooterProps = {
  /** When true, panel uses dark ink background (comic night mode). */
  isDarkMode?: boolean;
};

/**
 * Footer + bottom comic strip — from `src/components/stitch.md` (Simplified Footer + strips).
 */
export default function Footer({ isDarkMode = false }: FooterProps) {
  const year = new Date().getFullYear();
  const panelBg = isDarkMode ? 'rgba(22, 18, 16, 0.98)' : CREAM;
  const navColor = isDarkMode ? SURFACE : INK;

  return (
    <Box
      className="stitch-md-footer-root"
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        mt: { xs: '3rem', md: '5rem' },
      }}
    >
      <StitchFooterFonts />
      <Box
        component="footer"
        sx={{
          width: '100%',
          maxWidth: '80rem',
          mx: 'auto',
          bgcolor: panelBg,
          color: navColor,
          border: `8px solid ${INK}`,
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
                color: ORANGE,
                textShadow: `4px 4px 0 ${INK}`,
                lineHeight: 1,
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
                color: isDarkMode ? SURFACE : INK,
                textShadow: `4px 4px 0 ${ORANGE}`,
                lineHeight: 1,
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
            {NAV_ITEMS.map((item) =>
              item.to ? (
                <Box
                  key={item.label}
                  component={Link}
                  to={item.to}
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    fontStyle: 'italic',
                    color: navColor,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    '@media (hover: hover)': { '&:hover': { color: ORANGE } },
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
                    color: navColor,
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                    '@media (hover: hover)': { '&:hover': { color: ORANGE } },
                  }}
                >
                  {item.label}
                </Box>
              )
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              mb: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {SOCIAL.map(({ Icon, href, label }) => (
              <Box
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                sx={{
                  width: '3.5rem',
                  height: '3.5rem',
                  bgcolor: ORANGE,
                  color: INK,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `4px solid ${INK}`,
                  transition: 'transform 0.15s ease',
                  '@media (hover: hover)': { '&:hover': { transform: 'translateY(-4px)' } },
                }}
              >
                <Icon sx={{ fontSize: '1.75rem' }} />
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
                opacity: 0.85,
                color: navColor,
              }}
            >
              © {year} THE PULP ALCHEMIST. ALL RIGHTS RESERVED.
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
                  color: navColor,
                }}
              >
                Transmitted from the Ink-Verse
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Bottom comic strips — stitch.md */}
      <Box
        component="section"
        aria-label="Comic strip panels"
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
          gap: '1.5rem',
          width: '100%',
          maxWidth: '80rem',
          mx: 'auto',
          pt: '3rem',
          pb: '3rem',
          px: { xs: '1rem', md: 0 },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            height: { xs: 200, md: 256 },
            bgcolor: SURFACE_CONTAINER,
            border: `6px solid ${INK}`,
            position: 'relative',
            overflow: 'hidden',
            '&:hover .comic-footer-img': {
              filter: 'grayscale(0) contrast(1.08)',
            },
          }}
        >
          <Box
            component="img"
            className="comic-footer-img"
            src={COMIC_IMAGES.roast}
            alt="Close-up of a rustic coffee cup"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'grayscale(1) contrast(1.1)',
              transition: 'filter 0.5s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              bgcolor: PRIMARY_CONTAINER,
              p: '0.5rem',
              borderTop: `4px solid ${INK}`,
              borderRight: `4px solid ${INK}`,
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontSize: '0.875rem',
              color: '#460f00',
            }}
          >
            Issue #01: The Roast
          </Box>
        </Box>

        <Box
          sx={{
            height: { xs: 200, md: 256 },
            bgcolor: SURFACE_CONTAINER,
            border: `6px solid ${INK}`,
            position: 'relative',
            overflow: 'hidden',
            transform: { md: 'rotate(1deg)' },
            '&:hover .comic-footer-img': {
              filter: 'grayscale(0) contrast(1.08)',
            },
          }}
        >
          <Box
            component="img"
            className="comic-footer-img"
            src={COMIC_IMAGES.pour}
            alt="Barista pouring milk"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'grayscale(1) contrast(1.15)',
              transition: 'filter 0.5s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              bgcolor: TERTIARY_CONTAINER,
              color: '#584500',
              p: '0.5rem',
              borderTop: `4px solid ${INK}`,
              borderRight: `4px solid ${INK}`,
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontSize: '0.875rem',
            }}
          >
            Issue #02: The Pour
          </Box>
        </Box>

        <Box
          sx={{
            height: { xs: 200, md: 256 },
            bgcolor: SURFACE_CONTAINER,
            border: `6px solid ${INK}`,
            position: 'relative',
            overflow: 'hidden',
            transform: { md: 'rotate(-1deg)' },
            '&:hover .comic-footer-img': {
              filter: 'grayscale(0) contrast(1.08)',
            },
          }}
        >
          <Box
            component="img"
            className="comic-footer-img"
            src={COMIC_IMAGES.script}
            alt="Vintage typewriter"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: 'grayscale(1) contrast(1.12)',
              transition: 'filter 0.5s ease',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              bgcolor: PRIMARY,
              color: ON_PRIMARY,
              p: '0.5rem',
              borderTop: `4px solid ${INK}`,
              borderRight: `4px solid ${INK}`,
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              fontSize: '0.875rem',
            }}
          >
            Issue #03: The Script
          </Box>
        </Box>

        <Box
          sx={{
            height: { xs: 200, md: 256 },
            bgcolor: SURFACE_CONTAINER,
            border: `6px solid ${INK}`,
            position: 'relative',
            overflow: 'hidden',
            transform: { md: 'rotate(2deg)' },
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              bgcolor: INK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: '2rem',
              textAlign: 'center',
              '&::after': halftoneLayer('rgba(252,246,232,0.4)'),
            }}
          >
            <Box
              component="span"
              sx={{
                position: 'relative',
                zIndex: 1,
                color: SURFACE,
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                fontSize: { xs: '1.35rem', md: '1.5rem' },
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              TO BE <br />
              CONTINUED...
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
