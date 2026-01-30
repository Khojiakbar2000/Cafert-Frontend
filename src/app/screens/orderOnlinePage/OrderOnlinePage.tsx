import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  useTheme,
  useMediaQuery,
  Slide,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { CartItem } from '../../../lib/types/search';
import ProductService from '../../services/ProductService';
import { serverApi } from '../../../lib/config';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';

interface OrderOnlinePageProps {
  onAdd: (item: CartItem) => void;
  cartItems: CartItem[];
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

type OrderType = 'pickup' | 'delivery';
type TimeOption = 'asap' | 'schedule';

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: string[];
  productCollection?: string;
  productDesc?: string;
  productLeftCount?: number;
}

const OrderOnlinePage: React.FC<OrderOnlinePageProps> = ({
  onAdd,
  cartItems,
  onRemove,
  onDelete,
  onDeleteAll,
}) => {
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const history = useHistory();

  // Order configuration
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [timeOption, setTimeOption] = useState<TimeOption>('asap');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [locationMessage, setLocationMessage] = useState<string>('');

  // Mock address suggestions
  const mockAddressSuggestions = [
    '123 Main Street, Downtown',
    '456 Oak Avenue, Midtown',
    '789 Pine Road, Uptown',
    '321 Elm Street, Riverside',
    '654 Maple Drive, Parkview',
  ];

  // Products and categories
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'drinks', 'desserts', 'salads', 'dishes'];
  
  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('regular');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [sizeAccordionExpanded, setSizeAccordionExpanded] = useState(false);

  // Cart summary
  const [showCartSummary, setShowCartSummary] = useState(false);
  const cartSummaryRef = useRef<HTMLDivElement>(null);

  // Category refs for smooth scrolling
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const setCategoryRef = (category: string) => (el: HTMLDivElement | null) => {
    categoryRefs.current[category] = el;
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productService = new ProductService();
        const fetchedProducts = await productService.getProducts({
          page: 1,
          limit: 100,
          order: 'createdAt',
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Show cart summary when cart has items
  useEffect(() => {
    setShowCartSummary(cartItems.length > 0);
  }, [cartItems]);

  // Save order context to localStorage when order configuration changes
  useEffect(() => {
    const orderContext = {
      orderSource: 'order',
      fulfillmentType: orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      scheduledTime: orderType === 'pickup' && timeOption === 'schedule' 
        ? { date: scheduledDate, time: scheduledTime }
        : timeOption === 'asap' ? 'asap' : undefined,
    };
    localStorage.setItem('orderContext', JSON.stringify(orderContext));
  }, [orderType, deliveryAddress, timeOption, scheduledDate, scheduledTime]);

  // Handle address input with suggestions
  const handleAddressChange = (value: string) => {
    setDeliveryAddress(value);
    if (value.length > 2) {
      const filtered = mockAddressSuggestions.filter(addr =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleAddressEnter = () => {
    if (deliveryAddress.trim()) {
      setShowSuggestions(false);
      // Address is confirmed/entered
      console.log('Address confirmed:', deliveryAddress);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setDeliveryAddress(suggestion);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      setLocationMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('idle');
    setLocationMessage('Locating...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setDeliveryAddress('Current location');
        setLocationStatus('success');
        setLocationMessage('Location found. Delivery is available in your area.');
        setShowSuggestions(false);
      },
      (error) => {
        setLocationStatus('error');
        setLocationMessage('Unable to get your location. Please enter your address manually.');
      }
    );
  };

  const handleViewCart = () => {
    window.dispatchEvent(new CustomEvent('openBasket'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategory = useCallback((category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    scrollToCategory(category);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('regular');
    setSelectedOptions([]);
    setQuantity(1);
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const cartItem: CartItem = {
      _id: selectedProduct._id,
      name: selectedProduct.productName,
      price: selectedProduct.productPrice,
      image: selectedProduct.productImages?.[0] 
        ? `${serverApi}${selectedProduct.productImages[0]}`
        : '/icons/noimage-list.svg',
      quantity: quantity,
    };

    onAdd(cartItem);
    setModalOpen(false);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    const collection = product.productCollection?.toLowerCase();
    if (selectedCategory === 'drinks') {
      return collection === 'coffee' || collection === 'drink';
    }
    if (selectedCategory === 'desserts') {
      return collection === 'dessert';
    }
    if (selectedCategory === 'salads') {
      return collection === 'salad';
    }
    if (selectedCategory === 'dishes') {
      return collection === 'dish';
    }
    return false;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const parchmentBg = '#f5f1e8';
  const parchmentText = '#3a3429';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#fbfbf8',
        position: 'relative',
        pt: { xs: 2, md: 4 },
        pb: showCartSummary ? { xs: 20, md: 16 } : { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Compact Order Type Controls at Top */}
        <Paper
          elevation={0}
            sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
          <Stack spacing={3}>
            {/* Order Type Selection */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: '"Cinzel", serif',
                  color: parchmentText,
                  mb: 2,
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  fontWeight: 600,
                }}
              >
                Order Type
              </Typography>
              <RadioGroup
                row
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderType)}
                sx={{ gap: { xs: 2, md: 4 } }}
              >
                <FormControlLabel
                  value="pickup"
                  control={
                    <Radio
                      sx={{
                        color: parchmentText,
                        '&.Mui-checked': { color: '#8B4513' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: '1.2rem', color: '#8B4513' }} />
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: '1rem',
                          fontWeight: orderType === 'pickup' ? 600 : 400,
                        }}
                      >
                        Pickup
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="delivery"
                  control={
                    <Radio
                      sx={{
                        color: parchmentText,
                        '&.Mui-checked': { color: '#8B4513' },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon sx={{ fontSize: '1.2rem', color: '#8B4513' }} />
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: '1rem',
                          fontWeight: orderType === 'delivery' ? 600 : 400,
                        }}
                      >
                        Delivery
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </Box>

            {/* Conditional Content */}
              {orderType === 'pickup' ? (
              <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        color: parchmentText,
                        mb: 2,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                    fontWeight: 600,
                      }}
                    >
                      When
                    </Typography>
                    <RadioGroup
                      row
                      value={timeOption}
                      onChange={(e) => setTimeOption(e.target.value as TimeOption)}
                  sx={{ mb: timeOption === 'schedule' ? 2 : 0 }}
                    >
                      <FormControlLabel
                        value="asap"
                        control={
                          <Radio
                            sx={{
                              color: parchmentText,
                              '&.Mui-checked': { color: '#8B4513' },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: '1rem',
                            }}
                          >
                            ASAP
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="schedule"
                        control={
                          <Radio
                            sx={{
                              color: parchmentText,
                              '&.Mui-checked': { color: '#8B4513' },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: '1.2rem' }} />
                            <Typography
                              sx={{
                                fontFamily: '"EB Garamond", serif',
                                fontSize: '1rem',
                              }}
                            >
                              Schedule
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    {timeOption === 'schedule' && (
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={2}
                    sx={{ mt: 2 }}
                        >
                          <TextField
                            type="date"
                            label="Pickup Date"
                            value={scheduledDate}
                            onChange={(e) => setScheduledDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                fontFamily: '"EB Garamond", serif',
                                backgroundColor: '#fafafa',
                              },
                            }}
                          />
                          <TextField
                            type="time"
                            label="Pickup Time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                fontFamily: '"EB Garamond", serif',
                                backgroundColor: '#fafafa',
                              },
                            }}
                          />
                        </Stack>
                    )}
                  </Box>
              ) : (
              <Box>
                  <Typography
                  variant="h6"
                    sx={{
                    fontFamily: '"Cinzel", serif',
                      color: parchmentText,
                    mb: 2,
                    fontSize: { xs: '1.1rem', md: '1.2rem' },
                      fontWeight: 600,
                    }}
                  >
                    Delivery Address
                  </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ position: 'relative', flex: 1 }}>
                    <TextField
                      fullWidth
                      label="Enter your delivery address"
                      value={deliveryAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddressEnter();
                        }
                      }}
                      required
                      error={deliveryAddress === ''}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          fontFamily: '"EB Garamond", serif',
                          backgroundColor: '#fafafa',
                        },
                      }}
                    />
                    {showSuggestions && addressSuggestions.length > 0 && (
                      <Paper
                        elevation={4}
                        sx={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          zIndex: 1000,
                          mt: 0.5,
                          maxHeight: '200px',
                          overflow: 'auto',
                        }}
                      >
                        <Stack>
                          {addressSuggestions.map((suggestion, index) => (
                            <Box
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              sx={{
                                p: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'rgba(139, 69, 19, 0.05)',
                                },
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: '"EB Garamond", serif',
                                  fontSize: '0.95rem',
                                  color: parchmentText,
                                }}
                              >
                                {suggestion}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    )}
                  </Box>
                  <Button
                      variant="contained"
                      onClick={handleAddressEnter}
                      disabled={!deliveryAddress.trim()}
                    sx={{
                        mt: 0.5,
                        minWidth: 100,
                        height: 56,
                      fontFamily: '"EB Garamond", serif',
                        backgroundColor: '#8B4513',
                        color: '#ffffff',
                      textTransform: 'none',
                      '&:hover': {
                          backgroundColor: '#A0522D',
                        },
                        '&:disabled': {
                          backgroundColor: '#d0d0d0',
                          color: '#999',
                      },
                    }}
                  >
                      Enter
                  </Button>
                    </Box>
                </Box>
                  <Button
                    variant="outlined"
                    startIcon={<LocationIcon />}
                    onClick={handleUseLocation}
                      sx={{
                    mt: 2,
                          fontFamily: '"EB Garamond", serif',
                      borderColor: 'rgba(58, 52, 41, 0.3)',
                      color: parchmentText,
                      textTransform: 'none',
                        }}
                      >
                    Use My Location
                  </Button>
                    </Box>
                  )}
              </Stack>
        </Paper>

        {/* Category Navigation */}
        <Box
          sx={{
            position: 'sticky',
            top: 80,
            zIndex: 100,
            backgroundColor: '#fbfbf8',
            py: 2,
            mb: 3,
            borderBottom: '1px solid rgba(58, 52, 41, 0.1)',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            sx={{
              overflowX: 'auto',
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
            }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? 'contained' : 'outlined'}
                sx={{
                  fontFamily: '"EB Garamond", serif',
                  textTransform: 'capitalize',
                  fontSize: '1rem',
                  minWidth: '100px',
                  backgroundColor:
                    selectedCategory === category
                      ? '#8B4513'
                      : 'transparent',
                  color:
                    selectedCategory === category ? '#fff' : parchmentText,
                  borderColor: '#8B4513',
                  '&:hover': {
                    backgroundColor:
                      selectedCategory === category ? '#A0522D' : 'rgba(139, 69, 19, 0.1)',
                    borderColor: '#8B4513',
                  },
                }}
              >
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </Stack>
        </Box>

        {/* Products Grid */}
        <Box ref={setCategoryRef('all')} sx={{ mb: 6 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(2, 1fr)',
                },
                gap: { xs: 4, md: 6 },
              }}
            >
              {paginatedProducts.map((product) => (
                <Box
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid rgba(58, 52, 41, 0.15)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transition: 'border-color 0.2s ease',
                    '&:hover': {
                      borderColor: 'rgba(58, 52, 41, 0.3)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: { xs: 2, md: 3 },
                      backgroundColor: '#faf8f3',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        mb: 3,
                        borderRadius: '80px 80px 8px 8px',
                        overflow: 'hidden',
                        backgroundColor: '#f5f1e8',
                        border: '1px solid rgba(58, 52, 41, 0.08)',
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          product.productImages?.[0]
                            ? `${serverApi}${product.productImages[0]}`
                            : '/icons/noimage-list.svg'
                        }
                        alt={product.productName}
                        sx={{
                          width: '100%',
                          height: { xs: '320px', md: '400px' },
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", "Cormorant Garamond", serif',
                          fontSize: { xs: '1.3rem', md: '1.5rem' },
                          color: parchmentText,
                          mb: 1,
                          fontWeight: 500,
                        }}
                      >
                        {product.productName}
                      </Typography>

                      {product.productDesc && (
                        <Typography
                          sx={{
                            fontFamily: '"EB Garamond", serif',
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            color: parchmentText,
                            opacity: 0.65,
                            mb: 2.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.productDesc}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 1,
                          borderTop: '1px solid rgba(58, 52, 41, 0.1)',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", serif',
                            fontSize: { xs: '1.2rem', md: '1.3rem' },
                            color: '#8B4513',
                            fontWeight: 500,
                          }}
                        >
                          ${product.productPrice.toFixed(2)}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(product);
                          }}
                          sx={{
                            fontFamily: '"EB Garamond", serif',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            borderColor: 'rgba(58, 52, 41, 0.3)',
                            color: parchmentText,
                            px: { xs: 2, md: 3 },
                            py: 0.75,
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: 'rgba(58, 52, 41, 0.5)',
                              backgroundColor: 'rgba(58, 52, 41, 0.05)',
                            },
                          }}
                        >
                          Add
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 6,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: '"EB Garamond", serif',
                      fontSize: '1rem',
                      color: parchmentText,
                      '&.Mui-selected': {
                        backgroundColor: '#8B4513',
                        color: '#fff',
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>

        {/* Add to Cart Modal */}
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              maxWidth: { xs: '90%', md: '1000px' },
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: '"Cinzel", serif',
              color: parchmentText,
              fontSize: { xs: '1.5rem', md: '2rem' },
              fontWeight: 600,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {selectedProduct?.productName}
            <IconButton
              onClick={() => setModalOpen(false)}
              sx={{
                color: parchmentText,
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {selectedProduct && (
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={{ xs: 3, md: 4 }}
              >
                <Box sx={{ flex: { xs: 'none', md: '0 0 45%' } }}>
                <Box
                  sx={{
                      border: '1px solid rgba(58, 52, 41, 0.12)',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      backgroundColor: '#faf8f3',
                      p: { xs: 2, md: 3 },
                    }}
                  >
                    <Box
                      component="img"
                      src={
                        selectedProduct.productImages?.[0]
                          ? `${serverApi}${selectedProduct.productImages[0]}`
                          : '/icons/noimage-list.svg'
                      }
                      alt={selectedProduct.productName}
                      sx={{
                        width: '100%',
                        height: { xs: '280px', md: '400px' },
                        objectFit: 'cover',
                        borderRadius: '4px',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1 }}>
                  {selectedProduct.productDesc && (
                    <Typography
                      sx={{
                        fontFamily: '"EB Garamond", serif',
                        color: parchmentText,
                        opacity: 0.65,
                        fontSize: { xs: '0.95rem', md: '1rem' },
                        mb: 3,
                      }}
                    >
                      {selectedProduct.productDesc}
                    </Typography>
                  )}

                  {/* Size Selection */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: '0.75rem',
                        color: parchmentText,
                        opacity: 0.7,
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
                      Size
                    </Typography>
                      <Accordion
                        expanded={sizeAccordionExpanded}
                        onChange={(e, expanded) => setSizeAccordionExpanded(expanded)}
                        sx={{
                          boxShadow: 'none',
                          border: '1px solid rgba(58, 52, 41, 0.2)',
                          borderRadius: '4px',
                          backgroundColor: '#fafafa',
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: '1rem',
                              color: parchmentText,
                              textTransform: 'capitalize',
                            }}
                          >
                            {selectedSize === 'small'
                              ? 'Small (+$0.00)'
                              : selectedSize === 'regular'
                              ? 'Regular (+$0.00)'
                              : 'Large (+$1.50)'}
                          </Typography>
                        </AccordionSummary>
                      <AccordionDetails>
                        <Stack spacing={1}>
                          {['small', 'regular', 'large'].map((size) => (
                            <Button
                              key={size}
                              onClick={() => {
                                setSelectedSize(size);
                                setSizeAccordionExpanded(false);
                              }}
                              variant={selectedSize === size ? 'contained' : 'outlined'}
                                sx={{
                                  fontFamily: '"EB Garamond", serif',
                                  textTransform: 'capitalize',
                                }}
                              >
                              {size} (+${size === 'large' ? '1.50' : '0.00'})
                            </Button>
                          ))}
                          </Stack>
                      </AccordionDetails>
                    </Accordion>
                  </Box>

                  {/* Quantity */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: '0.75rem',
                        color: parchmentText,
                        opacity: 0.7,
                        textTransform: 'uppercase',
                        mb: 1.5,
                      }}
                    >
                      Quantity
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: '#fafafa',
                        borderRadius: '4px',
                        p: 1,
                        width: 'fit-content',
                      }}
                    >
                      <IconButton
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        sx={{
                          border: '1px solid rgba(58, 52, 41, 0.15)',
                        }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: '1.3rem',
                          minWidth: '50px',
                          textAlign: 'center',
                          color: parchmentText,
                        }}
                      >
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => setQuantity(quantity + 1)}
                        sx={{
                          border: '1px solid rgba(58, 52, 41, 0.15)',
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Total and Add Button */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      pt: 3,
                      mt: 'auto',
                      borderTop: '1px solid rgba(58, 52, 41, 0.1)',
                      mb: 3,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: '0.75rem',
                        color: parchmentText,
                        opacity: 0.7,
                        textTransform: 'uppercase',
                      }}
                    >
                      Total
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: { xs: '1.5rem', md: '1.8rem' },
                        color: '#8B4513',
                        fontWeight: 600,
                      }}
                    >
                      ${(selectedProduct.productPrice * quantity).toFixed(2)}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: '#8B4513',
                      fontFamily: '"EB Garamond", serif',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      py: { xs: 1.5, md: 1.75 },
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#A0522D',
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Stack>
            )}
          </DialogContent>
        </Dialog>

        {/* Sticky Cart Summary */}
        <Slide direction="up" in={showCartSummary} mountOnEnter unmountOnExit>
          <Paper
            ref={cartSummaryRef}
            elevation={8}
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderTop: '2px solid #8B4513',
            }}
          >
            <Container maxWidth="lg">
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    sx={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: '1.1rem',
                      color: parchmentText,
                    }}
                  >
                    {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: '1.5rem',
                      color: '#8B4513',
                      fontWeight: 600,
                    }}
                  >
                    ${cartTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    onClick={handleViewCart}
                    sx={{
                      fontFamily: '"EB Garamond", serif',
                      borderColor: '#8B4513',
                      color: '#8B4513',
                      textTransform: 'none',
                    }}
                  >
                    View Cart
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => history.push('/orders')}
                    sx={{
                      backgroundColor: '#8B4513',
                      fontFamily: '"EB Garamond", serif',
                      fontSize: '1.1rem',
                      px: 4,
                      '&:hover': { backgroundColor: '#A0522D' },
                    }}
                  >
                    Checkout
                  </Button>
                </Stack>
              </Stack>
            </Container>
          </Paper>
        </Slide>
      </Container>
    </Box>
  );
};

export default OrderOnlinePage;
