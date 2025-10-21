import React, { useState, useEffect, useMemo } from 'react';
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
  Fade,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
  CircularProgress,
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
  ShoppingCart as CartIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  TrendingUp as AnalyticsIcon,
} from '@mui/icons-material';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import Basket from './Basket';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { CartItem } from '../../../lib/types/search';
import ProductService from '../../services/ProductService';

interface OtherNavbarProps {
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

export default function OtherNavbar(props: OtherNavbarProps) {
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
  const history = useHistory();
  const { t, i18n } = useTranslation();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const productService = new ProductService();
      const products = await productService.getProducts({
        page: 1,
        limit: 20,
        order: "productViews"
      });

             // Filter products based on search query
       const filteredResults = products
         .filter(product => 
           (product.productName || '').toLowerCase().includes(query.toLowerCase()) ||
           (product.productDesc || '').toLowerCase().includes(query.toLowerCase()) ||
           (product.productCollection || '').toLowerCase().includes(query.toLowerCase())
         )
         .map(product => ({
           _id: product._id,
           name: product.productName || 'Unnamed Product',
           price: product.productPrice || 0,
           image: product.productImages?.[0] 
             ? `${serverApi}${product.productImages[0]}`
             : 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format',
           category: product.productCollection || 'Other',
           description: product.productDesc || 'No description available'
         }))
         .slice(0, 6); // Limit to 6 results for display

      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleAddToCart = (item: any) => {
    const cartItem = {
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    };
    onAdd(cartItem);
  };

  const handleProductClick = (productId: string) => {
    history.push(`/products/${productId}`);
    setSearchOpen(false);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navigationItems = useMemo(() => [
    { path: '/', label: t('navigation.home'), icon: <HomeIcon /> },
    { path: '/products', label: t('navigation.products'), icon: <ProductsIcon /> },
    ...(authMember ? [{ path: '/orders', label: t('navigation.orders'), icon: <OrdersIcon /> }] : []),
    ...(authMember ? [{ path: '/my-page', label: t('navigation.myPage'), icon: <AccountIcon /> }] : []),
    ...(authMember ? [{ path: '/stats', label: t('navigation.analytics'), icon: <AnalyticsIcon /> }] : []),
    { path: '/help', label: t('navigation.about'), icon: <HelpIcon /> },
  ], [t, authMember]);

  const drawer = (
    <Box sx={{ 
      width: 320, 
      pt: 3, 
      bgcolor: '#fafafa', 
      height: '100%', 
      color: '#2c3e50',
      borderRight: '1px solid #e0e0e0',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: '#8b4513',
            fontWeight: 700,
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '0.05em',
          }}
        >
          Cafert
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: '#8b4513' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={`${item.path}-${i18n.language}`}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? '#8b4513' : '#5d4037',
              backgroundColor: location.pathname === item.path ? 'rgba(139, 69, 19, 0.08)' : 'transparent',
              margin: '4px 12px',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              minHeight: 56,
              '&:hover': {
                backgroundColor: 'rgba(139, 69, 19, 0.12)',
                transform: 'translateX(8px)',
              },
            }}
          >
            <NavLink
              to={item.path}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <MuiListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                {item.icon}
              </MuiListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '1rem',
                    fontFamily: 'Inter, sans-serif',
                  }
                }}
              />
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 3, mt: 'auto', borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <LanguageIcon sx={{ color: '#8b4513', fontSize: 20 }} />
          <Typography variant="body2" sx={{ color: '#5d4037', fontWeight: 500 }}>
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
                borderColor: '#8b4513',
                color: '#8b4513',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1.5,
                '&:hover': { 
                  borderColor: '#a0522d', 
                  backgroundColor: 'rgba(139, 69, 19, 0.08)',
                }
              }}
            >
              {t('navigation.signup')}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setLoginOpen(true);
                handleDrawerToggle();
              }}
              sx={{
                backgroundColor: '#8b4513',
                color: '#ffffff',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1.5,
                '&:hover': { 
                  backgroundColor: '#a0522d',
                }
              }}
            >
              {t('navigation.login')}
            </Button>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Avatar
              src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
              sx={{ 
                width: 60, 
                height: 60, 
                mx: 'auto', 
                mb: 2,
                border: '2px solid #8b4513',
              }}
            />
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2, color: '#8b4513' }}>
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
                borderColor: '#e74c3c',
                color: '#e74c3c',
                borderRadius: '8px',
                fontWeight: 500,
                fontSize: '0.8rem',
                '&:hover': { 
                  borderColor: '#c0392b', 
                  backgroundColor: 'rgba(231, 76, 60, 0.08)',
                }
              }}
            >
              {t('navigation.logout')}
            </Button>
          </Box>
        )}
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
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 320 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Search Drawer */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={handleSearchToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          zIndex: 9999,
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
          },
          '& .MuiBackdrop-root': {
            zIndex: 9998,
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Search Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            mb: 3,
            position: 'sticky',
            top: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 10001,
            py: 2,
            mx: -3,
            px: 3,
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#8b4513' }}>
              {t('navigation.searchProducts')}
            </Typography>
            <IconButton onClick={handleSearchToggle} sx={{ color: '#8b4513' }}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </Box>

          {/* Search Input */}
          <TextField
            fullWidth
            placeholder={t('navigation.searchPlaceholder')}
            value={searchQuery}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8b4513' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    sx={{ color: '#8b4513' }}
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              position: 'sticky',
              top: 90,
              zIndex: 10000,
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderRadius: '25px',
              p: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                backgroundColor: '#ffffff',
                border: '2px solid #e0e0e0',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: '#8b4513',
                  boxShadow: '0 4px 25px rgba(139, 69, 19, 0.15)',
                },
                '&.Mui-focused': {
                  borderColor: '#8b4513',
                  boxShadow: '0 0 0 3px rgba(139, 69, 19, 0.1), 0 4px 25px rgba(139, 69, 19, 0.15)',
                },
              },
            }}
          />

          {/* Search Results */}
          <Box sx={{ 
            maxHeight: 'calc(100vh - 200px)', 
            overflowY: 'auto',
            position: 'relative',
            zIndex: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            p: 2,
          }}>
            {isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress sx={{ color: '#8b4513' }} />
              </Box>
            ) : searchQuery && searchResults.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SearchIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  {t('navigation.noResults')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  {t('navigation.trySearching')}
                </Typography>
              </Box>
            ) : searchResults.length > 0 ? (
              <Grid container spacing={3} sx={{ pt: 2 }}>
                {searchResults.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card
                      sx={{
                        height: '100%',
                        borderRadius: '16px',
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 25px rgba(139, 69, 19, 0.15)',
                          borderColor: '#8b4513',
                        },
                      }}
                      onClick={() => handleProductClick(item._id)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&auto=format';
                        }}
                      />
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                          {item.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b4513' }}>
                            ${item.price}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(139, 69, 19, 0.1)',
                              color: '#8b4513',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<AddIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          sx={{
                            backgroundColor: '#8b4513',
                            color: '#ffffff',
                            borderRadius: '12px',
                            fontWeight: 600,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: '#a0522d',
                              transform: 'translateY(-2px)',
                            },
                          }}
                        >
                          {t('navigation.addToCart')}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SearchIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                  {t('navigation.startSearching')}
                </Typography>
                <Typography variant="body2" sx={{ color: '#999' }}>
                  {t('navigation.enterProductName')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>

      <AppBar
        position="fixed"
        sx={{
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #e0e0e0' : 'none',
          boxShadow: scrolled ? '0 2px 20px rgba(0, 0, 0, 0.1)' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 1200,
        }}
        elevation={0}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 3, minHeight: 100 }}>
            {/* Logo */}
            <Box>
              <NavLink to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: '#8b4513',
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  Cafert
                </Typography>
              </NavLink>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'nowrap' }}>
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: 'none' }}
                  >
                    <Button
                      sx={{
                        color: location.pathname === item.path ? '#8b4513' : '#5d4037',
                        backgroundColor: location.pathname === item.path 
                          ? 'rgba(139, 69, 19, 0.08)'
                          : 'transparent',
                        borderRadius: '25px',
                        px: 3,
                        py: 2,
                        minWidth: '120px',
                        height: '48px',
                        textTransform: 'none',
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: 'rgba(139, 69, 19, 0.12)',
                          color: '#8b4513',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                        {item.icon}
                        <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 'inherit', whiteSpace: 'nowrap' }}>
                          {item.label}
                        </Typography>
                      </Box>
                    </Button>
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
                onClick={handleSearchToggle}
                sx={{
                  color: '#5d4037',
                  backgroundColor: 'rgba(93, 64, 55, 0.08)',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  '&:hover': { 
                    color: '#8b4513',
                    backgroundColor: 'rgba(139, 69, 19, 0.12)',
                    transform: 'scale(1.15)',
                  }
                }}
                aria-label="search"
              >
                <SearchIcon fontSize="large" />
              </IconButton>

              {/* User Actions */}
              {(() => {
                return !authMember ? (
                  <Box sx={{ display: 'flex', gap: 2, ml: 3 }}>
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => setSignupOpen(true)}
                      sx={{
                        borderColor: '#8b4513',
                        color: '#8b4513',
                        borderRadius: '25px',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        '&:hover': {
                          borderColor: '#a0522d',
                          backgroundColor: 'rgba(139, 69, 19, 0.08)',
                          transform: 'translateY(-3px)',
                        }
                      }}
                    >
                      {t('navigation.signup')}
                    </Button>
                    <Button
                      variant="contained"
                      size="medium"
                      onClick={() => setLoginOpen(true)}
                      sx={{
                        backgroundColor: '#8b4513',
                        color: '#ffffff',
                        borderRadius: '25px',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: '0 2px 8px rgba(139, 69, 19, 0.3)',
                        '&:hover': {
                          backgroundColor: '#a0522d',
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.4)',
                        }
                      }}
                    >
                      {t('navigation.login')}
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 3 }}>
                    <Chip
                      icon={<CartIcon />}
                      label={cartItemCount}
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(139, 69, 19, 0.12)',
                        color: '#8b4513',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        border: '1px solid #8b4513',
                        height: 40,
                      }}
                    />
                    <Avatar
                      src={authMember?.memberImage ? `${serverApi}${authMember?.memberImage}` : "/icons/default-user.svg"}
                      onClick={handleLogoutClick}
                      sx={{
                        width: 56,
                        height: 56,
                        cursor: 'pointer',
                        border: '2px solid #8b4513',
                        boxShadow: '0 2px 8px rgba(139, 69, 19, 0.2)',
                        '&:hover': {
                          transform: 'scale(1.15)',
                          transition: 'transform 0.3s ease',
                          boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
                        }
                      }}
                      alt="User Avatar"
                    />
                  </Box>
                );
              })()}

              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: '#8b4513',
                    backgroundColor: 'rgba(139, 69, 19, 0.08)',
                    ml: 2,
                    width: 56,
                    height: 56,
                    '&:hover': { 
                      backgroundColor: 'rgba(139, 69, 19, 0.12)',
                      transform: 'scale(1.15)',
                    }
                  }}
                >
                  <MenuIcon fontSize="large" />
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
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
            mt: 1.5,
            backgroundColor: '#ffffff',
            color: '#2c3e50',
            borderRadius: '12px',
            minWidth: 200,
            border: '1px solid #e0e0e0',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 8,
              height: 8,
              bgcolor: '#ffffff',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              borderLeft: '1px solid #e0e0e0',
              borderTop: '1px solid #e0e0e0',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => window.location.href = '/my-page'} sx={{ '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.08)' } }}>
          <ListItemIcon>
            <AccountIcon sx={{ color: '#8b4513' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('navigation.myPage')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/orders'} sx={{ '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.08)' } }}>
          <ListItemIcon>
            <OrdersIcon sx={{ color: '#8b4513' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('navigation.myOrders')}</Typography>
        </MenuItem>
        <MenuItem onClick={() => window.location.href = '/help'} sx={{ '&:hover': { backgroundColor: 'rgba(139, 69, 19, 0.08)' } }}>
          <ListItemIcon>
            <HelpIcon sx={{ color: '#8b4513' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>{t('navigation.helpSupport')}</Typography>
        </MenuItem>
        <MenuItem onClick={handleLogoutRequest} sx={{ '&:hover': { backgroundColor: 'rgba(231, 76, 60, 0.08)' } }}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#e74c3c' }} />
          </ListItemIcon>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#e74c3c' }}>{t('navigation.logout')}</Typography>
        </MenuItem>
      </Menu>

      {/* Toolbar Spacer */}
      <Box sx={{ height: 120 }} />
    </>
  );
}