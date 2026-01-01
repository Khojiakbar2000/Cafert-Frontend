// @ts-nocheck
import React, { useEffect, useState } from "react";
import { 
  Container, 
  Stack, 
  Box, 
  Typography, 
  Button, 
  Rating, 
  Chip,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Breadcrumbs,
  Link,
  Dialog,
  DialogContent
} from "@mui/material";
import { 
  Swiper, 
  SwiperSlide 
} from "swiper/react";
import {
  RemoveRedEye as RemoveRedEyeIcon,
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  AccessTime as AccessTimeIcon,
  Verified as VerifiedIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from "@mui/icons-material";
import { useHistory } from "react-router-dom";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper";

import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setChosenProduct, setProducts, setRestaurant } from "./slice";
import { createSelector } from "reselect";
import { Product } from "../../../lib/types/product";
import { retrieveChosenProduct, retrieveRestaurant } from "./selector";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import ActivityService from "../../services/ActivityService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { motion } from 'framer-motion';

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setRestaurant: (data: Member) =>
    dispatch(setRestaurant(data)),
  setChosenProduct: (data: Product) =>
    dispatch(setChosenProduct(data)),
});

const chosenProductRetriever = createSelector(
  retrieveChosenProduct,
  (chosenProduct) => ({ chosenProduct })
);

const restaurantRetriever = createSelector(
  retrieveRestaurant,
  (restaurant) => ({ restaurant })
)

