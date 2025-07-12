// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Badge,
  Avatar,
  Chip,
  Fade,
  Slide
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  LocalCafe as CoffeeIcon,
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  Help as HelpIcon,
  AccountCircle as AccountIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import Basket from './Basket';
import { CartItem } from '../../../lib/types/search';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';

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
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/products', label: 'Products', icon: <ProductsIcon /> },
    { path: '/coffees', label: 'Coffees', icon: <CoffeeIcon /> },
    ...(authMember ? [{ path: '/orders', label: 'Orders', icon: <OrdersIcon /> }] : []),
    { path: '/help', label: 'Help', icon: <HelpIcon /> },
  ];

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            color: '#8B4513',
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '-0.02em'
          }}
        >
          Cafert
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            component={NavLink}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? '#8B4513' : '#666',
              backgroundColor: location.pathname === item.path ? 'rgba(139, 69, 19, 0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(139, 69, 19, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        {!authMember ? (
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSignupOpen(true);
                handleDrawerToggle();
              }}
              sx={{
                borderColor: '#8B4513',
                color: '#8B4513',
                '&:hover': { borderColor: '#A0522D', backgroundColor: 'rgba(139, 69, 19, 0.05)' }
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
                backgroundColor: '#8B4513',
                '&:hover': { backgroundColor: '#A0522D' }
              }}
            >
              Login
            </Button>
          </Stack>
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <Avatar
              src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
              sx={{ width: 60, height: 60, mx: 'auto', mb: 2 }}
            />
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
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
                borderColor: '#8B4513',
                color: '#8B4513',
                '&:hover': { borderColor: '#A0522D', backgroundColor: 'rgba(139, 69, 19, 0.05)' }
              }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)' 
            : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NavLink to="/">
                <Typography
                  variant={scrolled ? "h5" : "h4"}
                  sx={{
                    color: scrolled ? '#8B4513' : '#fff',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    transition: 'all 0.3s ease',
                    textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  Cafert
                </Typography>
              </NavLink>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: 'none' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: scrolled ? '#333' : '#fff',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        position: 'relative',
                        '&:hover': {
                          color: scrolled ? '#8B4513' : '#D7B686',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: location.pathname === item.path ? '100%' : '0%',
                          height: '2px',
                          backgroundColor: scrolled ? '#8B4513' : '#D7B686',
                          transition: 'width 0.3s ease',
                        },
                        '&:hover::after': {
                          width: '100%',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography variant="body1">{item.label}</Typography>
                    </Box>
                  </NavLink>
                ))}
              </Box>
            )}

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Cart */}
              <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              {/* Search Icon */}
              <IconButton
                sx={{
                  color: scrolled ? '#333' : '#fff',
                  '&:hover': { color: scrolled ? '#8B4513' : '#D7B686' }
                }}
              >
                <SearchIcon />
              </IconButton>

              {/* Notifications */}
              <IconButton
                sx={{
                  color: scrolled ? '#333' : '#fff',
                  '&:hover': { color: scrolled ? '#8B4513' : '#D7B686' }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              {/* User Actions */}
              {!authMember ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSignupOpen(true)}
                    sx={{
                      borderColor: scrolled ? '#8B4513' : '#fff',
                      color: scrolled ? '#8B4513' : '#fff',
                      '&:hover': {
                        borderColor: scrolled ? '#A0522D' : '#D7B686',
                        backgroundColor: scrolled ? 'rgba(139, 69, 19, 0.05)' : 'rgba(255, 255, 255, 0.1)',
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
                      backgroundColor: scrolled ? '#8B4513' : '#3776CC',
                      '&:hover': {
                        backgroundColor: scrolled ? '#A0522D' : '#2d5aa0',
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${cartItemCount} items`}
                    size="small"
                    sx={{
                      backgroundColor: scrolled ? 'rgba(139, 69, 19, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                      color: scrolled ? '#8B4513' : '#fff',
                      fontWeight: 600,
                    }}
                  />
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                    onClick={handleLogoutClick}
                    sx={{
                      width: 40,
                      height: 40,
                      cursor: 'pointer',
                      border: `2px solid ${scrolled ? '#8B4513' : '#fff'}`,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease',
                      }
                    }}
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
                    color: scrolled ? '#333' : '#fff',
                    '&:hover': { color: scrolled ? '#8B4513' : '#D7B686' }
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
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => window.location.href = '/my-page'}>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          My Page
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/orders'}>
          <ListItemIcon>
            <OrdersIcon fontSize="small" />
          </ListItemIcon>
          My Orders
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/help'}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          Help & Support
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Toolbar Spacer */}
      <Toolbar />
    </>
  );
}