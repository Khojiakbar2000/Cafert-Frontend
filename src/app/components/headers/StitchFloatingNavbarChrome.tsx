import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  Popover,
  ClickAwayListener,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  MoreHoriz as MoreHorizIcon,
  Language as LanguageIcon,
  Nightlight as NightlightIcon,
} from '@mui/icons-material';
import { NavLink, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Basket from './Basket';
import type { CartItem } from '../../../lib/types/search';

const STITCH_INK = '#1A0F0D';
const STITCH_ORANGE = '#FF4E00';

/** Help Center full-width strip — matches help page shell */
const HELP_MAIN_MAX = 'min(100%, 2000px)';

export type StitchPrimaryNavItem = { path: string; label: string };

export type StitchNavbarChromeLayout = 'floating' | 'help';

type StitchFloatingNavbarChromeProps = {
  isDarkMode: boolean;
  isLgUp: boolean;
  authMember: unknown;
  stitchPrimaryNav: StitchPrimaryNavItem[];
  moreNavItems: StitchPrimaryNavItem[];
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (v: boolean) => void;
  setLoginOpen: (v: boolean) => void;
  handleLogoutRequest: () => void;
  onSearchOpen: () => void;
  toggleTheme: () => void;
  burgerAnchorEl: HTMLElement | null;
  setBurgerAnchorEl: (el: HTMLElement | null) => void;
  stitchNavActive: (path: string) => boolean;
  floatingChromeSpacerPx: number;
  /** `help` = full-width Help Center bar; same controls as floating pill. */
  chromeLayout?: StitchNavbarChromeLayout;
};

const rowBtnSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  p: 1.75,
  width: '100%',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  bgcolor: 'transparent',
  fontFamily: '"Space Grotesk", system-ui, sans-serif',
  fontWeight: 700,
  fontStyle: 'italic',
  textTransform: 'uppercase',
  fontSize: '0.95rem',
  color: STITCH_INK,
  textAlign: 'left',
  '&:hover': {
    bgcolor: STITCH_ORANGE,
    color: '#fff',
  },
} as const;

const navIconBtnSize = { width: 60, height: 60 } as const;
const navIconSize = 30;

