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
  Paper,
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
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import Basket from './Basket';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { CartItem } from '../../../lib/types/search';

interface ElegantNavbarProps {
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

export default function ElegantNavbar(props: ElegantNavbarProps) {
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
    <Paper 
      elevation={0}
      sx={{ 
        width: 320, 
        height: '100%', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 0,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        }
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: 'white',
              fontWeight: 300,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '0.05em',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Cafert
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={handleDrawerToggle}
              sx={{
                color: location.pathname === item.path ? '#667eea' : 'white',
                backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                margin: '4px 0',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                backdropFilter: location.pathname === item.path ? 'blur(10px)' : 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(6px)',
                  backdropFilter: 'blur(10px)',
                },
              }}
            >
              <NavLink
                to={item.path}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <MuiListItemIcon sx={{ color: 'inherit', minWidth: 45 }}>
                  {item.icon}
                </MuiListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      fontSize: '1rem',
                      fontFamily: 'Inter, sans-serif',
                    }
                  }}
                />
              </NavLink>
            </ListItem>
          ))}
        </List>

        <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <LanguageIcon sx={{ color: 'white', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
              {t('common.language')}
            </Typography>
          </Box>
          <LanguageSwitcher />

          {!authMember ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
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
                  borderRadius: '12px',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
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
                  color: '#667eea',
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Login
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Avatar
                src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 2,
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: 'white' }}>
                {authMember?.memberNick || 'User'}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  handleLogoutRequest();
                  handleDrawerToggle();
                }}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { 
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.8) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(102, 126, 234, 0.2)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(102, 126, 234, 0.15)' : 'none',
          transition: 'all 0.4s ease',
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{ 
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              py: 2.5 
            }}
          >
            {/* Logo */}
            <Box>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="h4"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: 300,
                    fontFamily: 'Playfair Display, serif',
                    letterSpacing: '0.05em',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      filter: 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.3))',
                    }
                  }}
                >
                  Cafert
                </Typography>
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
                        color: location.pathname === item.path ? '#667eea' : '#555',
                        backgroundColor: location.pathname === item.path 
                          ? 'rgba(102, 126, 234, 0.1)'
                          : 'transparent',
                        borderRadius: '25px',
                        px: 3,
                        py: 1.5,
                        minWidth: 'auto',
                        textTransform: 'none',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        fontSize: '0.9rem',
                        fontFamily: 'Inter, sans-serif',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent)',
                          transition: 'left 0.5s',
                        },
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.08)',
                          color: '#667eea',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                          '&::before': {
                            left: '100%',
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {item.icon}
                        <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
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
                  color: '#667eea',
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '50%',
                  width: 45,
                  height: 45,
                  '&:hover': { 
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    transform: 'scale(1.1) rotate(5deg)',
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
                      borderColor: '#667eea',
                      color: '#667eea',
                      borderRadius: '20px',
                      fontWeight: 500,
                      px: 2.5,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#5a6fd8',
                        backgroundColor: 'rgba(102, 126, 234, 0.08)',
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
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      borderRadius: '20px',
                      fontWeight: 600,
                      px: 2.5,
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 2 }}>
                  <Chip
                    icon={<FavoriteIcon />}
                    label={cartItemCount}
                    size="small"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                    }}
                  />
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                    onClick={handleLogoutClick}
                    sx={{
                      width: 45,
                      height: 45,
                      cursor: 'pointer',
                      border: '3px solid #667eea',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
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
                    color: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    ml: 1,
                    '&:hover': { 
                      backgroundColor: 'rgba(102, 126, 234, 0.2)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

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
            borderRadius: '16px',
            minWidth: 200,
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
        <MenuItem onClick={() => window.location.href = '/my-page'} sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' } }}>
          <ListItemIcon>
            <AccountIcon fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          My Page
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/orders'} sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' } }}>
          <ListItemIcon>
            <OrdersIcon fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/help'} sx={{ '&:hover': { backgroundColor: 'rgba(102, 126, 234, 0.08)' } }}>
          <ListItemIcon>
            <HelpIcon fontSize="small" sx={{ color: '#667eea' }} />
          </ListItemIcon>
          Help & Support
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest} sx={{ '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.08)' } }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Toolbar Spacer */}
      <Box sx={{ height: 90 }} />
    </>
  );
} 