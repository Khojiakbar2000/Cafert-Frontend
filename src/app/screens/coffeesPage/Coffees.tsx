// Coffees component for listing all coffees
import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
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

// Lazy load the AwardsStrip component
const AwardsStrip = React.lazy(() => import('../../../mui-coffee/components/AwardsStrip'));

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
  category: 'coffees' | 'desserts' | 'drinks' | 'salads';
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
  
  const [coffees, setCoffees] = useState<CoffeeItem[]>([
    {
      id: '1',
      name: 'Espresso Classic',
      description: 'Rich and bold single shot espresso',
      price: 3.50,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
      category: 'coffees',
      origin: 'Italy',
      roast: 'Dark',
      rating: 4.8,
      reviews: 124,
      views: 1250,
      isNew: true,
      inStock: true,
      isFavorite: false,
      preparationTime: '2 min',
      calories: 5,
      ingredients: ['Arabica beans', 'Water']
    },
    {
      id: '2',
      name: 'Cappuccino Deluxe',
      description: 'Perfectly balanced espresso with steamed milk',
      price: 4.80,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
      category: 'coffees',
      origin: 'Italy',
      roast: 'Medium',
      rating: 4.6,
      reviews: 89,
      views: 980,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '4 min',
      calories: 120,
      ingredients: ['Espresso', 'Steamed milk', 'Milk foam']
    },
    {
      id: '3',
      name: 'Chocolate Cake',
      description: 'Rich chocolate layer cake with ganache',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
      category: 'desserts',
      origin: 'France',
      roast: 'N/A',
      rating: 4.9,
      reviews: 156,
      views: 2100,
      isNew: true,
      inStock: true,
      isFavorite: false,
      preparationTime: '15 min',
      calories: 350,
      ingredients: ['Chocolate', 'Flour', 'Eggs', 'Sugar', 'Butter']
    },
    {
      id: '4',
      name: 'Green Tea Latte',
      description: 'Smooth matcha green tea with steamed milk',
      price: 5.20,
      image: 'https://images.unsplash.com/photo-1515823662972-9b8c2c2c0e5b?w=400',
      category: 'drinks',
      origin: 'Japan',
      roast: 'N/A',
      rating: 4.4,
      reviews: 67,
      views: 750,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '3 min',
      calories: 80,
      ingredients: ['Matcha powder', 'Steamed milk', 'Honey']
    },
    {
      id: '5',
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with caesar dressing',
      price: 8.90,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
      category: 'salads',
      origin: 'Mexico',
      roast: 'N/A',
      rating: 4.2,
      reviews: 43,
      views: 520,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '8 min',
      calories: 180,
      ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing']
    },
    {
      id: '6',
      name: 'Caramel Macchiato',
      description: 'Espresso with caramel and steamed milk',
      price: 5.50,
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      category: 'coffees',
      origin: 'Italy',
      roast: 'Medium',
      rating: 4.7,
      reviews: 203,
      views: 1850,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '5 min',
      calories: 140,
      ingredients: ['Espresso', 'Steamed milk', 'Caramel syrup']
    },
    {
      id: '7',
      name: 'Tiramisu',
      description: 'Classic Italian coffee-flavored dessert',
      price: 7.80,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
      category: 'desserts',
      origin: 'Italy',
      roast: 'N/A',
      rating: 4.8,
      reviews: 178,
      views: 1650,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '20 min',
      calories: 280,
      ingredients: ['Mascarpone cheese', 'Coffee', 'Ladyfingers', 'Cocoa powder']
    },
    {
      id: '8',
      name: 'Fresh Fruit Smoothie',
      description: 'Blend of seasonal fruits with yogurt',
      price: 6.20,
      image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400',
      category: 'drinks',
      origin: 'Local',
      roast: 'N/A',
      rating: 4.3,
      reviews: 92,
      views: 890,
      isNew: true,
      inStock: true,
      isFavorite: false,
      preparationTime: '4 min',
      calories: 160,
      ingredients: ['Mixed fruits', 'Yogurt', 'Honey', 'Ice']
    },
    {
      id: '9',
      name: 'Greek Salad',
      description: 'Fresh vegetables with feta cheese and olives',
      price: 9.50,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      category: 'salads',
      origin: 'Greece',
      roast: 'N/A',
      rating: 4.5,
      reviews: 78,
      views: 650,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '10 min',
      calories: 220,
      ingredients: ['Cucumber', 'Tomatoes', 'Feta cheese', 'Olives', 'Red onion']
    },
    {
      id: '10',
      name: 'Cheesecake',
      description: 'Creamy New York style cheesecake',
      price: 8.20,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
      category: 'desserts',
      origin: 'USA',
      roast: 'N/A',
      rating: 4.7,
      reviews: 134,
      views: 1450,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '25 min',
      calories: 320,
      ingredients: ['Cream cheese', 'Graham crackers', 'Sugar', 'Vanilla']
    },
    {
      id: '11',
      name: 'Iced Latte',
      description: 'Chilled espresso with cold milk',
      price: 4.90,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
      category: 'coffees',
      origin: 'Italy',
      roast: 'Medium',
      rating: 4.4,
      reviews: 156,
      views: 1200,
      isNew: true,
      inStock: true,
      isFavorite: false,
      preparationTime: '3 min',
      calories: 90,
      ingredients: ['Espresso', 'Cold milk', 'Ice']
    },
    {
      id: '12',
      name: 'Lemonade',
      description: 'Fresh squeezed lemonade with mint',
      price: 3.80,
      image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400',
      category: 'drinks',
      origin: 'Local',
      roast: 'N/A',
      rating: 4.1,
      reviews: 45,
      views: 420,
      isNew: false,
      inStock: true,
      isFavorite: false,
      preparationTime: '2 min',
      calories: 70,
      ingredients: ['Fresh lemons', 'Sugar', 'Mint', 'Water']
    }
  ]);

  const [filteredCoffees, setFilteredCoffees] = useState<CoffeeItem[]>(coffees);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coffees' | 'desserts' | 'drinks' | 'salads' | 'dishes' | 'other'>('all');
  const [sortBy, setSortBy] = useState<'new' | 'price' | 'views' | 'rating'>('new');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let filtered = coffees.filter((coffee) => {
      const matchesSearch = coffee.name.toLowerCase().includes(searchText.toLowerCase()) ||
                           coffee.description.toLowerCase().includes(searchText.toLowerCase());
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
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: 'all' | 'coffees' | 'desserts' | 'drinks' | 'salads' | 'dishes' | 'other') => {
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
    history.push(`/coffees/${coffeeId}`);
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
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
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
                  placeholder={t('common.search')}
                  value={searchText}
                  onChange={handleSearch}
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
              <Tab label={t('navigation.drinks')} value="coffees" />
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
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="h6" sx={{ 
                  color: isDarkMode ? '#ffffff' : '#333333', 
                  fontWeight: 600,
                  fontSize: '1.1rem'
                }}>
                  {t('common.sortBy')}:
                </Typography>
                
                <FormControl size="medium" sx={{ minWidth: 140 }}>
                  <InputLabel sx={{ 
                    color: isDarkMode ? '#b0b0b0' : '#666666',
                    fontSize: '1rem'
                  }}>
                    {t('common.sortBy')}
                  </InputLabel>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    label={t('common.sortBy')}
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

          {/* Enhanced Items Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 4,
            position: 'relative'
          }}>
            {currentItems.map((item) => (
              <Card 
                key={item.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                  border: `2px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
                  borderRadius: '20px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
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
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: isDarkMode 
                      ? '0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(255, 215, 0, 0.2)'
                      : '0 20px 40px rgba(0,0,0,0.15), 0 0 20px rgba(139, 69, 19, 0.1)',
                    borderColor: isDarkMode ? '#ffd700' : '#8B4513',
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                  },
                }}
                onClick={() => handleCoffeeClick(item.id)}
              >
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={item.image}
                    alt={item.name}
                    sx={{ 
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
                  
                  {/* New Badge */}
                  {item.isNew && (
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                        color: isDarkMode ? '#1a1a1a' : '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 2,
                      }}
                    />
                  )}
                  
                  {/* Favorite Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,1)',
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {item.isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e91e63', fontSize: '1.2rem' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: '1.2rem' }} />
                    )}
                  </IconButton>
                  
                  {/* Out of Stock Badge */}
                  {!item.inStock && (
                    <Chip
                      label="Out of Stock"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: 3,
                  position: 'relative'
                }}>
                  {/* Price Badge */}
                  <Box sx={{
                    position: 'absolute',
                    top: -20,
                    right: 16,
                    backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                    color: isDarkMode ? '#1a1a1a' : '#ffffff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    zIndex: 3,
                  }}>
                    ${item.price}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, mt: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        color: isDarkMode ? '#ffffff' : '#1a1a1a',
                        fontWeight: 700,
                        flex: 1,
                        fontSize: '1.3rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: isDarkMode ? '#b0b0b0' : '#666666',
                      mb: 3,
                      flex: 1,
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </Typography>
                  
                  {/* Enhanced Stats Row */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 2,
                    p: 1.5,
                    backgroundColor: isDarkMode ? '#2a2a2a' : '#f8f9fa',
                    borderRadius: '12px',
                    border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`
                  }}>
                    <Rating 
                      value={item.rating} 
                      precision={0.1} 
                      size="small" 
                      readOnly 
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: isDarkMode ? '#ffd700' : '#ffc107',
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ 
                      color: isDarkMode ? '#b0b0b0' : '#666666',
                      fontWeight: 500
                    }}>
                      ({item.reviews})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                      <VisibilityIcon fontSize="small" sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                      <Typography variant="body2" sx={{ 
                        color: isDarkMode ? '#b0b0b0' : '#666666',
                        fontWeight: 500
                      }}>
                        {item.views}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Enhanced Category and Origin */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                    <Chip 
                      label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                      size="medium" 
                      variant="outlined"
                      sx={{ 
                        borderColor: isDarkMode ? '#ffd700' : '#8B4513', 
                        color: isDarkMode ? '#ffd700' : '#8B4513',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        borderRadius: '12px',
                        '&:hover': {
                          backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                        }
                      }}
                    />
                    {item.origin !== 'N/A' && (
                      <Chip 
                        label={item.origin} 
                        size="medium" 
                        variant="outlined"
                        sx={{ 
                          borderColor: isDarkMode ? '#ffd700' : '#8B4513', 
                          color: isDarkMode ? '#ffd700' : '#8B4513',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          borderRadius: '12px',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                          }
                        }}
                      />
                    )}
                  </Box>
                  
                  {/* Enhanced Add to Cart Button */}
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon />}
                    fullWidth
                    disabled={!item.inStock}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    sx={{
                      backgroundColor: isDarkMode ? '#ffd700' : '#8B4513',
                      color: isDarkMode ? '#1a1a1a' : '#ffffff',
                      fontWeight: 700,
                      fontSize: '1rem',
                      py: 1.5,
                      borderRadius: '12px',
                      textTransform: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#ffed4e' : '#A0522D',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                      },
                      '&:disabled': {
                        backgroundColor: '#ccc',
                        transform: 'none',
                        boxShadow: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))}
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
      </Container>
    </Box>
  );
} 