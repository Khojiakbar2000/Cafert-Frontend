import React, { useMemo, useState } from 'react';
import { Box, Button, Collapse, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

/**
 * Built from `src/components/stitch.md` — Cake Missions (Pulp Alchemist) landing.
 */

const INK = '#1A0F0D';
const SURFACE = '#fcf6e8';
const ON_SURFACE = '#312f26';
const ON_SURFACE_VARIANT = '#5f5b51';
const PRIMARY = '#a83100';
const PRIMARY_CONTAINER = '#ff784d';
const PRIMARY_FIXED = '#ff784d';
const ON_PRIMARY = '#ffefeb';
const ON_PRIMARY_CONTAINER = '#460f00';
const TERTIARY_CONTAINER = '#fecc00';
const ON_TERTIARY_CONTAINER = '#584500';
const SURFACE_CONTAINER = '#eee8d8';
const SURFACE_CONTAINER_LOW = '#f6f0e1';
const SURFACE_CONTAINER_HIGHEST = '#e3ddcb';
const SURFACE_BRIGHT = '#fcf6e8';
const ON_BACKGROUND = '#312f26';
const PROTO_PANEL = '#2a1e1b';

const GROTESK = "'Space Grotesk', system-ui, sans-serif";
const COMIC = `6px solid ${INK}`;
const INK_BLEED = `6px 6px 0 0 ${INK}`;
const TAG_SHADOW = `4px 4px 0 ${INK}`;
const POW_SHADOW = `8px 8px 0 ${INK}`;

const HERO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBQqSSXXjRyqgOqKN3wSOu4VDEj6yufO19yENkqJtEQY1AKzczXLPJctp9mUidRdgRejaEMEcr9mgEUxGeVY6nI3NxyY4_InwnwRLSxGnSV7nqqu5e7nOgxReaGc240tKbINnQJk-4Wh6Q3LN2CHe-I1xbvrWrURIKhewA5prcdtNryu78-6LMHDlvisvqDhczn-qG1o_zOaX08inCCfU0BQP7BLzB0ARMm9YYXK6GFJuVetAi2CWc9DNhCEMEGfNOcwjNSsbhQM6NE';

function MsIcon({
  name,
  sx = {},
  fill,
}: {
  name: string;
  sx?: object;
  fill?: number;
}) {
  return (
    <Box
      component="span"
      className="material-symbols-outlined"
      sx={{
        fontVariationSettings: fill === 1 ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : undefined,
        userSelect: 'none',
        lineHeight: 1,
        ...sx,
      }}
    >
      {name}
    </Box>
  );
}

const bendayDots = {
  backgroundImage: 'radial-gradient(#a83100 1px, transparent 1px)',
  backgroundSize: '8px 8px',
} as const;

const activePress = {
  '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
};

export default function BirthdayCakePage() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const history = useHistory();

  const [payload, setPayload] = useState<'xl' | 'cocoa'>('cocoa');
  const [synthesisOn, setSynthesisOn] = useState(true);
  const [intelOn, setIntelOn] = useState(false);

  const [heroName, setHeroName] = useState('');
  const [missionDate, setMissionDate] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deployConfirmed, setDeployConfirmed] = useState(false);
  const [deployAttempted, setDeployAttempted] = useState(false);

  const formattedMissionDate = useMemo(() => {
    if (!missionDate.trim()) return '';
    try {
      return new Date(`${missionDate}T12:00:00`).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return missionDate;
    }
  }, [missionDate]);

  const deploymentValid =
    heroName.trim().length > 0 && missionDate.trim().length > 0 && deliveryLocation.trim().length > 0;

  const cancelDeploySuccess = () => setDeployConfirmed(false);

  const handleDeploySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDeployAttempted(true);
    const ok = deploymentValid;
    if (!ok) {
      setDeployConfirmed(false);
      return;
    }
    setDeployConfirmed(true);
  };

  const resetDeployment = () => {
    setDeployConfirmed(false);
    setDeployAttempted(false);
    setHeroName('');
    setMissionDate('');
    setDeliveryLocation('');
  };

  const dayMeta = useMemo(() => {
    const event = new Set([14, 22, 28]);
    const today = new Set([10]);
    return { event, today };
  }, []);

  return (
    <>
      <Helmet>
        <title>Cake Missions | THE PULP ALCHEMIST</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&family=Space+Grotesk:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <style>
        {`
          .cake-ms .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          @keyframes pulse-slow-cake {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.03); }
          }
          @keyframes pop-in-cake {
            0% { opacity: 0; transform: scale(0.8) translateY(20px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes stagger-fade-cake {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .cake-hero-pulse { animation: pulse-slow-cake 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          .cake-pop-in { animation: pop-in-cake 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        `}
      </style>

      <Box
        className="cake-ms"
        sx={{
          minHeight: '100vh',
          bgcolor: SURFACE,
          color: ON_SURFACE,
          fontFamily: GROTESK,
          position: 'relative',
          '& ::selection': { bgcolor: PRIMARY_CONTAINER, color: ON_PRIMARY_CONTAINER },
        }}
      >
        <Box
          aria-hidden
          sx={{
            ...bendayDots,
            opacity: 0.1,
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        {/* Top nav — stitch.md */}
        <Box
          component="nav"
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: { xs: 2, md: 3 },
            py: 2,
            bgcolor: SURFACE,
            borderBottom: `6px solid ${INK}`,
            boxShadow: INK_BLEED,
          }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: GROTESK,
              fontSize: { xs: '1.5rem', md: '1.875rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              color: INK,
              letterSpacing: '-0.05em',
              textDecoration: 'none',
              filter: 'drop-shadow(4px 4px 0 rgba(26,15,13,1))',
            }}
          >
            THE PULP ALCHEMIST
          </Typography>

          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            <Typography
              component={Link}
              to="/products"
              sx={{
                fontFamily: GROTESK,
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: INK,
                opacity: 0.8,
                textDecoration: 'none',
                '&:hover': { transform: 'translate(4px, 4px)' },
                transition: 'transform 150ms',
              }}
            >
              Menu
            </Typography>
            <Typography
              component={Link}
              to="/help"
              sx={{
                fontFamily: GROTESK,
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: INK,
                opacity: 0.8,
                textDecoration: 'none',
                '&:hover': { transform: 'translate(4px, 4px)' },
                transition: 'transform 150ms',
              }}
            >
              Story
            </Typography>
            <Typography
              sx={{
                fontFamily: GROTESK,
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: PRIMARY,
                textDecoration: 'underline',
                textDecorationThickness: 4,
                textUnderlineOffset: 8,
              }}
            >
              Cake Missions
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box onClick={() => history.push('/orders')} sx={{ cursor: 'pointer' }}>
              <MsIcon name="shopping_cart" sx={{ fontSize: 28, color: PRIMARY }} />
            </Box>
            <Box onClick={() => history.push('/my-page')} sx={{ cursor: 'pointer' }}>
              <MsIcon name="account_circle" sx={{ fontSize: 28, color: PRIMARY }} />
            </Box>
          </Stack>
        </Box>

        <Box
          component="main"
          sx={{
            position: 'relative',
            zIndex: 10,
            pt: { xs: 16, md: 18 },
            pb: { xs: 12, md: 12 },
            px: { xs: 2, md: 4 },
            maxWidth: '80rem',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 8, md: 10 },
          }}
        >
          {/* Hero */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(12, 1fr)' },
              gap: 3,
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                gridColumn: { md: 'span 7' },
                bgcolor: SURFACE,
                p: { xs: 3, md: 4 },
                border: COMIC,
                boxShadow: INK_BLEED,
                transform: 'rotate(-1deg)',
              }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  bgcolor: TERTIARY_CONTAINER,
                  color: ON_TERTIARY_CONTAINER,
                  px: 2,
                  py: 0.5,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  fontSize: '1.25rem',
                  textTransform: 'uppercase',
                  mb: 2,
                  border: COMIC,
                  ml: { xs: 0, md: -6 },
                  boxShadow: TAG_SHADOW,
                }}
              >
                TOP SECRET
              </Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: GROTESK,
                  fontSize: { xs: '3.75rem', md: '6rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  letterSpacing: '-0.05em',
                  color: ON_BACKGROUND,
                  lineHeight: 1,
                  textTransform: 'uppercase',
                  mb: 2,
                  filter: 'drop-shadow(4px 4px 0 rgba(26,15,13,1))',
                }}
              >
                DEPLOY THE{' '}
                <Box component="span" sx={{ color: PRIMARY }}>
                  CAKE!
                </Box>
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700,
                  lineHeight: 1.25,
                  maxWidth: 576,
                  color: ON_SURFACE_VARIANT,
                }}
              >
                Operation: Dessert Storm is afoot. Synchronize your objective coordinates and schedule a high-octane flavor drop to your
                target&apos;s location.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
                <Button
                  onClick={() => history.push('/orders?tab=menu')}
                  sx={{
                    bgcolor: PRIMARY,
                    color: ON_PRIMARY,
                    fontFamily: GROTESK,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    px: 4,
                    py: 2,
                    border: COMIC,
                    boxShadow: INK_BLEED,
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    ...activePress,
                    '&:hover': { bgcolor: PRIMARY },
                  }}
                >
                  Initialize Mission
                </Button>
              </Stack>
            </Box>

            <Box sx={{ gridColumn: { md: 'span 5' }, position: 'relative' }}>
              <Box
                className="cake-hero-pulse"
                sx={{
                  border: COMIC,
                  overflow: 'hidden',
                  bgcolor: PRIMARY_CONTAINER,
                  position: 'relative',
                  transform: 'rotate(1deg)',
                }}
              >
                <Box
                  component="img"
                  src={HERO_IMG}
                  alt=""
                  sx={{
                    width: '100%',
                    height: 400,
                    objectFit: 'cover',
                    filter: 'grayscale(1)',
                    mixBlendMode: 'multiply',
                    opacity: 0.8,
                    display: 'block',
                  }}
                />
                <Box
                  sx={{
                    ...bendayDots,
                    opacity: 0.4,
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                  }}
                />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  top: -40,
                  right: -24,
                  bgcolor: TERTIARY_CONTAINER,
                  border: COMIC,
                  p: 3,
                  transform: 'rotate(-1deg)',
                  boxShadow: POW_SHADOW,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: GROTESK,
                    fontSize: '2.25rem',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    color: ON_BACKGROUND,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                  }}
                >
                  POW!
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Form + calendar */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(5, 1fr)' },
              gap: 3,
            }}
          >
            <Box
              component="section"
              sx={{
                gridColumn: { lg: 'span 2' },
                bgcolor: SURFACE_CONTAINER_LOW,
                p: { xs: 3, md: 4 },
                border: COMIC,
                boxShadow: INK_BLEED,
                transform: 'rotate(-1deg)',
                alignSelf: 'start',
              }}
            >
              <Typography
                sx={{
                  fontFamily: GROTESK,
                  fontSize: { xs: '2rem', md: '2.25rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  mb: 4,
                  borderBottom: `4px solid ${ON_BACKGROUND}`,
                  pb: 1,
                }}
              >
                Target Deployment
              </Typography>
              <Stack component="form" spacing={3} onSubmit={handleDeploySubmit}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1 }}>
                    Hero Name (Recipient)
                  </Typography>
                  <TextField
                    fullWidth
                    value={heroName}
                    onChange={(e) => {
                      setHeroName(e.target.value);
                      cancelDeploySuccess();
                    }}
                    placeholder="CODE NAME..."
                    InputProps={{ sx: { borderRadius: 0, fontWeight: 700, fontSize: '1.25rem', bgcolor: SURFACE, pl: 1 } }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { border: `4px solid ${ON_BACKGROUND}`, borderRadius: 0 },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: PRIMARY,
                        boxShadow: `0 0 0 4px rgba(168, 49, 0, 0.2)`,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1 }}>
                    Strategic Date (Objective)
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    value={missionDate}
                    onChange={(e) => {
                      setMissionDate(e.target.value);
                      cancelDeploySuccess();
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { borderRadius: 0, fontWeight: 700, fontSize: '1.25rem', bgcolor: SURFACE, pl: 1, py: 0.5 } }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { border: `4px solid ${ON_BACKGROUND}`, borderRadius: 0 },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: PRIMARY,
                        boxShadow: `0 0 0 4px rgba(168, 49, 0, 0.2)`,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                      Drop Zone (Delivery Location)
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: TERTIARY_CONTAINER,
                        color: ON_TERTIARY_CONTAINER,
                        px: 1,
                        py: 0.25,
                        border: `3px solid ${INK}`,
                        transform: 'rotate(-3deg)',
                        boxShadow: TAG_SHADOW,
                      }}
                    >
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, fontStyle: 'italic' }}>NEW</Typography>
                    </Box>
                  </Stack>
                  <TextField
                    fullWidth
                    value={deliveryLocation}
                    onChange={(e) => {
                      setDeliveryLocation(e.target.value);
                      cancelDeploySuccess();
                    }}
                    placeholder="ADDRESS, LOBBY CODE, OR LAT/LONG — WE DON’T JUDGE"
                    multiline
                    minRows={2}
                    InputProps={{ sx: { borderRadius: 0, fontWeight: 700, fontSize: '1.05rem', bgcolor: SURFACE, pl: 1, alignItems: 'flex-start' } }}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { border: `4px solid ${ON_BACKGROUND}`, borderRadius: 0 },
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: PRIMARY,
                        boxShadow: `0 0 0 4px rgba(168, 49, 0, 0.2)`,
                      },
                    }}
                  />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', mb: 1 }}>
                    Payload Type
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Button
                      type="button"
                      onClick={() => {
                        setPayload('xl');
                        cancelDeploySuccess();
                      }}
                      sx={{
                        border: COMIC,
                        py: 2,
                        bgcolor: payload === 'xl' ? PRIMARY : SURFACE_BRIGHT,
                        color: payload === 'xl' ? ON_PRIMARY : ON_SURFACE,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        ...activePress,
                      }}
                    >
                      The Alchemist XL
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setPayload('cocoa');
                        cancelDeploySuccess();
                      }}
                      sx={{
                        border: COMIC,
                        py: 2,
                        bgcolor: payload === 'cocoa' ? PRIMARY : SURFACE_BRIGHT,
                        color: payload === 'cocoa' ? ON_PRIMARY : ON_SURFACE,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        borderRadius: 0,
                        ...activePress,
                      }}
                    >
                      Dark Matter Cocoa
                    </Button>
                  </Box>
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    bgcolor: ON_BACKGROUND,
                    color: SURFACE,
                    fontFamily: GROTESK,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: '1.5rem',
                    py: 3,
                    border: COMIC,
                    boxShadow: INK_BLEED,
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    '&:hover': { bgcolor: PRIMARY, color: ON_PRIMARY },
                    ...activePress,
                  }}
                >
                  Confirm Coordinates
                </Button>

                <Collapse in={deployAttempted && !deployConfirmed && !deploymentValid}>
                  <Box
                    sx={{
                      p: 2,
                      border: `4px dashed ${PRIMARY}`,
                      bgcolor: 'rgba(255, 120, 77, 0.12)',
                      transform: 'rotate(-0.5deg)',
                    }}
                  >
                    <Typography sx={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', color: PRIMARY, fontSize: '0.95rem' }}>
                      Hold up — we need a name, date, and drop zone before we launch the frosting.
                    </Typography>
                  </Box>
                </Collapse>

                <Collapse in={deployConfirmed}>
                  <Box
                    className="cake-pop-in"
                    sx={{
                      position: 'relative',
                      bgcolor: SURFACE_BRIGHT,
                      color: ON_BACKGROUND,
                      p: { xs: 2.5, md: 3 },
                      border: COMIC,
                      boxShadow: POW_SHADOW,
                      transform: 'rotate(1deg)',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        ...bendayDots,
                        opacity: 0.2,
                        position: 'absolute',
                        inset: 0,
                        pointerEvents: 'none',
                      }}
                    />
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ position: 'relative' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          sx={{
                            fontFamily: GROTESK,
                            fontWeight: 900,
                            fontStyle: 'italic',
                            textTransform: 'uppercase',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            lineHeight: 1.05,
                            color: PRIMARY,
                            textShadow: `3px 3px 0 ${INK}`,
                            mb: 2,
                          }}
                        >
                          Mission locked!
                        </Typography>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.05rem', md: '1.2rem' },
                            lineHeight: 1.5,
                            mb: 2,
                          }}
                        >
                          A cake payload (
                          <Box component="span" sx={{ bgcolor: TERTIARY_CONTAINER, px: 0.75, border: `2px solid ${INK}` }}>
                            {payload === 'xl' ? 'The Alchemist XL' : 'Dark Matter Cocoa'}
                          </Box>
                          ) is cleared for delivery to{' '}
                          <Box component="span" sx={{ color: PRIMARY, fontWeight: 900, fontStyle: 'italic' }}>
                            {heroName.trim()}
                          </Box>{' '}
                          on{' '}
                          <Box component="span" sx={{ borderBottom: `4px solid ${PRIMARY}`, fontWeight: 900 }}>
                            {formattedMissionDate}
                          </Box>
                          , straight to{' '}
                          <Box component="span" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                            {deliveryLocation.trim()}
                          </Box>
                          .
                        </Typography>
                        <Typography sx={{ fontWeight: 700, opacity: 0.85, fontSize: '0.95rem', fontStyle: 'italic' }}>
                          Transmission received. The pastry wing salutes you. Stand by for sprinkles.
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          flexShrink: 0,
                          bgcolor: PRIMARY_CONTAINER,
                          color: ON_PRIMARY_CONTAINER,
                          border: COMIC,
                          p: 1.5,
                          transform: 'rotate(-8deg)',
                          boxShadow: TAG_SHADOW,
                          display: { xs: 'none', sm: 'block' },
                        }}
                      >
                        <MsIcon name="cake" fill={1} sx={{ fontSize: 40 }} />
                      </Box>
                    </Stack>
                    <Button
                      type="button"
                      fullWidth
                      onClick={resetDeployment}
                      sx={{
                        mt: 3,
                        fontFamily: GROTESK,
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        border: `4px solid ${INK}`,
                        borderRadius: 0,
                        bgcolor: TERTIARY_CONTAINER,
                        color: ON_TERTIARY_CONTAINER,
                        py: 1.5,
                        boxShadow: INK_BLEED,
                        '&:hover': { bgcolor: PRIMARY_FIXED, color: ON_PRIMARY },
                        ...activePress,
                      }}
                    >
                      Plot another mission
                    </Button>
                  </Box>
                </Collapse>
              </Stack>
            </Box>

            <Box
              component="section"
              sx={{
                gridColumn: { lg: 'span 3' },
                bgcolor: SURFACE,
                p: { xs: 3, md: 4 },
                border: COMIC,
                boxShadow: INK_BLEED,
                transform: 'rotate(1deg)',
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography
                  sx={{
                    fontFamily: GROTESK,
                    fontSize: { xs: '2rem', md: '2.25rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                  }}
                >
                  The Kinetic Calendar
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button sx={{ p: 1, minWidth: 0, border: COMIC, bgcolor: SURFACE_CONTAINER, borderRadius: 0, ...activePress }}>
                    <MsIcon name="arrow_back" sx={{ color: ON_SURFACE }} />
                  </Button>
                  <Button sx={{ p: 1, minWidth: 0, border: COMIC, bgcolor: SURFACE_CONTAINER, borderRadius: 0, ...activePress }}>
                    <MsIcon name="arrow_forward" sx={{ color: ON_SURFACE }} />
                  </Button>
                </Stack>
              </Stack>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1,
                }}
              >
                {(['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const).map((d, i) => (
                  <Typography
                    key={`${d}-${i}`}
                    sx={{
                      textAlign: 'center',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      py: 1,
                      color: i >= 5 ? PRIMARY : ON_SURFACE,
                      opacity: 1,
                    }}
                  >
                    {d}
                  </Typography>
                ))}
                {Array.from({ length: 31 }, (_, j) => j + 1).map((day) => {
                  const isEvent = dayMeta.event.has(day);
                  const isToday = dayMeta.today.has(day);
                  return (
                    <Box
                      key={day}
                      sx={{
                        aspectRatio: '1',
                        border: COMIC,
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        bgcolor: isToday ? PRIMARY_CONTAINER : SURFACE_BRIGHT,
                        position: 'relative',
                        cursor: 'pointer',
                        animation: `stagger-fade-cake 0.4s ease-out forwards`,
                        animationDelay: `${day * 20}ms`,
                        opacity: 0,
                        '&:hover': {
                          bgcolor: PRIMARY_CONTAINER,
                          transform: 'scale(1.05) translateY(-4px)',
                        },
                        transition: 'transform 200ms, background-color 200ms',
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, fontSize: '1.125rem' }}>{day}</Typography>
                      {isEvent && <MsIcon name="star" fill={1} sx={{ fontSize: 22, color: PRIMARY, alignSelf: 'flex-end' }} />}
                      {isEvent && (
                        <Box
                          sx={{
                            ...bendayDots,
                            opacity: 0.35,
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>

          {/* Protocol */}
          <Box
            component="section"
            sx={{
              bgcolor: ON_BACKGROUND,
              color: SURFACE,
              p: { xs: 3, md: 5 },
              border: COMIC,
              boxShadow: INK_BLEED,
              transform: 'rotate(-1deg)',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={6}
              alignItems="center"
            >
              <Box sx={{ width: { md: '33.333%' } }}>
                <Typography
                  sx={{
                    fontFamily: GROTESK,
                    fontSize: { xs: '2.5rem', md: '3rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    mb: 2,
                    color: PRIMARY_FIXED,
                  }}
                >
                  Auto-Alchemist Protocol
                </Typography>
                <Typography sx={{ fontWeight: 700, opacity: 0.8 }}>
                  Configure your automated synthesis engines for recurring tactical cake deployments.
                </Typography>
              </Box>
              <Box sx={{ width: { md: '66.666%' }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                {[
                  {
                    title: 'Cake Synthesis',
                    sub: 'Auto-order on specific milestones',
                    on: synthesisOn,
                    set: setSynthesisOn,
                  },
                  { title: 'Advance Intel', sub: 'Early mission warnings', on: intelOn, set: setIntelOn },
                ].map((row) => (
                  <Stack
                    key={row.title}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ bgcolor: PROTO_PANEL, p: 3, border: COMIC, borderColor: PRIMARY }}
                  >
                    <Box>
                      <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.25rem' }}>{row.title}</Typography>
                      <Typography sx={{ fontSize: '0.875rem', opacity: 0.6 }}>{row.sub}</Typography>
                    </Box>
                    <Box
                      role="switch"
                      aria-checked={row.on}
                      onClick={() => row.set(!row.on)}
                      sx={{
                        width: 64,
                        height: 32,
                        bgcolor: row.on ? SURFACE_CONTAINER : ON_PRIMARY,
                        border: COMIC,
                        position: 'relative',
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 6,
                          ...(row.on ? { right: 6 } : { left: 6 }),
                          width: 16,
                          height: 16,
                          bgcolor: row.on ? PRIMARY : ON_BACKGROUND,
                          border: `2px solid ${INK}`,
                        }}
                      />
                    </Box>
                  </Stack>
                ))}
              </Box>
            </Stack>
          </Box>

          {/* Transmissions */}
          <Box
            component="section"
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            <Box sx={{ gridColumn: '1 / -1' }}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ height: 4, bgcolor: ON_BACKGROUND, flex: 1, maxWidth: 200 }} />
                <Typography
                  sx={{
                    fontFamily: GROTESK,
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    px: 1,
                  }}
                >
                  Mission Success Transmissions
                </Typography>
                <Box sx={{ height: 4, bgcolor: ON_BACKGROUND, flex: 1, maxWidth: 200 }} />
              </Stack>
            </Box>
            {(
              [
                {
                  q: '"The Black Forest payload arrived exactly at T-Minus zero. Target was completely overwhelmed by flavor. Success!"',
                  who: '— AGENT SWEET-TOOTH',
                  bg: SURFACE_CONTAINER_HIGHEST,
                  whoColor: PRIMARY,
                  slant: '2deg',
                  delay: '100ms',
                },
                {
                  q: '"Deployment of the Lemon Zest Protocol was seamless. The citrus extraction levels were off the charts. Highly recommended."',
                  who: '— DR. FROSTING',
                  bg: TERTIARY_CONTAINER,
                  whoColor: ON_TERTIARY_CONTAINER,
                  slant: '-1deg',
                  delay: '300ms',
                },
                {
                  q: '"Best Mission Intel yet. The cake was dense, rich, and physically impossible to resist. Returning for more."',
                  who: '— THE CAPTAIN',
                  bg: SURFACE_BRIGHT,
                  whoColor: ON_SURFACE,
                  slant: '2deg',
                  delay: '500ms',
                },
              ] as const
            ).map((card) => (
              <Box
                key={card.who}
                className="cake-pop-in"
                sx={{
                  bgcolor: card.bg,
                  p: 3,
                  border: COMIC,
                  position: 'relative',
                  transform: `rotate(${card.slant})`,
                  boxShadow: `4px 4px 0 ${INK}`,
                  animationDelay: card.delay,
                  opacity: 0,
                }}
              >
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, fontStyle: 'italic', mb: 2 }}>{card.q}</Typography>
                <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', color: card.whoColor }}>{card.who}</Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -16,
                    left: 40,
                    width: 32,
                    height: 32,
                    bgcolor: card.bg,
                    border: COMIC,
                    transform: 'rotate(45deg)',
                    borderTop: 'none',
                    borderLeft: 'none',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {!isMdUp && (
          <Box
            component="nav"
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              zIndex: 50,
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              minHeight: 80,
              px: 2,
              bgcolor: SURFACE,
              borderTop: `6px solid ${INK}`,
            }}
          >
            {(
              [
                { icon: 'home', label: 'Home', to: '/', active: false },
                { icon: 'star', label: 'Missions', to: '/birthday-cake', active: true, fill: 1 as const },
                { icon: 'menu_book', label: 'Menu', to: '/products', active: false },
                { icon: 'person', label: 'Profile', to: '/my-page', active: false },
              ] as const
            ).map((item) => (
              <Box
                key={item.label}
                component={Link}
                to={item.to}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1.5,
                  color: item.active ? SURFACE : INK,
                  bgcolor: item.active ? PRIMARY : 'transparent',
                  border: item.active ? `2px solid ${INK}` : 'none',
                  transform: item.active ? 'rotate(-1deg)' : 'none',
                  textDecoration: 'none',
                }}
              >
                <MsIcon name={item.icon} fill={'fill' in item ? item.fill : undefined} sx={{ fontSize: 24 }} />
                <Typography sx={{ fontFamily: GROTESK, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', mt: 0.5 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
}
