// @ts-nocheck
import React, { useEffect, useState, useRef } from "react";
import {
  Stack,
  Box,
  Typography,
  Button,
  Rating,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Dialog,
  DialogContent,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Verified as VerifiedIcon,
  Phone as PhoneIcon,
  Close as CloseIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
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
import { useParams, useRouteMatch } from "react-router-dom";
import ProductService from "../../services/ProductService";
import MemberService from "../../services/MemberService";
import ActivityService from "../../services/ActivityService";
import { Member } from "../../../lib/types/member";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { motion } from "framer-motion";
import {
  StitchPageShell,
  STITCH_THEME,
} from "../../../components/stitchUi";

/** Centered editorial width for PDP (image + detail + pairings + comics) — not full-bleed. */
const PDP_MAIN_MAX_PX = 1536;

/** Stitch / Pulp Alchemist tokens aligned with `stitch.tsx` (Space Grotesk shell + grain). */
function stitchProductTheme(isDark: boolean) {
  const ink = isDark ? "#e8ddd4" : STITCH_THEME.ink;
  return {
    bg: isDark ? "#2a2620" : STITCH_THEME.surface,
    ink,
    muted: isDark ? "rgba(245,235,227,0.72)" : "#4a423c",
    orange: STITCH_THEME.primaryContainer,
    panel: isDark ? "rgba(238, 232, 216, 0.12)" : STITCH_THEME.surfaceContainer,
    goldScript: STITCH_THEME.tertiaryContainer,
  };
}

function sensoryStatsFromProduct(p: Product) {
  const c = (p.productCollection || "").toLowerCase();
  if (c === "coffee" || c === "drink")
    return {
      sweetness: 58,
      sweetnessLabel: "ROUND",
      richness: 82,
      richnessLabel: "BOLD",
      freshness: 64,
      freshnessLabel: "BRIGHT",
      energy: 72,
      energyLabel: "LIFTED",
    };
  if (c === "dessert")
    return {
      sweetness: 88,
      sweetnessLabel: "DEEP",
      richness: 72,
      richnessLabel: "VELVET",
      freshness: 52,
      freshnessLabel: "MELLOW",
      energy: 58,
      energyLabel: "COZY",
    };
  if (c === "dish" || c === "salad")
    return {
      sweetness: 52,
      sweetnessLabel: "SUBTLE",
      richness: 60,
      richnessLabel: "SAVORY",
      freshness: 68,
      freshnessLabel: "CRISP",
      energy: 62,
      energyLabel: "STEADY",
    };
  return {
    sweetness: 55,
    sweetnessLabel: "BALANCED",
    richness: 68,
    richnessLabel: "FULL",
    freshness: 58,
    freshnessLabel: "CLEAN",
    energy: 65,
    energyLabel: "ALIVE",
  };
}

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
  /** PDP is sometimes rendered outside `<Route path="/products/:productId">` (e.g. full-page early return in ProductsPage). Match the URL directly. */
  const detailMatch = useRouteMatch<{ productId: string }>({
    path: "/products/:productId",
    exact: true,
  });
  const { productId: paramProductId } = useParams<{ productId: string }>();
  const productId = detailMatch?.params.productId ?? paramProductId ?? "";
  const { setRestaurant, setChosenProduct } = actionDispatch(useDispatch());
  const { chosenProduct } = useSelector(chosenProductRetriever);
  const { restaurant } = useSelector(restaurantRetriever);
  const history = useHistory();
  const { isDarkMode } = useCoffeeTheme();
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [localViews, setLocalViews] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const swiperRef = useRef<{ slideTo: (i: number) => void } | null>(null);

  useEffect(() => {
    console.log("restaurant updated:", restaurant);
  }, [restaurant]);

  useEffect(() => {
    if (!productId) return;

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

  const productPageShell = (inner: React.ReactNode) => {
    const lp = stitchProductTheme(isDarkMode);
    return (
      <StitchPageShell isDarkMode={isDarkMode}>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            width: "100%",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            px: 3,
            py: 6,
            color: lp.ink,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            WebkitFontSmoothing: "antialiased",
            boxSizing: "border-box",
          }}
        >
          {inner}
        </Box>
      </StitchPageShell>
    );
  };

  if (!productId) {
    return productPageShell(
      <>
        <Typography
          sx={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 900,
            fontStyle: "italic",
            textTransform: "uppercase",
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Product not found
        </Typography>
        <Button
          variant="outlined"
          onClick={() => history.push("/products")}
          sx={{
            borderRadius: 0,
            borderWidth: 6,
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 800,
            textTransform: "uppercase",
            boxShadow: `6px 6px 0 0 ${stitchProductTheme(isDarkMode).ink}`,
          }}
        >
          Back to shop
        </Button>
      </>
    );
  }

  if (!chosenProduct) {
    return productPageShell(
      <Typography
        sx={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 900,
          fontStyle: "italic",
          textTransform: "uppercase",
          fontSize: { xs: "1.65rem", sm: "2rem" },
          textAlign: "center",
          letterSpacing: "-0.02em",
        }}
      >
        Loading…
      </Typography>
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

  const ma = stitchProductTheme(isDarkMode);
  const stats = sensoryStatsFromProduct(chosenProduct);
  const showBestSeller = (chosenProduct.productViews || 0) >= 15;
  const grotesk = '"Space Grotesk", system-ui, sans-serif';
  const serif = grotesk;
  const sans = grotesk;

  const StatBar = ({ label, sub, pct }: { label: string; sub: string; pct: number }) => (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          fontFamily: sans,
          color: ma.muted,
        }}
      >
        {label}{" "}
        <Box component="span" sx={{ color: ma.ink, fontWeight: 700 }}>
          ({sub})
        </Box>
      </Typography>
      <Box sx={{ mt: 1, height: 14, border: `3px solid ${ma.ink}`, bgcolor: "transparent" }}>
        <Box sx={{ height: "100%", width: `${pct}%`, bgcolor: ma.ink }} />
      </Box>
    </Box>
  );

  return (
    <StitchPageShell isDarkMode={isDarkMode}>
      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          flex: "1 1 auto",
          alignSelf: "stretch",
          width: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: ma.ink,
          fontFamily: sans,
          WebkitFontSmoothing: "antialiased",
          py: { xs: 0.5, md: 1 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: `${PDP_MAIN_MAX_PX}px` },
            mx: "auto",
            px: { xs: 2, sm: 2.5, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mb: { xs: 2, md: 3 },
              mt: { xs: 0.5, md: 1 },
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.72rem",
              fontWeight: 700,
              color: ma.muted,
            }}
          >
            <Link
              component="button"
              type="button"
              onClick={handleBackClick}
              sx={{
                color: ma.ink,
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { color: ma.orange },
              }}
            >
              Products
            </Link>{" "}
            / {chosenProduct.productName}
          </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          <Grid container spacing={{ xs: 3, md: 4 }} alignItems="flex-start" sx={{ width: "100%" }}>
            <Grid item xs={12} md={6} sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  position: "relative",
                  border: { xs: `4px solid ${ma.ink}`, md: `6px solid ${ma.ink}` },
                  boxShadow: { xs: `8px 8px 0 0 ${ma.ink}`, md: `12px 12px 0 0 ${ma.ink}` },
                  bgcolor: "#111",
                  overflow: "hidden",
                }}
              >
                {showBestSeller && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 20,
                      right: -6,
                      zIndex: 6,
                      bgcolor: ma.orange,
                      color: "#fff",
                      px: 1.75,
                      py: 0.5,
                      transform: "rotate(12deg)",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      border: `3px solid ${ma.ink}`,
                      fontFamily: sans,
                    }}
                  >
                    Best Seller
                  </Box>
                )}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    left: 16,
                    zIndex: 5,
                    pointerEvents: "none",
                    maxWidth: "70%",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: serif,
                      fontStyle: "italic",
                      fontSize: { xs: "1.5rem", md: "2rem" },
                      color: ma.goldScript,
                      lineHeight: 1.15,
                      textShadow: "0 1px 3px rgba(0,0,0,0.65)",
                    }}
                  >
                    {chosenProduct.productCollection || "Signature"}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: serif,
                      fontSize: "0.75rem",
                      color: "rgba(255,255,255,0.88)",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      mt: 0.5,
                    }}
                  >
                    Sensory
                  </Typography>
                </Box>
                <Card
                  sx={{
                    m: 0,
                    borderRadius: 0,
                    bgcolor: "transparent",
                    border: "none",
                    boxShadow: "none",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      "& .swiper-button-next, & .swiper-button-prev": {
                        color: ma.ink,
                        backgroundColor: ma.panel,
                        width: "44px",
                        height: "44px",
                        borderRadius: 0,
                        border: `4px solid ${ma.ink}`,
                        boxShadow: `4px 4px 0 0 ${ma.ink}`,
                        "&:after": { fontSize: "14px", fontWeight: "bold" },
                      },
                      "& .swiper-button-next": { right: "12px" },
                      "& .swiper-button-prev": { left: "12px" },
                      "& .swiper-button-disabled": { opacity: 0.35 },
                    }}
                  >
                    {chosenProduct?.productImages && chosenProduct.productImages.length > 0 ? (
                      <Swiper
                        loop={chosenProduct.productImages.length > 1}
                        spaceBetween={0}
                        navigation={chosenProduct.productImages.length > 1}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="swiper-area"
                        style={{
                          height: "clamp(280px, min(52vh, 52vw), 560px)",
                        }}
                        onSwiper={(s) => {
                          swiperRef.current = s;
                        }}
                        onSlideChange={(swiper) => setSelectedImageIndex(swiper.realIndex)}
                        initialSlide={selectedImageIndex}
                      >
                        {chosenProduct.productImages.map((ele: string, index: number) => {
                          const imagePath = ele ? `${serverApi}${ele}` : "/icons/noimage-list.svg";
                          return (
                            <SwiperSlide key={index}>
                              <img
                                className="product-main-image slider-image"
                                src={imagePath}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/icons/noimage-list.svg";
                                }}
                                onClick={() => setLightboxOpen(true)}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  display: "block",
                                }}
                                alt={`${chosenProduct.productName} — ${index + 1}`}
                              />
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: 400,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: ma.panel,
                        }}
                      >
                        <img
                          src="/icons/noimage-list.svg"
                          alt=""
                          style={{ width: 160, height: 160, opacity: 0.4 }}
                        />
                      </Box>
                    )}
                  </Box>
                </Card>
              </Box>
              {chosenProduct?.productImages && chosenProduct.productImages.length > 1 && (
                <Box sx={{ display: "flex", gap: 1.25, overflowX: "auto", pb: 1, mt: 2 }}>
                  {chosenProduct.productImages.map((ele: string, index: number) => {
                    const imagePath = ele ? `${serverApi}${ele}` : "/icons/noimage-list.svg";
                    return (
                      <Box
                        key={index}
                        onClick={() => {
                          setSelectedImageIndex(index);
                          swiperRef.current?.slideTo(index);
                        }}
                        sx={{
                          flexShrink: 0,
                          width: 76,
                          height: 76,
                          overflow: "hidden",
                          cursor: "pointer",
                          border:
                            selectedImageIndex === index
                              ? `4px solid ${ma.orange}`
                              : `3px solid ${ma.ink}`,
                          borderRadius: 0,
                          opacity: selectedImageIndex === index ? 1 : 0.75,
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Box
                          component="img"
                          src={imagePath}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/icons/noimage-list.svg";
                          }}
                          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: 0, pt: { xs: 0, md: 0.5 } }}>
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: serif,
                        fontWeight: 900,
                        fontStyle: "italic",
                        fontSize: { xs: "2.1rem", md: "2.85rem" },
                        lineHeight: 1.05,
                        color: ma.ink,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {chosenProduct.productName}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: serif,
                        fontStyle: "italic",
                        fontWeight: 900,
                        color: ma.orange,
                        fontSize: { xs: "1.65rem", md: "2rem" },
                        mt: 1,
                      }}
                    >
                      ${chosenProduct.productPrice}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={toggleFavorite}
                    sx={{ border: `4px solid ${ma.ink}`, borderRadius: 0, color: ma.ink }}
                    aria-label="Save"
                  >
                    {isFavorite ? <FavoriteIcon sx={{ color: ma.orange }} /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Rating name="product-rating" value={4.5} precision={0.5} readOnly size="small" />
                  <Typography sx={{ color: ma.muted, fontSize: "0.85rem" }}>(1 review)</Typography>
                </Box>
                <Typography sx={{ color: ma.muted, fontSize: "1.05rem", lineHeight: 1.75, fontWeight: 400 }}>
                  {chosenProduct.productDesc?.trim() ||
                    `A composed cup built for daily ritual — ${chosenProduct.productName.toLowerCase()} with balanced sweetness and a clean finish.`}
                </Typography>
                <Box sx={{ border: `6px solid ${ma.ink}`, p: 3, bgcolor: ma.panel, boxShadow: `6px 6px 0 0 ${ma.ink}` }}>
                  <StatBar label="Sweetness" sub={stats.sweetnessLabel} pct={stats.sweetness} />
                  <StatBar label="Richness" sub={stats.richnessLabel} pct={stats.richness} />
                  <StatBar label="Freshness" sub={stats.freshnessLabel} pct={stats.freshness} />
                  <StatBar label="Energy" sub={stats.energyLabel} pct={stats.energy} />
                </Box>
                <Typography
                  sx={{
                    color: ma.muted,
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                  }}
                >
                  {chosenProduct.productSize} · {chosenProduct.productVolume} ml · {chosenProduct.productLeftCount}{" "}
                  available
                </Typography>
                <Box>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={chosenProduct.productLeftCount === 0}
                    fullWidth
                    disableElevation
                    sx={{
                      borderRadius: 0,
                      bgcolor: ma.orange,
                      color: STITCH_THEME.ink,
                      py: 1.6,
                      fontSize: "0.82rem",
                      fontFamily: sans,
                      fontWeight: 900,
                      fontStyle: "italic",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      border: `6px solid ${ma.ink}`,
                      boxShadow: `8px 8px 0 0 ${ma.ink}`,
                      "&:hover": {
                        bgcolor: STITCH_THEME.primary,
                        color: STITCH_THEME.onPrimary,
                        boxShadow: `6px 6px 0 0 ${ma.ink}`,
                        transform: "translate(2px, 2px)",
                      },
                      "&:disabled": { bgcolor: ma.muted, color: ma.panel, boxShadow: "none" },
                    }}
                  >
                    Add to collection
                  </Button>
                  <Typography sx={{ textAlign: "center", color: ma.muted, mt: 1.25, fontSize: "0.85rem" }}>
                    Ready in ~15 minutes · Roastery schedule
                  </Typography>
                </Box>
                <Box sx={{ border: `6px solid ${ma.ink}`, p: 2, bgcolor: ma.panel, textAlign: "center", boxShadow: `6px 6px 0 0 ${ma.ink}` }}>
                  <Typography
                    sx={{
                      fontFamily: sans,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      color: ma.orange,
                      textTransform: "uppercase",
                    }}
                  >
                    Popular today
                  </Typography>
                  <Typography sx={{ color: ma.muted, fontSize: "0.88rem", mt: 0.75 }}>
                    {(chosenProduct.productViews ?? 0).toLocaleString()} archive views · trending in{" "}
                    {chosenProduct.productCollection || "the roastery"}
                  </Typography>
                </Box>
                {restaurant && (
                  <Card
                    sx={{
                      border: `6px solid ${ma.ink}`,
                      borderRadius: 0,
                      boxShadow: `8px 8px 0 0 ${ma.ink}`,
                      bgcolor: ma.panel,
                      p: 2.25,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 0,
                          border: `4px solid ${ma.ink}`,
                          bgcolor: ma.orange,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontFamily: serif,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        {restaurant?.memberNick?.charAt(0).toUpperCase() || "C"}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.25 }}>
                          <Typography variant="body1" sx={{ fontFamily: serif, fontWeight: 600, color: ma.ink }}>
                            {restaurant?.memberNick}
                          </Typography>
                          <VerifiedIcon sx={{ fontSize: 18, color: ma.orange }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: ma.muted, fontSize: "0.75rem" }}>
                          Verified café
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PhoneIcon sx={{ fontSize: 18, color: ma.orange }} />
                      <Typography
                        variant="body2"
                        component="a"
                        href={`tel:${restaurant?.memberPhone}`}
                        sx={{
                          color: ma.ink,
                          textDecoration: "none",
                          fontWeight: 600,
                          "&:hover": { color: ma.orange, textDecoration: "underline" },
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

          {relatedProducts.length > 0 && (
            <Box sx={{ mt: { xs: 8, md: 10 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    fontFamily: serif,
                    fontWeight: 900,
                    fontStyle: "italic",
                    textTransform: "uppercase",
                    fontSize: { xs: "1.65rem", md: "2rem" },
                    whiteSpace: "nowrap",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Perfect Pairings
                </Typography>
                <Box sx={{ flex: 1, minWidth: 100, height: "1px", bgcolor: ma.ink, opacity: 0.28 }} />
              </Box>
              <Grid container spacing={3}>
                {relatedProducts.slice(0, 4).map((product: Product) => (
                  <Grid item xs={12} md={6} key={product._id}>
                    <Card
                      onClick={() => {
                        setChosenProduct(product);
                        history.push(`/products/${product._id}`);
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        cursor: "pointer",
                        borderRadius: 0,
                        overflow: "hidden",
                        border: `6px solid ${ma.ink}`,
                        boxShadow: `10px 10px 0 0 ${ma.ink}`,
                        bgcolor: ma.panel,
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        "&:hover": {
                          transform: "translate(2px, 2px)",
                          boxShadow: `6px 6px 0 0 ${ma.ink}`,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={
                          product.productImages?.[0]
                            ? `${serverApi}${product.productImages[0]}`
                            : "/icons/noimage-list.svg"
                        }
                        alt=""
                        sx={{
                          width: { xs: "100%", sm: 200 },
                          minHeight: { xs: 200, sm: "auto" },
                          objectFit: "cover",
                        }}
                      />
                      <CardContent sx={{ p: 2.5, flex: 1 }}>
                        <Typography sx={{ fontFamily: serif, fontWeight: 600, fontSize: "1.2rem", mb: 1, color: ma.ink }}>
                          {product.productName}
                        </Typography>
                        <Typography sx={{ color: ma.muted, fontSize: "0.95rem", lineHeight: 1.65 }}>
                          {(product.productDesc && product.productDesc.trim()) ||
                            `Complements ${chosenProduct.productName} — ${product.productCollection || "roastery"} pick with shared sweetness and richness.`}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: serif,
                            fontStyle: "italic",
                            fontWeight: 700,
                            color: ma.orange,
                            mt: 1.5,
                            fontSize: "1.05rem",
                          }}
                        >
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
        </Box>
      </Box>
    </StitchPageShell>
  );
}
















 



