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
import { serverApi } from "../../../lib/config";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";

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

// Extended product data with new fields
interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'drinks' | 'desserts' | 'salads' | 'dishes' | 'other';
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

interface ProductsProps {
  onAdd: (item: CartItem) => void;
  defaultCategory?: 'all' | 'drinks' | 'desserts' | 'salads' | 'dishes' | 'other';
}

export default function Products(props: ProductsProps) {
  const { onAdd, defaultCategory = 'all' } = props;
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { colors } = useCoffeeTheme();
  const { t } = useTranslation();
  
  const dispatch = useDispatch();
  const products = useSelector(retrieveProducts);
  
  const [loading, setLoading] = useState(true);
  const [productsList, setProductsList] = useState<ProductItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortAccordionExpanded, setSortAccordionExpanded] = useState(false);
  const [orderAccordionExpanded, setOrderAccordionExpanded] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productService = new ProductService();
        const products = await productService.getProducts({
          page: 1,
          limit: 50,
          order: "createdAt",
          productCollection: undefined,
          search: ""
        });

        // Transform backend data to frontend format
        const transformedProducts: ProductItem[] = products.map((product: any) => {
          const category = (product.productCollection?.toLowerCase() === 'coffee' || product.productCollection?.toLowerCase() === 'drink') ? 'drinks' : 
                          (product.productCollection?.toLowerCase() === 'dessert') ? 'desserts' :
                          (product.productCollection?.toLowerCase() === 'salad') ? 'salads' :
                          (product.productCollection?.toLowerCase() === 'dish') ? 'dishes' : 'other';
          
          return {
            id: product._id,
            name: product.productName,
            description: product.productDesc || 'No description available',
            price: product.productPrice,
            image: product.productImages?.[0] ? `${serverApi}${product.productImages[0]}` : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
            category: category,
            origin: 'Local',
            roast: 'Medium',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            views: product.productViews || Math.floor(Math.random() * 1000) + 100,
            isNew: false,
            inStock: product.productLeftCount > 0,
            isFavorite: false,
            preparationTime: '5 min',
            calories: Math.floor(Math.random() * 300) + 50,
            ingredients: ['Fresh ingredients']
          };
        });

        setProductsList(transformedProducts);
        setFilteredProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        console.error('Error details:', error.response?.data || error.message);
        setProductsList([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = productsList;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'newest':
          comparison = 0; // Since we don't have creation date in transformed data
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [productsList, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: 'all' | 'drinks' | 'desserts' | 'salads' | 'dishes' | 'other') => {
    setSelectedCategory(newValue);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: any) => {
    setSortOrder(event.target.value);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: ProductItem) => {
    onAdd({
      _id: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleProductClick = (productId: string) => {
    history.push(`/products/${productId}`);
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'salads', label: 'Salads' },
    { value: 'dishes', label: 'Dishes' },
    { value: 'other', label: 'Other' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price', label: 'Price' },
    { value: 'views', label: 'Views' }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 700, 
            color: colors.text,
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Our Menu
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: colors.textSecondary,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Discover our carefully curated selection of delicious products
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={3} 
          alignItems="center"
          justifyContent="space-between"
        >
          {/* Search Bar */}
          <TextField
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              minWidth: { xs: '100%', md: 300 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: colors.background
              }
            }}
          />

          {/* Sort Controls - Accordions (Overlay) */}
          <Stack direction="row" spacing={2} sx={{ position: 'relative', zIndex: 10, alignItems: 'flex-start' }}>
            <Box sx={{ position: 'relative', height: 40, flexShrink: 0, width: 150 }}>
              <Accordion 
                expanded={sortAccordionExpanded} 
                onChange={(e, isExpanded) => setSortAccordionExpanded(isExpanded)}
                sx={{ 
                  width: '100%',
                  boxShadow: sortAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  position: 'relative',
                  zIndex: sortAccordionExpanded ? 1000 : 1,
                  backgroundColor: colors.background,
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                    minHeight: '40px !important',
                  },
                }}
              >
                <AccordionSummary sx={{ 
                  minHeight: 40, 
                  maxHeight: 40,
                  '&.Mui-expanded': { 
                    minHeight: 40,
                    maxHeight: 40,
                  } 
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Sort by: {sortOptions.find(opt => opt.value === sortBy)?.label || 'Newest'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ 
                  p: 0,
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 1001,
                  mt: 0,
                  display: sortAccordionExpanded ? 'block' : 'none',
                }}>
                {sortOptions.map((option) => (
                    <ListItemButton
                      key={option.value}
                      selected={sortBy === option.value}
                      onClick={() => {
                        handleSortChange({ target: { value: option.value } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: `${colors.primary}20`,
                          '&:hover': {
                            backgroundColor: `${colors.primary}30`,
                          },
                        },
                      }}
                    >
                      <ListItemText primary={option.label} />
                    </ListItemButton>
                  ))}
                </AccordionDetails>
              </Accordion>
            </Box>
            
            <Box sx={{ position: 'relative', height: 40, flexShrink: 0, width: 150 }}>
              <Accordion 
                expanded={orderAccordionExpanded} 
                onChange={(e, isExpanded) => setOrderAccordionExpanded(isExpanded)}
                sx={{ 
                  width: '100%',
                  boxShadow: orderAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  position: 'relative',
                  zIndex: orderAccordionExpanded ? 1000 : 1,
                  backgroundColor: colors.background,
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: 0,
                    minHeight: '40px !important',
                  },
                }}
              >
                <AccordionSummary sx={{ 
                  minHeight: 40, 
                  maxHeight: 40,
                  '&.Mui-expanded': { 
                    minHeight: 40,
                    maxHeight: 40,
                  } 
                }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Order: {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ 
                  p: 0,
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: colors.background,
                  border: `1px solid ${colors.border}`,
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
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
                      '&.Mui-selected': {
                        backgroundColor: `${colors.primary}20`,
                        '&:hover': {
                          backgroundColor: `${colors.primary}30`,
                        },
                      },
                    }}
                  >
                    <ListItemText primary="Descending" />
                  </ListItemButton>
                  <ListItemButton
                    selected={sortOrder === 'asc'}
                    onClick={() => {
                      handleSortOrderChange({ target: { value: 'asc' } } as any);
                      setOrderAccordionExpanded(false);
                    }}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: `${colors.primary}20`,
                        '&:hover': {
                          backgroundColor: `${colors.primary}30`,
                        },
                      },
                    }}
                  >
                    <ListItemText primary="Ascending" />
                  </ListItemButton>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 120,
              borderRadius: 3,
              mx: 0.5,
              '&.Mui-selected': {
                backgroundColor: colors.primary,
                color: 'white',
              }
            }
          }}
        >
          {categories.map((category) => (
            <Tab
              key={category.value}
              value={category.value}
              label={category.label}
            />
          ))}
        </Tabs>
      </Box>

      {/* Products Grid */}
      {loading ? (
        <GridSkeleton />
      ) : currentProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 4 
        }}>
          <AnimatePresence>
            {currentProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    maxHeight: '380px',
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    }
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '150px',
                      overflow: 'hidden'
                    }}
                  >
                    <Box
                    component="img"
                      src={product.image}
                    alt={product.name}
                    sx={{ 
                      cursor: 'pointer',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                    onClick={() => handleProductClick(product.id)}
                  />
                  
                  {/* Product badges */}
                    <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 1, zIndex: 2 }}>
                    {product.isNew && (
                      <Chip 
                        label="New" 
                        size="small" 
                        color="primary" 
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                    {!product.inStock && (
                      <Chip 
                        label="Out of Stock" 
                        size="small" 
                        color="error" 
                        sx={{ fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>

                  {/* Favorite button */}
                  <IconButton
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        zIndex: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)'
                      }
                    }}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    {favorites.includes(product.id) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, pt: 1.5 }}>
                    {/* Title and Price in same row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
                    <Typography 
                        variant="subtitle1" 
                      component="h3" 
                      sx={{ 
                        fontWeight: 600, 
                        cursor: 'pointer',
                          flex: 1,
                          fontSize: '0.95rem',
                          lineHeight: 1.2,
                        '&:hover': { color: colors.primary }
                      }}
                      onClick={() => handleProductClick(product.id)}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        color="primary" 
                        sx={{ fontWeight: 700, ml: 1, fontSize: '0.95rem' }}
                      >
                        ${product.price}
                    </Typography>
                    </Box>

                    {/* Rating and reviews - compact */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Rating value={product.rating} precision={0.5} size="small" readOnly sx={{ fontSize: '0.875rem' }} />
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                        ({product.reviews})
                      </Typography>
                    </Box>

                    {/* Product info - very compact */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <VisibilityIcon fontSize="small" color="action" sx={{ fontSize: '0.75rem' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {product.views}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <AccessTimeIcon fontSize="small" color="action" sx={{ fontSize: '0.75rem' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {product.preparationTime}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Add to cart button - very compact */}
                      <Button
                        variant="contained"
                        size="small"
                      startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.875rem' }} />}
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock}
                        sx={{ 
                        height: 32,
                        borderRadius: '8px',
                          textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        mt: 'auto',
                        py: 0
                        }}
                      >
                        Add to Cart
                      </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Awards Strip */}
      <Suspense fallback={<Box sx={{ height: 100 }} />}>
        <AwardsStrip />
      </Suspense>
    </Container>
  );
}