export function StitchFloatingNavbarChrome({
  isDarkMode,
  isLgUp,
  authMember,
  stitchPrimaryNav,
  moreNavItems,
  cartItems,
  onAdd,
  onRemove,
  onDelete,
  onDeleteAll,
  setSignupOpen,
  setLoginOpen,
  handleLogoutRequest,
  onSearchOpen,
  toggleTheme,
  burgerAnchorEl,
  setBurgerAnchorEl,
  stitchNavActive,
  floatingChromeSpacerPx,
  chromeLayout = 'floating',
}: StitchFloatingNavbarChromeProps) {
  const { t, i18n } = useTranslation();
  const history = useHistory();
  const burgerOpen = Boolean(burgerAnchorEl);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const helpBarBg = isDarkMode ? '#1a0f0d' : '#fcf6e8';
  const helpBarInk = isDarkMode ? '#fcf6e8' : STITCH_INK;

  const primaryLinkTypography = (path: string, label: string, variant: 'floating' | 'help') => {
    const active = stitchNavActive(path);
    if (variant === 'help') {
      return (
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            fontSize: '1.05rem',
            color: active ? STITCH_ORANGE : helpBarInk,
            textDecoration: active ? 'underline' : 'none',
            textUnderlineOffset: '4px',
            textDecorationThickness: '2px',
            textDecorationColor: STITCH_ORANGE,
            '&:hover': { opacity: 0.88 },
          }}
        >
          {label}
        </Typography>
      );
    }
    return (
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700,
          fontStyle: 'italic',
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          fontSize: '1.05rem',
          color: active ? STITCH_ORANGE : isDarkMode ? '#f5ebe3' : STITCH_INK,
          textDecoration: active ? 'underline' : 'none',
          textUnderlineOffset: '4px',
          textDecorationThickness: '2px',
          textDecorationColor: STITCH_ORANGE,
          '&:hover': { color: STITCH_ORANGE },
        }}
      >
        {label}
      </Typography>
    );
  };

  /** Main menu — fixed floating control (classic stitch offset shadow), only on non-help layout. */
  const floatingMainBurgerButton = (
    <IconButton
      type="button"
      disableRipple
      onClick={(e) => {
        setMoreMenuOpen(false);
        setBurgerAnchorEl(e.currentTarget);
      }}
      aria-label={t('navigation.menu')}
      aria-expanded={burgerOpen}
      sx={{
        ...navIconBtnSize,
        borderRadius: 0,
        bgcolor: isDarkMode ? '#2a2620' : '#fff',
        border: `2px solid ${STITCH_INK}`,
        boxShadow: `6px 6px 0 0 ${STITCH_INK}`,
        color: isDarkMode ? '#f5ebe3' : STITCH_INK,
        '&:hover': { bgcolor: isDarkMode ? '#332e2a' : '#FFF8F6' },
      }}
    >
      <MenuIcon
        sx={{
          fontSize: navIconSize,
        }}
      />
    </IconButton>
  );

  /** Main menu — inline on Help Center bar only. */
  const helpMainBurgerButton = (
    <IconButton
      type="button"
      onClick={(e) => {
        setMoreMenuOpen(false);
        setBurgerAnchorEl(e.currentTarget);
      }}
      aria-label={t('navigation.menu')}
      aria-expanded={burgerOpen}
      sx={{
        ...navIconBtnSize,
        borderRadius: 0,
        bgcolor: isDarkMode ? '#2a2620' : '#f6f0e1',
        border: `2px solid ${STITCH_INK}`,
        boxShadow: `6px 6px 0 0 ${STITCH_INK}`,
        color: isDarkMode ? '#f5ebe3' : STITCH_INK,
        '&:hover': { bgcolor: isDarkMode ? '#332e2a' : '#FFF8F6' },
        '&:active': {
          boxShadow: `2px 2px 0 0 ${STITCH_INK}`,
        },
      }}
    >
      <MenuIcon
        sx={{
          fontSize: navIconSize,
        }}
      />
    </IconButton>
  );

  /** Extra routes — ⋯ only (no chevron); toggle panel with no collapse animation. */
  const moreNavMenu = (
    <ClickAwayListener onClickAway={() => setMoreMenuOpen(false)}>
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          pointerEvents: 'auto',
        }}
      >
        <IconButton
          type="button"
          disableRipple
          onClick={() => {
            setMoreMenuOpen((open) => !open);
            setBurgerAnchorEl(null);
          }}
          aria-label={t('navigation.more')}
          aria-expanded={moreMenuOpen}
          aria-haspopup="true"
          aria-controls="navbar-more-links"
          id="navbar-more-trigger"
          sx={{
            ...navIconBtnSize,
            borderRadius: '18px',
            bgcolor: isDarkMode ? 'rgba(255,78,0,0.12)' : '#fff',
            border: `3px solid ${STITCH_ORANGE}`,
            boxShadow: `4px 4px 0 0 ${STITCH_ORANGE}`,
            color: STITCH_ORANGE,
            '&:hover': {
              bgcolor: isDarkMode ? 'rgba(255,78,0,0.22)' : 'rgba(255,78,0,0.08)',
            },
          }}
        >
          <MoreHorizIcon sx={{ fontSize: navIconSize + 2 }} />
        </IconButton>
        {moreMenuOpen ? (
          <Box
            id="navbar-more-links"
            role="menu"
            sx={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              width: 292,
              p: 2,
              border: `2px solid ${STITCH_INK}`,
              borderRadius: '12px',
              boxShadow: `8px 8px 0 0 ${STITCH_INK}`,
              bgcolor: isDarkMode ? '#1e1a18' : '#fff',
              zIndex: 1350,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {moreNavItems.map(({ path, label }) => (
                <Box
                  key={path}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => {
                    setMoreMenuOpen(false);
                    history.push(path);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setMoreMenuOpen(false);
                      history.push(path);
                    }
                  }}
                  sx={{
                    ...rowBtnSx,
                    color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                    justifyContent: 'flex-start',
                    boxSizing: 'border-box',
                  }}
                >
                  {label}
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
      </Box>
    </ClickAwayListener>
  );

  const authCluster = (
    <>
      <Basket
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
      />
      {authMember ? (
        <Button
          type="button"
          onClick={handleLogoutRequest}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            fontSize: '0.9rem',
            px: 3.25,
            py: 1.15,
            borderRadius: chromeLayout === 'help' ? 0 : '9999px',
            bgcolor: STITCH_INK,
            color: '#fff',
            boxShadow: chromeLayout === 'help' ? `4px 4px 0 0 ${STITCH_INK}` : 'none',
            border: chromeLayout === 'help' ? `2px solid ${STITCH_INK}` : undefined,
            '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
            transition: 'none',
          }}
          disableRipple
        >
          {t('navigation.logout')}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={() => setLoginOpen(true)}
          sx={{
            display: { xs: 'none', md: 'inline-flex' },
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700,
            fontStyle: 'italic',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            fontSize: '0.9rem',
            px: 3.25,
            py: 1.15,
            borderRadius: chromeLayout === 'help' ? 0 : '9999px',
            bgcolor: STITCH_INK,
            color: '#fff',
            boxShadow: chromeLayout === 'help' ? `4px 4px 0 0 ${STITCH_INK}` : undefined,
            border: chromeLayout === 'help' ? `2px solid ${STITCH_INK}` : undefined,
            '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
            transition: 'none',
          }}
          disableRipple
        >
          {t('navigation.login')}
        </Button>
      )}
    </>
  );

  return (
    <>
      {chromeLayout === 'help' ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1250,
            borderBottom: `8px solid ${helpBarInk}`,
            bgcolor: helpBarBg,
            pointerEvents: 'none',
          }}
        >
          <Box
            component="nav"
            sx={{
              position: 'relative',
              maxWidth: HELP_MAIN_MAX,
              width: '100%',
              mx: 'auto',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              minHeight: 72,
              px: { xs: 2, md: 3 },
              py: 1.5,
              pointerEvents: 'auto',
              overflow: 'visible',
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-start',
                minWidth: 0,
                zIndex: 1,
                pointerEvents: 'none',
                '& > *': { pointerEvents: 'auto' },
              }}
            >
              <NavLink to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                <Typography
                  sx={{
                    fontFamily: '"Space Grotesk", system-ui, sans-serif',
                    fontSize: { xs: '1.35rem', md: '1.75rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    color: helpBarInk,
                    letterSpacing: '-0.03em',
                    textShadow: `4px 4px 0 ${STITCH_ORANGE}`,
                  }}
                >
                  The Pulp Alchemist
                </Typography>
              </NavLink>
            </Box>
            {isLgUp && (
              <Box
                sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translate3d(-50%, 0, 0)',
                  zIndex: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 2, md: 3.5 },
                  flexWrap: 'nowrap',
                  pointerEvents: 'auto',
                  maxWidth: 'min(58vw, 720px)',
                }}
              >
                {stitchPrimaryNav.map(({ path, label }) => (
                  <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
                    {primaryLinkTypography(path, label, 'help')}
                  </NavLink>
                ))}
              </Box>
            )}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1,
                flexShrink: 0,
                zIndex: 1,
                pointerEvents: 'none',
                '& > *': { pointerEvents: 'auto' },
              }}
            >
              {authCluster}
              {helpMainBurgerButton}
              {moreNavMenu}
            </Box>
          </Box>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              position: 'fixed',
              top: 16,
              left: '50%',
              transform: 'translate3d(-50%, 0, 0)',
              zIndex: 1250,
              width: '95%',
              maxWidth: '80rem',
              pointerEvents: 'none',
            }}
          >
            <Box
              component="nav"
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, sm: 4 },
                minHeight: 76,
                borderRadius: '9999px',
                border: `2px solid ${STITCH_INK}`,
                boxShadow: `4px 4px 0 0 ${STITCH_INK}`,
                bgcolor: isDarkMode ? 'rgba(26, 22, 20, 0.98)' : 'rgba(255, 248, 246, 0.98)',
                boxSizing: 'border-box',
                pointerEvents: 'auto',
                overflow: 'visible',
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  minWidth: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  '& > *': { pointerEvents: 'auto' },
                }}
              >
                <NavLink to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: '"Space Grotesk", system-ui, sans-serif',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.04em',
                      fontSize: { xs: '1.15rem', sm: '1.55rem' },
                      color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                      textShadow: `2px 2px 0 ${STITCH_ORANGE}`,
                    }}
                  >
                    Cafert
                  </Typography>
                </NavLink>
              </Box>

              {isLgUp && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translate3d(-50%, 0, 0)',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: { md: 2.25, lg: 3 },
                    flexWrap: 'nowrap',
                    pointerEvents: 'auto',
                    maxWidth: 'min(55vw, 640px)',
                  }}
                >
                  {stitchPrimaryNav.map(({ path, label }) => (
                    <NavLink key={path} to={path} style={{ textDecoration: 'none' }}>
                      {primaryLinkTypography(path, label, 'floating')}
                    </NavLink>
                  ))}
                </Box>
              )}

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: { xs: 0.75, sm: 1 },
                  flexShrink: 0,
                  zIndex: 1,
                  pointerEvents: 'none',
                  '& > *': { pointerEvents: 'auto' },
                }}
              >
                {authCluster}
                {moreNavMenu}
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              position: 'fixed',
              top: { xs: 88, md: 96 },
              right: { xs: 16, md: 24 },
              zIndex: 1250,
              pointerEvents: 'auto',
            }}
          >
            {floatingMainBurgerButton}
          </Box>
        </>
      )}

      <Popover
          open={burgerOpen}
          anchorEl={burgerAnchorEl}
          onClose={() => {
            setBurgerAnchorEl(null);
            setMoreMenuOpen(false);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ zIndex: 1300 }}
          PaperProps={{
            sx: {
              mt: 2,
              width: 288,
              p: 2.25,
              border: `2px solid ${STITCH_INK}`,
              borderRadius: '12px',
              boxShadow: `8px 8px 0 0 ${STITCH_INK}`,
              bgcolor: isDarkMode ? '#1e1a18' : '#fff',
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.15 }}>
            {!isLgUp &&
              stitchPrimaryNav.map(({ path, label }) => (
                <Box
                  key={path}
                  role="link"
                  tabIndex={0}
                  onClick={() => {
                    setBurgerAnchorEl(null);
                    history.push(path);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setBurgerAnchorEl(null);
                      history.push(path);
                    }
                  }}
                  sx={{
                    ...rowBtnSx,
                    color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                    justifyContent: 'flex-start',
                    boxSizing: 'border-box',
                  }}
                >
                  {label}
                </Box>
              ))}
            {!isLgUp && <Divider sx={{ borderColor: `${STITCH_INK}22`, my: 0.5 }} />}

            <Button
              type="button"
              onClick={() => {
                setBurgerAnchorEl(null);
                onSearchOpen();
              }}
              sx={{
                ...rowBtnSx,
                color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
              }}
            >
              <SearchIcon sx={{ fontSize: 24 }} />
              {t('navigation.searchProducts')}
            </Button>

            <Box sx={{ px: 0.5, py: 0.5 }}>
              <Typography
                sx={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: isDarkMode ? 'rgba(245,235,227,0.7)' : 'rgba(26,15,13,0.65)',
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <LanguageIcon sx={{ fontSize: 20 }} />
                {t('common.language')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.75 }}>
                <Button
                  size="small"
                  variant={i18n.language.startsWith('en') ? 'contained' : 'outlined'}
                  onClick={() => i18n.changeLanguage('en')}
                  sx={{
                    flex: 1,
                    fontWeight: 800,
                    border: `2px solid ${STITCH_INK}`,
                    borderRadius: 2,
                    color: STITCH_INK,
                    bgcolor: i18n.language.startsWith('en') ? STITCH_ORANGE : 'transparent',
                    '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
                  }}
                >
                  EN
                </Button>
                <Button
                  size="small"
                  variant={i18n.language.startsWith('ko') ? 'contained' : 'outlined'}
                  onClick={() => i18n.changeLanguage('ko')}
                  sx={{
                    flex: 1,
                    fontWeight: 800,
                    border: `2px solid ${STITCH_INK}`,
                    borderRadius: 2,
                    color: STITCH_INK,
                    bgcolor: i18n.language.startsWith('ko') ? STITCH_ORANGE : 'transparent',
                    '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
                  }}
                >
                  KO
                </Button>
              </Box>
            </Box>

            <Button
              type="button"
              onClick={() => toggleTheme()}
              sx={{
                ...rowBtnSx,
                color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                '&:hover': { bgcolor: STITCH_ORANGE, color: '#fff' },
              }}
            >
              <NightlightIcon sx={{ fontSize: 24 }} />
              {isDarkMode ? 'Day mode' : 'Night mode'}
            </Button>

            {!authMember && (
              <Button
                variant="outlined"
                onClick={() => {
                  setBurgerAnchorEl(null);
                  setSignupOpen(true);
                }}
                sx={{
                  mt: 0.5,
                  border: `2px solid ${STITCH_INK}`,
                  borderRadius: 2,
                  fontWeight: 800,
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  color: isDarkMode ? '#f5ebe3' : STITCH_INK,
                }}
              >
                {t('navigation.signup')}
              </Button>
            )}
          </Box>
        </Popover>

      {chromeLayout !== 'help' && floatingChromeSpacerPx > 0 && (
        <Box sx={{ height: floatingChromeSpacerPx, flexShrink: 0 }} aria-hidden />
      )}
    </>
  );
}
