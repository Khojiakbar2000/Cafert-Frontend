import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import BackHandIcon from '@mui/icons-material/BackHand';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useHistory } from 'react-router-dom';
import { STITCH_THEME } from '../../components/stitchUi';

/**
 * stitch.tsx — The Daily Roast tokens (tailwind theme extend)
 * Sections: First Roast, Bean Journey, Keep it Fresh → 1:1 layout/spacing/type
 */
const S = {
  outline: '#90715d',
  comicShadow: '4px 4px 0 0 rgba(144, 113, 93, 1)',
  primary: '#705a4c',
  secondary: '#bc004f',
  tertiary: '#795900',
  onPrimary: '#ffffff',
  onSurface: '#1d1b18',
  onSurfaceVariant: '#5b4130',
  surface: '#fef9f3',
  surfaceContainerLow: '#f8f3ed',
  tertiaryContainer: '#ffdfa0',
  onTertiaryContainer: '#5c4300',
  primaryContainer: '#fbddca',
  onPrimaryContainer: '#574335',
  secondaryContainer: '#ffd9de',
  onSecondaryContainer: '#90003b',
};

/** Hero-aligned comic ink + warm newsprint */
const COMIC_INK = STITCH_THEME.ink;
const COMIC_PAPER = '#F3E6C8';
const COMIC_PRIMARY = STITCH_THEME.primary;

