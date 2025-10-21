// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  Stack,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon as MuiListItemIcon,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon,
  Receipt as OrdersIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  Inventory as ProductsIcon,
  Coffee as CoffeeIcon,
  Restaurant as RestaurantIcon,
  Cake as CakeIcon,
  Language as LanguageIcon,
  LocalFireDepartment as FireIcon,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import Basket from './Basket';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { CartItem } from '../../../lib/types/search';

interface EnhancedHomeNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
  setSignupOpen: (isOpen: boolean) => void;
  setLoginOpen: (isOpen: boolean) => void;
  handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

export default function EnhancedHomeNavbar(props: EnhancedHomeNavbarProps) {
  const {
    cartItems,
    onAdd,
    onRemove,
    onDelete,
    onDeleteAll,
    setSignupOpen,
    setLoginOpen,
    handleLogoutClick,
    anchorEl,
    handleCloseLogout,
    handleLogoutRequest,
  } = props;

  const { authMember } = useGlobals();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Force re-render when auth state changes
  useEffect(() => {
    // This ensures the component re-renders when authMember changes
  }, [authMember]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { path: '/', label: t('navigation.home'), icon: <HomeIcon /> },
    { path: '/products', label: t('navigation.products'), icon: <ProductsIcon /> },
    { path: '/salads', label: t('navigation.salads'), icon: <RestaurantIcon /> },
    { path: '/desserts', label: t('navigation.desserts'), icon: <CakeIcon /> },
    ...(authMember ? [{ path: '/orders', label: t('navigation.orders'), icon: <OrdersIcon /> }] : []),
    ...(authMember ? [{ path: '/my-page', label: t('navigation.profile'), icon: <AccountIcon /> }] : []),
    { path: '/help', label: t('navigation.about'), icon: <HelpIcon /> },
  ];

  const drawer = (
    <Box sx={{ 
      width: 350, 
      height: '100%', 
      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1, p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FireIcon sx={{ color: 'white', fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                fontWeight: 800,
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0.1em',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              CAFERT
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navigationItems.map((item, index) => (
            <ListItem
              key={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: location.pathname === item.path ? '#ff6b6b' : 'white',
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                margin: '6px 0',
                borderRadius: '20px',
                transition: 'all 0.4s ease',
                backdropFilter: location.pathname === item.path ? 'blur(15px)' : 'none',
                border: location.pathname === item.path ? '2px solid rgba(255, 255, 255, 0.3)' : '2px solid transparent',
                animation: location.pathname === item.path ? 'pulse 2s infinite' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateX(10px) scale(1.02)',
                  backdropFilter: 'blur(15px)',
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '@keyframes pulse': {
                  '0%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.4)' },
                  '70%': { boxShadow: '0 0 0 10px rgba(255, 255, 255, 0)' },
                  '100%': { boxShadow: '0 0 0 0 rgba(255, 255, 255, 0)' },
                }
              }}
            >
              <NavLink
                to={item.path}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <MuiListItemIcon sx={{ color: 'inherit', minWidth: 50 }}>
                  {item.icon}
                </MuiListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 700 : 500,
                      fontSize: '1.1rem',
                      fontFamily: 'Poppins, sans-serif',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }
                  }}
                />
              </NavLink>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 4, borderTop: '2px solid rgba(255, 255, 255, 0.3)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LanguageIcon sx={{ color: 'white', fontSize: 24 }} />
            <Typography variant="body1" sx={{ color: 'white', fontWeight: 600, fontSize: '1rem' }}>
              {t('common.language')}
            </Typography>
          </Box>
          <LanguageSwitcher />

          {!authMember ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSignupOpen(true);
                  handleDrawerToggle();
                }}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  borderRadius: '15px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  }
                }}
              >
                Sign Up
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  setLoginOpen(true);
                  handleDrawerToggle();
                }}
                sx={{
                  backgroundColor: 'white',
                  color: '#ff6b6b',
                  borderRadius: '15px',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  py: 1.5,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  }
                }}
              >
                Login
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Avatar
                src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                sx={{ 
                  width: 90, 
                  height: 90, 
                  mx: 'auto', 
                  mb: 2,
                  border: '4px solid rgba(255, 255, 255, 0.4)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                {authMember?.memberNick || 'User'}
              </Typography>
              <Button
                variant="outlined"
                size="large"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  handleLogoutRequest();
                  handleDrawerToggle();
                }}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.6)',
                  color: 'white',
                  borderRadius: '15px',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 350 },
        }}
      >
        {drawer}
      </Drawer>

      <AppBar
        position="fixed"
        sx={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.9)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
          backdropFilter: 'blur(25px)',
          borderBottom: scrolled ? '2px solid rgba(255, 107, 107, 0.3)' : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(255, 107, 107, 0.2)' : 'none',
          transition: 'all 0.4s ease',
          zIndex: 1200,
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
            {/* Logo */}
            <Box>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FireIcon 
                    sx={{ 
                      color: '#ff6b6b', 
                      fontSize: 28,
                      filter: 'drop-shadow(0 2px 4px rgba(255, 107, 107, 0.3))',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'rotate(15deg) scale(1.1)',
                      }
                    }} 
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 800,
                      fontFamily: 'Poppins, sans-serif',
                      letterSpacing: '0.1em',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.4))',
                      }
                    }}
                  >
                    CAFERT
                  </Typography>
                </Box>
              </NavLink>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      sx={{
                        color: location.pathname === item.path ? '#ff6b6b' : '#555',
                        backgroundColor: location.pathname === item.path 
                          ? 'rgba(255, 107, 107, 0.15)'
                          : 'transparent',
                        borderRadius: '30px',
                        px: 3,
                        py: 1.5,
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontWeight: location.pathname === item.path ? 700 : 500,
                        fontSize: '0.9rem',
                        fontFamily: 'Poppins, sans-serif',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        border: location.pathname === item.path ? '2px solid rgba(255, 107, 107, 0.3)' : '2px solid transparent',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255, 107, 107, 0.1), transparent)',
                          transition: 'left 0.6s',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          color: '#ff6b6b',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 6px 20px rgba(255, 107, 107, 0.3)',
                          borderColor: 'rgba(255, 107, 107, 0.5)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {item.icon}
                        <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'inherit' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Button>
                  </NavLink>
                ))}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Cart */}
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Search Icon */}
              <IconButton
                sx={{
                  color: '#ff6b6b',
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    transform: 'scale(1.1) rotate(10deg)',
                  }
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>

              {/* User Actions */}
              {!authMember ? (
                <Box sx={{ display: 'flex', gap: 1.5, ml: 2 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSignupOpen(true)}
                    sx={{
                      borderColor: '#ff6b6b',
                      color: '#ff6b6b',
                      borderRadius: '25px',
                      fontWeight: 600,
                      px: 2.5,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#ff5252',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setLoginOpen(true)}
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                      color: 'white',
                      borderRadius: '25px',
                      fontWeight: 700,
                      px: 2.5,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #ff5252 0%, #feca57 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.5)',
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                  <Chip
                    icon={<FireIcon />}
                    label={cartItemCount}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      boxShadow: '0 3px 10px rgba(255, 107, 107, 0.3)',
                    }}
                  />
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                    onClick={handleLogoutClick}
                    sx={{
                      width: 48,
                      height: 48,
                      cursor: 'pointer',
                      border: '3px solid #ff6b6b',
                      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 6px 20px rgba(255, 107, 107, 0.5)',
                      }
                    }}
                    alt="User Avatar"
                  />
                </Box>
              )}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    ml: 1,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 107, 107, 0.2)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseLogout}
        onClick={handleCloseLogout}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            backgroundColor: 'white',
            borderRadius: '20px',
            minWidth: 220,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'white',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => window.location.href = '/my-page'} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          My Page
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/orders'} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}>
          <ListItemIcon>
            <OrdersIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/help'} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          Help & Support
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' } }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Toolbar Spacer */}
      <Box sx={{ height: 80 }} />
    </>
  );
}