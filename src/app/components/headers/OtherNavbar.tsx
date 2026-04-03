import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery,
  Drawer,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useLocation, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGlobals } from '../../hooks/useGlobals';
import { serverApi } from '../../../lib/config';
import { StitchFloatingNavbarChrome } from './StitchFloatingNavbarChrome';
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
  const location = useLocation();
  const history = useHistory();
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme } = useCoffeeTheme();
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [burgerAnchorEl, setBurgerAnchorEl] = useState<HTMLElement | null>(null);
  const burgerMenuOpen = Boolean(burgerAnchorEl);
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  const stitchPrimaryNav = useMemo(
    () => [
      { path: '/', label: t('navigation.home') },
      { path: '/products', label: t('navigation.menu') },
      { path: '/orders', label: t('navigation.orders') },
      { path: '/help', label: t('navigation.about') },
    ],
    [t, i18n.language],
  );

  const isFullBleedUnderNav =
    location.pathname === '/products' ||
    location.pathname === '/' ||
    location.pathname === '/coffee-demo';
  const isHelpRoute =
    location.pathname === '/help' || location.pathname.startsWith('/help/');
  const floatingChromeSpacerPx = isFullBleedUnderNav ? 0 : 96;
  const chromeLayout = isHelpRoute ? 'help' : 'floating';

  // Force re-render when auth state changes
  useEffect(() => {
    // This ensures the component re-renders when authMember changes
  }, [authMember]);

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

  const moreNavItems = useMemo(
    () => [
      { path: '/stats', label: t('navigation.analytics') },
      { path: '/my-page', label: t('navigation.myPage') },
      { path: '/birthday-cake', label: t('navigation.birthdayCake') },
    ],
    [t, i18n.language],
  );

  const stitchNavActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products')
      return location.pathname === '/products' || /^\/products\//.test(location.pathname);
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
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

      <StitchFloatingNavbarChrome
        isDarkMode={isDarkMode}
        isLgUp={isLgUp}
        authMember={authMember}
        stitchPrimaryNav={stitchPrimaryNav}
        moreNavItems={moreNavItems}
        cartItems={cartItems}
        onAdd={onAdd}
        onRemove={onRemove}
        onDelete={onDelete}
        onDeleteAll={onDeleteAll}
        setSignupOpen={setSignupOpen}
        setLoginOpen={setLoginOpen}
        handleLogoutRequest={handleLogoutRequest}
        onSearchOpen={handleSearchToggle}
        toggleTheme={toggleTheme}
        burgerAnchorEl={burgerAnchorEl}
        setBurgerAnchorEl={setBurgerAnchorEl}
        stitchNavActive={stitchNavActive}
        floatingChromeSpacerPx={floatingChromeSpacerPx}
        chromeLayout={chromeLayout}
      />

    </>
  );
}