/** Very subtle printed halftone (matches hero ben-day feel) */
function HalftoneLayer({ isDarkMode }: { isDarkMode: boolean }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle, ${
          isDarkMode ? 'rgba(252, 246, 232, 0.06)' : 'rgba(26, 15, 13, 0.07)'
        } 1px, transparent 1px)`,
        backgroundSize: '6px 6px',
        opacity: isDarkMode ? 0.9 : 1,
      }}
    />
  );
}

const IMG_FIRST_ROAST_MAIN =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtnyUx76l1KVa1Pi-C2HHPZHW5SQevbu_prqoX9O0JFnUXNdedYqZExAyuDjn9ETh4X5S0WX9jlWSza-L_oRZR0mLRCrcYxcXwKJ0haseozS1l5FP4te8NRCMDOwn4Gfr7PG1aKcscxBsQ-IIl3hHLCyr1YGhr8gURvQa98BMqxFhMvE8GTp7IGC7aiPoRGHfgQOPe500mWoIy8EvwZJ_zyiKNNTad47kzV7KxgspDwqojiTtFCNjO_5MBZTrr6Y2-3q76yPprYVGm';
const IMG_FIRST_ROAST_INSET =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD2cYLTwTSUbWxset_Xd1jwgB5YDb5rXuIHBl6f-7cg3jrx34u78UZUubiaKqVSf0JI61kKfjhBEB5PqgUZ6lNlcDegTU7AboTZQEyBI5DHHSX2rnw1VKxx_xYT04xbME58SpcIsonRFk6VE9cK73D46uLyKFtxMwnso9E1Jv0etjbEtREqObzFeAdEWce0jND9_3n_TDDauZTYkicWXikr3EOO_ByUJBw3ht4aTGR_4Cayje1crPb6IluSEABo3qL5xfa8yaOkE4bI';

function StitchFonts() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Space+Grotesk:ital,wght@0,400;0,700;0,800;0,900;1,700;1,800;1,900&display=swap');
      @keyframes stitchBeanJourneyIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}

type Darkable = { isDarkMode?: boolean };

/** max-w-7xl mx-auto px-6 mb-32 — The First Roast */
export function StitchFirstRoastSection({ isDarkMode = false }: Darkable) {
  const history = useHistory();
  const outline = isDarkMode ? 'rgba(230, 210, 190, 0.45)' : COMIC_INK;
  const frameShadow = isDarkMode ? '6px 6px 0 0 rgba(200, 180, 160, 0.35)' : `6px 6px 0 0 ${COMIC_INK}`;
  const surfaceLow = isDarkMode ? 'rgba(248, 243, 237, 0.08)' : 'rgba(255, 252, 245, 0.65)';
  const well = isDarkMode ? 'rgba(255, 223, 160, 0.15)' : '#f0d9a8';
  const text = isDarkMode ? '#f5f0ea' : COMIC_INK;
  const textVar = isDarkMode ? 'rgba(245, 240, 234, 0.82)' : '#4a3828';

  return (
    <Box
      component="section"
      sx={{
        width: '100%',
        bgcolor: isDarkMode ? 'rgba(30, 28, 26, 0.92)' : COMIC_PAPER,
        py: { xs: '5rem', md: '8.5rem' },
        mb: '8rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <HalftoneLayer isDarkMode={isDarkMode} />
      <Box sx={{ maxWidth: '80rem', mx: 'auto', px: '1.5rem', position: 'relative', zIndex: 1 }}>
        <StitchFonts />
        {/* grid grid-cols-1 md:grid-cols-12 gap-12 items-center */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
            gap: '3rem',
            alignItems: 'center',
          }}
        >
        <Box sx={{ gridColumn: { md: 'span 5' }, position: 'relative' }}>
          {/* comic-shadow border-4 … p-4 rotate-[-2deg] hover:rotate-0 transition-transform duration-300 */}
          <Box
            sx={{
              border: `6px solid ${outline}`,
              boxShadow: frameShadow,
              bgcolor: surfaceLow,
              p: '1rem',
              transform: 'rotate(-2deg)',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'rotate(-0.5deg) translateY(-4px)',
                  boxShadow: isDarkMode ? '8px 8px 0 0 rgba(200, 180, 160, 0.35)' : `9px 9px 0 0 ${COMIC_INK}`,
                },
              },
            }}
          >
            <Box
              component="img"
              src={IMG_FIRST_ROAST_MAIN}
              alt=""
              sx={{
                width: '100%',
                height: { xs: 'min(500px, 70vh)', md: '500px' },
                objectFit: 'cover',
                filter: isDarkMode
                  ? 'grayscale(0.6) sepia(0.2) brightness(0.85) contrast(1.1)'
                  : 'grayscale(1) sepia(0.3) brightness(0.9) contrast(1.1)',
                display: 'block',
              }}
            />
          </Box>
          {/* absolute -bottom-8 -right-8 w-48 h-48 … p-2 rotate-[5deg] hidden lg:block */}
          <Box
            sx={{
              display: { xs: 'none', lg: 'block' },
              position: 'absolute',
              bottom: '-2rem',
              right: '-2rem',
              width: '12rem',
              height: '12rem',
              border: `6px solid ${outline}`,
              boxShadow: frameShadow,
              bgcolor: well,
              p: '0.5rem',
              transform: 'rotate(5deg)',
              transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '@media (hover: hover)': { '&:hover': { transform: 'rotate(7deg) scale(1.02)' } },
            }}
          >
            <Box
              component="img"
              src={IMG_FIRST_ROAST_INSET}
              alt=""
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isDarkMode ? 'grayscale(0.4)' : 'grayscale(1)',
                display: 'block',
              }}
            />
          </Box>
        </Box>

        {/* md:col-span-7 space-y-8 */}
        <Box
          sx={{
            gridColumn: { md: 'span 7' },
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {/* font-headline font-extrabold text-5xl … uppercase tracking-tighter */}
          <Typography
            component="h2"
            sx={{
              m: 0,
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: { xs: '2.35rem', md: '3.25rem' },
              lineHeight: 1.05,
              color: text,
              textTransform: 'uppercase',
              letterSpacing: { xs: '0.06em', md: '0.1em' },
              textShadow: isDarkMode ? `4px 4px 0 rgba(252, 246, 232, 0.15)` : `5px 5px 0 rgba(168, 49, 0, 0.2)`,
              '@media (max-width: 899px)': { fontSize: '2.25rem' },
            }}
          >
            The First Roast
          </Typography>
          {/* space-y-6 text-xl leading-relaxed text-on-surface-variant font-body */}
          <Box
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: '1.25rem',
              lineHeight: 1.625,
              color: textVar,
            }}
          >
            <Box
              component="p"
              sx={{
                m: 0,
                '&::first-letter': {
                  float: 'left',
                  fontFamily: '"Epilogue", sans-serif',
                  fontSize: '3.75rem',
                  fontWeight: 900,
                  lineHeight: 0.9,
                  marginRight: '0.75rem',
                  color: S.secondary,
                },
              }}
            >
              It began in 1994, in a small, drafty garage in Portland. Our founder, Arthur Vance,
              didn&apos;t have a plan—just a bag of unroasted green beans and a passion for the
              perfect extraction.
            </Box>
            <Box component="p" sx={{ m: 0 }}>
              While the rest of the world was content with burnt, oily beans, Arthur spent his
              nights listening to the rhythmic &apos;crack&apos; of the roast, looking for that
              elusive sweet spot where fruit meets chocolate.
            </Box>
          </Box>
          {/* pt-6 */}
          <Box sx={{ pt: '1.5rem' }}>
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={() => history.push('/products')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  history.push('/products');
                }
              }}
              sx={{
                display: 'inline-block',
                fontFamily: '"Epilogue", sans-serif',
                fontWeight: 700,
                px: '2rem',
                py: '1rem',
                borderRadius: '9999px',
                bgcolor: S.primary,
                color: S.onPrimary,
                boxShadow: frameShadow,
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '@media (hover: hover)': {
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: `8px 8px 0 0 ${COMIC_INK}` },
                },
              }}
            >
              Explore the Archives
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Warm coffee-forward fills for comic “stickers” (light mode) */
const JOURNEY_STEPS = [
  {
    Icon: EnergySavingsLeafIcon,
    title: 'Sustainable Growth',
    body: 'Organically grown in shaded canopies to protect local biodiversity.',
    circleBg: '#e8cfa5',
    iconColor: '#4a3218',
  },
  {
    Icon: BackHandIcon,
    title: 'Hand Picked',
    body: 'Only the ripest coffee cherries are selected by our estate partners.',
    circleBg: '#edc9a6',
    iconColor: '#5c2f20',
  },
  {
    Icon: LocalFireDepartmentIcon,
    title: 'Artisan Roasting',
    body: 'Small-batch roasted daily in our vintage copper drum roaster.',
    circleBg: '#e5b896',
    iconColor: '#4a2812',
  },
  {
    Icon: LocalCafeIcon,
    title: 'The Perfect Pour',
    body: 'Delivered fresh to your cup within 48 hours of roasting.',
    circleBg: '#deb887',
    iconColor: '#3d2410',
  },
] as const;

/** Comic-paper stripe: aligns with First Roast hero (#F3E6C8 + halftone + sticker icons) */
export function StitchBeanJourneySection({ isDarkMode = false }: Darkable) {
  const outline = isDarkMode ? 'rgba(230, 210, 190, 0.45)' : COMIC_INK;
  const stickerShadow = isDarkMode
    ? '6px 6px 0 0 rgba(200, 180, 160, 0.35), 12px 12px 0 0 rgba(0,0,0,0.12)'
    : `6px 6px 0 0 ${COMIC_INK}, 11px 11px 0 0 rgba(168, 49, 0, 0.14)`;
  const titleColor = isDarkMode ? '#f5f0ea' : COMIC_INK;
  const h3Color = isDarkMode ? '#f5f0ea' : '#2c1810';
  const bodyColor = isDarkMode ? 'rgba(245, 240, 234, 0.82)' : '#4a3828';

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: isDarkMode ? 'rgba(30, 28, 26, 0.92)' : COMIC_PAPER,
        py: '6rem',
        mb: '8rem',
        borderTop: `6px solid ${outline}`,
        borderBottom: `6px solid ${outline}`,
      }}
    >
      <HalftoneLayer isDarkMode={isDarkMode} />
      <StitchFonts />
      <Box sx={{ maxWidth: '80rem', mx: 'auto', px: '1.5rem', position: 'relative', zIndex: 1 }}>
        <Typography
          component="h2"
          sx={{
            m: 0,
            mb: { xs: '3rem', md: '4rem' },
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 900,
            fontStyle: 'italic',
            fontSize: { xs: '2.5rem', md: '3.35rem' },
            lineHeight: 1.05,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: { xs: '0.1em', md: '0.14em' },
            color: titleColor,
            textShadow: isDarkMode
              ? '4px 4px 0 rgba(252, 246, 232, 0.12)'
              : `5px 5px 0 rgba(168, 49, 0, 0.18), 1px 1px 0 ${COMIC_INK}`,
          }}
        >
          The Bean Journey
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: '2.5rem', md: '2rem' },
          }}
        >
          {JOURNEY_STEPS.map(({ Icon, title, body, circleBg, iconColor }, i) => {
            const tiltDeg = i % 2 === 0 ? -1.25 : 1.25;
            const yNudge = i === 1 ? 4 : i === 3 ? -3 : 0;
            return (
              <Box
                key={title}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  transform: { xs: 'none', md: `translateY(${yNudge}px) rotate(${tiltDeg * 0.35}deg)` },
                  transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '@media (hover: hover)': {
                    '&:hover': {
                      transform: {
                        xs: 'none',
                        md: `translateY(${yNudge - 4}px) rotate(${tiltDeg * 0.35 + (i % 2 === 0 ? -1.5 : 1.5)}deg) scale(1.02)`,
                      },
                    },
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    animation: 'stitchBeanJourneyIn 0.58s cubic-bezier(0.34, 1.56, 0.64, 1) backwards',
                    animationDelay: `${0.06 + i * 0.09}s`,
                  }}
                >
                <Box
                  sx={{
                    width: '8rem',
                    height: '8rem',
                    borderRadius: '50%',
                    border: `6px solid ${outline}`,
                    bgcolor: isDarkMode ? 'rgba(255, 223, 160, 0.12)' : circleBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: '1.5rem',
                    boxShadow: stickerShadow,
                    transition:
                      'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease',
                    '@media (hover: hover)': {
                      '&:hover': {
                        transform: `rotate(${i % 2 === 0 ? 4 : -4}deg) scale(1.08)`,
                        boxShadow: isDarkMode
                          ? '8px 8px 0 0 rgba(200, 180, 160, 0.45), 14px 14px 0 0 rgba(0,0,0,0.15)'
                          : `8px 8px 0 0 ${COMIC_INK}, 14px 14px 0 0 rgba(168, 49, 0, 0.18)`,
                      },
                    },
                  }}
                >
                  <Icon
                    sx={{
                      fontSize: '2.25rem',
                      color: isDarkMode ? '#ffdfa0' : iconColor,
                    }}
                  />
                </Box>
                <Typography
                  component="h3"
                  sx={{
                    m: 0,
                    mb: '0.75rem',
                    fontFamily: '"Epilogue", sans-serif',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                    lineHeight: 1.25,
                    letterSpacing: '0.02em',
                    color: h3Color,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{
                    m: 0,
                    maxWidth: '22rem',
                    mx: 'auto',
                    fontFamily: '"Newsreader", Georgia, serif',
                    fontSize: '1rem',
                    lineHeight: 1.625,
                    fontStyle: 'italic',
                    color: bodyColor,
                  }}
                >
                  {body}
                </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/** max-w-5xl mx-auto px-6 — inner p-12 */
export function StitchKeepItFreshSection({ isDarkMode = false }: Darkable) {
  const [email, setEmail] = useState('');
  const outline = isDarkMode ? 'rgba(230, 210, 190, 0.45)' : S.outline;
  const shadow = isDarkMode ? '4px 4px 0 0 rgba(200, 180, 160, 0.3)' : S.comicShadow;
  const panelBg = isDarkMode ? 'rgba(255, 223, 160, 0.12)' : S.tertiaryContainer;
  const titleColor = isDarkMode ? '#ffdfa0' : S.onTertiaryContainer;
  const subColor = isDarkMode ? 'rgba(255, 223, 160, 0.8)' : `rgba(92, 67, 0, 0.8)`;
  const mailTint = isDarkMode ? 'rgba(255, 223, 160, 0.2)' : 'rgba(92, 67, 0, 0.2)';
  const inputBg = isDarkMode ? 'rgba(30, 28, 24, 0.85)' : S.surface;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      window.alert('Thanks! We\'ll be in touch with roast news.');
      setEmail('');
    }
  };

  return (
    <Box
      component="section"
      sx={{
        maxWidth: '64rem',
        mx: 'auto',
        px: '1.5rem',
        pt: { xs: '4rem', md: '6rem' },
        pb: { xs: '1rem', md: '1.5rem' },
      }}
    >
      <StitchFonts />
      {/* bg-tertiary-container border-4 border-outline p-12 relative comic-shadow overflow-hidden */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: panelBg,
          border: `4px solid ${outline}`,
          boxShadow: shadow,
          p: '3rem',
          overflow: 'hidden',
          '@media (max-width: 599px)': { p: '2rem' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            p: '1rem',
            pointerEvents: 'none',
            color: mailTint,
          }}
        >
          {/* text-8xl */}
          <MailOutlineIcon sx={{ fontSize: '6rem', display: 'block' }} />
        </Box>
        {/* relative z-10 text-center space-y-6 */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <Typography
            component="h2"
            sx={{
              m: 0,
              fontFamily: '"Epilogue", sans-serif',
              fontWeight: 900,
              fontSize: '3rem',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              color: titleColor,
              '@media (max-width: 899px)': { fontSize: '2.25rem' },
            }}
          >
            Keep it Fresh
          </Typography>
          {/* font-body text-2xl italic text-on-tertiary-container/80 */}
          <Typography
            sx={{
              m: 0,
              fontFamily: '"Newsreader", Georgia, serif',
              fontSize: '1.5rem',
              lineHeight: 1.5,
              fontStyle: 'italic',
              color: subColor,
              '@media (max-width: 899px)': { fontSize: '1.25rem' },
            }}
          >
            Get the latest news on limited roasts and secret menu items.
          </Typography>
          {/* flex flex-col md:flex-row gap-4 max-w-2xl mx-auto */}
          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: '1rem',
              maxWidth: '42rem',
              mx: 'auto',
              width: '100%',
            }}
          >
            <Box
              component="input"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="Your email address"
              sx={{
                flex: 1,
                minWidth: 0,
                bgcolor: inputBg,
                color: isDarkMode ? '#f5f0ea' : S.onSurface,
                border: `4px solid ${outline}`,
                borderRadius: '9999px',
                px: '1.5rem',
                py: '1rem',
                fontFamily: '"Epilogue", sans-serif',
                fontWeight: 700,
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                '&:focus': { borderColor: S.secondary },
                '&::placeholder': { color: isDarkMode ? 'rgba(245,240,234,0.45)' : 'rgba(29,27,24,0.45)' },
              }}
            />
            <Button
              type="submit"
              sx={{
                bgcolor: S.secondary,
                color: S.onPrimary,
                fontFamily: '"Epilogue", sans-serif',
                fontWeight: 900,
                textTransform: 'uppercase',
                px: '2.5rem',
                py: '1rem',
                borderRadius: '9999px',
                boxShadow: shadow,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#a00345' },
                '@media (hover: hover)': {
                  '&:hover': { transform: 'translateY(-2px)' },
                },
                '&:active': { transform: 'translateY(2px)' },
                transition: 'transform 0.2s ease',
              }}
            >
              Join The Club
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
