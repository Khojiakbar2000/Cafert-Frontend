import React, { useState, useMemo, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import { CheckCircle as CheckCircleIcon, Close as CloseIcon } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { STITCH_THEME } from '../../components/stitchUi';

type NewsletterColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  surface: string;
};

interface NewsletterSubscriptionProps {
  colors?: NewsletterColors;
}

const INK = STITCH_THEME.ink;
const PAPER_COMIC = '#F1D79C';
const INPUT_SURFACE = '#FFFEF6';
const ON_TERTIARY = STITCH_THEME.onTertiary;

const DEFAULT_COLORS: NewsletterColors = {
  primary: INK,
  secondary: '#8B4513',
  accent: STITCH_THEME.primary,
  background: 'transparent',
  text: INK,
  textSecondary: '#3d2f28',
  border: INK,
  surface: PAPER_COMIC,
};

const BORDER_PANEL_PX = 8;
const BORDER_CONTROL_PX = 4;
const SHADOW_PANEL = 14;
const SHADOW_CONTROL = 8;
const GROTESK = '"Space Grotesk", system-ui, sans-serif';

const comicPop = {
  clipPath:
    'polygon(0% 12%, 12% 12%, 12% 0%, 88% 0%, 88% 12%, 100% 12%, 100% 88%, 88% 88%, 88% 100%, 12% 100%, 12% 88%, 0% 88%)',
} as const;

