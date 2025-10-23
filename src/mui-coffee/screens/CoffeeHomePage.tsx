import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  AppBar,
  Toolbar,
  Avatar,
  Dialog,
  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Home as HomeIcon,
  LocalCafe as CoffeeIcon,
  Help as HelpIcon,
  Star as StarIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Restaurant as RestaurantIcon,
  Coffee as CafeIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { useGlobals } from '../../app/hooks/useGlobals';
import ActivityService from '../../app/services/ActivityService';
import ProductService from '../../app/services/ProductService';
import MemberService from '../../app/services/MemberService';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import HeroSection from '../../app/components/HeroSection';
import NewsletterSubscription from '../components/NewsletterSubscription';
import FloatingStyleSwitcher from '../components/FloatingStyleSwitcher';
import StorytellingTimeline from '../components/StorytellingTimeline';
import { coffeeShopTimelineData } from '../components/TimelineData';
import { Product } from '../../lib/types/product';
import { UserActivity, RecentActivity, ActiveUsersStats } from '../../app/services/ActivityService';
import { serverApi } from '../../lib/config';

interface CoffeeHomePageProps {
  setSignupOpen?: (isOpen: boolean) => void;
  setLoginOpen?: (isOpen: boolean) => void;
}

const CoffeeHomePage: React.FC<CoffeeHomePageProps> = ({ 
  setSignupOpen, 
  setLoginOpen 
}: CoffeeHomePageProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme, colors } = useThemeContext();
  const { authMember, setAuthMember } = useGlobals();
  const [activeMenuTab, setActiveMenuTab] = useState('popular-coffees');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationForm, setReservationForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    specialRequests: ''
  });
  
  // New state for real products
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New state for real active users data
  const [userProfiles, setUserProfiles] = useState<UserActivity[]>([]);
  const [activeUsersStats, setActiveUsersStats] = useState<ActiveUsersStats>({
    totalActive: 0,
    onlineUsers: 0,
    recentJoiners: 0
  });
  
  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  
  // Mobile menu state
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Force re-render when language changes
  const currentLanguage = i18n.language;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      const memberService = new MemberService();
      await memberService.logout();
      setAuthMember(null);
      // Optionally redirect to home or show success message
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear the auth state even if API call fails
      setAuthMember(null);
      localStorage.removeItem('memberData');
      window.location.href = '/';
    }
  };

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productService = new ProductService();
        
        // Fetch popular products (by views) - backend handles sorting
        const popularData = await productService.getProducts({
          page: 1,
          limit: 6,
          order: "productViews" // Backend sorts by views
        });
        
        // Fetch fresh products (by creation date) - backend handles sorting
        const freshData = await productService.getProducts({
          page: 1,
          limit: 6,
          order: "createdAt" // Backend sorts by creation date
        });
        
        setPopularProducts(popularData);
        setFreshProducts(freshData);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty arrays if API fails
        setPopularProducts([]);
        setFreshProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Transform backend products to frontend format
  const transformProduct = (product: Product, isPopular: boolean = false, isFresh: boolean = false) => {
    // Use your beautiful coffee images as fallbacks
    const coffeeImages = [
      '/img/coffee/coffee-1.webp',
      '/img/coffee/coffee-2.webp', 
      '/img/coffee/coffee-3.webp',
      '/img/coffee/coffee-4.webp',
      '/img/coffee/coffee-latte.jpg',
      '/img/coffee/coffee-espresso.jpg'
    ];
    
    const foodImages = [
      '/img/food/kebab.webp',
      '/img/food/lavash.webp',
      '/img/food/cutlet.webp',
      '/img/food/doner.webp',
      '/img/food/seafood.webp',
      '/img/food/sweets.webp'
    ];
    
    const fallbackImage = isPopular 
      ? coffeeImages[Math.floor(Math.random() * coffeeImages.length)]
      : foodImages[Math.floor(Math.random() * foodImages.length)];
    
    return {
      id: product._id,
      name: product.productName,
      price: `$${product.productPrice}`,
      image: product.productImages?.[0] ? `${serverApi}${product.productImages[0]}` : fallbackImage,
      description: product.productDesc || 'Delicious product from our menu',
      ingredients: 'Fresh ingredients',
      rating: 4.5 + (Math.random() * 0.5), // Random rating between 4.5-5.0
      orders: product.productViews || Math.floor(Math.random() * 1000) + 100,
      isPopular: isPopular,
      isNew: isFresh,
      views: product.productViews || 0,
      createdAt: product.createdAt
    };
  };

  // Dynamic menu items based on real data
  const menuItems = {
    'popular-coffees': popularProducts.map(product => transformProduct(product, true, false)),
    'fresh-menu': freshProducts.map(product => transformProduct(product, false, true))
  };

  // Fallback menu items if no data is available - using your beautiful coffee images
  const fallbackMenuItems = {
    'popular-coffees': [
      { 
        id: 1, 
        name: 'Classic Espresso', 
        price: '$3.50', 
        image: '/img/coffee/coffee-1.webp', 
        description: 'Rich and bold Italian espresso with perfect crema', 
        ingredients: 'Premium Arabica beans, filtered water',
        rating: 4.9,
        orders: 1250,
        isPopular: true
      },
      { 
        id: 2, 
        name: 'Cappuccino Deluxe', 
        price: '$4.80', 
        image: '/img/coffee/coffee-2.webp', 
        description: 'Perfectly balanced with velvety steamed milk and rich foam', 
        ingredients: 'Espresso, whole milk, microfoam',
        rating: 4.8,
        orders: 980,
        isPopular: true
      },
      { 
        id: 3, 
        name: 'Caramel Latte', 
        price: '$5.20', 
        image: '/img/coffee/coffee-3.webp', 
        description: 'Smooth espresso with caramel and steamed milk', 
        ingredients: 'Espresso, caramel syrup, steamed milk',
        rating: 4.7,
        orders: 856,
        isPopular: true
      },
      { 
        id: 4, 
        name: 'Mocha Delight', 
        price: '$5.50', 
        image: '/img/coffee/coffee-4.webp', 
        description: 'Rich chocolate and espresso blend with steamed milk', 
        ingredients: 'Espresso, chocolate syrup, steamed milk, whipped cream',
        rating: 4.6,
        orders: 720,
        isPopular: true
      },
      { 
        id: 5, 
        name: 'Vanilla Latte', 
        price: '$4.90', 
        image: '/coffee-latte.jpg', 
        description: 'Smooth vanilla-infused latte with perfect foam', 
        ingredients: 'Espresso, vanilla syrup, steamed milk, microfoam',
        rating: 4.8,
        orders: 890,
        isPopular: true
      },
      { 
        id: 6, 
        name: 'Americano Classic', 
        price: '$3.80', 
        image: '/coffee-espresso.jpg', 
        description: 'Bold espresso with hot water for a clean, strong taste', 
        ingredients: 'Espresso, hot water',
        rating: 4.7,
        orders: 650,
        isPopular: true
      }
    ],
    'fresh-menu': [
      { 
        id: 7, 
        name: 'Gourmet Kebab Plate', 
        price: '$18.50', 
        image: '/img/kebab.webp', 
        description: 'Fresh kebab with premium meat and authentic spices', 
        ingredients: 'Premium lamb, fresh vegetables, authentic spices, pita bread',
        rating: 4.9,
        orders: 520,
        isNew: true
      },
      { 
        id: 8, 
        name: 'Lavash Wrap Deluxe', 
        price: '$16.00', 
        image: '/img/lavash.webp', 
        description: 'Fresh lavash wrap with tender meat and vegetables', 
        ingredients: 'Lavash bread, tender meat, fresh vegetables, special sauce',
        rating: 4.8,
        orders: 480,
        isNew: true
      },
      { 
        id: 9, 
        name: 'Cutlet Special', 
        price: '$19.50', 
        image: '/img/cutlet.webp', 
        description: 'Crispy cutlet with golden breading and tender meat', 
        ingredients: 'Premium meat, golden breading, fresh herbs, special seasoning',
        rating: 4.7,
        orders: 420,
        isNew: true
      },
      { 
        id: 10, 
        name: 'Fresh Doner', 
        price: '$15.00', 
        image: '/img/doner.webp', 
        description: 'Traditional doner with authentic preparation', 
        ingredients: 'Marinated meat, fresh vegetables, traditional spices',
        rating: 4.8,
        orders: 380,
        isNew: true
      },
      { 
        id: 11, 
        name: 'Seafood Delight', 
        price: '$22.00', 
        image: '/img/seafood.webp', 
        description: 'Fresh seafood selection with premium quality', 
        ingredients: 'Fresh seafood, herbs, lemon, special sauce',
        rating: 4.9,
        orders: 320,
        isNew: true
      },
      { 
        id: 12, 
        name: 'Sweet Treats', 
        price: '$8.50', 
        image: '/img/sweets.webp', 
        description: 'Delicious sweet treats and desserts', 
        ingredients: 'Premium ingredients, fresh preparation, special recipes',
        rating: 4.8,
        orders: 280,
        isNew: true
      }
    ]
  };

  // Use real data if available, otherwise use fallback
  const currentMenuItems = {
    'popular-coffees': menuItems['popular-coffees'].length > 0 ? menuItems['popular-coffees'] : fallbackMenuItems['popular-coffees'],
    'fresh-menu': menuItems['fresh-menu'].length > 0 ? menuItems['fresh-menu'] : fallbackMenuItems['fresh-menu']
  };

  // Dynamic testimonials using active users data when available
  const testimonials = userProfiles.length > 0 ? userProfiles.slice(0, 4).map((user, index) => ({
    id: index + 1,
    text: [
      "The best coffee I've ever tasted! The atmosphere is perfect for working and the staff is incredibly friendly.",
      "Amazing food and coffee. This place has become my go-to spot for meetings and casual dining.",
      "Perfect blend of comfort and quality. The pastries are to die for and the coffee is consistently excellent.",
      "Exceptional service and the most delicious coffee in town. I love the cozy atmosphere!"
    ][index],
    author: user.name || `User ${index + 1}`,
    rating: 5,
    avatar: user.avatar || `/img/food/rose.webp`
  })) : [
    {
      id: 1,
      text: "The best coffee I've ever tasted! The atmosphere is perfect for working and the staff is incredibly friendly.",
      author: "Sarah Johnson",
      rating: 5,
      avatar: "/img/food/rose.webp"
    },
    {
      id: 2,
      text: "Amazing food and coffee. This place has become my go-to spot for meetings and casual dining.",
      author: "Michael Chen",
      rating: 5,
      avatar: "/img/food/martin.webp"
    },
    {
      id: 3,
      text: "Perfect blend of comfort and quality. The pastries are to die for and the coffee is consistently excellent.",
      author: "Emily Rodriguez",
      rating: 5,
      avatar: "/img/food/justin.webp"
    },
    {
      id: 4,
      text: "Exceptional service and the most delicious coffee in town. I love the cozy atmosphere!",
      author: "Nusret Gökçe",
      rating: 5,
      avatar: "/img/food/nusret.webp"
    }
  ];

  const services = [
    {
      id: 1,
      title: "Private Events",
      description: "Host your special occasions in our elegant private dining room",
      icon: <RestaurantIcon />,
      image: "/img/coffee/coffee-hero.jpg"
    },
    {
      id: 2,
      title: "Catering Services",
      description: "Let us cater your next event with our delicious menu",
      icon: <CafeIcon />,
      image: "/img/coffee/coffee-gallery.jpg"
    },
    {
      id: 3,
      title: "Coffee Workshops",
      description: "Learn the art of coffee brewing from our expert baristas",
      icon: <CoffeeIcon />,
      image: "/img/coffee/coffee-menu.jpg"
    }
  ];

  // Active users data
  const activityTypes = [
    { type: 'order', icon: <ShoppingCartIcon />, color: colors.accent },
    { type: 'favorite', icon: <FavoriteIcon />, color: '#e91e63' },
    { type: 'view', icon: <VisibilityIcon />, color: '#2196f3' },
    { type: 'join', icon: <PersonIcon />, color: '#4caf50' }
  ];

  const activityMessages = [
    'just ordered a Caramel Macchiato',
    'added Espresso to favorites',
    'is browsing our menu',
    'joined our coffee community',
    'ordered a Cappuccino',
    'liked our Latte Art',
    'is exploring our coffee beans',
    'booked a table for tonight'
  ];

  // Fetch active users and activities from backend
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchActiveUsersData = async () => {
      try {
        const activityService = new ActivityService();
        
        // Fetch active users
        const activeUsersData = await activityService.getActiveUsers();
        if (isMounted) {
          setUserProfiles(activeUsersData);
        }
        
        // Fetch recent activities
        const activitiesData = await activityService.getRecentActivities();
        if (isMounted) {
          setRecentActivities(activitiesData);
        }
        
        // Fetch active users stats
        const statsData = await activityService.getActiveUsersStats();
        if (isMounted) {
          setActiveUsersStats(statsData);
          setActiveUsers(statsData.totalActive);
        }
        
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching active users data:', error);
          // Fallback data is handled in the service
        }
      }
    };

    fetchActiveUsersData();
    
    // Refresh data every 60 seconds instead of 30 to reduce API calls
    const interval = setInterval(fetchActiveUsersData, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
      abortController.abort();
    };
  }, []);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate carousel for active users
  useEffect(() => {
    if (userProfiles.length === 0) return;
    
    const autoRotate = setInterval(() => {
      setCurrentUserIndex((prev) => (prev + 1) % userProfiles.length);
    }, 4000); // Change user every 4 seconds

    return () => clearInterval(autoRotate);
  }, [userProfiles.length]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignup = () => {
    if (setSignupOpen) {
      setSignupOpen(true);
    }
  };

  // Carousel navigation functions
  const nextEvent = () => {
    setCurrentEventIndex((prev) => (prev + 1) % services.length);
  };

  const prevEvent = () => {
    setCurrentEventIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToEvent = (index: number) => {
    setCurrentEventIndex(index);
  };

  const nextUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % userProfiles.length);
  };

  const prevUser = () => {
    setCurrentUserIndex((prev) => (prev - 1 + userProfiles.length) % userProfiles.length);
  };

  const goToUser = (index: number) => {
    setCurrentUserIndex(index);
  };

  const handleReservationOpen = () => {
    setReservationOpen(true);
    setReservationSuccess(false);
    setReservationForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      specialRequests: ''
    });
  };

  const handleReservationClose = () => {
    setReservationOpen(false);
    setReservationSuccess(false);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate reservation submission
    setTimeout(() => {
      setReservationSuccess(true);
      setTimeout(() => {
        setReservationOpen(false);
        setReservationSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleFormChange = (field: string, value: string | number) => {
    setReservationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Track user activity when they perform actions
  const trackUserActivity = async (type: 'order' | 'favorite' | 'view' | 'join', productId?: string) => {
    try {
      const memberData = localStorage.getItem("memberData");
      if (memberData) {
        const member = JSON.parse(memberData);
        const activityService = new ActivityService();
        await activityService.trackUserActivity({
          type,
          productId,
          memberId: member._id
        });
      }
    } catch (error) {
      console.error('Error tracking user activity:', error);
      // Silently fail - don't break user experience
    }
  };

  // Track product view when user clicks on a product
  const handleProductClick = (productId: string) => {
    trackUserActivity('view', productId);
  };

  // Global styles for the page
  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      margin: 0;
      padding: 0;
    }
    
    .scroll-smooth {
      scroll-behavior: smooth;
    }
  `;

  return (
    <Box sx={{
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Global Styles */}
      <style>{globalStyles}</style>



      {/* Header */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(248, 244, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: isDarkMode ? `1px solid ${colors.border}` : '1px solid rgba(107, 79, 79, 0.1)',
        transition: 'all 0.3s ease'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            py: 6
          }}>
            {/* Logo */}
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 600,
                color: isDarkMode ? colors.accent : '#6B4F4F',
                fontSize: { xs: '2rem', md: '2.75rem', lg: '3rem' },
                fontFamily: 'Poppins, sans-serif',
                letterSpacing: '0.5px'
              }}
            >
              Cafert
            </Typography>
            
            {/* Navigation Links */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6,
              mx: 4
            }}>
              <Typography
                variant="body1"
                onClick={scrollToTop}
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    color: isDarkMode ? colors.accent : '#8B6B6B',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(1)',
                      transition: 'transform 0.3s ease'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                {t('navigation.home')}
              </Typography>
              <Typography
                variant="body1"
                onClick={() => window.location.href = '/products'}
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    color: isDarkMode ? colors.accent : '#8B6B6B',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(1)',
                      transition: 'transform 0.3s ease'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                {t('navigation.menu')}
              </Typography>
              {authMember && (
                <Typography
                  variant="body1"
                  onClick={() => window.location.href = '/orders'}
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    color: isDarkMode ? colors.text : '#6B4F4F',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      color: isDarkMode ? colors.accent : '#8B6B6B',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                        transform: 'scaleX(1)',
                        transition: 'transform 0.3s ease'
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  {t('navigation.orders')}
                </Typography>
              )}
              {authMember && (
                <Typography
                  variant="body1"
                  onClick={() => window.location.href = '/user-profile'}
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    color: isDarkMode ? colors.text : '#6B4F4F',
                    cursor: 'pointer',
                    position: 'relative',
                    '&:hover': {
                      color: isDarkMode ? colors.accent : '#8B6B6B',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                        transform: 'scaleX(1)',
                        transition: 'transform 0.3s ease'
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  {t('navigation.profile')}
                </Typography>
              )}
              <Typography
                variant="body1"
                onClick={() => window.location.href = '/help'}
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    color: isDarkMode ? colors.accent : '#8B6B6B',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(1)',
                      transition: 'transform 0.3s ease'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                {t('navigation.about')}
              </Typography>
            </Box>
            
            {/* Stats Button */}
            {authMember && (
              <Typography
                variant="body1"
                onClick={() => window.location.href = '/stats'}
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  cursor: 'pointer',
                  position: 'relative',
                  mr: 4,
                  '&:hover': {
                    color: isDarkMode ? colors.accent : '#8B6B6B',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      transform: 'scaleX(1)',
                      transition: 'transform 0.3s ease'
                    }
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                    transform: 'scaleX(0)',
                    transition: 'transform 0.3s ease'
                  }
                }}
              >
                {t('navigation.analytics')}
              </Typography>
            )}
            
            {/* Right side controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              <LanguageToggle isDarkMode={isDarkMode} />
              
              {/* Show login/signup buttons only when not authenticated */}
              {!authMember ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => setLoginOpen && setLoginOpen(true)}
                    sx={{
                      borderColor: isDarkMode ? colors.accent : '#6B4F4F',
                      color: isDarkMode ? colors.accent : '#6B4F4F',
                      fontWeight: 600,
                      fontSize: '18px',
                      fontFamily: 'Poppins, sans-serif',
                      px: { xs: 3, md: 4 },
                      py: 1.5,
                      borderRadius: '8px',
                      '&:hover': {
                        borderColor: isDarkMode ? colors.accentDark : '#8B6B6B',
                        backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {t('common.login')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSignup}
                    sx={{
                      backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                      color: isDarkMode ? colors.background : '#F8F4F0',
                      fontWeight: 600,
                      fontSize: '20px',
                      fontFamily: 'Poppins, sans-serif',
                      px: { xs: 4, md: 5 },
                      py: 2,
                      borderRadius: '8px',
                      whiteSpace: 'nowrap',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: isDarkMode ? colors.accentDark : '#8B6B6B',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {t('common.signup')}
                  </Button>
                </>
              ) : (
                /* Show user info when authenticated */
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: isDarkMode ? colors.text : '#6B4F4F',
                      fontWeight: 500,
                      fontSize: '16px',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {t('common.welcome')}, {authMember.memberNick || t('common.user')}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      borderColor: isDarkMode ? colors.accent : '#6B4F4F',
                      color: isDarkMode ? colors.accent : '#6B4F4F',
                      fontWeight: 500,
                      fontSize: '14px',
                      fontFamily: 'Poppins, sans-serif',
                      px: 2,
                      py: 1,
                      borderRadius: '8px',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: isDarkMode ? colors.accentDark : '#8B6B6B',
                        backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.05)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {t('navigation.logout')}
                  </Button>
                </Box>
              )}
              {/* Mobile Menu Button */}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: isDarkMode ? colors.text : '#6B4F4F',
                    '&:hover': { 
                      color: isDarkMode ? colors.accent : '#8B6B6B',
                      backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(248, 244, 240, 0.95)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode ? `1px solid ${colors.border}` : '1px solid rgba(107, 79, 79, 0.1)',
          },
        }}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                color: isDarkMode ? colors.accent : '#6B4F4F',
                fontWeight: 700,
                fontStyle: 'italic',
                letterSpacing: '-0.02em',
              }}
            >
              Cafert
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ color: isDarkMode ? colors.text : '#6B4F4F' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List>
            <ListItem
              onClick={() => {
                scrollToTop();
                handleDrawerToggle();
              }}
              sx={{
                color: isDarkMode ? colors.text : '#6B4F4F',
                '&:hover': {
                  backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.home')} />
            </ListItem>
            <ListItem
              onClick={() => {
                window.location.href = '/products';
                handleDrawerToggle();
              }}
              sx={{
                color: isDarkMode ? colors.text : '#6B4F4F',
                '&:hover': {
                  backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <CoffeeIcon />
              </ListItemIcon>
              <ListItemText primary={t('nav.menu')} />
            </ListItem>
            {authMember && (
              <ListItem
                onClick={() => {
                  window.location.href = '/stats';
                  handleDrawerToggle();
                }}
                sx={{
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  '&:hover': {
                    backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  <TrendingUpIcon />
                </ListItemIcon>
                <ListItemText primary={t('navigation.analytics')} />
              </ListItem>
            )}
            <ListItem
              onClick={() => {
                window.location.href = '/help';
                handleDrawerToggle();
              }}
              sx={{
                color: isDarkMode ? colors.text : '#6B4F4F',
                '&:hover': {
                  backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <HelpIcon />
              </ListItemIcon>
              <ListItemText primary={t('navigation.help')} />
            </ListItem>
          </List>

          <Divider sx={{ my: 2, borderColor: isDarkMode ? colors.border : 'rgba(107, 79, 79, 0.2)' }} />

          {/* Mobile Stats Section */}
          <Box sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{
              color: isDarkMode ? colors.accent : '#6B4F4F',
              fontWeight: 600,
              fontSize: '1rem',
              fontFamily: 'Poppins, sans-serif',
              mb: 2,
              textAlign: 'center'
            }}>
              {t('common.communityStats')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              p: 2,
              borderRadius: '8px',
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(107, 79, 79, 0.05)',
              border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(107, 79, 79, 0.1)'}`
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {activeUsersStats.totalActive}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {t('common.active')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {activeUsersStats.onlineUsers}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {t('common.online')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {activeUsersStats.recentJoiners}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
                  fontFamily: 'Poppins, sans-serif'
                }}>
                  {t('common.new')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Show login/signup buttons only when not authenticated */}
          {!authMember ? (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setLoginOpen && setLoginOpen(true);
                    handleDrawerToggle();
                  }}
                  sx={{
                    borderColor: isDarkMode ? colors.accent : '#6B4F4F',
                    color: isDarkMode ? colors.accent : '#6B4F4F',
                    '&:hover': { 
                      borderColor: isDarkMode ? colors.accentDark : '#8B6B6B', 
                      backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.1)' 
                    }
                  }}
                >
                  {t('common.login')}
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    handleSignup();
                    handleDrawerToggle();
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? colors.accent : '#6B4F4F',
                    whiteSpace: 'nowrap',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: isDarkMode ? colors.accentDark : '#8B6B6B' }
                  }}
                >
                  {t('common.signup')}
                </Button>
              </Box>
            </Box>
          ) : (
            /* Show user info when authenticated in mobile drawer */
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? colors.text : '#6B4F4F',
                  fontWeight: 500,
                  fontSize: '16px',
                  fontFamily: 'Poppins, sans-serif',
                  mb: 2
                }}
              >
                {t('common.welcome')}, {authMember.memberNick || t('common.user')}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  handleLogout();
                  handleDrawerToggle();
                }}
                sx={{
                  borderColor: isDarkMode ? colors.accent : '#6B4F4F',
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 500,
                  fontSize: '14px',
                  fontFamily: 'Poppins, sans-serif',
                  px: 3,
                  py: 1,
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: isDarkMode ? colors.accentDark : '#8B6B6B',
                    backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.05)',
                  }
                }}
              >
                {t('navigation.logout')}
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box ref={heroRef}>
        <HeroSection onReservationClick={handleReservationOpen} />
      </Box>

      {/* Storytelling Timeline */}
      <StorytellingTimeline 
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        items={coffeeShopTimelineData}
      />



      {/* Happy Coffee Time Section */}
      <Box sx={{
        padding: '6rem 0',
        backgroundImage: `url('/img/coffee/coffee-beans.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.7)' 
            : 'rgba(255, 255, 255, 0.9)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container alignItems="center" spacing={6}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 1, -1, 0]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Typography variant="overline" sx={{
                    color: colors.accent,
                    fontWeight: 600,
                    letterSpacing: 3,
                    mb: 2,
                    display: 'block',
                    fontSize: '0.9rem',
                    textTransform: 'uppercase'
                  }}>
                    {t('hero.welcome')}
                  </Typography>
                  <Typography variant="h2" sx={{
                    color: colors.text,
                    fontWeight: 700,
                    mb: 3,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                    background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.accent} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {t('hero.happyCoffeeTime')}
                  </Typography>
                  <Typography variant="h5" sx={{
                    color: colors.textSecondary,
                    fontWeight: 400,
                    mb: 4,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.4
                  }}>
                    {t('hero.whereEverySip')}
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: colors.textSecondary,
                    lineHeight: 1.8,
                    mb: 4,
                    fontSize: '1.1rem'
                  }}>
                    {t('hero.experiencePerfect')}
                  </Typography>
                </motion.div>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ 
                  duration: 1.2, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 100,
                  delay: 0.3
                }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 2, -2, 0],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Box
                    component="img"
                    src="/img/coffee/coffee-beans.jpg"
                    alt="Fresh Coffee Beans"
                    sx={{
                      width: '100%',
                      height: 450,
                      objectFit: 'cover',
                      borderRadius: '25px',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 100%)`,
                        borderRadius: '25px',
                        zIndex: 1
                      }
                    }}
                  />
                  {/* Floating coffee beans decoration */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                    style={{
                      position: 'absolute',
                      top: '10%',
                      right: '15%',
                      zIndex: 2
                    }}
                  >
                    <Box
                      component="img"
                      src="/img/coffee/coffee-beans.jpg"
                      alt=""
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        filter: 'blur(1px)',
                        opacity: 0.8
                      }}
                    />
                  </motion.div>
                  <motion.div
                    animate={{ 
                      y: [0, -15, 0],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 2
                    }}
                    style={{
                      position: 'absolute',
                      bottom: '20%',
                      left: '10%',
                      zIndex: 2
                    }}
                  >
                    <Box
                      component="img"
                      src="/img/coffee/coffee-beans.jpg"
                      alt=""
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        filter: 'blur(1px)',
                        opacity: 0.7
                      }}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Menu Section */}
      <Box ref={menuRef} sx={{
        padding: '6rem 0',
        backgroundColor: colors.background,
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: 'block'
            }}>
              our menu
            </Typography>
            <Typography variant="h2" sx={{
              color: colors.text,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              fontFamily: 'Playfair Display, serif'
            }}>
              {t('menu.title')}
            </Typography>
            <Typography variant="h6" sx={{
              color: colors.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              {t('menu.subtitle')}
            </Typography>
          </Box>

          {/* Menu Navigation */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
            <Box sx={{
              display: 'flex',
              backgroundColor: colors.surface,
              borderRadius: '60px',
              padding: '6px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
              border: `1px solid ${colors.border}`
            }}>
              {[
                { key: 'popular-coffees', label: t('menu.popular'), icon: '🔥' },
                { key: 'fresh-menu', label: t('menu.fresh'), icon: '✨' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  onClick={() => setActiveMenuTab(tab.key)}
                  sx={{
                    borderRadius: '50px',
                    px: 6,
                    py: 2,
                    textTransform: 'none',
                    fontSize: { xs: '0.9rem', md: '1.1rem' },
                    fontWeight: 600,
                    backgroundColor: activeMenuTab === tab.key ? colors.accent : 'transparent',
                    color: activeMenuTab === tab.key ? colors.background : colors.textSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    '&:hover': {
                      backgroundColor: activeMenuTab === tab.key ? colors.accentDark : colors.surface,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                  {tab.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Menu Items Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {currentMenuItems[activeMenuTab as keyof typeof currentMenuItems].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card sx={{
                  height: '100%',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  backgroundColor: colors.surface,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'translateY(-8px) scale(1.02)'
                  }
                }}
                onClick={() => handleProductClick(item.id)}
                >
                  {/* Popular/New Badge */}
                  {(item.isPopular || item.isNew) && (
                    <Box sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 2,
                      backgroundColor: item.isPopular ? '#FF6B35' : '#4CAF50',
                      color: 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      {item.isPopular ? `🔥 ${t('common.popular')}` : `✨ ${t('common.new')}`}
                    </Box>
                  )}

                  {/* Image Container */}
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.image}
                      alt={item.name}
                      sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', item.image);
                        (e.target as HTMLImageElement).src = '/img/coffee/coffee-placeholder.jpg';
                      }}
                      onLoad={() => console.log('Image loaded successfully:', item.image)}
                    />
                    {/* Gradient Overlay */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.3))',
                      pointerEvents: 'none'
                    }} />
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    {/* Header with Rating */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: colors.text,
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.1rem',
                        lineHeight: 1.3
                      }}>
                        {item.name}
                      </Typography>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 700, 
                        color: colors.accent,
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.2rem'
                      }}>
                        {item.price}
                      </Typography>
                    </Box>



                    {/* Description */}
                    <Typography variant="body2" sx={{ 
                      color: colors.textSecondary, 
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}>
                      {item.description}
                    </Typography>

                    {/* Ingredients */}
                    <Box sx={{
                      backgroundColor: colors.background,
                      borderRadius: '12px',
                      p: 2,
                      border: `1px solid ${colors.border}`
                    }}>
                      <Typography variant="caption" sx={{ 
                        color: colors.textSecondary,
                        fontStyle: 'italic',
                        fontSize: '0.85rem',
                        display: 'block',
                        lineHeight: 1.4
                      }}>
                        <strong>Ingredients:</strong> {item.ingredients}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Services Section */}
      <Box ref={servicesRef} sx={{
        padding: '6rem 0',
        backgroundImage: `url('/img/misc/night-mode.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.6)' 
            : 'rgba(255, 255, 255, 0.85)',
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: 'block'
            }}>
              our services
            </Typography>
            <Typography variant="h2" sx={{
              color: colors.text,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              fontFamily: 'Playfair Display, serif'
            }}>
              We Hold Events
            </Typography>
            <Typography variant="h6" sx={{
              color: colors.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              From intimate gatherings to corporate events, we provide exceptional service
            </Typography>
          </Box>

          {/* Events Carousel */}
          <Box sx={{ position: 'relative', mb: 4 }}>
            {/* Carousel Container */}
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: 500
            }}>
              {/* Navigation Arrows */}
              <IconButton
                onClick={prevEvent}
                sx={{
                  position: 'absolute',
                  left: { xs: 10, md: -60 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: colors.accent,
                  color: colors.background,
                  width: 50,
                  height: 50,
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: colors.accentDark,
                    transform: 'translateY(-50%) scale(1.1)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                <ArrowLeftIcon />
              </IconButton>

              <IconButton
                onClick={nextEvent}
                sx={{
                  position: 'absolute',
                  right: { xs: 10, md: -60 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: colors.accent,
                  color: colors.background,
                  width: 50,
                  height: 50,
                  zIndex: 3,
                  '&:hover': {
                    backgroundColor: colors.accentDark,
                    transform: 'translateY(-50%) scale(1.1)'
                  },
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}
              >
                <ArrowRightIcon />
              </IconButton>

              {/* Carousel Cards */}
              <Box sx={{
                display: 'flex',
                gap: 3,
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: '100%'
              }}>
                {services.map((service, index) => {
                  const isActive = index === currentEventIndex;
                  const isPrev = index === (currentEventIndex - 1 + services.length) % services.length;
                  const isNext = index === (currentEventIndex + 1) % services.length;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: isActive ? 1 : (isPrev || isNext) ? 0.7 : 0.3,
                        scale: isActive ? 1 : (isPrev || isNext) ? 0.9 : 0.7,
                        x: isActive ? 0 : isPrev ? -100 : isNext ? 100 : 0,
                        zIndex: isActive ? 2 : 1
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      style={{
                        position: 'relative',
                        cursor: isActive ? 'default' : 'pointer'
                      }}
                      onClick={() => !isActive && goToEvent(index)}
                    >
                      <Card sx={{
                        width: { xs: 280, sm: 320, md: 350 },
                        height: 450,
                        borderRadius: '25px',
                        overflow: 'hidden',
                        boxShadow: isActive 
                          ? '0 20px 40px rgba(0,0,0,0.25)' 
                          : '0 8px 20px rgba(0,0,0,0.15)',
                        transition: 'all 0.4s ease',
                        backgroundColor: colors.surface,
                        border: isActive ? `2px solid ${colors.accent}` : 'none',
                        transform: isActive ? 'translateY(-10px)' : 'translateY(0)',
                        '&:hover': {
                          transform: isActive ? 'translateY(-15px)' : 'translateY(-5px)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
                        }
                      }}>
                        {/* Event Badge */}
                        <Box sx={{
                          position: 'absolute',
                          top: 16,
                          left: 16,
                          zIndex: 2,
                          backgroundColor: colors.accent,
                          color: colors.background,
                          px: 2,
                          py: 0.5,
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                        }}>
                          Event {index + 1}
                        </Box>

                        {/* Image Container */}
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            height="220"
                            image={service.image}
                            alt={service.title}
                            sx={{ 
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          />
                          {/* Gradient Overlay */}
                          <Box sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '60px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.4))',
                            pointerEvents: 'none'
                          }} />
                        </Box>

                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
                          {/* Icon */}
                          <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            mb: 3
                          }}>
                            <Box sx={{
                              width: 70,
                              height: 70,
                              borderRadius: '50%',
                              backgroundColor: colors.accent,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.background,
                              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'scale(1.1) rotate(5deg)'
                              }
                            }}>
                              {service.icon}
                            </Box>
                          </Box>

                          {/* Title */}
                          <Typography variant="h5" sx={{
                            fontWeight: 700,
                            color: colors.text,
                            mb: 2,
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '1.3rem',
                            lineHeight: 1.2
                          }}>
                            {service.title}
                          </Typography>

                          {/* Description */}
                          <Typography variant="body1" sx={{
                            color: colors.textSecondary,
                            lineHeight: 1.6,
                            fontSize: '0.95rem',
                            mb: 3
                          }}>
                            {service.description}
                          </Typography>

                          {/* CTA Button */}
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: colors.accent,
                              color: colors.background,
                              fontWeight: 600,
                              px: 3,
                              py: 1.5,
                              borderRadius: '25px',
                              textTransform: 'none',
                              fontSize: '0.9rem',
                              '&:hover': {
                                backgroundColor: colors.accentDark,
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </Box>
            </Box>

            {/* Carousel Indicators */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 4
            }}>
              {services.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => goToEvent(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentEventIndex ? colors.accent : colors.border,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: colors.accent,
                      transform: 'scale(1.2)'
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box ref={testimonialsRef} sx={{
        padding: '6rem 0',
        backgroundColor: colors.background,
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: 'block'
            }}>
              testimonials
            </Typography>
            <Typography variant="h2" sx={{
              color: colors.text,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              fontFamily: 'Playfair Display, serif'
            }}>
              What They Say About Us
            </Typography>
            <Typography variant="h6" sx={{
              color: colors.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Real experiences from coffee lovers who visit our cafe
            </Typography>
          </Box>

          {/* Enhanced Testimonials Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4,
            position: 'relative'
          }}>
            {/* Background Decorative Elements */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.accent}20 0%, transparent 100%)`,
              zIndex: 0
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -30,
              right: -30,
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colors.accent}15 0%, transparent 100%)`,
              zIndex: 0
            }} />

            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card sx={{
                  height: '100%',
                  borderRadius: '30px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                  backgroundColor: colors.surface,
                  transition: 'all 0.4s ease',
                  position: 'relative',
                  border: `1px solid ${colors.border}`,
                  '&:hover': {
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
                    transform: 'translateY(-8px) scale(1.02)'
                  }
                }}>
                  {/* Quote Icon */}
                  <Box sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.background,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    zIndex: 2
                  }}>
                    "
                  </Box>

                  {/* Gradient Background */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '120px',
                    background: `linear-gradient(135deg, ${colors.accent}10 0%, ${colors.accent}05 100%)`,
                    zIndex: 1
                  }} />

                  <CardContent sx={{ 
                    p: 4, 
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}>
                    {/* Rating Stars */}
                    <Box sx={{ 
                      display: 'flex', 
                      mb: 3,
                      justifyContent: 'center'
                    }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ 
                            duration: 0.5, 
                            delay: index * 0.2 + i * 0.1,
                            type: "spring",
                            stiffness: 200
                          }}
                        >
                          <StarIcon sx={{ 
                            color: '#FFD700', 
                            fontSize: '1.4rem',
                            filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))'
                          }} />
                        </motion.div>
                      ))}
                    </Box>

                    {/* Testimonial Text */}
                    <Typography variant="body1" sx={{
                      color: colors.text,
                      mb: 4,
                      fontStyle: 'italic',
                      lineHeight: 1.8,
                      fontSize: '1.05rem',
                      textAlign: 'center',
                      flexGrow: 1,
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 60,
                        height: 2,
                        backgroundColor: colors.accent,
                        borderRadius: 1
                      }
                    }}>
                      "{testimonial.text}"
                    </Typography>

                    {/* Author Section */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 'auto'
                    }}>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.5, 
                          delay: index * 0.2 + 0.5,
                          type: "spring",
                          stiffness: 200
                        }}
                      >
                        <Avatar
                          src={testimonial.avatar}
                          sx={{
                            width: 60,
                            height: 60,
                            border: `3px solid ${colors.accent}`,
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.1) rotate(5deg)'
                            }
                          }}
                        />
                      </motion.div>
                      <Box>
                        <Typography variant="h6" sx={{
                          color: colors.accent,
                          fontWeight: 700,
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.1rem',
                          mb: 0.5
                        }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="caption" sx={{
                          color: colors.textSecondary,
                          fontSize: '0.85rem',
                          fontStyle: 'italic'
                        }}>
                          Verified Customer
                        </Typography>
                      </Box>
                    </Box>

                    {/* Decorative Bottom Element */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentLight} 50%, ${colors.accent} 100%)`,
                      borderRadius: '0 0 30px 30px'
                    }} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          {/* Testimonials Stats */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 6 },
            mt: 6,
            flexWrap: 'wrap'
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, serif',
                  mb: 1
                }}>
                  4.9
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary,
                  fontSize: '0.9rem'
                }}>
                  Average Rating
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, serif',
                  mb: 1
                }}>
                  2,500+
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary,
                  fontSize: '0.9rem'
                }}>
                  Happy Customers
                </Typography>
              </Box>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
            >
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontFamily: 'Playfair Display, serif',
                  mb: 1
                }}>
                  98%
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary,
                  fontSize: '0.9rem'
                }}>
                  Satisfaction Rate
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Image Gallery Section */}
      <Box sx={{
        padding: '6rem 0',
        backgroundColor: colors.surface,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography variant="overline" sx={{
                color: colors.accent,
                fontWeight: 600,
                letterSpacing: 2,
                mb: 2,
                display: 'block'
              }}>
                our gallery
              </Typography>
              <Typography variant="h2" sx={{
                color: colors.text,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Playfair Display, serif'
              }}>
                Visual Stories
              </Typography>
              <Typography variant="h6" sx={{
                color: colors.textSecondary,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Discover the beauty and atmosphere of Cafert through our curated collection
              </Typography>
            </motion.div>
          </Box>

          {/* Gallery Grid */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            {[
              { src: '/img/coffee/coffee-hero.jpg', alt: 'Coffee Hero', title: 'Perfect Brew' },
              { src: '/img/coffee/coffee-shop.jpg', alt: 'Coffee Shop Interior', title: 'Cozy Atmosphere' },
              { src: '/img/cafe/tropical-outdoor-cafe.jpg', alt: 'Outdoor Cafe', title: 'Outdoor Dining' },
              { src: '/img/cafe/istock-cafe.jpg', alt: 'Modern Cafe', title: 'Modern Design' },
              { src: '/img/coffee/coffee-gallery.jpg', alt: 'Coffee Gallery', title: 'Coffee Art' },
              { src: '/img/coffee/coffee-menu.jpg', alt: 'Coffee Menu', title: 'Our Menu' }
            ].map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Box sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  '&:hover': {
                    '& .image-overlay': {
                      opacity: 1
                    },
                    '& .gallery-image': {
                      transform: 'scale(1.1)'
                    }
                  }
                }}>
                  <Box
                    component="img"
                    src={image.src}
                    alt={image.alt}
                    className="gallery-image"
                    sx={{
                      width: '100%',
                      height: { xs: '250px', md: '300px' },
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />
                  <Box
                    className="image-overlay"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    <Typography variant="h6" sx={{
                      color: 'white',
                      fontWeight: 600,
                      textAlign: 'center',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                    }}>
                      {image.title}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Gallery CTA */}
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: colors.accent,
                  color: colors.accent,
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '25px',
                  '&:hover': {
                    borderColor: colors.accentDark,
                    backgroundColor: `${colors.accent}08`,
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                View Full Gallery
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Active Users Section */}
      <Box sx={{
        padding: '6rem 0',
        backgroundColor: colors.background,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          background: `radial-gradient(circle at 20% 80%, ${colors.accent} 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, ${colors.accent} 0%, transparent 50%)`,
          pointerEvents: 'none'
        }} />

        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Typography variant="overline" sx={{
                color: colors.accent,
                fontWeight: 600,
                letterSpacing: 2,
                mb: 2,
                display: 'block'
              }}>
                live activity
              </Typography>
              <Typography variant="h2" sx={{
                color: colors.text,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                mb: 2,
                fontFamily: 'Playfair Display, serif'
              }}>
                {t('home.joinCommunity')}
              </Typography>
              <Typography variant="h6" sx={{
                color: colors.textSecondary,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                {t('home.communityDescription')}
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {/* Active Users Carousel */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Box sx={{
                  p: 6,
                  borderRadius: '24px',
                  background: `linear-gradient(135deg, ${colors.accent}08, ${colors.accent}03)`,
                  border: `1px solid ${colors.accent}20`,
                  position: 'relative',
                  overflow: 'hidden',
                  textAlign: 'center'
                }}>
                  {/* Header */}
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 6,
                    gap: 2
                  }}>
                    <Typography variant="h4" sx={{
                      color: colors.text,
                      fontWeight: 700,
                      fontFamily: 'Playfair Display, serif',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2
                    }}>
                      <Box sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#4caf50',
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                      {t('home.activeUsers')} ({activeUsers})
                    </Typography>
                  </Box>

                  {/* Carousel Container */}
                  <Box sx={{
                    position: 'relative',
                    maxWidth: '600px',
                    mx: 'auto',
                    mb: 4
                  }}>
                    {/* Navigation Arrows */}
                    <IconButton
                      onClick={prevUser}
                      sx={{
                        position: 'absolute',
                        left: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: colors.accent,
                        color: colors.background,
                        width: 50,
                        height: 50,
                        zIndex: 2,
                        '&:hover': {
                          backgroundColor: colors.accentDark,
                          transform: 'translateY(-50%) scale(1.1)'
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <ArrowLeftIcon />
                    </IconButton>

                    <IconButton
                      onClick={nextUser}
                      sx={{
                        position: 'absolute',
                        right: -20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: colors.accent,
                        color: colors.background,
                        width: 50,
                        height: 50,
                        zIndex: 2,
                        '&:hover': {
                          backgroundColor: colors.accentDark,
                          transform: 'translateY(-50%) scale(1.1)'
                        },
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                      }}
                    >
                      <ArrowRightIcon />
                    </IconButton>

                    {/* User Profile Card */}
                    <motion.div
                      key={currentUserIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Box sx={{
                        p: 6,
                        borderRadius: '24px',
                        backgroundColor: colors.surface,
                        border: `2px solid ${colors.border}`,
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        textAlign: 'center',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                          borderColor: colors.accent
                        }
                      }}>
                        {/* Large Profile Picture */}
                        <Box sx={{ 
                          position: 'relative', 
                          display: 'flex', 
                          justifyContent: 'center',
                          mb: 4
                        }}>
                          {userProfiles.length > 0 && userProfiles[currentUserIndex] ? (
                            <>
                              <Box
                                component="img"
                                src={userProfiles[currentUserIndex].avatar}
                                alt={userProfiles[currentUserIndex].name}
                                sx={{
                                  width: 180,
                                  height: 180,
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: `5px solid ${colors.accent}30`,
                                  boxShadow: '0 12px 35px rgba(0,0,0,0.2)',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'scale(1.05)',
                                    borderColor: colors.accent,
                                    boxShadow: '0 16px 45px rgba(0,0,0,0.3)'
                                  }
                                }}
                              />
                              {/* Online Status */}
                              <Box sx={{
                                position: 'absolute',
                                bottom: 20,
                                right: '50%',
                                transform: 'translateX(50%)',
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                border: `4px solid ${colors.surface}`,
                                animation: 'pulse 2s ease-in-out infinite',
                                boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)'
                              }} />
                            </>
                          ) : (
                            // Loading placeholder
                            <Box sx={{
                              width: 180,
                              height: 180,
                              borderRadius: '50%',
                              backgroundColor: colors.border,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: `5px solid ${colors.accent}30`,
                            }}>
                              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                                Loading...
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* User Info */}
                        <Box sx={{ textAlign: 'center' }}>
                          {userProfiles.length > 0 && userProfiles[currentUserIndex] ? (
                            <>
                              <Typography variant="h3" sx={{
                                color: colors.text,
                                fontWeight: 700,
                                fontSize: '1.8rem',
                                mb: 2,
                                fontFamily: 'Playfair Display, serif'
                              }}>
                                {userProfiles[currentUserIndex].name}
                              </Typography>
                              
                              <Typography variant="h6" sx={{
                                color: colors.textSecondary,
                                fontSize: '1.1rem',
                                mb: 3,
                                fontStyle: 'italic'
                              }}>
                                {userProfiles[currentUserIndex].location}
                              </Typography>

                              <Box sx={{
                                backgroundColor: `${colors.accent}15`,
                                borderRadius: '30px',
                                px: 4,
                                py: 2,
                                mb: 3,
                                display: 'inline-block',
                                border: `2px solid ${colors.accent}30`
                              }}>
                                <Typography variant="h6" sx={{
                                  color: colors.accent,
                                  fontSize: '1rem',
                                  fontWeight: 600,
                                  textTransform: 'uppercase',
                                  letterSpacing: '1px'
                                }}>
                                  {userProfiles[currentUserIndex].activity}
                                </Typography>
                              </Box>

                              <Typography variant="body1" sx={{
                                color: colors.textSecondary,
                                fontSize: '1rem',
                                fontWeight: 500,
                                display: 'block'
                              }}>
                                {userProfiles[currentUserIndex].lastActivity}
                              </Typography>
                            </>
                          ) : (
                            // Loading placeholder for user info
                            <Box sx={{ textAlign: 'center' }}>
                              <Typography variant="h3" sx={{
                                color: colors.textSecondary,
                                fontWeight: 700,
                                fontSize: '1.8rem',
                                mb: 2,
                                fontFamily: 'Playfair Display, serif'
                              }}>
                                Loading User...
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Hover Effect Overlay */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '24px',
                          background: `linear-gradient(135deg, ${colors.accent}05, transparent)`,
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          pointerEvents: 'none',
                          '&:hover': {
                            opacity: 1
                          }
                        }} />
                      </Box>
                    </motion.div>
                  </Box>

                  {/* Carousel Indicators */}
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 2,
                    mt: 4
                  }}>
                    {userProfiles.length > 0 ? (
                      userProfiles.map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => goToUser(index)}
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: index === currentUserIndex ? colors.accent : colors.border,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: colors.accent,
                              transform: 'scale(1.2)'
                            }
                          }}
                        />
                      ))
                    ) : (
                      // Loading placeholder for indicators
                      <Box sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: colors.border,
                        animation: 'pulse 2s ease-in-out infinite'
                      }} />
                    )}
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Recent Activities */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Box sx={{
                  p: 4,
                  borderRadius: '20px',
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  <Typography variant="h5" sx={{
                    color: colors.text,
                    fontWeight: 600,
                    mb: 3,
                    fontFamily: 'Playfair Display, serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Box sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: '#4caf50',
                      animation: 'pulse 2s ease-in-out infinite'
                    }} />
                    Recent Activities
                  </Typography>

                  <Box sx={{
                    maxHeight: '400px',
                    overflow: 'hidden'
                  }}>
                    {recentActivities.length > 0 ? (
                      recentActivities.map((activity, index) => {
                        // Map activity type to icon and color
                        const activityType = activityTypes.find(type => type.type === activity.type);
                        const icon = activityType?.icon || <PersonIcon />;
                        const color = activityType?.color || colors.accent;
                        
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                              p: 2,
                              mb: 2,
                              borderRadius: '12px',
                              backgroundColor: colors.background,
                              border: `1px solid ${colors.border}`,
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateX(5px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                borderColor: color
                              }
                            }}>
                              {/* User Avatar */}
                              <Box sx={{ position: 'relative' }}>
                                <Box
                                  component="img"
                                  src={activity.avatar}
                                  alt={activity.name}
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: `2px solid ${colors.border}`
                                  }}
                                />
                                {/* Activity Icon Overlay */}
                                <Box sx={{
                                  position: 'absolute',
                                  bottom: -2,
                                  right: -2,
                                  width: 20,
                                  height: 20,
                                  borderRadius: '50%',
                                  backgroundColor: color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: colors.background,
                                  fontSize: '0.7rem',
                                  border: `2px solid ${colors.background}`
                                }}>
                                  {icon}
                                </Box>
                              </Box>

                              {/* Activity Content */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body1" sx={{
                                  color: colors.text,
                                  fontWeight: 500,
                                  fontSize: '0.95rem',
                                  lineHeight: 1.4
                                }}>
                                  <Box component="span" sx={{
                                    color: colors.accent,
                                    fontWeight: 600
                                  }}>
                                    {activity.name}
                                  </Box>
                                  {' '}{activity.message}
                                </Typography>
                                <Typography variant="caption" sx={{
                                  color: colors.textSecondary,
                                  fontSize: '0.8rem'
                                }}>
                                  {activity.time}
                                </Typography>
                              </Box>

                              {/* Live Indicator */}
                              <Box sx={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                backgroundColor: '#4caf50',
                                animation: 'pulse 2s ease-in-out infinite'
                              }} />
                            </Box>
                          </motion.div>
                        );
                      })
                    ) : (
                      // Loading placeholder for activities
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                        color: colors.textSecondary
                      }}>
                        <Typography variant="body2">
                          Loading recent activities...
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* Join Community CTA */}
                  <Box sx={{
                    textAlign: 'center',
                    mt: 4,
                    pt: 3,
                    borderTop: `1px solid ${colors.border}`
                  }}>
                    <Button
                      variant="outlined"
                      sx={{
                        borderColor: colors.accent,
                        color: colors.accent,
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        borderRadius: '25px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: colors.accent,
                          color: colors.background,
                          transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Join Our Community
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{
        padding: '6rem 0',
        backgroundColor: colors.surface,
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="overline" sx={{
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 2,
              mb: 2,
              display: 'block'
            }}>
              contact us
            </Typography>
            <Typography variant="h2" sx={{
              color: colors.text,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              mb: 2,
              fontFamily: 'Playfair Display, serif'
            }}>
              Book Your Reservation Today
            </Typography>
            <Typography variant="h6" sx={{
              color: colors.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Reserve your table and experience the perfect blend of tradition and innovation
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleReservationOpen}
              sx={{
                backgroundColor: colors.accent,
                color: colors.background,
                fontWeight: 600,
                px: 6,
                py: 2,
                fontSize: '1.1rem',
                '&:hover': {
                  backgroundColor: colors.accentDark,
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Make Reservation
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Reservation Modal */}
      <Dialog
        open={reservationOpen}
        onClose={handleReservationClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: colors.background,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Close Button */}
          <IconButton
            onClick={handleReservationClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
              backgroundColor: colors.surface,
              color: colors.textSecondary,
              '&:hover': {
                backgroundColor: colors.border,
                color: colors.text
              }
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Success Message */}
          {reservationSuccess ? (
            <Box sx={{
              p: 6,
              textAlign: 'center'
            }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
              >
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  color: 'white'
                }}>
                  <CheckCircleIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h4" sx={{
                  color: colors.text,
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Reservation Confirmed!
                </Typography>
                <Typography variant="h6" sx={{
                  color: colors.textSecondary,
                  mb: 3
                }}>
                  Thank you for choosing Cafert. We'll see you soon!
                </Typography>
                <Typography variant="body1" sx={{
                  color: colors.textSecondary,
                  fontSize: '0.9rem'
                }}>
                  A confirmation email has been sent to your inbox.
                </Typography>
              </motion.div>
            </Box>
          ) : (
            <Box sx={{ p: 4 }}>
              {/* Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                  color: colors.text,
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Book Your Table
                </Typography>
                <Typography variant="h6" sx={{
                  color: colors.textSecondary,
                  maxWidth: '500px',
                  mx: 'auto'
                }}>
                  Reserve your table and experience the perfect blend of tradition and innovation
                </Typography>
              </Box>

              {/* Reservation Form */}
              <Box component="form" onSubmit={handleReservationSubmit}>
                <Grid container spacing={3}>
                  {/* Name */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={reservationForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      value={reservationForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Phone */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={reservationForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Date */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={reservationForm.date}
                      onChange={(e) => handleFormChange('date', e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Time */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={reservationForm.time}
                      onChange={(e) => handleFormChange('time', e.target.value)}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Number of Guests */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Number of Guests"
                      type="number"
                      value={reservationForm.guests}
                      onChange={(e) => handleFormChange('guests', parseInt(e.target.value))}
                      required
                      inputProps={{ min: 1, max: 10 }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        }
                      }}
                    />
                  </Grid>

                  {/* Special Requests */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Special Requests (Optional)"
                      multiline
                      rows={3}
                      value={reservationForm.specialRequests}
                      onChange={(e) => handleFormChange('specialRequests', e.target.value)}
                      placeholder="Any special requests or dietary requirements..."
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          '&:hover fieldset': {
                            borderColor: colors.accent
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                          '&.Mui-focused': {
                            color: colors.accent
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: colors.textSecondary,
                          opacity: 0.7
                        }
                      }}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                          backgroundColor: colors.accent,
                          color: colors.background,
                          fontWeight: 600,
                          px: 6,
                          py: 2,
                          fontSize: '1.1rem',
                          borderRadius: '25px',
                          '&:hover': {
                            backgroundColor: colors.accentDark,
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Confirm Reservation
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Additional Info */}
              <Box sx={{
                mt: 4,
                p: 3,
                backgroundColor: `${colors.accent}08`,
                borderRadius: '12px',
                border: `1px solid ${colors.accent}20`
              }}>
                <Typography variant="h6" sx={{
                  color: colors.text,
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif'
                }}>
                  Reservation Policy
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary,
                  mb: 1
                }}>
                  • Reservations are held for 15 minutes past the scheduled time
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary,
                  mb: 1
                }}>
                  • Cancellations must be made at least 2 hours in advance
                </Typography>
                <Typography variant="body2" sx={{
                  color: colors.textSecondary
                }}>
                  • For groups of 6+ people, please call us directly
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Newsletter Subscription */}
      <NewsletterSubscription colors={colors} />

      {/* Footer */}
      <Box sx={{
        background: `linear-gradient(135deg, ${colors.primary} 0%, ${isDarkMode ? '#1a1a1a' : '#2a2a2a'} 100%)`,
        color: colors.background,
        padding: '6rem 0 3rem',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url('/img/coffee/coffee-beans.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 1
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={6} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Typography variant="h3" sx={{
                  fontWeight: 700,
                  color: colors.accent,
                  mb: 3,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}>
                  Cafert
                </Typography>
                <Typography variant="h6" sx={{
                  color: colors.background,
                  mb: 4,
                  lineHeight: 1.8,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 400,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                  background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.accent} 100%)`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  {t('hero.experiencePerfect')}
                  {t('hero.joinCommunity')}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                    <IconButton sx={{ 
                      color: colors.accent, 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.accent}40`,
                      '&:hover': { 
                        color: colors.background,
                        backgroundColor: colors.accent,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <FacebookIcon />
                    </IconButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                    <IconButton sx={{ 
                      color: colors.accent, 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.accent}40`,
                      '&:hover': { 
                        color: colors.background,
                        backgroundColor: colors.accent,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <InstagramIcon />
                    </IconButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, y: -2 }}>
                    <IconButton sx={{ 
                      color: colors.accent, 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${colors.accent}40`,
                      '&:hover': { 
                        color: colors.background,
                        backgroundColor: colors.accent,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <TwitterIcon />
                    </IconButton>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Typography variant="h5" sx={{ 
                  color: colors.accent,
                  fontWeight: 600,
                  marginBottom: '2rem',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>Quick Links</Typography>
                <Typography variant="body1" sx={{
                  color: colors.background,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 2,
                  fontWeight: 500,
                  '&:hover': { 
                    color: colors.accent,
                    transform: 'translateX(5px)'
                  }
                }}>Our Menu</Typography>
                <Typography variant="body1" sx={{
                  color: colors.background,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 2,
                  fontWeight: 500,
                  '&:hover': { 
                    color: colors.accent,
                    transform: 'translateX(5px)'
                  }
                }}>Services</Typography>
                <Typography variant="body1" sx={{
                  color: colors.background,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  mb: 2,
                  fontWeight: 500,
                  '&:hover': { 
                    color: colors.accent,
                    transform: 'translateX(5px)'
                  }
                }}>Gallery</Typography>
                <Typography variant="body1" sx={{
                  color: colors.background,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  '&:hover': { 
                    color: colors.accent,
                    transform: 'translateX(5px)'
                  }
                }}>Contact</Typography>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Typography variant="h5" sx={{ 
                  color: colors.accent,
                  fontWeight: 600,
                  marginBottom: '2rem',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>Contact Info</Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.background,
                  marginBottom: '1rem',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  lineHeight: 1.6
                }}>
                  123 Coffee Street, Brewtown, BT 12345
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.background,
                  marginBottom: '2rem',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  lineHeight: 1.6
                }}>
                  Phone: (555) 123-4567 | Email: info@cafert.com
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: colors.accent,
                  fontWeight: 600,
                  marginBottom: '1.5rem',
                  fontSize: { xs: '1.2rem', md: '1.4rem' },
                  fontFamily: 'Playfair Display, serif',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>Hours</Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.background,
                  marginBottom: '0.5rem',
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  lineHeight: 1.6
                }}>
                  Monday - Friday: 7:00 AM - 8:00 PM
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: colors.background,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  lineHeight: 1.6
                }}>
                  Saturday - Sunday: 8:00 AM - 9:00 PM
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Box sx={{ 
              borderTop: `2px solid ${colors.accent}40`,
              marginTop: '4rem',
              paddingTop: '3rem',
              textAlign: 'center'
            }}>
              <Typography variant="body1" sx={{ 
                color: colors.background,
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontWeight: 500
              }}>
                © 2024 Cafert. All rights reserved.
              </Typography>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Floating Style Switcher */}
      <FloatingStyleSwitcher />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: colors.accent,
            color: colors.background,
            width: '50px',
            height: '50px',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: colors.accentDark,
              transform: 'translateY(-3px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          <ArrowDownIcon sx={{ transform: 'rotate(180deg)' }} />
        </IconButton>
      )}

    </Box>
  );
};

export default CoffeeHomePage; 