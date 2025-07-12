import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Receipt as OrdersIcon,
  Help as HelpIcon,
  Home as HomeIcon,
  Coffee as CoffeeIcon,
  Restaurant as RestaurantIcon,
  Cake as CakeIcon,
  LocalCafe as DrinksIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useHistory, useLocation } from 'react-router-dom';
import { useGlobals } from '../../hooks/useGlobals';
import { useTranslation } from 'react-i18next';

interface ElegantNavbarProps {
  cartItems: any[];
  onAdd: (item: any) => void;
  onRemove: (item: any) => void;
  onDelete: (item: any) => void;
  onDeleteAll: () => void;
  setSignupOpen: (open: boolean) => void;
  setLoginOpen: (open: boolean) => void;
  handleLogoutClick: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl: HTMLElement | null;
  handleCloseLogout: () => void;
  handleLogoutRequest: () => void;
}

const ElegantNavbar: React.FC<ElegantNavbarProps> = ({
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
  handleLogoutRequest
}) => {
  const { authMember } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    history.push(path);
    setMobileOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = [
    { path: '/', label: 'Home', icon: <HomeIcon /> },
    { path: '/coffees', label: 'Coffees', icon: <CoffeeIcon /> },
    { path: '/salads', label: 'Salads', icon: <RestaurantIcon /> },
    { path: '/desserts', label: 'Desserts', icon: <CakeIcon /> },
    { path: '/drinks', label: 'Drinks', icon: <DrinksIcon /> },
  ];

  const userMenuItems = [
    { label: 'Profile', icon: <PersonIcon />, action: () => handleNavigation('/member-page') },
    { label: 'Orders', icon: <OrdersIcon />, action: () => handleNavigation('/orders') },
    { label: 'Settings', icon: <SettingsIcon />, action: () => {} },
    { label: 'Help', icon: <HelpIcon />, action: () => handleNavigation('/help') },
  ];

  const drawer = (
    <Box sx={{ width: 280, p: 2 }}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Avatar
            src={authMember?.memberImage ? `/api${authMember.memberImage}` : "/icons/default-user.svg"}
            sx={{
              width: 80,
              height: 80,
              margin: '0 auto',
              mb: 2,
              border: '3px solid #667eea',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}
          />
        </motion.div>
        
        {authMember ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mb: 1 }}>
              {authMember.memberNick}
            </Typography>
            <Chip 
              icon={<StarIcon />}
              label={authMember.memberType} 
              sx={{ 
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: '#ffffff',
                fontWeight: 600,
                px: 2
              }}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mb: 2 }}>
              Welcome Guest
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => { setSignupOpen(true); setMobileOpen(false); }}
                sx={{
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  }
                }}
              >
                Sign Up
              </Button>
              <Button
                variant="outlined"
                onClick={() => { setLoginOpen(true); setMobileOpen(false); }}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderRadius: '12px',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </motion.div>
        )}
      </Box>

      <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

      <List>
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&.Mui-selected': {
                  background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  '& .MuiListItemIcon-root': {
                    color: '#667eea',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#667eea',
                    fontWeight: 600,
                  }
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.05)',
                }
              }}
            >
              <ListItemIcon sx={{ color: '#7F8C8D', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    color: '#2C3E50',
                  }
                }}
              />
            </ListItemButton>
          </motion.div>
        ))}
      </List>

      {authMember && (
        <>
          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />
          
          <Typography variant="subtitle2" sx={{ color: '#7F8C8D', fontWeight: 600, mb: 2, px: 2 }}>
            Account
          </Typography>
          
          <List>
            {userMenuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * (index + navigationItems.length) }}
              >
                            <ListItemButton
              onClick={item.action}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.05)',
                }
              }}
            >
                  <ListItemIcon sx={{ color: '#7F8C8D', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        fontWeight: 500,
                        color: '#2C3E50',
                      }
                    }}
                  />
                </ListItemButton>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (userMenuItems.length + navigationItems.length) }}
            >
                          <ListItemButton
              onClick={handleLogoutRequest}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&:hover': {
                  background: 'rgba(231, 76, 60, 0.05)',
                }
              }}
            >
                <ListItemIcon sx={{ color: '#E74C3C', minWidth: 40 }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Logout" 
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: 500,
                      color: '#E74C3C',
                    }
                  }}
                />
              </ListItemButton>
            </motion.div>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AppBar
          position="fixed"
          sx={{
            background: scrolled 
              ? 'rgba(255, 255, 255, 0.95)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.3s ease-in-out',
            borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          }}
          elevation={0}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  onClick={() => handleNavigation('/')}
                  sx={{
                    flexGrow: 0,
                    fontWeight: 800,
                    color: scrolled ? '#2C3E50' : '#ffffff',
                    cursor: 'pointer',
                    textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                    transition: 'color 0.3s ease',
                    mr: 4
                  }}
                >
                  Coffee Shop
                </Typography>
              </motion.div>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', gap: 2, flexGrow: 1 }}>
                  {navigationItems.map((item) => (
                    <motion.div
                      key={item.path}
                      whileHover={{ y: -2 }}
                      whileTap={{ y: 0 }}
                    >
                      <Button
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          color: scrolled ? '#2C3E50' : '#ffffff',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          px: 2,
                          py: 1,
                          borderRadius: '12px',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            background: scrolled 
                              ? 'rgba(102, 126, 234, 0.1)' 
                              : 'rgba(255, 255, 255, 0.2)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        {item.label}
                      </Button>
                    </motion.div>
                  ))}
                </Box>
              )}

              {/* Right Side Actions */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Cart */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    onClick={() => handleNavigation('/products')}
                    sx={{
                      color: scrolled ? '#2C3E50' : '#ffffff',
                      background: scrolled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: scrolled ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Badge badgeContent={cartItemCount} color="error">
                      <CartIcon />
                    </Badge>
                  </IconButton>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <IconButton
                    sx={{
                      color: scrolled ? '#2C3E50' : '#ffffff',
                      background: scrolled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        background: scrolled ? 'rgba(102, 126, 234, 0.2)' : 'rgba(255, 255, 255, 0.3)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </motion.div>

                {/* User Menu */}
                {authMember ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconButton
                      onClick={handleLogoutClick}
                      sx={{
                        p: 0,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Avatar
                        src={authMember.memberImage ? `/api${authMember.memberImage}` : "/icons/default-user.svg"}
                        sx={{
                          width: 40,
                          height: 40,
                          border: '2px solid',
                          borderColor: scrolled ? '#667eea' : '#ffffff',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        }}
                      />
                    </IconButton>
                  </motion.div>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        onClick={() => setLoginOpen(true)}
                        sx={{
                          borderColor: scrolled ? '#667eea' : '#ffffff',
                          color: scrolled ? '#667eea' : '#ffffff',
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            borderColor: scrolled ? '#5a6fd8' : '#ffffff',
                            background: scrolled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                          }
                        }}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => setSignupOpen(true)}
                        sx={{
                          background: scrolled ? 'linear-gradient(45deg, #667eea, #764ba2)' : 'rgba(255, 255, 255, 0.2)',
                          color: scrolled ? '#ffffff' : '#ffffff',
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            background: scrolled ? 'linear-gradient(45deg, #5a6fd8, #6a4190)' : 'rgba(255, 255, 255, 0.3)',
                            transform: 'translateY(-2px)',
                          }
                        }}
                      >
                        Sign Up
                      </Button>
                    </motion.div>
                  </Box>
                )}

                {/* Mobile Menu Button */}
                {isMobile && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      edge="start"
                      onClick={handleDrawerToggle}
                      sx={{
                        color: scrolled ? '#2C3E50' : '#ffffff',
                        ml: 1,
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </motion.div>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseLogout}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            mt: 1,
          }
        }}
        TransitionComponent={Zoom}
        transitionDuration={200}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => { item.action(); handleCloseLogout(); }}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#667eea', minWidth: 36 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: 500,
                  color: '#2C3E50',
                }
              }}
            />
          </MenuItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={() => { handleLogoutRequest(); handleCloseLogout(); }}
          sx={{
            borderRadius: '8px',
            mx: 1,
            my: 0.5,
            '&:hover': {
              background: 'rgba(231, 76, 60, 0.1)',
            }
          }}
        >
          <ListItemIcon sx={{ color: '#E74C3C', minWidth: 36 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            sx={{ 
              '& .MuiListItemText-primary': {
                fontWeight: 500,
                color: '#E74C3C',
              }
            }}
          />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280 
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Toolbar spacer */}
      <Toolbar />
    </>
  );
};

export default ElegantNavbar; 