interface ChosenProductProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenProduct(props: ChosenProductProps) {
  const { onAdd } = props;
  const { productId } = useParams<{ productId: string }>();
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const history = useHistory();
  const { isDarkMode, colors } = useCoffeeTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [localViews, setLocalViews] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    console.log("restaurant updated:", restaurant);
  }, [restaurant]);

  useEffect(() => {
    const product = new ProductService()
    product
      .getProduct(productId)
      .then((data) => {
        setChosenProduct(data);
        
        // Show real backend views and track unique user views
        const currentViews = data.productViews || 0;
        
        // Get or create a unique user ID for this browser session
        let userId = localStorage.getItem('user_session_id');
        if (!userId) {
          userId = 'user_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('user_session_id', userId);
        }
        
        // Check if this user has already viewed this product
        const userViewKey = `user_viewed_${userId}_${productId}`;
        const hasUserViewed = localStorage.getItem(userViewKey) === 'true';
        
        // Get persistent view count from localStorage
        const storageKey = `product_views_${productId}`;
        const persistentViews = parseInt(localStorage.getItem(storageKey) || '0', 10);
        
        // Use the higher of backend views or persistent views
        let actualViews = Math.max(currentViews, persistentViews);
        
        // Only increment if this user hasn't viewed this product before
        if (!hasUserViewed) {
          actualViews += 1;
          localStorage.setItem(storageKey, actualViews.toString());
          localStorage.setItem(userViewKey, 'true');
          console.log(`Product ${productId} views: ${actualViews - 1} → ${actualViews} (new user view)`);
        } else {
          console.log(`Product ${productId} views: ${actualViews} (user already viewed)`);
        }
        
        setLocalViews(actualViews);
        
        // Try to increment product views on backend (may fail if endpoint doesn't exist)
        if (!hasUserViewed) {
          product.incrementProductViews(productId).catch(() => {
            console.log("Backend view increment not available, using frontend simulation");
          });
        }
        
        // Track product view activity
        const activityService = new ActivityService();
        activityService.trackUserActivity({
          type: 'view',
          productId: productId,
          memberId: 'guest' // You can get actual member ID from Redux store if logged in
        });
      })
      .catch((err) => console.log(err));

    const member = new MemberService();
    member
      .getRestaurant(productId)
      .then((data) => setRestaurant(data))
      .catch((err) => console.log(err));
  }, [productId]); // Removed setChosenProduct and setRestaurant to prevent loop

  // Fetch related products when chosenProduct is available
  useEffect(() => {
    if (!chosenProduct || !productId) {
      setRelatedProducts([]);
      return;
    }
    
    const productService = new ProductService();
    let isMounted = true;
    
    // Helper function to fetch fallback products
    const fetchFallbackRelatedProducts = async () => {
      try {
        const data = await productService.getProducts({
          page: 1,
          limit: 20,
          order: 'productViews'
        });
        if (isMounted) {
          const related = data.filter((p: Product) => p._id !== productId);
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (err) {
        console.log("Error fetching fallback related products:", err);
        if (isMounted) {
          setRelatedProducts([]);
        }
      }
    };
    
    // Try to fetch by productCollection first
    if (chosenProduct.productCollection) {
      productService
        .getProducts({
          page: 1,
          limit: 20,
          productCollection: chosenProduct.productCollection,
          order: 'productViews'
        })
        .then((data) => {
          if (!isMounted) return;
          
          // Filter out current product
          const related = data.filter((p: Product) => p._id !== productId);
          if (related.length > 0) {
            setRelatedProducts(related.slice(0, 4));
          } else {
            // If no products found in same collection, try fallback
            fetchFallbackRelatedProducts();
          }
        })
        .catch((err) => {
          console.log("Error fetching related products by collection:", err);
          // Try fallback if collection-based fetch fails
          if (isMounted) {
            fetchFallbackRelatedProducts();
          }
        });
    } else {
      // If no productCollection, use fallback
      fetchFallbackRelatedProducts();
    }
    
    return () => {
      isMounted = false;
    };
  }, [chosenProduct?._id, productId]);

  if (!chosenProduct) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        backgroundColor: colors.background
      }}>
        <Typography variant="h5" sx={{ color: colors.text }}>
          Loading product details...
        </Typography>
      </Box>
    );
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("BUTTON PRESSED");
    onAdd({
      _id: chosenProduct._id,
      quantity: quantity,
      name: chosenProduct.productName,
      price: chosenProduct.productPrice,
      image: chosenProduct.productImages[0]
    });
    e.stopPropagation();
  };

  const handleBackClick = () => {
    history.goBack();
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <Box sx={{
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="md" sx={{ maxWidth: '1100px !important' }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3, color: colors.textSecondary }}>
          <Link
            component="button"
            variant="body1"
            onClick={handleBackClick}
            sx={{ 
              color: colors.textSecondary,
              textDecoration: 'none',
              '&:hover': { color: colors.accent }
            }}
          >
            Products
          </Link>
          <Typography color="text.primary">{chosenProduct.productName}</Typography>
        </Breadcrumbs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Grid container spacing={4}>
            {/* Product Images - 60% */}
            <Grid item xs={12} md={7.2}>
              <Stack spacing={2}>
                {/* Main Image with Carousel */}
                <Card 
                  onClick={() => setLightboxOpen(true)}
                  sx={{
                backgroundColor: colors.surface,
                    borderRadius: '20px',
                overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
                      '& .product-main-image': {
                        transform: 'scale(1.05)',
                      },
                      '& .carousel-arrow': {
                        opacity: 1,
                      }
                    }
                  }}
                >
                  <Box sx={{
                    '& .swiper-button-next, & .swiper-button-prev': {
                      color: colors.accent,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      '&:after': {
                        fontSize: '20px',
                        fontWeight: 'bold',
                      },
                      '&:hover': {
                        backgroundColor: colors.accent,
                        color: 'white',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.3s ease',
                    },
                    '& .swiper-button-next': {
                      right: '16px',
                    },
                    '& .swiper-button-prev': {
                      left: '16px',
                    },
                    '& .swiper-button-disabled': {
                      opacity: 0.35,
                    }
              }}>
                <Swiper
                      loop={chosenProduct?.productImages && chosenProduct.productImages.length > 1}
                  spaceBetween={10}
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="swiper-area"
                      style={{ height: '500px' }}
                      onSlideChange={(swiper) => setSelectedImageIndex(swiper.realIndex)}
                      initialSlide={selectedImageIndex}
                >
                  {chosenProduct?.productImages.map((ele: string, index: number) => {
                    const imagePath = `${serverApi}${ele}`;
                    return (
                      <SwiperSlide key={index}>
                        <img 
                            className="product-main-image slider-image" 
                          src={imagePath}
                          style={{
                            width: '100%',
                            height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease',
                          }}
                          alt={`${chosenProduct.productName} - Image ${index + 1}`}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                  </Box>
              </Card>

                {/* Thumbnail Strip */}
                {chosenProduct?.productImages && chosenProduct.productImages.length > 1 && (
                  <Box sx={{ display: 'flex', gap: 1.5, overflowX: 'auto', pb: 1 }}>
                    {chosenProduct.productImages.map((ele: string, index: number) => {
                      const imagePath = `${serverApi}${ele}`;
                      return (
                        <Box
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          sx={{
                            flexShrink: 0,
                            width: 80,
                            height: 80,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: selectedImageIndex === index ? `3px solid ${colors.accent}` : `2px solid ${colors.border}`,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1)',
                              borderColor: colors.accent,
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={imagePath}
                            alt={`Thumbnail ${index + 1}`}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                )}
              </Stack>
            </Grid>

            {/* Product Information - 40% */}
            <Grid item xs={12} md={4.8}>
              <Stack spacing={2.5}>
                {/* Product Header - Tightened */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h3" sx={{
                      fontWeight: 700,
                      color: isDarkMode ? '#e0e0e0' : '#2c2c2c', // Slightly darker
                      fontFamily: 'Playfair Display, serif',
                      fontSize: { xs: '1.8rem', md: '2.2rem' },
                      lineHeight: 1.2
                    }}>
                      {chosenProduct?.productName}
                    </Typography>
                    <IconButton
                      onClick={toggleFavorite}
                      sx={{ color: isFavorite ? '#ff6b6b' : colors.textSecondary }}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>

                  {/* Rating and Views - Compact */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                    <Rating name="half-rating" defaultValue={4.5} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" sx={{ color: colors.textSecondary, fontSize: '0.85rem' }}>
                      (1 review)
                      </Typography>
                  </Box>
                </Box>

                {/* Price - Stronger, Closer to Title */}
                <Box>
                  <Typography variant="h2" sx={{
                    fontWeight: 700,
                    color: colors.accent,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    mb: 0.5
                  }}>
                    ${chosenProduct?.productPrice}
                  </Typography>
                </Box>

                {/* Description - Value-focused */}
                <Box>
                  <Typography variant="body1" sx={{ 
                    color: colors.text,
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    fontWeight: 500,
                    mb: 2
                  }}>
                    {chosenProduct?.productDesc || `A delicious ${chosenProduct?.productName.toLowerCase()} made with premium ingredients and crafted with care.`}
                  </Typography>
                  
                  {/* Bullet Highlights */}
                  <Stack spacing={1}>
                    {[
                      'Freshly prepared daily',
                      'Made with premium ingredients',
                      'Perfect for any occasion'
                    ].map((highlight, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CheckCircleIcon sx={{ fontSize: 18, color: colors.accent }} />
                        <Typography variant="body2" sx={{ 
                          color: colors.textSecondary,
                          fontSize: '0.9rem',
                          lineHeight: 1.6
                        }}>
                          {highlight}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Product Details - Pill Cards */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  <Chip
                    label={`${chosenProduct.productSize} Size`}
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(139, 69, 19, 0.1)',
                      color: colors.text,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: 36,
                      borderRadius: '18px',
                    }}
                  />
                  <Chip
                    label={`${chosenProduct.productVolume} ml`}
                    sx={{
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(139, 69, 19, 0.1)',
                      color: colors.text,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: 36,
                      borderRadius: '18px',
                    }}
                  />
                  <Chip
                    label={`${chosenProduct.productLeftCount} Available`}
                    sx={{
                      backgroundColor: chosenProduct.productLeftCount > 0 
                        ? (isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.15)')
                        : (isDarkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.15)'),
                      color: colors.text,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      height: 36,
                      borderRadius: '18px',
                    }}
                  />
                </Box>

                {/* CTA - Stronger, Food-app-like */}
                <Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={chosenProduct.productLeftCount === 0}
                    fullWidth
                    sx={{
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark || colors.accent} 100%)`,
                      color: 'white',
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${colors.accentDark || colors.accent} 0%, ${colors.accent} 100%)`,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        backgroundColor: colors.textSecondary,
                        background: 'none',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Typography variant="body2" sx={{ 
                    textAlign: 'center',
                    color: colors.textSecondary,
                    mt: 1,
                    fontSize: '0.85rem'
                  }}>
                    Ready in ~15 minutes
                  </Typography>
                </Box>

                {/* Social Proof */}
                <Box sx={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(139, 69, 19, 0.08)',
                  borderRadius: '12px',
                  p: 2,
                  textAlign: 'center'
                }}>
                  <Typography variant="body2" sx={{ 
                    color: colors.accent,
                    fontWeight: 600,
                    fontSize: '0.95rem'
                  }}>
                    🔥 Popular today
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: colors.textSecondary,
                    fontSize: '0.85rem',
                    mt: 0.5
                  }}>
                    Ordered 23 times today
                  </Typography>
                </Box>

                {/* Restaurant Info - Enhanced */}
                {restaurant && (
                  <Card sx={{
                    backgroundColor: colors.surface,
                    borderRadius: '16px',
                    p: 2.5,
                    border: `1px solid ${colors.border}`
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        backgroundColor: colors.accent,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.2rem'
                      }}>
                        {restaurant?.memberNick?.charAt(0).toUpperCase() || 'C'}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: 700, color: colors.text }}>
                      {restaurant?.memberNick}
                    </Typography>
                          <VerifiedIcon sx={{ fontSize: 18, color: colors.accent }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, fontSize: '0.75rem' }}>
                          Verified Cafe
                    </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: colors.accent }} />
                      <Typography 
                        variant="body2" 
                        component="a"
                        href={`tel:${restaurant?.memberPhone}`}
                        sx={{ 
                          color: colors.text,
                          textDecoration: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            color: colors.accent,
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {restaurant?.memberPhone}
                      </Typography>
                    </Box>
                  </Card>
                )}
              </Stack>
            </Grid>
          </Grid>

          {/* Related Items Section */}
          {relatedProducts.length > 0 && (
            <Box sx={{ mt: 8 }}>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: colors.text,
                mb: 4,
                fontFamily: 'Playfair Display, serif'
              }}>
                You might also like
              </Typography>
              <Grid container spacing={3}>
                {relatedProducts.map((product: Product) => (
                  <Grid item xs={6} sm={4} md={3} key={product._id}>
                    <Card
                      onClick={() => {
                        setChosenProduct(product);
                        history.push(`/products/${product._id}`);
                      }}
                      sx={{
                        cursor: 'pointer',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        }
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${serverApi}${product.productImages[0]}`}
                        alt={product.productName}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{
                          fontWeight: 600,
                          color: colors.text,
                          fontSize: '1rem',
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {product.productName}
                        </Typography>
                        <Typography variant="h6" sx={{
                          fontWeight: 700,
                          color: colors.accent,
                          fontSize: '1.1rem'
                        }}>
                          ${product.productPrice}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </motion.div>

        {/* Lightbox Modal */}
        <Dialog
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            }
          }}
        >
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setLightboxOpen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1000,
                backgroundColor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.7)',
                }
              }}
            >
              <CloseIcon />
            </IconButton>
            {chosenProduct?.productImages && (
              <>
                <IconButton
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev > 0 ? prev - 1 : chosenProduct.productImages.length - 1
                  )}
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <IconButton
                  onClick={() => setSelectedImageIndex((prev) => 
                    prev < chosenProduct.productImages.length - 1 ? prev + 1 : 0
                  )}
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1000,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(0,0,0,0.7)',
                    }
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
                <Box
                  component="img"
                  src={`${serverApi}${chosenProduct.productImages[selectedImageIndex]}`}
                  alt={chosenProduct.productName}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: '90vh',
                    objectFit: 'contain',
                    borderRadius: '8px',
                  }}
                />
              </>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
















 



