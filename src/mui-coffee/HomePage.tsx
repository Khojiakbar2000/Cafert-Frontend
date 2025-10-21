// @ts-nocheck - Temporary bypass for MUI version conflicts
import React, { useEffect } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Stack,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Favorite, 
  Visibility, 
  LocalCafe,
  Star,
  TrendingUp,
  People,
  Schedule
} from "@mui/icons-material";
import { useState } from "react";

import { Product } from "../lib/types/product";
import ProductService from "../app/services/ProductService";
import { ProductCollection } from "../lib/enums/product.enum";
import MemberService from "../app/services/MemberService";
import { Member } from "../lib/types/member";
import { serverApi } from "../lib/config";
import WaveDivider from '../app/components/WaveDivider';


// Coffee shop theme colors
const coffeeColors = {
  primary: "#8B4513", // Saddle Brown
  secondary: "#D2691E", // Chocolate
  accent: "#DEB887", // Burlywood
  warm: "#F5DEB3", // Wheat
  cream: "#FFF8DC", // Cornsilk
  dark: "#654321", // Dark Brown
  light: "#FDF5E6", // Old Lace
  text: "#2F1B14", // Dark Coffee
  textLight: "#8B7355" // Tan
};

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${coffeeColors.primary} 0%, ${coffeeColors.secondary} 100%)`,
  color: coffeeColors.cream,
  padding: theme.spacing(12, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.3,
    zIndex: 0
  }
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 800,
  margin: '0 auto'
}));

const StatsCard = styled(Card)(({ theme }) => ({
  background: coffeeColors.cream,
  border: `2px solid ${coffeeColors.accent}`,
  borderRadius: 16,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: `0 12px 24px rgba(139, 69, 19, 0.2)`,
    borderColor: coffeeColors.primary
  }
}));

const ProductCard = styled(Card)(({ theme }) => ({
  background: coffeeColors.light,
  border: `2px solid ${coffeeColors.accent}`,
  borderRadius: 20,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  cursor: 'pointer',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    background: 'linear-gradient(45deg, rgba(230, 126, 34, 0.1), rgba(52, 152, 219, 0.1))',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    transition: 'left 0.5s ease',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'scale(1.05) translateY(-8px)',
    boxShadow: `
      0 20px 40px rgba(139, 69, 19, 0.25),
      0 0 0 1px rgba(230, 126, 34, 0.3),
      0 0 20px rgba(230, 126, 34, 0.4),
      0 0 40px rgba(230, 126, 34, 0.2)
    `,
    border: `2px solid rgba(230, 126, 34, 0.8)`,
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      left: '100%',
    },
    '& .MuiCardMedia-root': {
      transform: 'scale(1.08)',
      filter: 'brightness(1.1) contrast(1.05)',
    },
    '& .product-title': {
      color: coffeeColors.primary,
      transform: 'translateY(-2px)',
    },
    '& .product-price': {
      color: coffeeColors.primary,
      transform: 'scale(1.1)',
    }
  }
}));

const FeaturedProductCard = styled(Card)(({ theme }) => ({
  background: coffeeColors.light,
  border: `3px solid ${coffeeColors.primary}`,
  borderRadius: 20,
  overflow: 'hidden',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  cursor: 'pointer',
  animation: 'featuredGlow 3s ease-in-out infinite',
  '@keyframes featuredGlow': {
    '0%, 100%': {
      boxShadow: `
        0 0 0 2px rgba(139, 69, 19, 0.3),
        0 0 20px rgba(139, 69, 19, 0.2),
        0 0 40px rgba(139, 69, 19, 0.1)
      `,
    },
    '50%': {
      boxShadow: `
        0 0 0 3px rgba(139, 69, 19, 0.5),
        0 0 30px rgba(139, 69, 19, 0.4),
        0 0 60px rgba(139, 69, 19, 0.2)
      `,
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
    background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.15), rgba(230, 126, 34, 0.15))',
    opacity: 0,
    transition: 'opacity 0.4s ease',
    zIndex: 1,
    pointerEvents: 'none',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
    transition: 'left 0.6s ease',
    zIndex: 2,
    pointerEvents: 'none',
  },
  '&:hover': {
    transform: 'scale(1.08) translateY(-12px)',
    animation: 'none',
    boxShadow: `
      0 25px 50px rgba(139, 69, 19, 0.3),
      0 0 0 3px rgba(139, 69, 19, 0.6),
      0 0 30px rgba(139, 69, 19, 0.5),
      0 0 60px rgba(139, 69, 19, 0.3)
    `,
    border: `3px solid rgba(139, 69, 19, 0.9)`,
    '&::before': {
      opacity: 1,
    },
    '&::after': {
      left: '100%',
    },
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
      filter: 'brightness(1.15) contrast(1.1)',
    },
    '& .product-title': {
      color: coffeeColors.primary,
      transform: 'translateY(-3px)',
    },
    '& .product-price': {
      color: coffeeColors.primary,
      transform: 'scale(1.15)',
    },
    '& .featured-badge': {
      transform: 'scale(1.1) rotate(5deg)',
    }
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: coffeeColors.text,
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 60,
    height: 3,
    background: coffeeColors.primary,
    borderRadius: 2
  }
}));

const CoffeeIcon = styled(LocalCafe)(({ theme }) => ({
  color: coffeeColors.primary,
  fontSize: 32
}));

// Flexbox Grid replacements
const GridContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(4),
  margin: 0,
  padding: 0,
  listStyle: 'none'
}));

const GridItem = styled(Box)<{ xs?: number; sm?: number; md?: number }>(({ theme, xs = 12, sm, md }) => ({
  flex: `0 0 ${(xs / 12) * 100}%`,
  maxWidth: `${(xs / 12) * 100}%`,
  padding: theme.spacing(1),
  [theme.breakpoints.up('sm')]: sm && {
    flex: `0 0 ${(sm / 12) * 100}%`,
    maxWidth: `${(sm / 12) * 100}%`
  },
  [theme.breakpoints.up('md')]: md && {
    flex: `0 0 ${(md / 12) * 100}%`,
    maxWidth: `${(md / 12) * 100}%`
  }
}));

export default function CoffeeHomePage() {
  const [popularDishes, setPopularDishes] = useState<Product[]>([]);
  const [newDishes, setNewDishes] = useState<Product[]>([]);
  const [topUsers, setTopUsers] = useState<Member[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    // Backend server data fetch => Data
    const product = new ProductService();
    product
      .getProducts({
        page: 1,
        limit: 4,
        order: "productViews",
        productCollection: ProductCollection.DISH
      })
      .then(data => {
        setPopularDishes(data);
      })
      .catch(err => console.log(err));

    product.getProducts({
      page: 1,
      limit: 4,
      order: "createdAt",
      productCollection: ProductCollection.DISH
    })
      .then(data => {
        setNewDishes(data);
      })
      .catch(err => console.log(err));

    const member = new MemberService();
    member.getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.log(err));
  }, []);

  const stats = [
    { number: "12", label: "Years of Excellence", icon: <Star /> },
    { number: "8", label: "Expert Baristas", icon: <LocalCafe /> },
    { number: "50+", label: "Coffee Varieties", icon: <TrendingUp /> },
    { number: "200+", label: "Happy Customers", icon: <People /> }
  ];

  return (
    <Box sx={{ background: coffeeColors.light, minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <HeroContent>
            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontWeight: 800,
                marginBottom: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Brew & Bean
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                marginBottom: 4,
                opacity: 0.9,
                fontWeight: 300
              }}
            >
              Where Every Cup Tells a Story
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.2rem',
                opacity: 0.8,
                maxWidth: 600,
                margin: '0 auto'
              }}
            >
              Experience the perfect blend of tradition and innovation in every sip. 
              From artisanal espresso to handcrafted lattes, discover coffee that awakens your senses.
            </Typography>
          </HeroContent>
        </Container>
      </HeroSection>

      <WaveDivider />

      {/* Statistics Section */}
      <Box sx={{ py: 8, background: coffeeColors.cream }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3" sx={{ marginBottom: 6 }}>
            Our Coffee Journey
          </SectionTitle>
          <GridContainer>
            {stats.map((stat, index) => (
              <GridItem key={index} xs={6} md={3}>
                <StatsCard>
                  <CardContent sx={{ py: 4 }}>
                    <Box sx={{ color: coffeeColors.primary, mb: 2 }}>
                      {stat.icon}
                    </Box>
                    <Typography 
                      variant="h2" 
                      sx={{ 
                        color: coffeeColors.primary,
                        fontWeight: 800,
                        fontSize: '2.5rem'
                      }}
                    >
                      {stat.number}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: coffeeColors.textLight,
                        fontWeight: 500
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </CardContent>
                </StatsCard>
              </GridItem>
            ))}
          </GridContainer>
        </Container>
      </Box>

      <WaveDivider />

      {/* Popular Coffee Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3">
            Most Loved Brews
          </SectionTitle>
          <GridContainer>
            {popularDishes.length !== 0 ? (
              popularDishes.map((product: Product, index: number) => {
                const imagePath = `${serverApi}${product.productImages[0]}`;
                const isFeatured = index === 0;
                const CardComponent = isFeatured ? FeaturedProductCard : ProductCard;
                return (
                  <GridItem key={product._id} xs={12} sm={6} md={3}>
                    <CardComponent>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia 
                          component="img" 
                          image={imagePath} 
                          alt={product.productName}
                          sx={{ height: 200 }}
                          onError={(e) => {
                            console.error('Image failed to load:', imagePath);
                            e.target.src = '/coffee-placeholder.jpg';
                          }}
                          onLoad={() => console.log('Image loaded successfully:', imagePath)}
                        />
                        {isFeatured && (
                          <Chip 
                            label="FEATURED"
                            size="small"
                            className="featured-badge"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              background: coffeeColors.primary,
                              color: coffeeColors.cream,
                              fontWeight: 600,
                              transition: 'all 0.4s ease'
                            }}
                          />
                        )}
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                                  <Typography 
                          variant="h6" 
                          className="product-title"
                          sx={{ 
                            color: coffeeColors.text,
                            fontWeight: 600,
                            transition: 'all 0.4s ease'
                          }}
                        >
                          {product.productName}
                        </Typography>
                          <Chip 
                            icon={<Visibility />} 
                            label={product.productViews}
                            size="small"
                            sx={{ 
                              background: coffeeColors.accent,
                              color: coffeeColors.text
                            }}
                          />
                        </Stack>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: coffeeColors.textLight,
                            mb: 2,
                            lineHeight: 1.6
                          }}
                        >
                          {product.productDesc}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography 
                            variant="h6" 
                            className="product-price"
                            sx={{ 
                              color: coffeeColors.primary,
                              fontWeight: 700,
                              transition: 'all 0.4s ease'
                            }}
                          >
                            ${product.productPrice}
                          </Typography>
                          <IconButton 
                            size="small"
                            sx={{ color: coffeeColors.primary }}
                          >
                            <Favorite />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </CardComponent>
                  </GridItem>
                );
              })
            ) : (
              <GridItem xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CoffeeIcon sx={{ fontSize: 64, color: coffeeColors.textLight, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: coffeeColors.textLight }}>
                    Popular coffee selections are brewing...
                  </Typography>
                </Box>
              </GridItem>
            )}
          </GridContainer>
        </Container>
      </Box>

      <WaveDivider />

      {/* New Arrivals Section */}
      <Box sx={{ py: 8, background: coffeeColors.cream }}>
        <Container maxWidth="lg">
          <SectionTitle variant="h3">
            Fresh from the Roaster
          </SectionTitle>
          <GridContainer>
            {newDishes.length !== 0 ? (
              newDishes.map((product: Product) => {
                const imagePath = `${serverApi}${product.productImages[0]}`;
                return (
                  <GridItem key={product._id} xs={12} sm={6} md={3}>
                    <ProductCard>
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia 
                          component="img" 
                          image={imagePath} 
                          alt={product.productName}
                          sx={{ height: 200 }}
                          onError={(e) => {
                            console.error('Image failed to load:', imagePath);
                            e.target.src = '/coffee-placeholder.jpg';
                          }}
                          onLoad={() => console.log('Image loaded successfully:', imagePath)}
                        />
                        <Chip 
                          label="NEW"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            background: coffeeColors.primary,
                            color: coffeeColors.cream,
                            fontWeight: 600
                          }}
                        />
                      </Box>
                      <CardContent sx={{ p: 3 }}>
                        <Typography 
                          variant="h6" 
                          className="product-title"
                          sx={{ 
                            color: coffeeColors.text,
                            fontWeight: 600,
                            transition: 'all 0.4s ease',
                            mb: 1
                          }}
                        >
                          {product.productName}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: coffeeColors.textLight,
                            mb: 2,
                            lineHeight: 1.6
                          }}
                        >
                          {product.productDesc}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography 
                            variant="h6" 
                            className="product-price"
                            sx={{ 
                              color: coffeeColors.primary,
                              fontWeight: 700,
                              transition: 'all 0.4s ease'
                            }}
                          >
                            ${product.productPrice}
                          </Typography>
                          <IconButton 
                            size="small"
                            sx={{ color: coffeeColors.primary }}
                          >
                            <Favorite />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </ProductCard>
                  </GridItem>
                );
              })
            ) : (
              <GridItem xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Schedule sx={{ fontSize: 64, color: coffeeColors.textLight, mb: 2 }} />
                  <Typography variant="h6" sx={{ color: coffeeColors.textLight }}>
                    New arrivals coming soon...
                  </Typography>
                </Box>
              </GridItem>
            )}
          </GridContainer>
        </Container>
      </Box>

      <WaveDivider />

      {/* Coffee Experience Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
            <Box sx={{ flex: '1 1 50%', minWidth: 300 }}>
              <Box sx={{ pr: { md: 4 } }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: coffeeColors.text,
                    fontWeight: 700,
                    mb: 3
                  }}
                >
                  The Perfect Coffee Experience
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: coffeeColors.textLight,
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    mb: 4
                  }}
                >
                  Every cup of coffee we serve is a testament to our passion for quality. 
                  From the carefully selected beans to the precise brewing techniques, 
                  we ensure that every sip delivers an unforgettable experience.
                </Typography>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  <Chip 
                    label="Artisanal Roasting"
                    sx={{ 
                      background: coffeeColors.accent,
                      color: coffeeColors.text,
                      fontWeight: 500
                    }}
                  />
                  <Chip 
                    label="Premium Beans"
                    sx={{ 
                      background: coffeeColors.accent,
                      color: coffeeColors.text,
                      fontWeight: 500
                    }}
                  />
                  <Chip 
                    label="Expert Baristas"
                    sx={{ 
                      background: coffeeColors.accent,
                      color: coffeeColors.text,
                      fontWeight: 500
                    }}
                  />
                </Stack>
              </Box>
            </Box>
            <Box sx={{ flex: '1 1 50%', minWidth: 300 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Coffee Experience"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 4,
                  boxShadow: `0 8px 32px rgba(139, 69, 19, 0.2)`
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      
    </Box>
  );
} 