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
} from '@mui/icons-material';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import Basket from './Basket';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { CartItem } from '../../../lib/types/search';
import { Member } from '../../../lib/types/member';
import { MemberType, MemberStatus } from '../../../lib/enums/member.enum';

interface HomeNavbarProps {
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

export default function HomeNavbar(props: HomeNavbarProps) {
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

  const { authMember, setAuthMember } = useGlobals();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { t } = useTranslation();

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
    { path: '/', label: t('navigation.home'), icon: <HomeIcon /> },
    { path: '/products', label: t('navigation.products'), icon: <ProductsIcon /> },
    { path: '/salads', label: t('navigation.salads'), icon: <RestaurantIcon /> },
    { path: '/desserts', label: t('navigation.desserts'), icon: <CakeIcon /> },
    ...(authMember ? [{ path: '/orders', label: t('navigation.orders'), icon: <OrdersIcon /> }] : []),
    ...(authMember ? [{ path: '/my-page', label: t('navigation.profile'), icon: <AccountIcon /> }] : []),
    { path: '/help', label: t('navigation.about'), icon: <HelpIcon /> },
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
            letterSpacing: '-0.02em',
          }}
        >
          Cafert
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#666' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? '#8B4513' : '#666',
              backgroundColor: location.pathname === item.path ? 'rgba(139, 69, 19, 0.08)' : 'transparent',
              margin: '2px 8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(139, 69, 19, 0.05)',
                transform: 'translateX(2px)',
              },
            }}
          >
            <NavLink
              to={item.path}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <MuiListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </MuiListItemIcon>
              <ListItemText primary={item.label} />
            </NavLink>
          </ListItem>
        ))}
      </List>

      {/* Language Switcher for Mobile */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LanguageIcon sx={{ color: '#8B4513', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: '#666', fontWeight: 500 }}>
            {t('common.language')}
          </Typography>
        </Box>
        <LanguageSwitcher />
      </Box>

      <Box sx={{ p: 2, mt: 'auto' }}>
        {!authMember ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
          </Box>
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
      <Box
        key={`navbar-${authMember ? 'authenticated' : 'guest'}`}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : 'none',
          transition: 'all 0.3s ease',
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
              py: 2 
            }}
          >
            {/* Logo */}
            <Box>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#8B4513',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      filter: 'drop-shadow(0 0 10px rgba(139, 69, 19, 0.3))',
                    }
                  }}
                >
                  Cafert
                </Typography>
              </NavLink>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                        color: '#333',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        position: 'relative',
                        px: 3,
                        py: 1.5,
                        borderRadius: '8px',
                        backgroundColor: location.pathname === item.path 
                          ? 'rgba(139, 69, 19, 0.08)'
                          : 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#8B4513',
                          backgroundColor: 'rgba(139, 69, 19, 0.05)',
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -2,
                          left: '50%',
                          width: location.pathname === item.path ? '60%' : '0%',
                          height: '2px',
                          backgroundColor: '#8B4513',
                          borderRadius: 1,
                          transform: 'translateX(-50%)',
                          transition: 'width 0.2s ease',
                        },
                        '&:hover::after': {
                          width: '60%',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                        {item.label}
                      </Typography>
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

              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Search Icon */}
              <IconButton
                sx={{
                  color: '#666',
                  '&:hover': { 
                    color: '#8B4513',
                    backgroundColor: 'rgba(139, 69, 19, 0.05)'
                  }
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>

              {/* User Actions */}
              <Box>
                {!authMember ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => setSignupOpen(true)}
                    sx={{
                      color: '#666',
                      fontWeight: 500,
                      px: 2,
                      '&:hover': {
                        color: '#8B4513',
                        backgroundColor: 'rgba(139, 69, 19, 0.05)',
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
                      backgroundColor: '#8B4513',
                      color: '#fff',
                      fontWeight: 500,
                      borderRadius: '6px',
                      px: 2,
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: '#A0522D',
                        boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
                      }
                    }}
                  >
                    Login
                  </Button>
                  {/* Test button to manually set auth state */}
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      const testUser: Member = {
                        _id: 'test123',
                        memberNick: 'TestUser',
                        memberPhone: '1234567890',
                        memberType: MemberType.USER,
                        memberStatus: MemberStatus.ACTIVE,
                        memberPoints: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      };
                      setAuthMember(testUser);
                    }}
                    sx={{
                      borderColor: '#ff0000',
                      color: '#ff0000',
                      fontSize: '0.7rem',
                      px: 1,
                      '&:hover': {
                        borderColor: '#cc0000',
                        backgroundColor: 'rgba(255, 0, 0, 0.05)',
                      }
                    }}
                  >
                    Test Auth
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={`${cartItemCount} items`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(139, 69, 19, 0.08)',
                      color: '#8B4513',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                    }}
                  />
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                    onClick={handleLogoutClick}
                    sx={{
                      width: 36,
                      height: 36,
                      cursor: 'pointer',
                      border: '2px solid #f0f0f0',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease',
                        borderColor: '#8B4513',
                      }
                    }}
                    alt="User Avatar"
                  />
                </Box>
              )}
              </Box>

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#666',
                    '&:hover': { 
                      color: '#8B4513',
                      backgroundColor: 'rgba(139, 69, 19, 0.05)'
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
          {t('navigation.myPage')}
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/orders'}>
          <ListItemIcon>
            <OrdersIcon fontSize="small" />
          </ListItemIcon>
          {t('navigation.myOrders')}
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/help'}>
          <ListItemIcon>
            <HelpIcon fontSize="small" />
          </ListItemIcon>
          {t('navigation.helpSupport')}
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('navigation.logout')}
        </MenuItem>
      </Menu>

      {/* Toolbar Spacer */}
      <Box sx={{ height: 80 }} />
    </>
  );
} 