import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  ListItemButton,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Collapse,
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
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { NavLink, useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import Basket from './Basket';
import LanguageSwitcher from '../../../components/LanguageSwitcher';
import { CartItem } from '../../../lib/types/search';
import ProductService from '../../services/ProductService';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';

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
  const { isDarkMode } = useCoffeeTheme();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const productsDropdownRef = useRef<HTMLDivElement>(null);

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
    { path: '/products', label: t('navigation.products'), icon: <ProductsIcon />, isProducts: true },
    ...(authMember ? [{ path: '/orders', label: t('navigation.orders'), icon: <OrdersIcon /> }] : []),
    ...(authMember ? [{ path: '/my-page', label: t('navigation.myPage'), icon: <AccountIcon /> }] : []),
    { path: '/stats', label: t('navigation.analytics'), icon: <AnalyticsIcon /> },
    { path: '/help', label: t('navigation.about'), icon: <HelpIcon /> },
  ], [t, authMember]);

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (productsDropdownOpen) {
      // Second click: navigate to products page
      setProductsDropdownOpen(false);
      history.push('/products');
    } else {
      // First click: open dropdown
      setProductsDropdownOpen(true);
    }
  };

  const handleCategoryClick = (category: string) => {
    setProductsDropdownOpen(false);
    history.push(`/products?category=${category}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target as Node)) {
        setProductsDropdownOpen(false);
      }
    };

    if (productsDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [productsDropdownOpen]);

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
        {navigationItems.map((item) => {
          if ((item as any).isProducts) {
            // Products item with accordion
            return (
              <Box key={`${item.path}-${i18n.language}`}>
                <ListItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (productsDropdownOpen) {
                      setProductsDropdownOpen(false);
                      history.push('/products');
                      handleDrawerToggle();
                    } else {
                      setProductsDropdownOpen(true);
                    }
                  }}
                  sx={{
                    color: location.pathname === item.path ? '#8b4513' : '#5d4037',
                    backgroundColor: location.pathname === item.path ? 'rgba(139, 69, 19, 0.08)' : 'transparent',
                    margin: '4px 12px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    minHeight: 56,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(139, 69, 19, 0.12)',
                      transform: 'translateX(8px)',
                    },
                  }}
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
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: productsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                    }} 
                  />
                </ListItem>
                <Collapse in={productsDropdownOpen}>
                  <List component="div" disablePadding>
                    {['all', 'drinks', 'desserts', 'salads'].map((category) => (
                      <ListItem
                        key={category}
                        onClick={() => {
                          handleCategoryClick(category);
                          handleDrawerToggle();
                        }}
                        sx={{
                          pl: 6,
                          py: 1,
                          color: '#5d4037',
                          '&:hover': {
                            backgroundColor: 'rgba(139, 69, 19, 0.08)',
                          },
                        }}
                      >
                        <ListItemText 
                          primary={category === 'all' ? t('common.all') : t(`navigation.${category}`)}
                          sx={{ 
                            '& .MuiListItemText-primary': {
                              fontSize: '0.9rem',
                              fontFamily: 'Inter, sans-serif',
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            );
          }
          
          // Regular navigation items
          const isActive = item.path.includes('?') 
            ? location.pathname === item.path.split('?')[0] && (location as any).search === `?${item.path.split('?')[1]}`
            : location.pathname === item.path;
          
          return (
            <ListItem
              key={`${item.path}-${i18n.language}`}
              onClick={() => {
                if (item.path.includes('?')) {
                  (history as any).push(item.path);
                }
                handleDrawerToggle();
              }}
              sx={{
                color: isActive ? '#8b4513' : '#5d4037',
                backgroundColor: isActive ? 'rgba(139, 69, 19, 0.08)' : 'transparent',
                margin: '4px 12px',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                minHeight: 56,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(139, 69, 19, 0.12)',
                  transform: 'translateX(8px)',
                },
              }}
            >
              {item.path.includes('?') ? (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <MuiListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    {item.icon}
                  </MuiListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    sx={{ 
                      '& .MuiListItemText-primary': {
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </Box>
              ) : (
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
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '1rem',
                        fontFamily: 'Inter, sans-serif',
                      }
                    }}
                  />
                </NavLink>
              )}
            </ListItem>
          );
        })}
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

      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(50px) saturate(180%)',
          WebkitBackdropFilter: 'blur(50px) saturate(180%)',
          borderBottom: scrolled 
            ? '2px solid rgba(255, 255, 255, 0.4)' 
            : '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: scrolled 
            ? '0 25px 70px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
            : '0 15px 50px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
      <AppBar
        position="static"
        sx={{
          background: 'transparent',
          boxShadow: 'none',
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
                {navigationItems.map((item) => {
                  if ((item as any).isProducts) {
                    // Products button with dropdown
                    return (
                      <Box key={item.path} ref={productsDropdownRef} sx={{ position: 'relative' }}>
                        <Button
                          onClick={handleProductsClick}
                          sx={{
                            color: isDarkMode ? '#ffffff' : (location.pathname === item.path ? '#8b4513' : '#5d4037'),
                            backgroundColor: location.pathname === item.path 
                              ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 69, 19, 0.08)')
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
                            ...(isDarkMode && {
                              textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                              boxShadow: location.pathname === item.path
                                ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)'
                                : 'none',
                            }),
                            '&:hover': {
                              backgroundColor: isDarkMode 
                                ? 'rgba(255, 255, 255, 0.15)'
                                : 'rgba(139, 69, 19, 0.12)',
                              color: isDarkMode ? '#ffffff' : '#8b4513',
                              transform: 'translateY(-2px)',
                              ...(isDarkMode && {
                                textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                                boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                              }),
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                            {item.icon}
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontSize: '1rem', 
                                fontWeight: 'inherit', 
                                whiteSpace: 'nowrap',
                                color: 'inherit',
                                ...(isDarkMode && {
                                  textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                                }),
                              }}
                            >
                              {item.label}
                            </Typography>
                            <ExpandMoreIcon 
                              sx={{ 
                                transform: productsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                fontSize: '20px',
                              }} 
                            />
                          </Box>
                        </Button>
                        <Collapse in={productsDropdownOpen}>
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '100%',
                              left: 0,
                              mt: 1.5,
                              minWidth: '280px',
                              width: '280px',
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                              borderRadius: '20px',
                              boxShadow: isDarkMode
                                ? '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 8px rgba(0, 0, 0, 0.3)'
                                : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
                              border: isDarkMode 
                                ? '1px solid rgba(255, 255, 255, 0.08)' 
                                : '1px solid rgba(0, 0, 0, 0.05)',
                              zIndex: 1300,
                              overflow: 'hidden',
                              py: 2,
                            }}
                          >
                            {['all', 'drinks', 'desserts', 'salads'].map((category, index) => (
                              <React.Fragment key={category}>
                                <Button
                                  onClick={() => handleCategoryClick(category)}
                                  fullWidth
                                  sx={{
                                    justifyContent: 'flex-start',
                                    px: 4,
                                    py: 2.5,
                                    textTransform: 'none',
                                    color: isDarkMode ? '#ffffff' : '#3a3429',
                                    borderRadius: 0,
                                    transition: 'all 0.15s ease',
                                    '&:hover': {
                                      backgroundColor: isDarkMode 
                                        ? 'rgba(255, 255, 255, 0.1)'
                                        : 'rgba(139, 69, 19, 0.05)',
                                      transform: 'translateX(2px)',
                                    },
                                  }}
                                >
                                  <Typography 
                                    sx={{ 
                                      fontSize: '1rem', 
                                      fontWeight: 500,
                                      lineHeight: 1.5,
                                      fontFamily: '"EB Garamond", serif',
                                    }}
                                  >
                                    {category === 'all' ? t('common.all') : t(`navigation.${category}`)}
                                  </Typography>
                                </Button>
                                {index < 3 && (
                                  <Box 
                                    sx={{ 
                                      height: '1px',
                                      backgroundColor: isDarkMode 
                                        ? 'rgba(255, 255, 255, 0.06)'
                                        : 'rgba(0, 0, 0, 0.04)',
                                      mx: 3,
                                    }} 
                                  />
                                )}
                              </React.Fragment>
                            ))}
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  }
                  
                  // Regular navigation items
                  const isActive = item.path.includes('?') 
                    ? location.pathname === item.path.split('?')[0] && (location as any).search === `?${item.path.split('?')[1]}`
                    : location.pathname === item.path;
                  
                  return (
                    <Button
                      key={item.path}
                      onClick={() => {
                        if (item.path.includes('?')) {
                          (history as any).push(item.path);
                        } else {
                          (history as any).push(item.path);
                        }
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : (isActive ? '#8b4513' : '#5d4037'),
                        backgroundColor: isActive 
                          ? (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 69, 19, 0.08)')
                          : 'transparent',
                        borderRadius: '25px',
                        px: 3,
                        py: 2,
                        minWidth: '120px',
                        height: '48px',
                        textTransform: 'none',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...(isDarkMode && {
                          textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                          boxShadow: isActive
                            ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)'
                            : 'none',
                        }),
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(255, 255, 255, 0.15)'
                            : 'rgba(139, 69, 19, 0.12)',
                          color: isDarkMode ? '#ffffff' : '#8b4513',
                          transform: 'translateY(-2px)',
                          ...(isDarkMode && {
                            textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                          }),
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center' }}>
                        {item.icon}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontSize: '1rem', 
                            fontWeight: 'inherit', 
                            whiteSpace: 'nowrap',
                            color: 'inherit',
                            ...(isDarkMode && {
                              textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                            }),
                          }}
                        >
                          {item.label}
                        </Typography>
                      </Box>
                    </Button>
                  );
                })}
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
                  color: isDarkMode ? '#ffffff' : '#5d4037',
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(93, 64, 55, 0.08)',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  ...(isDarkMode && {
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                  }),
                  '&:hover': { 
                    color: isDarkMode ? '#ffffff' : '#8b4513',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(139, 69, 19, 0.12)',
                    transform: 'scale(1.15)',
                    ...(isDarkMode && {
                      boxShadow: '0 0 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.3)',
                    }),
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
                        borderColor: isDarkMode ? '#ffffff' : '#8b4513',
                        color: isDarkMode ? '#ffffff' : '#8b4513',
                        borderRadius: '25px',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        ...(isDarkMode && {
                          textShadow: '0 0 8px rgba(255, 255, 255, 0.6), 0 0 12px rgba(255, 255, 255, 0.4)',
                          boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                        }),
                        '&:hover': {
                          borderColor: isDarkMode ? '#ffffff' : '#a0522d',
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 69, 19, 0.08)',
                          transform: 'translateY(-3px)',
                          ...(isDarkMode && {
                            textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 15px rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 0 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.3)',
                          }),
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
                        backgroundColor: isDarkMode ? '#ffffff' : '#8b4513',
                        color: isDarkMode ? '#1a1a1a' : '#ffffff',
                        borderRadius: '25px',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: isDarkMode 
                          ? '0 0 15px rgba(255, 255, 255, 0.5), 0 0 25px rgba(255, 255, 255, 0.3), 0 2px 8px rgba(255, 255, 255, 0.4)'
                          : '0 2px 8px rgba(139, 69, 19, 0.3)',
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : '#a0522d',
                          transform: 'translateY(-3px)',
                          boxShadow: isDarkMode
                            ? '0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4), 0 4px 12px rgba(255, 255, 255, 0.5)'
                            : '0 4px 12px rgba(139, 69, 19, 0.4)',
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
                    color: isDarkMode ? '#ffffff' : '#8b4513',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(139, 69, 19, 0.08)',
                    ml: 2,
                    width: 56,
                    height: 56,
                    ...(isDarkMode && {
                      boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)',
                    }),
                    '&:hover': { 
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(139, 69, 19, 0.12)',
                      transform: 'scale(1.15)',
                      ...(isDarkMode && {
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.4), 0 0 25px rgba(255, 255, 255, 0.3)',
                      }),
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
      </Box>

      {/* Toolbar Spacer */}
      <Box sx={{ height: 120 }} />
    </>
  );
}