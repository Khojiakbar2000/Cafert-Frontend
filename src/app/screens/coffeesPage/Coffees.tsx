// Coffees component for listing all coffees
import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton,
  CircularProgress
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCart as AddShoppingCartIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Whatshot as WhatshotIcon,
  AttachMoney as AttachMoneyIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ProductService from "../../services/ProductService";

// Lazy load the AwardsStrip component
import { serverApi } from "../../../lib/config";const AwardsStrip = React.lazy(() => import('../../../mui-coffee/components/AwardsStrip'));

// Loading skeleton for cards
const CardSkeleton = () => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <Skeleton variant="rectangular" height={240} />
    <CardContent sx={{ flexGrow: 1 }}>
      <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
      <Skeleton variant="text" height={20} sx={{ mb: 2 }} />
      <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={48} />
    </CardContent>
  </Card>
);

// Loading skeleton for the entire grid
const GridSkeleton = () => (
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
    gap: 4 
  }}>
    {Array.from({ length: 8 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </Box>
);

// Extended coffee data with new fields
interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "coffees" | "desserts" | "drinks" | "salads" | "dishes" | "other";
  origin: string;
  roast: string;
  rating: number;
  reviews: number;
  views: number;
  isNew: boolean;
  inStock: boolean;
  isFavorite: boolean;
  preparationTime: string;
  calories: number;
  ingredients: string[];
}

interface CoffeesProps {
  onAdd: (item: CartItem) => void;
}

export default function Coffees(props: CoffeesProps) {
  const { onAdd } = props;
  const history = useHistory();
  const { isDarkMode, toggleTheme } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // Pagination constants
  const ITEMS_PER_PAGE = 5;
  
  const [coffees, setCoffees] = useState<CoffeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filteredCoffees, setFilteredCoffees] = useState<CoffeeItem[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productService = new ProductService();
        const products = await productService.getProducts({
          page: 1,
          limit: 50,
          order: "createdAt"
        });

        // Transform backend data to frontend format
        const transformedProducts: CoffeeItem[] = products.map((product: any) => {
          let category = 'other';
          const productCollection = product.productCollection?.toLowerCase();
          
          if (productCollection === 'coffee' || productCollection === 'drink') {
            category = 'drinks';
          } else if (productCollection === 'dessert') {
            category = 'desserts';
          } else if (productCollection === 'salad') {
            category = 'salads';
          } else if (productCollection === 'dish') {
            category = 'dishes';
          }
          
          return {
            id: product._id, // Keep the original MongoDB _id as id
            name: product.productName,
            description: product.productDesc || 'No description available',
            price: product.productPrice,
            image: product.productImages?.[0] ? `${serverApi}${product.productImages[0]}` : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
            category: category as "coffees" | "desserts" | "drinks" | "salads" | "dishes" | "other",
            origin: 'Local',
            roast: 'Medium',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            views: (() => {
              const backendViews = product.productViews || 0;
              const storageKey = `product_views_${product._id}`;
              const persistentViews = parseInt(localStorage.getItem(storageKey) || "0", 10);
              return Math.max(backendViews, persistentViews);
            })(),
            isNew: false,
            inStock: product.productLeftCount > 0,
            isFavorite: false,
            preparationTime: '5 min',
            calories: Math.floor(Math.random() * 300) + 50,
            ingredients: ['Fresh ingredients']
          };
        });

        setCoffees(transformedProducts);
        setFilteredCoffees(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if API fails
        setCoffees([]);
        setFilteredCoffees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "desserts" | "drinks" | "salads" | "dishes" | "other">('all');
  const [sortBy, setSortBy] = useState<'new' | 'price' | 'views' | 'rating'>('new');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightResults, setHighlightResults] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  
  // Ref for auto-scrolling to search results
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = coffees.filter((coffee) => {
      if (!searchText.trim()) {
        // If no search term, only filter by category
        return selectedCategory === 'all' || coffee.category === selectedCategory;
      }
      
      const searchLower = searchText.toLowerCase().trim();
      const nameMatch = coffee.name.toLowerCase().includes(searchLower);
      const descMatch = coffee.description.toLowerCase().includes(searchLower);
      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === 'all' || coffee.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'new':
          comparison = (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCoffees(filtered);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [coffees, searchText, selectedCategory, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCoffees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredCoffees.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    
    // Reset search submitted flag when text changes
    if (searchSubmitted) {
      setSearchSubmitted(false);
    }
    
    // Reset highlight when search is cleared
    if (!value.trim()) {
      setHighlightResults(false);
    }
  };

  // Function to handle auto-scroll to search results
  const scrollToSearchResults = () => {
    if (searchText.trim() && filteredCoffees.length > 0) {
      // Mark search as submitted
      setSearchSubmitted(true);
      
      // Trigger highlight effect
      setHighlightResults(true);
      
      setTimeout(() => {
        if (productsGridRef.current) {
          const navbarHeight = 120; // Account for fixed navbar
          const elementPosition = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        
        // Remove highlight after scroll completes
        setTimeout(() => {
          setHighlightResults(false);
        }, 2000);
      }, 100); // Small delay to ensure DOM is updated
    }
  };

  // Handle Enter key press in search field
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      scrollToSearchResults();
    }
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: "all" | "desserts" | "drinks" | "salads" | "dishes" | "other") => {
    setSelectedCategory(newValue);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: any) => {
    setSortOrder(event.target.value);
  };

  const toggleFavorite = (coffeeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coffeeId)) {
      newFavorites.delete(coffeeId);
    } else {
      newFavorites.add(coffeeId);
    }
    setFavorites(newFavorites);
    
    setCoffees(prev => prev.map(coffee => 
      coffee.id === coffeeId 
        ? { ...coffee, isFavorite: !coffee.isFavorite }
        : coffee
    ));
  };

  const handleAddToCart = (coffee: CoffeeItem) => {
    const cartItem: CartItem = {
      _id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      quantity: 1,
      image: coffee.image,
    };
    onAdd(cartItem);
  };

  const handleCoffeeClick = (coffeeId: string) => {
    history.push(`/products/${coffeeId}`);
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'coffees', label: 'Coffees' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'salads', label: 'Salads' },
    { value: 'dishes', label: 'Dishes' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box className={`coffees-page-container ${isDarkMode ? 'dark' : ''}`}>
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Stack spacing={6}>
          {/* Header Section */}
          <Box className="coffees-header">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h2" className={`coffees-title ${isDarkMode ? 'dark' : ''}`}>
                Our Menu
              </Typography>
              <Typography variant="h5" className={`coffees-subtitle ${isDarkMode ? 'dark' : ''}`}>
                Discover our carefully curated selection of coffee, desserts, and more
              </Typography>
            </motion.div>
          </Box>

          {/* Enhanced Search and Controls */}
          <Paper className={`coffees-controls ${isDarkMode ? 'dark' : ''}`}>
            <Box className="coffees-search-container">
              <Box className={`coffees-search-field ${isDarkMode ? 'dark' : ''}`}>
                {/* Enhanced Search Bar */}
                <TextField
                  id="coffee-search"
                  name="coffee-search"
                  label="Search Products"
                  placeholder="Search for products... (Press Enter to scroll to results)"
                  value={searchText}
                  onChange={handleSearch}
                  onKeyPress={handleSearchKeyPress}
                  size="medium"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <SearchIcon sx={{ 
                          color: isDarkMode ? '#ffd700' : '#8B4513',
                          fontSize: '1.5rem'
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchText.trim() && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={scrollToSearchResults}
                          sx={{
                            color: isDarkMode ? '#ffd700' : '#8B4513',
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.1)',
                            '&:hover': {
                              backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.2)',
                            }
                          }}
                          title="Click to scroll to results"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              {/* Enhanced Night Mode Toggle */}
              <IconButton
                onClick={toggleTheme}
                className="coffees-search-button"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <LightModeIcon sx={{ fontSize: '1.5rem' }} /> : <DarkModeIcon sx={{ fontSize: '1.5rem' }} />}
              </IconButton>
            </Box>
          </Paper>

          {/* Awards & Certifications Section */}
          <Suspense fallback={<CircularProgress />}>
            <AwardsStrip />
          </Suspense>

          {/* Enhanced Category Tabs */}
          <Paper className={`coffees-category-tabs ${isDarkMode ? 'dark' : ''}`}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
            >
              <Tab label={t('common.all')} value="all" />
              <Tab label={t('navigation.desserts')} value="desserts" />
              <Tab label={t('navigation.drinks')} value="drinks" />
              <Tab label={t('navigation.salads')} value="salads" />
            </Tabs>
          </Paper>

          {/* Enhanced Sort Controls */}
          <Paper className={`coffees-controls ${isDarkMode ? 'dark' : ''}`}>
            <Box className="coffees-sort-container">
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" className={`coffees-results-count ${isDarkMode ? 'dark' : ''}`}>
                  {t('common.sortBy')}:
                </Typography>
                
                <FormControl size="medium" className={`coffees-sort-field ${isDarkMode ? 'dark' : ''}`}>
                  <InputLabel>
                    {t('common.sortBy')}
                  </InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label={t('common.sortBy')}
                  >
                    <MenuItem value="new">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatshotIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                        {t('common.newest')}
                      </Box>
                    </MenuItem>
                    <MenuItem value="price">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AttachMoneyIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                        {t('common.price')}
                      </Box>
                    </MenuItem>
                    <MenuItem value="views">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VisibilityIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                        {t('common.views')}
                      </Box>
                    </MenuItem>
                    <MenuItem value="rating">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                        {t('common.rating')}
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="medium" sx={{ minWidth: 120 }}>
                  <InputLabel sx={{ 
                    color: isDarkMode ? '#b0b0b0' : '#666666',
                    fontSize: '1rem'
                  }}>
                    {t('common.order')}
                  </InputLabel>
                  <Select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    label={t('common.order')}
                    sx={{
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      color: isDarkMode ? '#ffffff' : '#333333',
                      borderRadius: '12px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                        borderWidth: '2px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    <MenuItem value="desc">{t('common.descending')}</MenuItem>
                    <MenuItem value="asc">{t('common.ascending')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body1" sx={{ 
                color: isDarkMode ? '#b0b0b0' : '#666666',
                fontWeight: 500,
                fontSize: '1rem',
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`
              }}>
                {t('common.showing')} {startIndex + 1}-{Math.min(endIndex, filteredCoffees.length)} {t('common.of')} {filteredCoffees.length} {t('common.items')}
              </Typography>
            </Box>
          </Paper>

          {/* Search Results Indicator */}
          {searchText.trim() && searchSubmitted && filteredCoffees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: highlightResults ? 1 : 0.7, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ 
                p: 2, 
                mb: 3,
                backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.2)'}`,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#ffd700' : '#8B4513',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  🔍 Found {filteredCoffees.length} result{filteredCoffees.length !== 1 ? 's' : ''} for "{searchText}"
                </Typography>
              </Paper>
            </motion.div>
          )}

          {/* Enhanced Items Grid */}
          <Box 
            ref={productsGridRef}
            className={`coffees-products-grid ${highlightResults ? 'highlight' : ''}`}
          >
            {loading ? (
              <GridSkeleton />
            ) : (
              currentItems.map((item) => (
              <Card 
                key={item.id}
                className="coffee-card"
                onClick={() => handleCoffeeClick(item.id)}
              >
                {/* Glassmorphism glow effect */}
                <Box 
                  className="glassmorphism-glow"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '100%',
                    height: '100%',
                    background: isDarkMode 
                      ? 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)' 
                      : 'radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%)',
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0,
                    transition: 'all 0.4s ease',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={item.image}
                    alt={item.name}
                    className="coffee-card-image"
                  />
                  
                  {/* Gradient Overlay */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isDarkMode 
                      ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)'
                      : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                    pointerEvents: 'none'
                  }} />
                  
                  {/* New Badge with glassmorphism */}
                  <Box className="coffee-card-badges">
                    {item.isNew && (
                      <Chip
                        label="NEW"
                        size="small"
                        className="coffee-card-badge new"
                      />
                    )}
                    {!item.inStock && (
                      <Chip
                        label="Out of Stock"
                        size="small"
                        className="coffee-card-badge out-of-stock"
                      />
                    )}
                  </Box>
                  
                  {/* Favorite Button with enhanced glassmorphism */}
                  <IconButton
                    className="coffee-card-favorite-button"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {item.isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e91e63', fontSize: '1.3rem' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: '1.3rem' }} />
                    )}
                  </IconButton>
                </Box>
                
                <CardContent className="coffee-card-content">
                  {/* Price Badge with glassmorphism */}
                  <Typography className="coffee-card-price">
                    ${item.price}
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    className="coffee-card-title"
                  >
                    {item.name}
                  </Typography>
                  
                  <Typography 
                    variant="body1" 
                    className="coffee-card-description"
                  >
                    {item.description}
                  </Typography>
                  
                  {/* Enhanced Stats Row with glassmorphism */}
                  <Box className="coffee-card-meta">
                    <Box className="coffee-card-rating">
                      <Rating 
                        value={item.rating} 
                        precision={0.1} 
                        size="small" 
                        readOnly 
                      />
                      <Typography variant="body2">
                        ({item.reviews})
                      </Typography>
                    </Box>
                    <Box className="coffee-card-views">
                      <VisibilityIcon fontSize="small" />
                      <Typography variant="body2">
                        {item.views}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Enhanced Category and Origin with glassmorphism */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip 
                      label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                      size="medium" 
                      variant="outlined"
                      sx={{ 
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 215, 0, 0.1)' 
                          : 'rgba(139, 69, 19, 0.1)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513', 
                        color: isDarkMode ? '#ffd700' : '#8B4513',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        borderRadius: '16px',
                        border: isDarkMode 
                          ? '1px solid rgba(255, 215, 0, 0.3)' 
                          : '1px solid rgba(139, 69, 19, 0.3)',
                        '&:hover': {
                          backgroundColor: isDarkMode 
                            ? 'rgba(255, 215, 0, 0.2)' 
                            : 'rgba(139, 69, 19, 0.15)',
                          transform: 'scale(1.05)',
                          boxShadow: isDarkMode 
                            ? '0 4px 12px rgba(255, 215, 0, 0.3)' 
                            : '0 4px 12px rgba(139, 69, 19, 0.2)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                    {item.origin !== 'N/A' && (
                      <Chip 
                        label={item.origin} 
                        size="medium" 
                        variant="outlined"
                        sx={{ 
                          backgroundColor: isDarkMode 
                            ? 'rgba(255, 215, 0, 0.1)' 
                            : 'rgba(139, 69, 19, 0.1)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          borderColor: isDarkMode ? '#ffd700' : '#8B4513', 
                          color: isDarkMode ? '#ffd700' : '#8B4513',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          borderRadius: '16px',
                          border: isDarkMode 
                            ? '1px solid rgba(255, 215, 0, 0.3)' 
                            : '1px solid rgba(139, 69, 19, 0.3)',
                          '&:hover': {
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 215, 0, 0.2)' 
                              : 'rgba(139, 69, 19, 0.15)',
                            transform: 'scale(1.05)',
                            boxShadow: isDarkMode 
                              ? '0 4px 12px rgba(255, 215, 0, 0.3)' 
                              : '0 4px 12px rgba(139, 69, 19, 0.2)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Enhanced Add to Cart Button with glassmorphism */}
                  <Box className="coffee-card-actions">
                    <Button
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      fullWidth
                      disabled={!item.inStock}
                      className="coffee-card-action-button primary"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleAddToCart(item);
                      }}
                    >
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
            )}
          </Box>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Box className={`coffees-pagination ${isDarkMode ? 'dark' : ''}`}>
              <Typography variant="h6" className={`coffees-results-count ${isDarkMode ? 'dark' : ''}`}>
                Page {currentPage} of {totalPages}
              </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                />
            </Box>
          )}

          {/* Enhanced No Results */}
          {filteredCoffees.length === 0 && (
            <Paper sx={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
              borderRadius: '20px',
              p: 6,
              textAlign: 'center',
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 3 
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                  mb: 2
                }}>
                  <SearchIcon sx={{ 
                    fontSize: '2rem',
                    color: isDarkMode ? '#ffd700' : '#8B4513'
                  }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  color: isDarkMode ? '#ffffff' : '#333333',
                  fontWeight: 600,
                  fontSize: '1.5rem'
                }}>
                  No items found
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#b0b0b0' : '#666666',
                  maxWidth: '400px',
                  lineHeight: 1.6
                }}>
                  Try adjusting your search terms or filters to find what you're looking for
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchText("");
                    setSelectedCategory("all");
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                    color: isDarkMode ? '#1a1a1a' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#ffed4e' : '#A0522D',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>
          )}

          {/* Map Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" sx={{ color: isDarkMode ? '#ffffff' : '#333333', mb: 3, fontWeight: 600 }}>
              Find Our Locations
            </Typography>
            
            <Paper 
              sx={{ 
                p: 3, 
                backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff', 
                border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
                overflow: 'hidden'
              }}
            >
              {/* Interactive Map */}
              <Box sx={{ height: 400, position: 'relative', mb: 3 }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007%2C%20USA!5e0!3m2!1sen!2sus!4v1640995200000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Coffee Shop Location"
                />
              </Box>
              
              {/* Location Info */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* Main Location */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#ffffff' : '#333333', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon sx={{ color: isDarkMode ? '#8B4513' : '#8B4513' }} />
                    Main Coffee Shop
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666', mb: 1 }}>
                    123 Coffee Street, Downtown
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666', mb: 1 }}>
                    New York, NY 10001
                  </Typography>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666', mb: 2 }}>
                    Open Daily: 7:00 AM - 10:00 PM
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PhoneIcon />}
                      sx={{ borderColor: isDarkMode ? '#8B4513' : '#8B4513', color: isDarkMode ? '#8B4513' : '#8B4513' }}
                    >
                      (555) 123-4567
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AccessTimeIcon />}
                      sx={{ borderColor: isDarkMode ? '#8B4513' : '#8B4513', color: isDarkMode ? '#8B4513' : '#8B4513' }}
                    >
                      Hours
                    </Button>
                  </Box>
                </Box>
                
                {/* Additional Locations */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ color: isDarkMode ? '#ffffff' : '#333333', mb: 2 }}>
                    Other Locations
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : '#333333', fontWeight: 600 }}>
                        Midtown Branch
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}>
                        456 Avenue A, Midtown
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : '#333333', fontWeight: 600 }}>
                        Brooklyn Branch
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}>
                        789 Coffee Lane, Brooklyn
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : '#333333', fontWeight: 600 }}>
                        Queens Branch
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666666' }}>
                        321 Brew Street, Queens
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
} 