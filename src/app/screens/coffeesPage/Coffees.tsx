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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  ListItemText,
  ListItemIcon,
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
    <Skeleton variant="rectangular" height={220} />
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
  const [sortAccordionExpanded, setSortAccordionExpanded] = useState(false);
  const [orderAccordionExpanded, setOrderAccordionExpanded] = useState(false);
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
    <Box sx={{ 
      backgroundColor: isDarkMode ? '#0a0a0a' : '#fafafa', 
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '200px',
        background: isDarkMode 
          ? 'linear-gradient(180deg, rgba(139, 69, 19, 0.1) 0%, transparent 100%)'
          : 'linear-gradient(180deg, rgba(139, 69, 19, 0.05) 0%, transparent 100%)',
        zIndex: 0
      }
    }}>
      <Box sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Stack spacing={6}>
          {/* Header Section */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography variant="h2" sx={{
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Playfair Display, serif',
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                color: isDarkMode ? '#ffffff' : '#1a1a1a'
              }}>
                Our Menu
            </Typography>
              <Typography variant="h5" sx={{
                color: isDarkMode ? '#b0b0b0' : '#666666',
                fontWeight: 400,
                fontFamily: 'Poppins, sans-serif',
                fontSize: { xs: '1.1rem', md: '1.3rem' }
              }}>
                Discover our carefully curated selection of coffee, desserts, and more
            </Typography>
            </motion.div>
          </Box>

          {/* Enhanced Search and Controls */}
          <Paper sx={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
            borderRadius: '20px',
            p: 3,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: 3 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 300 }}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      '& fieldset': {
                        borderColor: isDarkMode ? '#404040' : '#e0e0e0',
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#ffffff' : '#333333',
                      padding: '16px 20px',
                    },
                  }}
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
                sx={{
                  backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
                  color: isDarkMode ? '#ffd700' : '#8B4513',
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  border: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#404040' : '#e8e8e8',
                    transform: 'scale(1.05)',
                    boxShadow: isDarkMode 
                      ? '0 8px 20px rgba(255, 215, 0, 0.3)'
                      : '0 8px 20px rgba(139, 69, 19, 0.2)',
                  },
                  transition: 'all 0.3s ease',
                }}
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
          <Paper sx={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                '& .MuiTab-root': {
                  color: isDarkMode ? '#b0b0b0' : '#666666',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  padding: '20px 24px',
                  minHeight: '64px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: isDarkMode ? '#ffd700' : '#8B4513',
                    backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                  },
                  '&.Mui-selected': {
                    color: isDarkMode ? '#ffd700' : '#8B4513',
                    fontWeight: 700,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                  height: '4px',
                  borderRadius: '2px 2px 0 0',
                },
              }}
            >
              <Tab label={t('common.all')} value="all" />
              <Tab label={t('navigation.desserts')} value="desserts" />
              <Tab label={t('navigation.drinks')} value="drinks" />
              <Tab label={t('navigation.salads')} value="salads" />
            </Tabs>
          </Paper>

          {/* Enhanced Sort Controls */}
          <Paper sx={{ 
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
            borderRadius: '16px',
            p: 3,
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexWrap: 'wrap', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'nowrap', position: 'relative', zIndex: 10 }}>
                <Box sx={{ position: 'relative', height: 48, flexShrink: 0, width: 180 }}>
                  <Accordion 
                    expanded={sortAccordionExpanded} 
                    onChange={(e, isExpanded) => setSortAccordionExpanded(isExpanded)}
                    sx={{ 
                      width: '100%',
                      boxShadow: sortAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      position: 'relative',
                      zIndex: sortAccordionExpanded ? 1000 : 1,
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        minHeight: '48px !important',
                      },
                    }}
                  >
                  <AccordionSummary sx={{ 
                    minHeight: 48, 
                    '&.Mui-expanded': { minHeight: 48 },
                  color: isDarkMode ? '#ffffff' : '#333333', 
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('common.sortBy')}: {
                          sortBy === 'new' ? t('common.newest') :
                          sortBy === 'price' ? t('common.price') :
                          sortBy === 'views' ? t('common.views') :
                          t('common.rating')
                        }
                </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ 
                    p: 0,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1001,
                    mt: 0,
                  }}>
                    <ListItemButton
                      selected={sortBy === 'new'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'new' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                    sx={{
                      color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                      },
                    }}
                  >
                      <ListItemIcon>
                        <WhatshotIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.newest')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'price'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'price' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AttachMoneyIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.price')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'views'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'views' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <VisibilityIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.views')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'rating'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'rating' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <StarIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.rating')} />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>
                      </Box>

                <Box sx={{ position: 'relative', height: 48, flexShrink: 0, width: 150 }}>
                  <Accordion 
                    expanded={orderAccordionExpanded} 
                    onChange={(e, isExpanded) => setOrderAccordionExpanded(isExpanded)}
                    sx={{
                      width: '100%',
                      boxShadow: orderAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      position: 'relative',
                      zIndex: orderAccordionExpanded ? 1000 : 1,
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        minHeight: '48px !important',
                      },
                    }}
                  >
                  <AccordionSummary sx={{ 
                    minHeight: 48,
                    maxHeight: 48,
                    '&.Mui-expanded': { 
                      minHeight: 48,
                      maxHeight: 48,
                    },
                      color: isDarkMode ? '#ffffff' : '#333333',
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('common.order')}: {sortOrder === 'desc' ? t('common.descending') : t('common.ascending')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ 
                    p: 0,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1001,
                    mt: 0,
                    display: orderAccordionExpanded ? 'block' : 'none',
                  }}>
                    <ListItemButton
                      selected={sortOrder === 'desc'}
                      onClick={() => {
                        handleSortOrderChange({ target: { value: 'desc' } } as any);
                        setOrderAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemText primary={t('common.descending')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortOrder === 'asc'}
                      onClick={() => {
                        handleSortOrderChange({ target: { value: 'asc' } } as any);
                        setOrderAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#333333',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                      },
                    }}
                  >
                      <ListItemText primary={t('common.ascending')} />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>
                </Box>
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
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 4,
              position: 'relative',
              borderRadius: '16px',
              padding: '16px',
              transition: 'all 0.5s ease',
              backgroundColor: highlightResults 
                ? (isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.05)')
                : 'transparent',
              border: highlightResults 
                ? `2px solid ${isDarkMode ? 'rgba(255, 215, 0, 0.3)' : 'rgba(139, 69, 19, 0.2)'}`
                : '2px solid transparent',
              boxShadow: highlightResults 
                ? (isDarkMode 
                  ? '0 0 20px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(255, 215, 0, 0.1)'
                  : '0 0 20px rgba(139, 69, 19, 0.15), inset 0 0 20px rgba(139, 69, 19, 0.05)')
                : 'none',
            }}>
            {loading ? (
              <GridSkeleton />
            ) : (
              currentItems.map((item) => (
              <Card 
                key={item.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  // Glassmorphism effect
                  backgroundColor: isDarkMode 
                    ? 'rgba(26, 26, 26, 0.7)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)', // For Safari support
                  border: isDarkMode 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '24px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  // Glassmorphism shadow
                  boxShadow: isDarkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: isDarkMode 
                      ? 'linear-gradient(90deg, #ffd700, #8B4513, #ffd700)'
                      : 'linear-gradient(90deg, #8B4513, #A0522D, #8B4513)',
                    zIndex: 1,
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-12px) scale(1.03)',
                    backgroundColor: isDarkMode 
                      ? 'rgba(26, 26, 26, 0.9)' 
                      : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    border: isDarkMode 
                      ? '1px solid rgba(255, 215, 0, 0.3)' 
                      : '1px solid rgba(139, 69, 19, 0.3)',
                    boxShadow: isDarkMode 
                      ? '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                      : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 30px rgba(139, 69, 19, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                    '& .glassmorphism-glow': {
                      opacity: 1,
                      transform: 'scale(1.1)',
                    },
                  },
                }}
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
                    image={item.image}
                    alt={item.name}
                    sx={{ 
                      height: '220px',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
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
                  {item.isNew && (
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 215, 0, 0.9)' 
                          : 'rgba(139, 69, 19, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isDarkMode ? '#1a1a1a' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        border: isDarkMode 
                          ? '1px solid rgba(255, 215, 0, 0.3)' 
                          : '1px solid rgba(139, 69, 19, 0.3)',
                        boxShadow: isDarkMode 
                          ? '0 4px 12px rgba(255, 215, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                          : '0 4px 12px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        zIndex: 2,
                      }}
                    />
                  )}
                  
                  {/* Favorite Button with enhanced glassmorphism */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                      width: 44,
                      height: 44,
                      borderRadius: '16px',
                      border: isDarkMode 
                        ? '1px solid rgba(255, 255, 255, 0.2)' 
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: isDarkMode 
                        ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.25)' 
                          : 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.1)',
                        boxShadow: isDarkMode 
                          ? '0 6px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                          : '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      },
                      transition: 'all 0.3s ease',
                    }}
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
                  
                  {/* Out of Stock Badge with glassmorphism */}
                  {!item.inStock && (
                    <Chip
                      label="Out of Stock"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 2,
                  position: 'relative',
                }}>
                  {/* Title and Price in same row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="h2" 
                      sx={{ 
                        color: isDarkMode ? '#ffffff' : '#1a1a1a',
                        fontWeight: 600,
                        flex: 1,
                        fontSize: '1rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </Typography>
                  <Typography 
                      variant="subtitle1" 
                    sx={{ 
                        color: isDarkMode ? '#ffd700' : '#8B4513',
                        fontWeight: 700,
                        ml: 1,
                        fontSize: '1rem'
                      }}
                    >
                      ${item.price}
                  </Typography>
                  </Box>
                  
                  {/* Rating and reviews - with spacing */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating 
                      value={item.rating} 
                      precision={0.1} 
                      size="small" 
                      readOnly 
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiRating-iconFilled': {
                          color: isDarkMode ? '#ffd700' : '#ffc107',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ 
                      color: isDarkMode ? '#b0b0b0' : '#666666',
                      ml: 0.5,
                      fontSize: '0.75rem'
                    }}>
                      ({item.reviews})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 'auto' }}>
                      <VisibilityIcon fontSize="small" sx={{ color: isDarkMode ? '#ffd700' : '#8B4513', fontSize: '0.75rem' }} />
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? '#b0b0b0' : '#666666',
                        fontSize: '0.75rem'
                      }}>
                        {item.views}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Category chip - with spacing */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    <Chip 
                      label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 215, 0, 0.1)' 
                          : 'rgba(139, 69, 19, 0.1)',
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513', 
                        color: isDarkMode ? '#ffd700' : '#8B4513',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                  
                  {/* Add to cart button - compact with margin-top */}
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.875rem' }} />}
                    fullWidth
                    disabled={!item.inStock}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    sx={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 215, 0, 0.9)' 
                        : 'rgba(139, 69, 19, 0.9)',
                      color: isDarkMode ? '#1a1a1a' : '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 36,
                      borderRadius: '8px',
                      textTransform: 'none',
                      mt: 1,
                      py: 0,
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 215, 0, 1)' 
                          : 'rgba(139, 69, 19, 1)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(204, 204, 204, 0.5)',
                      },
                    }}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))
            )}
          </Box>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Paper sx={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
              borderRadius: '16px',
              p: 3,
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Typography variant="h6" sx={{ 
                  color: isDarkMode ? '#ffffff' : '#333333',
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
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
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: isDarkMode ? '#ffffff' : '#333333',
                      backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                      border: `2px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
                      borderRadius: '12px',
                      margin: '0 4px',
                      fontWeight: 600,
                      fontSize: '1rem',
                      minWidth: 44,
                      height: 44,
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#404040' : '#e8e8e8',
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                        transform: 'translateY(-2px)',
                        boxShadow: isDarkMode 
                          ? '0 4px 12px rgba(255, 215, 0, 0.2)'
                          : '0 4px 12px rgba(139, 69, 19, 0.2)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                        color: isDarkMode ? '#1a1a1a' : '#ffffff',
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                        fontWeight: 700,
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#ffed4e' : '#A0522D',
                          transform: 'translateY(-2px)',
                          boxShadow: isDarkMode 
                            ? '0 6px 16px rgba(255, 215, 0, 0.3)'
                            : '0 6px 16px rgba(139, 69, 19, 0.3)',
                        },
                      },
                      transition: 'all 0.3s ease',
                    },
                  }}
                />
              </Box>
            </Paper>
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
      </Box>
    </Box>
  );
} 