const NewsletterSubscriptionComponent: React.FC<NewsletterSubscriptionProps> = ({ colors }) => {
  const theme = useTheme();

  const prevColorValuesRef = useRef<string | null>(null);
  const prevComponentColorsRef = useRef<NewsletterColors>(DEFAULT_COLORS);

  const componentColors = useMemo(() => {
    if (!colors) {
      if (prevColorValuesRef.current !== 'DEFAULT') {
        prevComponentColorsRef.current = DEFAULT_COLORS;
        prevColorValuesRef.current = 'DEFAULT';
      }
      return prevComponentColorsRef.current;
    }

    const colorKey = `${colors.primary}|${colors.secondary}|${colors.accent}|${colors.background}|${colors.text}|${colors.textSecondary}|${colors.border}|${colors.surface}`;

    if (colorKey === prevColorValuesRef.current) {
      return prevComponentColorsRef.current;
    }

    prevColorValuesRef.current = colorKey;
    const newColors: NewsletterColors = {
      primary: String(colors.primary || DEFAULT_COLORS.primary),
      secondary: String(colors.secondary || DEFAULT_COLORS.secondary),
      accent: String(colors.accent || DEFAULT_COLORS.accent),
      background: String(colors.background || DEFAULT_COLORS.background),
      text: String(colors.text || DEFAULT_COLORS.text),
      textSecondary: String(colors.textSecondary || DEFAULT_COLORS.textSecondary),
      border: String(colors.border || DEFAULT_COLORS.border),
      surface: String(colors.surface || DEFAULT_COLORS.surface),
    };
    prevComponentColorsRef.current = newColors;

    return prevComponentColorsRef.current;
  }, [
    colors?.primary,
    colors?.secondary,
    colors?.accent,
    colors?.background,
    colors?.text,
    colors?.textSecondary,
    colors?.border,
    colors?.surface,
  ]);

  const benefits = useMemo(
    () => [
      { text: 'Weekly Coffee Tips', emoji: '☕' },
      { text: 'Exclusive Offers', emoji: '🎁' },
      { text: 'Event Updates', emoji: '📅' },
    ],
    []
  );

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      setShowAlert(true);
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubscribed(true);
      setEmail('');
      setShowAlert(true);

      setTimeout(() => {
        setIsSubscribed(false);
        setShowAlert(false);
      }, 5000);
    } catch {
      setError('Something went wrong. Please try again.');
      setShowAlert(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    setError('');
  };

  if (!componentColors) {
    return null;
  }

  const btnAccent = componentColors.accent;

  return (
    <Box
      component="section"
      aria-labelledby="newsletter-heading"
      sx={{
        /* Float panel: no gray band — sit on page chrome with pull-up overlap */
        mt: { xs: '-2.5rem', sm: '-3.25rem', md: '-4rem' },
        py: { xs: '2rem', md: '3rem' },
        px: { xs: '1rem', sm: '1.5rem' },
        position: 'relative',
        backgroundColor: 'transparent',
        overflow: 'visible',
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-40px' }}
        >
          {/* Comic panel */}
          <Box
            sx={{
              position: 'relative',
              backgroundColor: PAPER_COMIC,
              border: `${BORDER_PANEL_PX}px solid ${INK}`,
              boxShadow: `${SHADOW_PANEL}px ${SHADOW_PANEL}px 0 0 ${INK}`,
              px: { xs: '1.5rem', sm: '2rem', md: '2.75rem' },
              py: { xs: '2.25rem', md: '3rem' },
              overflow: 'hidden',
            }}
          >
            {/* Halftone texture */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
                backgroundSize: '11px 11px',
                opacity: 0.11,
                mixBlendMode: 'multiply',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(${INK} 0.5px, transparent 0.5px)`,
                backgroundSize: '5px 5px',
                opacity: 0.06,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Heading + comic badge */}
              <Box
                sx={{
                  textAlign: 'center',
                  mb: { xs: '1.75rem', md: '2.25rem' },
                  position: 'relative',
                  maxWidth: '36rem',
                  mx: 'auto',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-block',
                    position: 'relative',
                    mb: { xs: '1.25rem', md: '1.5rem' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: { xs: -8, md: -12 },
                      right: { xs: -28, md: -36 },
                      zIndex: 2,
                      bgcolor: STITCH_THEME.tertiaryContainer,
                      color: ON_TERTIARY,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      fontSize: { xs: '0.7rem', md: '0.8rem' },
                      letterSpacing: '0.06em',
                      py: '0.35rem',
                      px: '0.75rem',
                      border: `4px solid ${INK}`,
                      ...comicPop,
                      transform: 'rotate(12deg)',
                      boxShadow: `6px 6px 0 0 ${INK}`,
                      fontFamily: GROTESK,
                    }}
                  >
                    New drops
                  </Box>
                  <Typography
                    id="newsletter-heading"
                    variant="h3"
                    sx={{
                      m: 0,
                      color: componentColors.text,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.035em',
                      lineHeight: 1.05,
                      fontFamily: GROTESK,
                      fontSize: { xs: 'clamp(1.85rem, 7vw, 2.35rem)', md: 'clamp(2.35rem, 4vw, 3rem)' },
                      textShadow: `4px 4px 0 rgba(26, 15, 13, 0.12)`,
                    }}
                  >
                    Stay brewed in
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  component="p"
                  sx={{
                    m: 0,
                    color: componentColors.textSecondary,
                    maxWidth: '32rem',
                    mx: 'auto',
                    lineHeight: 1.55,
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    fontFamily: GROTESK,
                  }}
                >
                  Subscribe and be the first to know about new blends, special events, and exclusive offers.
                </Typography>
              </Box>

              <AnimatePresence>
                {showAlert && (
                  <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Box sx={{ mb: 2.5, maxWidth: '500px', mx: 'auto' }}>
                      <Alert
                        severity={isSubscribed ? 'success' : 'error'}
                        icon={isSubscribed ? <CheckCircleIcon /> : undefined}
                        action={
                          <IconButton color="inherit" size="small" onClick={handleCloseAlert} aria-label="Close alert">
                            <CloseIcon />
                          </IconButton>
                        }
                        sx={{
                          borderRadius: 0,
                          border: `4px solid ${INK}`,
                          boxShadow: `6px 6px 0 0 ${INK}`,
                          fontFamily: GROTESK,
                          fontWeight: 600,
                          backgroundColor: isSubscribed ? '#2e7d32' : '#c62828',
                          color: 'white',
                          '& .MuiAlert-icon': { color: 'white' },
                        }}
                      >
                        {isSubscribed ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            Thank you for subscribing! Welcome to our coffee community!
                          </Box>
                        ) : (
                          error
                        )}
                      </Alert>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08 }}
                viewport={{ once: true }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubscribe}
                  sx={{
                    maxWidth: '540px',
                    mx: 'auto',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'stretch', sm: 'flex-start' },
                      gap: { xs: 2, sm: 2 },
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      type="email"
                      autoComplete="email"
                      sx={{
                        flex: 1,
                        '& .MuiOutlinedInput-root': {
                          fontFamily: GROTESK,
                          fontWeight: 600,
                          fontSize: { xs: '0.95rem', md: '1rem' },
                          borderRadius: '9999px',
                          backgroundColor: INPUT_SURFACE,
                          boxShadow: `${SHADOW_CONTROL - 2}px ${SHADOW_CONTROL - 2}px 0 0 ${INK}`,
                          transition:
                            'box-shadow 0.2s ease, transform 0.2s ease, background-color 0.2s ease',
                          '& fieldset': {
                            borderWidth: BORDER_CONTROL_PX,
                            borderColor: INK,
                          },
                          '&:hover': {
                            backgroundColor: '#fff',
                            '& fieldset': {
                              borderWidth: BORDER_CONTROL_PX,
                              borderColor: INK,
                            },
                          },
                          '&.Mui-focused': {
                            backgroundColor: '#fff',
                            boxShadow: `${SHADOW_CONTROL}px ${SHADOW_CONTROL}px 0 0 ${INK}`,
                            '& fieldset': {
                              borderWidth: BORDER_CONTROL_PX,
                              borderColor: btnAccent,
                            },
                          },
                        },
                      }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      disableElevation
                      disabled={isLoading}
                      sx={{
                        flexShrink: 0,
                        backgroundColor: btnAccent,
                        color: STITCH_THEME.onPrimary,
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        fontFamily: GROTESK,
                        px: { xs: 3, sm: 3.5 },
                        py: { xs: 1.35, sm: 1.5 },
                        borderRadius: '9999px',
                        border: `${BORDER_CONTROL_PX}px solid ${INK}`,
                        boxShadow: `${SHADOW_CONTROL}px ${SHADOW_CONTROL}px 0 0 ${INK}`,
                        fontSize: { xs: '0.9rem', md: '0.95rem' },
                        minWidth: { xs: '100%', sm: '158px' },
                        transition:
                          'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? btnAccent : '#e64500',
                          transform: 'translateY(-3px)',
                          boxShadow: `${SHADOW_CONTROL + 4}px ${SHADOW_CONTROL + 4}px 0 0 ${INK}`,
                        },
                        '&:active': {
                          transform: 'translateY(1px)',
                          boxShadow: `4px 4px 0 0 ${INK}`,
                        },
                        '&:disabled': {
                          backgroundColor: `${INK}33`,
                          color: INK,
                          borderColor: INK,
                          boxShadow: `4px 4px 0 0 ${INK}`,
                        },
                      }}
                    >
                      {isLoading ? 'Sending…' : 'Subscribe'}
                    </Button>
                  </Box>
                </Box>
              </motion.div>

              <Box sx={{ textAlign: 'center', mt: { xs: '1.75rem', md: '2rem' } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: componentColors.textSecondary,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                    maxWidth: '26rem',
                    mx: 'auto',
                    lineHeight: 1.5,
                    fontWeight: 500,
                    fontFamily: GROTESK,
                  }}
                >
                  We respect your privacy. Unsubscribe anytime — no spam, just coffee.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: { xs: 1.25, md: 1.75 },
                  mt: { xs: '1.75rem', md: '2.25rem' },
                  flexWrap: 'wrap',
                }}
              >
                {benefits.map((benefit) => (
                  <Box
                    key={benefit.text}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.75,
                      backgroundColor: 'rgba(255, 255, 255, 0.45)',
                      py: '0.5rem',
                      px: '1rem',
                      borderRadius: '9999px',
                      border: `3px solid ${INK}`,
                      boxShadow: `4px 4px 0 0 ${INK}`,
                      fontFamily: GROTESK,
                    }}
                  >
                    <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>{benefit.emoji}</span>
                    <Typography
                      variant="body2"
                      sx={{
                        color: componentColors.text,
                        fontWeight: 700,
                        fontSize: { xs: '0.75rem', md: '0.8rem' },
                        fontFamily: GROTESK,
                      }}
                    >
                      {benefit.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

NewsletterSubscriptionComponent.displayName = 'NewsletterSubscription';

export default NewsletterSubscriptionComponent;
