// @ts-nocheck
import React, { useEffect, useState } from "react";
import { 
  Container, 
  Stack, 
  Box, 
  Typography, 
  Button, 
  Divider,
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
  Add as AddIcon,
  Remove as RemoveIcon,
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
      backgroundColor: '#d8b88f',
      backgroundImage: "linear-gradient(rgba(250,244,230,.05),rgba(250,244,230,.05)),url('/img/coffee/cafert-investigation-board.webp')",
      backgroundSize: '100% auto',
      backgroundPosition: 'center top',
      backgroundRepeat: 'repeat-y',
      color: colors.text,
      minHeight: '100vh',
      py: { xs: 5, md: 10 },
      '@media (max-width: 700px)': { backgroundSize: 'auto 1180px' },
    }}>
      <Container maxWidth="xl" sx={{ maxWidth: '1320px !important', px: { xs: 2, md: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ display: 'table', mb: { xs: 3, md: 5 }, px: 1.5, py: 1, bgcolor: 'rgba(255,250,240,.92)', border: '1px solid #c9b28e', boxShadow: '0 3px 9px rgba(58,43,25,.1)', color: colors.textSecondary }}>
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

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          {/* Product hero: image gallery beside a focused purchase panel */}
          <Grid container spacing={{ xs: 4, md: 7 }} alignItems="start" sx={{ position: 'relative', '&::after': { content: '""', position: 'absolute', zIndex: 0, left: '48%', top: '28%', width: '10%', height: 110, borderTop: '3px solid #b54f42', borderRight: '3px solid #b54f42', borderRadius: '0 38px 0 0', transform: 'rotate(12deg)', opacity: .82, pointerEvents: 'none', '@media (max-width: 900px)': { display: 'none' } } }}>
            <Grid item xs={12} md={7}>
              <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 1.5, md: 2 }, bgcolor: '#f6f0e4', border: '1px solid #dfd4c1', boxShadow: '0 16px 40px rgba(63,49,32,.17)', transform: { md: 'rotate(-.35deg)' }, '&::before': { content: '""', position: 'absolute', zIndex: 8, top: -9, left: '50%', width: 17, height: 17, borderRadius: '50%', bgcolor: '#a05245', border: '2px solid #f2e7d6', boxShadow: '0 2px 4px rgba(48,36,23,.28)' } }}>
                <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#ece6da', '& .swiper-button-next, & .swiper-button-prev': { color: '#6b7354', bgcolor: 'rgba(255,252,245,.94)', width: 42, height: 42, borderRadius: '50%', boxShadow: '0 3px 10px rgba(45,35,24,.14)', '&::after': { fontSize: 16, fontWeight: 700 } } }}>
                  {chosenProduct?.productImages?.length ? (
                    <Swiper loop={chosenProduct.productImages.length > 1} spaceBetween={10} navigation={chosenProduct.productImages.length > 1} modules={[FreeMode, Navigation, Thumbs]} className="swiper-area" style={{ height: 'min(68vw, 680px)', minHeight: 340 }} onSlideChange={(swiper) => setSelectedImageIndex(swiper.realIndex)} initialSlide={selectedImageIndex}>
                      {chosenProduct.productImages.map((image: string, index: number) => <SwiperSlide key={index}><img className="product-main-image" src={image ? `${serverApi}${image}` : '/icons/noimage-list.svg'} onError={(event) => { (event.target as HTMLImageElement).src = '/icons/noimage-list.svg'; }} onClick={() => setLightboxOpen(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in' }} alt={`${chosenProduct.productName} · image ${index + 1}`} /></SwiperSlide>)}
                    </Swiper>
                  ) : <Box sx={{ height: 320, display: 'grid', placeItems: 'center' }}><img src="/icons/noimage-list.svg" alt="No image available" style={{ width: 160, opacity: .5 }} /></Box>}
                  <Box aria-hidden="true" sx={{ position: 'absolute', zIndex: 5, top: { xs: 12, md: 20 }, left: { xs: 12, md: 20 }, px: 1.1, py: .65, bgcolor: 'rgba(255,250,240,.94)', color: '#63704f', border: '1px solid rgba(99,112,79,.55)', font: '700 .53rem/1 monospace', letterSpacing: '.11em' }}>LEAD PHOTO · CAFERT</Box>
                  <Box aria-hidden="true" sx={{ position: 'absolute', zIndex: 5, right: 15, bottom: 15, width: 66, height: 66, border: '1.5px solid #a05245', borderRadius: '50%', outline: '1px dashed #a05245', outlineOffset: -5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#a05245', bgcolor: 'rgba(255,248,233,.94)', transform: 'rotate(8deg)' }}><Typography sx={{ font: '700 .42rem/1 monospace', letterSpacing: '.1em' }}>CAFERT</Typography><Typography sx={{ font: '700 .55rem/1 monospace', mt: .35 }}>FILED</Typography></Box>
                </Box>
                {chosenProduct?.productImages?.length > 1 && <Box sx={{ display: 'flex', gap: 1.5, mt: 2, overflowX: 'auto' }}>{chosenProduct.productImages.map((image: string, index: number) => <Box key={index} onClick={() => setSelectedImageIndex(index)} sx={{ flex: '0 0 72px', height: 72, p: .4, bgcolor: '#fffaf0', border: selectedImageIndex === index ? '2px solid #a05245' : '1px solid #d5c6ad', cursor: 'pointer' }}><Box component="img" src={image ? `${serverApi}${image}` : '/icons/noimage-list.svg'} alt={`${chosenProduct.productName} thumbnail ${index + 1}`} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /></Box>)}</Box>}
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ position: { md: 'sticky' }, zIndex: 1, top: { md: 100 }, p: { xs: 2.5, md: 4 }, bgcolor: 'rgba(255,250,240,.97)', border: '1px solid #d9c7a8', boxShadow: '0 14px 34px rgba(65,49,31,.18)', '&::before': { content: '""', position: 'absolute', top: -7, left: 26, width: 54, height: 12, bgcolor: '#e8d6b8', border: '1px solid #d0b48a', transform: 'rotate(-4deg)' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography sx={{ font: '700 .65rem/1 monospace', letterSpacing: '.16em', color: '#a05245' }}>CAFERT CASE FILE · LEAD {productId.slice(-4).toUpperCase()}</Typography>
                  <IconButton aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'} onClick={toggleFavorite} size="small" sx={{ color: isFavorite ? '#a05245' : colors.textSecondary, border: '1px solid #d8c7a9' }}>{isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}</IconButton>
                </Box>
                <Typography component="h1" sx={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: { xs: '2.65rem', md: '3.8rem' }, lineHeight: 1.03, color: '#302c24', textTransform: 'capitalize', mb: 2.5 }}>{chosenProduct?.productName}</Typography>
                <Typography sx={{ fontFamily: 'Georgia,serif', fontSize: '1.12rem', lineHeight: 1.85, color: '#635b4e', mb: 4 }}>{chosenProduct?.productDesc || `A ${chosenProduct?.productName.toLowerCase()} made with care at Cafert.`}</Typography>

                <Box sx={{ p: 2.5, borderLeft: '4px solid #9b5c3c', bgcolor: '#f1e7d6', mb: 3.5 }}>
                  <Typography sx={{ font: '700 .63rem/1 monospace', letterSpacing: '.13em', color: '#a05245', mb: 1.5 }}>VALUE OF THE FIND</Typography>
                  <Typography sx={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: '3rem', lineHeight: 1, color: '#78482e', fontWeight: 700 }}>${chosenProduct?.productPrice}</Typography>
                </Box>

                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2.5 }}>
                  <Typography sx={{ mr: 'auto', font: '700 .56rem/1 monospace', letterSpacing: '.1em', color: '#80765f' }}>QUANTITY</Typography>
                  <IconButton aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} sx={{ border: '1px solid #d5c6ad', borderRadius: '3px', width: 46, height: 46, color: '#5c584b' }}><RemoveIcon fontSize="small" /></IconButton>
                  <Typography aria-live="polite" sx={{ minWidth: 28, textAlign: 'center', font: '700 .78rem/1 monospace', color: colors.text }}>{quantity}</Typography>
                  <IconButton aria-label="Increase quantity" disabled={quantity >= (chosenProduct?.productLeftCount || 1)} onClick={() => setQuantity((value) => Math.min(chosenProduct?.productLeftCount || value + 1, value + 1))} sx={{ border: '1px solid #d5c6ad', borderRadius: '3px', width: 46, height: 46, color: '#5c584b' }}><AddIcon fontSize="small" /></IconButton>
                </Stack>
                <Button variant="contained" onClick={handleAddToCart} disabled={chosenProduct?.productLeftCount === 0} fullWidth sx={{ minHeight: 70, borderRadius: '3px', bgcolor: '#a64f42', color: '#fffaf0', fontFamily: 'Georgia,serif', fontSize: '1.18rem', fontWeight: 700, textTransform: 'none', boxShadow: '0 5px 12px rgba(133,58,48,.23)', '&:hover': { bgcolor: '#873f35', boxShadow: '0 7px 16px rgba(133,58,48,.28)' }, '&:disabled': { bgcolor: '#c9c2b5', color: '#f7f2e9' } }}>{chosenProduct?.productLeftCount === 0 ? 'Sold out' : 'Add to Cart'}</Button>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><Typography sx={{ px: 1.3, py: .65, borderRadius: 10, bgcolor: '#e7ebdd', color: '#566344', font: '700 .63rem/1 monospace', letterSpacing: '.04em' }}>{chosenProduct?.productLeftCount > 0 ? `${chosenProduct.productLeftCount} AVAILABLE AT THE COUNTER` : 'CURRENTLY UNAVAILABLE'}</Typography></Box>
              </Box>
            </Grid>
          </Grid>

          {/* Product story and factual details */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.3fr .7fr' }, gap: { xs: 4, md: 8 }, mt: { xs: 7, md: 11 }, pt: { xs: 4, md: 6 }, borderTop: '1px solid #d9cbb5' }}>
            <Box sx={{ maxWidth: 700, p: { xs: 3, md: 4 }, bgcolor: 'rgba(255,250,240,.96)', border: '1px solid #dfd2bc', boxShadow: '0 9px 24px rgba(73,55,34,.09)', transform: { md: 'rotate(-.4deg)' } }}><Typography sx={{ font: '700 .62rem/1 monospace', letterSpacing: '.16em', color: '#a05245', mb: 1.5 }}>CASE NOTES · CAFERT COUNTER</Typography><Typography variant="h4" sx={{ fontFamily: 'Playfair Display,Georgia,serif', color: colors.text, mb: 2.5 }}>What we found.</Typography><Typography sx={{ fontFamily: 'Georgia,serif', fontSize: '1.08rem', lineHeight: 1.95, color: colors.textSecondary }}>{chosenProduct?.productDesc || `Meet the ${chosenProduct?.productName}, available from the Cafert counter.`}</Typography></Box>
            <Box sx={{ p: { xs: 3, md: 4 }, bgcolor: '#f3ead8', border: '1px solid #dfd2bc' }}><Typography sx={{ font: '700 .57rem/1 monospace', letterSpacing: '.14em', color: '#7a8061', mb: 2.5 }}>AT A GLANCE</Typography><Stack spacing={2}><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontFamily: 'Georgia,serif', color: colors.textSecondary }}>Size</Typography><Typography sx={{ font: '700 .65rem/1.5 monospace', color: colors.text, textTransform: 'uppercase' }}>{chosenProduct?.productSize || 'Regular'}</Typography></Box><Divider sx={{ borderColor: '#d5c6ad', borderStyle: 'dashed' }} /><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontFamily: 'Georgia,serif', color: colors.textSecondary }}>Volume</Typography><Typography sx={{ font: '700 .65rem/1.5 monospace', color: colors.text }}>{chosenProduct?.productVolume || '—'} ml</Typography></Box>{restaurant && <><Divider sx={{ borderColor: '#d5c6ad', borderStyle: 'dashed' }} /><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}><Typography sx={{ fontFamily: 'Georgia,serif', color: colors.textSecondary }}>Made by</Typography><Typography sx={{ font: '700 .65rem/1.5 monospace', color: colors.text }}>{restaurant.memberNick}</Typography></Box></>}</Stack></Box>
          </Box>

          {relatedProducts.length > 0 && (
            <Box sx={{ mt: { xs: 7, md: 11 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', mb: 4, pb: 2, borderBottom: '1px solid #d9cbb5' }}>
                <Box>
                  <Typography sx={{ font: '700 .62rem/1 monospace', letterSpacing: '.15em', color: '#a05245', mb: 1 }}>FOLLOW THE THREAD</Typography>
                  <Typography variant="h4" sx={{ fontFamily: 'Playfair Display,Georgia,serif', color: colors.text }}>Other leads</Typography>
                </Box>
              </Box>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                {relatedProducts.map((product: Product) => (
                  <Grid item xs={6} sm={4} md={3} key={product._id}>
                    <Card onClick={() => { setChosenProduct(product); history.push(`/products/${product._id}`); }} sx={{ cursor: 'pointer', overflow: 'hidden', borderRadius: '4px', border: '1px solid #ded2be', bgcolor: '#f9f5ed', boxShadow: '0 4px 12px rgba(73,55,34,.07)', transition: 'transform .2s ease, box-shadow .2s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 9px 18px rgba(73,55,34,.12)' } }}>
                      <CardMedia component="img" height="220" image={`${serverApi}${product.productImages?.[0] || ''}`} alt={product.productName} sx={{ objectFit: 'cover' }} />
                      <CardContent sx={{ p: 2.2 }}>
                        <Typography sx={{ fontFamily: 'Georgia,serif', color: colors.text, fontWeight: 700, mb: .8 }}>{product.productName}</Typography>
                        <Typography sx={{ font: '700 .72rem/1 monospace', color: '#865638' }}>${product.productPrice}</Typography>
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
















 



