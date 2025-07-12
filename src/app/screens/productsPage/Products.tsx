import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton,
  IconButton
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCart as AddShoppingCartIcon
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Product } from "../../../lib/types/product";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "./slice";
import { retrieveProducts } from "./selector";
import ProductService from "../../services/ProductService";

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

interface ProductsProps {
  onAdd: (item: CartItem) => void;
}

export default function Products(props: ProductsProps) {
  const { onAdd } = props;
  const history = useHistory();
  const { isDarkMode, toggleTheme, colors } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  const dispatch = useDispatch();
  const { setProducts: setProductsAction } = { setProducts: (data: Product[]) => dispatch(setProducts(data)) };
  const { products } = useSelector((state: any) => ({ products: state.products.products || [] }));
  
  // Pagination constants
  const ITEMS_PER_PAGE = 8;
  
  const [productSearch, setProductSearch] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    order: "createdAt",
    productCollection: undefined,
    search: "",
  });

  const [searchText, setSearchText] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'coffees' | 'desserts' | 'drinks' | 'salads' | 'dishes' | 'other'>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch products
  useEffect(() => {
    const productService = new ProductService();
    productService.getProducts(productSearch)
      .then((data) => setProductsAction(data))
      .catch((err) => console.log(err));
  }, [productSearch, setProductsAction]);

  // Handle search text changes
  useEffect(() => {
    if (searchText === "") {
      setProductSearch(prev => ({ ...prev, search: "" }));
    }
  }, [searchText]);

  // Convert ProductCollection to category string
  const getCategoryFromCollection = (collection: ProductCollection | undefined) => {
    switch (collection) {
      case ProductCollection.COFFEE: return 'coffees';
      case ProductCollection.DESSERT: return 'desserts';
      case ProductCollection.DRINK: return 'drinks';
      case ProductCollection.SALAD: return 'salads';
      case ProductCollection.DISH: return 'dishes';
      case ProductCollection.OTHER: return 'other';
      default: return 'all';
    }
  };

  // Convert category string to ProductCollection
  const getCollectionFromCategory = (category: string): ProductCollection | undefined => {
    switch (category) {
      case 'coffees': return ProductCollection.COFFEE;
      case 'desserts': return ProductCollection.DESSERT;
      case 'drinks': return ProductCollection.DRINK;
      case 'salads': return ProductCollection.SALAD;
      case 'dishes': return ProductCollection.DISH;
      case 'other': return ProductCollection.OTHER;
      default: return undefined;
    }
  };

  // Filtered and sorted products
  const filteredProducts = React.useMemo(() => {
    let filtered = products;

    // Apply category filter
    if (selectedCategory !== 'all') {
      const collection = getCollectionFromCategory(selectedCategory);
      filtered = filtered.filter((product: Product) => product.productCollection === collection);
    }

    // Apply search filter
    if (searchText) {
      filtered = filtered.filter((product: Product) =>
        product.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a: Product, b: Product) => {
      let comparison = 0;
      switch (sortBy) {
        case 'newest':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'price':
          comparison = a.productPrice - b.productPrice;
          break;
        case 'views':
          comparison = (a.productViews || 0) - (b.productViews || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [products, selectedCategory, searchText, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const currentPage = productSearch.page;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Event handlers
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setProductSearch(prev => ({ ...prev, page }));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: 'all' | 'coffees' | 'desserts' | 'drinks' | 'salads' | 'dishes' | 'other') => {
    setSelectedCategory(newValue);
    setProductSearch(prev => ({ 
      ...prev, 
      productCollection: getCollectionFromCategory(newValue),
      page: 1 
    }));
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

  const handleAddToCart = (product: Product) => {
    onAdd({
      _id: product._id,
      quantity: 1,
      name: product.productName,
      price: product.productPrice,
      image: product.productImages[0]
    });
  };

  const handleProductClick = (productId: string) => {
    history.push(`/products/${productId}`);
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

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'price', label: 'Price' },
    { value: 'views', label: 'Views' }
  ];

  return (
    <Box sx={{
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
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
              color: colors.text
            }}>
              Our Menu
            </Typography>
            <Typography variant="h5" sx={{
              color: colors.textSecondary,
              fontWeight: 400,
              fontFamily: 'Poppins, sans-serif',
              fontSize: { xs: '1.1rem', md: '1.3rem' }
            }}>
              Discover our carefully curated selection of coffee, desserts, and more
            </Typography>
          </motion.div>
        </Box>

        {/* Search and Filter Section */}
        <Paper sx={{
          p: 3,
          mb: 4,
          backgroundColor: colors.surface,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Grid container spacing={3} alignItems="center">
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchText}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.textSecondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: colors.background
                  }
                }}
              />
            </Grid>

            {/* Sort Options */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                  sx={{ borderRadius: 2 }}
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sort Order */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  label="Order"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="desc">Descending</MenuItem>
                  <MenuItem value="asc">Ascending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

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
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                color: colors.textSecondary,
                '&.Mui-selected': {
                  color: colors.accent
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: colors.accent,
                height: 3,
                borderRadius: 1.5
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
        <Grid container spacing={3}>
          {currentProducts.map((product: Product, index: number) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: colors.surface,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => handleProductClick(product._id)}
                >
                  {/* Product Image */}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="240"
                      image={`${serverApi}${product.productImages[0]}`}
                      alt={product.productName}
                      sx={{ objectFit: 'cover' }}
                    />
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 1)'
                        }
                      }}
                    >
                      {favorites.includes(product._id) ? (
                        <FavoriteIcon sx={{ color: '#e91e63' }} />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                  </Box>

                  {/* Product Content */}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="h6" sx={{
                      fontWeight: 600,
                      mb: 1,
                      color: colors.text,
                      fontSize: '1.1rem',
                      lineHeight: 1.3
                    }}>
                      {product.productName}
                    </Typography>

                    <Typography variant="body2" sx={{
                      color: colors.textSecondary,
                      mb: 2,
                      fontSize: '0.9rem',
                      lineHeight: 1.5
                    }}>
                      {product.productDesc || 'No description available'}
                    </Typography>

                    {/* Product Meta */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="body2" sx={{
                        color: colors.textSecondary,
                        fontSize: '0.8rem'
                      }}>
                        Views: {product.productViews || 0}
                      </Typography>
                    </Box>

                    {/* Price and Add to Cart */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 'auto'
                    }}>
                      <Typography variant="h6" sx={{
                        fontWeight: 700,
                        color: colors.accent,
                        fontSize: '1.2rem'
                      }}>
                        ${product.productPrice}
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        sx={{
                          borderRadius: 2,
                          backgroundColor: colors.accent,
                          '&:hover': {
                            backgroundColor: colors.accentDark
                          }
                        }}
                      >
                        Add
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* No Products Message */}
        {currentProducts.length === 0 && (
          <Box sx={{
            textAlign: 'center',
            py: 8,
            color: colors.textSecondary
          }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              No products found
            </Typography>
            <Typography variant="body1">
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mt: 6
          }}>
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
      </Container>
    </Box>
  );
}
