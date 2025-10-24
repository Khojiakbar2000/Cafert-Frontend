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
    <Box className={`chosen-product-container ${isDarkMode ? 'dark' : ''}`}>
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs className="chosen-product-breadcrumbs">
          <Link
            component="button"
            variant="body1"
            onClick={handleBackClick}
            className="chosen-product-breadcrumb-link"
          >
            Products
          </Link>
          <Typography color="text.primary">{chosenProduct.productName}</Typography>
        </Breadcrumbs>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="chosen-product-animated"
        >
          <Grid container spacing={4} className="chosen-product-grid">
            {/* Product Images */}
            <Grid item xs={12} md={6}>
              <Card className={`chosen-product-image-card ${isDarkMode ? 'dark' : ''}`}>
                <Swiper
                  loop={true}
                  spaceBetween={10}
                  navigation={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="chosen-product-swiper"
                >
                  {chosenProduct?.productImages.map((ele: string, index: number) => {
                    const imagePath = `${serverApi}${ele}`;
                    return (
                      <SwiperSlide key={index}>
                        <img 
                          className="chosen-product-slider-image" 
                          src={imagePath}
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
              <Stack spacing={3} className="chosen-product-info">
                {/* Product Header */}
                <Box>
                  <Box className="chosen-product-header">
                    <Typography variant="h3" className={`chosen-product-title ${isDarkMode ? 'dark' : ''}`}>
                      {chosenProduct?.productName}
                    </Typography>
                    <IconButton
                      onClick={toggleFavorite}
                      className={`chosen-product-favorite-button ${isFavorite ? 'favorited' : ''}`}
                    >
                      {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>

                  {/* Category and Status */}
                  <Box className="chosen-product-chips">
                    <Chip 
                      label={chosenProduct.productCollection} 
                      size="small"
                      className="chosen-product-chip category"
                    />
                    {chosenProduct.productLeftCount > 0 ? (
                      <Chip 
                        label="In Stock" 
                        size="small"
                        className="chosen-product-chip in-stock"
                      />
                    ) : (
                      <Chip 
                        label="Out of Stock" 
                        size="small"
                        className="chosen-product-chip out-of-stock"
                      />
                    )}
                  </Box>

                  {/* Rating and Views */}
                  <Box className="chosen-product-rating-section">
                    <Rating name="half-rating" defaultValue={4.5} precision={0.5} readOnly />
                    <Box className="chosen-product-views">
                      <RemoveRedEyeIcon className="chosen-product-views-icon" />
                      <Typography variant="body2" className="chosen-product-views-text">
                        {localViews || chosenProduct?.productViews || 0} views
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Description */}
                <Box className="chosen-product-description-section">
                  <Typography variant="h6" className={`chosen-product-description-title ${isDarkMode ? 'dark' : ''}`}>
                    Description
                  </Typography>
                  <Typography variant="body1" className="chosen-product-description-text">
                    {chosenProduct?.productDesc || "No description available for this product."}
                  </Typography>
                </Box>

                {/* Product Details */}
                <Card className={`chosen-product-details-card ${isDarkMode ? 'dark' : ''}`}>
                  <Grid container spacing={2} className="chosen-product-details-grid">
                    <Grid item xs={6}>
                      <Box className="chosen-product-detail-item">
                        <Typography variant="body2" className="chosen-product-detail-label">
                          Size
                        </Typography>
                        <Typography variant="body1" className={`chosen-product-detail-value ${isDarkMode ? 'dark' : ''}`}>
                          {chosenProduct.productSize}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className="chosen-product-detail-item">
                        <Typography variant="body2" className="chosen-product-detail-label">
                          Volume
                        </Typography>
                        <Typography variant="body1" className={`chosen-product-detail-value ${isDarkMode ? 'dark' : ''}`}>
                          {chosenProduct.productVolume}ml
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className="chosen-product-detail-item">
                        <Typography variant="body2" className="chosen-product-detail-label">
                          Stock
                        </Typography>
                        <Typography variant="body1" className={`chosen-product-detail-value ${isDarkMode ? 'dark' : ''}`}>
                          {chosenProduct.productLeftCount} available
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box className="chosen-product-detail-item">
                        <Typography variant="body2" className="chosen-product-detail-label">
                          Category
                        </Typography>
                        <Typography variant="body1" className={`chosen-product-detail-value ${isDarkMode ? 'dark' : ''}`}>
                          {chosenProduct.productCollection}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>

                {/* Price and Add to Cart */}
                <Box className="chosen-product-price-section">
                  <Typography variant="h2" className="chosen-product-price">
                    ${chosenProduct?.productPrice}
                  </Typography>

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={chosenProduct.productLeftCount === 0}
                    className="chosen-product-add-to-cart-button"
                  >
                    {chosenProduct.productLeftCount > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </Box>

                {/* Restaurant Info */}
                {restaurant && (
                  <Card className={`chosen-product-restaurant-card ${isDarkMode ? 'dark' : ''}`}>
                    <Typography variant="h6" className={`chosen-product-restaurant-title ${isDarkMode ? 'dark' : ''}`}>
                      Restaurant Information
                    </Typography>
                    <Typography variant="body1" className={`chosen-product-restaurant-name ${isDarkMode ? 'dark' : ''}`}>
                      {restaurant?.memberNick}
                    </Typography>
                    <Typography variant="body2" className="chosen-product-restaurant-info">
                      Phone: {restaurant?.memberPhone}
                    </Typography>
                    {restaurant?.memberAddress && (
                      <Typography variant="body2" className="chosen-product-restaurant-info">
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
















 



