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
  IconButton,
  Breadcrumbs,
  Link
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
  AccessTime as AccessTimeIcon
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
      <Container maxWidth="lg">
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
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Card sx={{
                backgroundColor: colors.surface,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <Swiper
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="swiper-area"
                  style={{ height: '400px' }}
                >
                  {chosenProduct?.productImages.map((ele: string, index: number) => {
                    const imagePath = `${serverApi}${ele}`;
                    return (
                      <SwiperSlide key={index}>
                        <img 
                          className="slider-image" 
                          src={imagePath}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                          alt={`${chosenProduct.productName} - Image ${index + 1}`}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Card>
            </Grid>

            {/* Product Information */}
            <Grid item xs={12} md={6}>
              <Stack spacing={3}>
                {/* Product Header */}
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h3" sx={{
                      fontWeight: 700,
                      color: colors.text,
                      fontFamily: 'Playfair Display, serif'
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

                  {/* Category and Status */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={chosenProduct.productCollection} 
                      size="small"
                      sx={{ 
                        backgroundColor: colors.accent,
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                    {chosenProduct.productLeftCount > 0 ? (
                      <Chip 
                        label="In Stock" 
                        size="small"
                        sx={{ 
                          backgroundColor: '#4caf50',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    ) : (
                      <Chip 
                        label="Out of Stock" 
                        size="small"
                        sx={{ 
                          backgroundColor: '#f44336',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Box>

                  {/* Rating and Views */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Rating name="half-rating" defaultValue={4.5} precision={0.5} readOnly />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <RemoveRedEyeIcon sx={{ fontSize: 20, color: colors.textSecondary }} />
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        {localViews || chosenProduct?.productViews || 0} views
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: colors.textSecondary,
                    lineHeight: 1.6
                  }}>
                    {chosenProduct?.productDesc || "No description available for this product."}
                  </Typography>
                </Box>

                {/* Product Details */}
                <Card sx={{
                  backgroundColor: colors.surface,
                  borderRadius: 2,
                  p: 2
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Size
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {chosenProduct.productSize}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Volume
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {chosenProduct.productVolume}ml
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Stock
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {chosenProduct.productLeftCount} available
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Category
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {chosenProduct.productCollection}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>

                {/* Price and Add to Cart */}
                <Box>
                  <Typography variant="h2" sx={{
                    fontWeight: 700,
                    color: colors.accent,
                    mb: 2
                  }}>
                    ${chosenProduct?.productPrice}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={chosenProduct.productLeftCount === 0}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: colors.accent,
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: colors.accentDark
                      },
                      '&:disabled': {
                        backgroundColor: colors.textSecondary
                      }
                    }}
                  >
                    {chosenProduct.productLeftCount > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </Box>

                {/* Restaurant Info */}
                {restaurant && (
                  <Card sx={{
                    backgroundColor: colors.surface,
                    borderRadius: 2,
                    p: 2
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Restaurant Information
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                      {restaurant?.memberNick}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Phone: {restaurant?.memberPhone}
                    </Typography>
                    {restaurant?.memberAddress && (
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Address: {restaurant.memberAddress}
                      </Typography>
                    )}
                  </Card>
                )}
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}
















 



