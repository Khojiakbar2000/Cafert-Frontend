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
  DialogTitle,
  DialogContent,
  DialogActions,
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
  CheckCircle as CheckCircleIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Restaurant as RestaurantIcon,
  Coffee as CafeIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { useGlobals } from '../../app/hooks/useGlobals';
import ProductService from '../../app/services/ProductService';
import MemberService from '../../app/services/MemberService';
import LanguageToggle from '../components/LanguageToggle';
import HeroSection from '../../app/components/HeroSection';
import Footer from '../../app/components/footer';
import NewsletterSubscription from '../components/NewsletterSubscription';
import FloatingStyleSwitcher from '../components/FloatingStyleSwitcher';
import StorytellingTimeline from '../components/StorytellingTimeline';
import { coffeeShopTimelineData } from '../components/TimelineData';
import Showcase from '../components/Showcase';
import EventTableExperience from '../components/EventTableExperience';
import HorizontalTestimonials from '../components/HorizontalTestimonials';
import { Product } from '../../lib/types/product';
import type { UserActivity, ActiveUsersStats } from '../../app/services/ActivityServiceTypes';
import { serverApi } from '../../lib/config';
import SEO from '../../components/SEO';
import { useHistory } from 'react-router-dom';

interface CoffeeHomePageProps {
  setSignupOpen?: (isOpen: boolean) => void;
  setLoginOpen?: (isOpen: boolean) => void;
}


const CoffeeHomePage: React.FC<CoffeeHomePageProps> = ({ 
  setSignupOpen, 
  setLoginOpen 
}: CoffeeHomePageProps) => {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const { isDarkMode, colors } = useThemeContext();
  const { authMember, setAuthMember } = useGlobals();
  const history = useHistory();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
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
  const communityMembers = userProfiles.filter((member) => member.status === 'online').slice(0, 8);
  const selectedCommunityMember = communityMembers[currentUserIndex] || communityMembers[0];
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
    'popular-coffees': popularProducts.filter(product => product.productCollection === 'COFFEE' || product.productCollection === 'DRINK').map(product => transformProduct(product, true, false)),
    'fresh-menu': freshProducts.filter(product => product.productCollection === 'DESSERT').map(product => transformProduct(product, false, true))
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
        image: '/img/coffee/coffee-latte.jpg', 
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
        image: '/img/coffee/coffee-espresso.jpg', 
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
        name: 'Chocolate Cake', 
        price: '$5.00', 
        image: '', 
        description: 'Dark chocolate sponge with a soft cream filling', 
        ingredients: 'Chocolate, cream, flour',
        rating: 4.9,
        orders: 520,
        isNew: true
      },
      { 
        id: 8, 
        name: 'Tiramisu', 
        price: '$5.50', 
        image: '', 
        description: 'Espresso-soaked layers finished with cocoa', 
        ingredients: 'Espresso, mascarpone, cocoa',
        rating: 4.8,
        orders: 480,
        isNew: true
      },
      { 
        id: 9, 
        name: 'Cheesecake', 
        price: '$5.00', 
        image: '', 
        description: 'Baked cream cheese on a crisp biscuit base', 
        ingredients: 'Cream cheese, biscuit, vanilla',
        rating: 4.7,
        orders: 420,
        isNew: true
      },
      { 
        id: 10, 
        name: 'Butter Croissant', 
        price: '$3.50', 
        image: '', 
        description: 'Flaky, buttery pastry baked until golden', 
        ingredients: 'Butter, flour, milk',
        rating: 4.8,
        orders: 380,
        isNew: true
      },
      { 
        id: 11, 
        name: 'Cinnamon Roll', 
        price: '$4.50', 
        image: '', 
        description: 'Soft roll with cinnamon sugar and a light glaze', 
        ingredients: 'Cinnamon, flour, butter',
        rating: 4.9,
        orders: 320,
        isNew: true
      },
      { 
        id: 12, 
        name: 'Seasonal Pastry', 
        price: '$4.50', 
        image: '', 
        description: 'Ask us what came fresh from the oven today', 
        ingredients: 'Baked fresh daily',
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
      author: "Martin",
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
      fullDescription: "Our private events service offers an exclusive experience for your special occasions. Whether it's a birthday celebration, anniversary, corporate gathering, or intimate dinner party, we provide a sophisticated atmosphere with personalized service. Our elegant private dining room can accommodate up to 50 guests and features custom menu options, professional catering staff, and a dedicated event coordinator to ensure everything runs smoothly.",
      features: [
        "Accommodates up to 50 guests",
        "Custom menu options available",
        "Professional catering staff",
        "Dedicated event coordinator",
        "Flexible event packages",
        "Audio/visual equipment available"
      ],
      icon: <RestaurantIcon />,
      image: "/img/events/private-event-cutout.webp"
    },
    {
      id: 2,
      title: "Catering Services",
      description: "Let us cater your next event with our delicious menu",
      fullDescription: "Bring the exceptional taste of our café to your location with our professional catering services. We offer a wide range of menu options from light refreshments to full-course meals, all prepared with the same attention to quality and presentation that you experience in our café. Perfect for office meetings, conferences, weddings, and any special occasion where you want to impress your guests.",
      features: [
        "Wide range of menu options",
        "Office and corporate events",
        "Wedding catering available",
        "Custom menu planning",
        "Professional presentation",
        "Delivery and setup included"
      ],
      icon: <CafeIcon />,
      image: "/img/events/catering-cutout.webp"
    },
    {
      id: 3,
      title: "Coffee Workshops",
      description: "Learn the art of coffee brewing from our expert baristas",
      fullDescription: "Join our expert baristas for hands-on coffee workshops where you'll learn the art and science of coffee brewing. From espresso basics to advanced latte art techniques, our workshops cover everything you need to know to create café-quality coffee at home. Each session includes practical demonstrations, hands-on practice, and take-home materials. Perfect for coffee enthusiasts of all skill levels.",
      features: [
        "Hands-on learning experience",
        "Expert barista instruction",
        "Espresso and latte art techniques",
        "Take-home materials included",
        "Small class sizes for personalized attention",
        "Suitable for all skill levels"
      ],
      icon: <CoffeeIcon />,
      image: "/img/events/workshop-cutout.webp"
    }
  ];

  // Fetch active users from the backend
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchActiveUsersData = async () => {
      try {
        const ActivityServiceModule = await import('../../app/services/ActivityService');
        const ActivityService = ActivityServiceModule.default;
        const activityService = new ActivityService();
        
        // Fetch active users
        const activeUsersData = await activityService.getActiveUsers();
        if (isMounted) {
          setUserProfiles(activeUsersData);
        }
        
        // Fetch active users stats
        const statsData = await activityService.getActiveUsersStats();
        if (isMounted) {
          setActiveUsersStats(statsData);
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

  // Select an event arrangement in the interactive table.
  const goToEvent = (index: number) => {
    setCurrentEventIndex(index);
  };

  const handleEventClick = (index: number) => {
    setSelectedEvent(index);
    setEventDetailsOpen(true);
  };

  const handleCloseEventDetails = () => {
    setEventDetailsOpen(false);
    setSelectedEvent(null);
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
        const ActivityServiceModule = await import('../../app/services/ActivityService');
        const ActivityService = ActivityServiceModule.default;
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

  // Track product view when user clicks on a product and navigate to detail page
  const handleProductClick = (productId: string) => {
    trackUserActivity('view', productId);
    // Navigate to product detail page
    history.push(`/products/${productId}`);
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
            
            {/* Right side controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
      <Box ref={heroRef} className="hero-section">
        <HeroSection onReservationClick={handleReservationOpen} />
      </Box>

      {/* Storytelling Timeline */}
      <StorytellingTimeline 
        title={t('about.title')}
        subtitle={t('about.subtitle')}
        items={coffeeShopTimelineData}
      />

      {/* Happy Coffee Time Section */}
      <Box 
        className="happy-coffee-time-section"
        sx={{
        padding: '6rem 0',
        background: '#f3eadb',
        position: 'relative',
        overflow: 'hidden',
          zIndex: 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 80% 45%, #e5d1b5 0%, transparent 54%)',
          zIndex: 1
        }
        }}
      >
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
                <motion.div className="happy-coffee-order-slip">
                  <div className="happy-coffee-order-slip__number">CAFERT <span>·</span> DAILY SPECIAL <span>·</span> NO. 01</div>
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
                  <div className="happy-coffee-order-slip__rule" />
                  <div className="happy-coffee-order-slip__footer"><span>MADE FRESH, SERVED WARM</span><span aria-hidden="true">☕</span></div>
                  <img className="happy-coffee-order-slip__pencil" src="/img/coffee/cafert-pencil.webp" alt="" aria-hidden="true" />
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
                <motion.div>
                  <Box
                    component="img"
                    src="/img/coffee/coffee-beans.jpg"
                    alt="Fresh Coffee Beans"
                    sx={{
                      width: '100%',
                      height: 450,
                      objectFit: 'cover',
                      borderRadius: 0,
                      border: '12px solid #fffaf0',
                      boxShadow: '0 22px 48px rgba(72,53,34,0.22), 0 0 0 1px #cdb99c',
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
                </motion.div>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <style>{`
        .happy-coffee-order-slip{position:relative;padding:clamp(24px,4vw,46px);background:${isDarkMode ? '#f2e8d7' : '#fffaf0'};color:#49382a;box-shadow:0 18px 42px #48352224,inset 0 0 0 1px #cdb99c;transform:rotate(-1.2deg)}
        .happy-coffee-order-slip:before{content:'';position:absolute;inset:10px;border:1px dashed #b9a98f;pointer-events:none}
        .happy-coffee-order-slip:after{content:'';position:absolute;left:0;right:0;bottom:-8px;height:9px;background:linear-gradient(135deg,${isDarkMode ? '#f2e8d7' : '#fffaf0'} 50%,transparent 50%) 0 0/14px 14px repeat-x}
        .happy-coffee-order-slip__number{position:relative;z-index:1;margin-bottom:28px;color:#8b6847;font:12px/1.4 monospace;letter-spacing:.13em}
        .happy-coffee-order-slip__number span{padding:0 7px;color:#bd9770}
        .happy-coffee-order-slip .MuiTypography-root{position:relative;z-index:1}
        .happy-coffee-order-slip .MuiTypography-h5,.happy-coffee-order-slip .MuiTypography-body1{color:#695b4b!important}
        .happy-coffee-order-slip .MuiTypography-overline{color:#8b6847!important;letter-spacing:.18em!important}
        .happy-coffee-order-slip .MuiTypography-h2{background:none!important;-webkit-text-fill-color:#49382a!important;color:#49382a!important}
        .happy-coffee-order-slip__rule{position:relative;z-index:1;margin:24px 0 12px;border-top:1px dashed #b9a98f}
        .happy-coffee-order-slip__footer{position:relative;z-index:1;display:flex;justify-content:space-between;align-items:center;padding-right:145px;color:#8b6847;font:11px monospace;letter-spacing:.12em}
        .happy-coffee-order-slip__pencil{position:absolute;z-index:2;width:170px;right:2px;bottom:-11px;transform:rotate(2deg);transform-origin:20% 50%;filter:drop-shadow(0 7px 4px #49362042);animation:welcome-pencil-appear .65s .35s cubic-bezier(.2,.8,.2,1) both}
        @keyframes welcome-pencil-appear{from{opacity:0;transform:translate(12px,-3px) rotate(4deg)}to{opacity:1;transform:rotate(2deg)}}
        @media(prefers-reduced-motion:reduce){.happy-coffee-order-slip__pencil{animation:none}}
        @media(max-width:600px){.happy-coffee-order-slip{transform:none}.happy-coffee-order-slip__number{margin-bottom:20px}}
      `}</style>

      {/* Menu Section */}
      <Box 
        ref={menuRef}
        sx={{
        padding: '6rem 0',
        backgroundColor: '#eee6d9',
          position: 'relative',
          zIndex: 10,
          willChange: 'transform'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" sx={{
              color: '#403329',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 600,
              mb: 2,
              fontFamily: '"Cinzel", serif',
              letterSpacing: '0.02em',
            }}>
              {t('menu.title')}
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: 2,
              mb: 3,
            }}>
              <Box sx={{ 
                width: '40px', 
                height: '1px', 
                backgroundColor: '#d6c7b2'
              }} />
              <Box sx={{ 
                fontSize: '1.5rem',
                color: '#766957',
                lineHeight: 1,
              }}>❦</Box>
              <Box sx={{ 
                width: '40px', 
                height: '1px', 
                backgroundColor: '#d6c7b2'
              }} />
            </Box>
            <Typography variant="h6" sx={{
              color: '#766957',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
              fontFamily: '"EB Garamond", serif',
              fontStyle: 'italic',
            }}>
              {t('menu.subtitle')}
            </Typography>
          </Box>

            <Box className="cafert-menu-folio" sx={{ maxWidth: 1120, mx: 'auto', position: 'relative', overflow: 'hidden', background: 'linear-gradient(90deg,#f6efdf 0%,#fffaf0 43%,#eee3d1 50%,#fffaf0 57%,#f7f0e3 100%)', border: '1px solid #d4c2a8', boxShadow: '0 2px 3px #503b2512,0 7px 0 -2px #e2d6c4,0 22px 42px #503b2522,inset 0 0 0 5px #fffaf044', px: { xs: 2, sm: 4, md: 6 }, py: { xs: 3, sm: 4, md: 5 }, '&::after': { content: '""', display: { xs: 'none', md: 'block' }, position: 'absolute', left: '50%', top: 88, bottom: 58, width: 24, transform: 'translateX(-50%)', pointerEvents: 'none', background: 'linear-gradient(90deg,transparent,#6c54301b,transparent)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 2, mb: { xs: 2, md: 3 }, borderBottom: '1px solid #d8cbb6' }}>
              <Typography variant="overline" sx={{ color: '#906643', fontFamily: 'monospace', fontSize: '.72rem', letterSpacing: '.16em' }}>{t('menu.menuMasthead')}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: .5, sm: 1.5 } }}>
                <Typography variant="overline" sx={{ color: '#766957', fontFamily: 'monospace', fontSize: '.68rem', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>{t('menu.menuEdition')}</Typography>
                <Box component="img" src="/img/coffee/cafert-pencil.webp" alt="" aria-hidden="true" sx={{ display: 'block', width: { xs: 72, sm: 116 }, height: 'auto', transform: 'rotate(2deg)', filter: 'drop-shadow(0 3px 2px #4936203d)' }} />
              </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, position: 'relative' }}>
              {[
                { key: 'popular-coffees', title: t('menu.coffee'), index: '01', note: t('menu.brewedToOrder') },
                { key: 'fresh-menu', title: t('menu.pastries'), index: '02', note: t('menu.fromPastryCase') }
              ].map((section, sectionIndex) => (
                <Box key={section.key} component="section" sx={{ px: { xs: 0, md: 4 }, py: { xs: 2, md: 1 }, borderRight: { xs: 0, md: sectionIndex === 0 ? '1px solid #d8cbb6' : 0 }, borderBottom: { xs: sectionIndex === 0 ? '1px solid #d8cbb6' : 0, md: 0 }, pb: { xs: sectionIndex === 0 ? 3 : 1, md: 1 }, mb: { xs: sectionIndex === 0 ? 1 : 0, md: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 1, pb: 1.5, mb: 1, borderBottom: '1px solid #d8cbb6' }}>
                    <Box>
                      <Typography component="span" sx={{ display: 'block', mb: .35, color: '#906643', fontFamily: 'monospace', fontSize: '.68rem', letterSpacing: '.17em' }}>{section.index} / {section.note}</Typography>
                      <Typography component="h3" sx={{ m: 0, color: '#403329', fontFamily: '"EB Garamond", serif', fontSize: { xs: '2rem', sm: '2.35rem' }, lineHeight: 1 }}>{section.title}</Typography>
                    </Box>
                    <Typography aria-hidden="true" sx={{ color: '#ad8057', fontFamily: 'Georgia, serif', fontSize: '1.6rem', lineHeight: 1 }}>✳</Typography>
                  </Box>
                  {currentMenuItems[section.key as keyof typeof currentMenuItems].map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, delay: index * .035 }}>
                      <Box component="button" type="button" onClick={() => handleProductClick(String(item.id))} aria-label={`${item.name}, ${item.price}. ${item.description}`} sx={{
                        display: 'grid', gridTemplateColumns: item.image ? { xs: '60px minmax(0,1fr) auto', sm: '72px minmax(0,1fr) auto' } : 'minmax(0,1fr) auto', gap: { xs: 1.25, sm: 1.75 }, alignItems: 'center', width: '100%', minHeight: 86, py: 1.15,
                        border: 0, borderBottom: '1px dotted #cdbda5', background: 'transparent', color: 'inherit', textAlign: 'left', cursor: 'pointer',
                        '&:hover .cafert-menu-item-name': { color: '#946c48' }, '&:hover .cafert-menu-thumb': { transform: 'scale(1.04)' }, '&:focus-visible': { outline: '2px solid #946c48', outlineOffset: -2 }
                      }}>
                        {item.image && <Box className="cafert-menu-thumb" component="img" src={item.image} alt="" onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = '/img/coffee/cafert-placeholder.jpg'; }} sx={{ width: { xs: 60, sm: 72 }, height: { xs: 60, sm: 66 }, objectFit: 'cover', transition: 'transform .2s ease' }} />}
                        <Box sx={{ minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: .75 }}>
                            <Typography className="cafert-menu-item-name" component="span" sx={{ color: '#403329', fontFamily: '"EB Garamond", serif', fontWeight: 600, fontSize: { xs: '1.02rem', sm: '1.17rem' }, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', transition: 'color .18s' }}>{item.name}</Typography>
                            <Box aria-hidden="true" sx={{ flex: 1, minWidth: 5, borderBottom: '1px dotted #cdbda5', transform: 'translateY(-3px)' }} />
                          </Box>
                          <Typography component="span" sx={{ display: 'block', mt: .35, color: '#766957', fontFamily: '"EB Garamond", serif', fontSize: { xs: '.83rem', sm: '.91rem' }, lineHeight: 1.3 }}>{item.description}</Typography>
                        </Box>
                        <Typography component="span" sx={{ color: '#403329', fontFamily: 'Georgia, serif', fontSize: { xs: '.98rem', sm: '1.05rem' }, whiteSpace: 'nowrap', pl: .35 }}>{item.price}</Typography>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2.2, mt: 2, borderTop: '1px solid #d8cbb6' }}>
              <Typography variant="overline" sx={{ color: '#766957', fontFamily: 'monospace', fontSize: '.66rem', letterSpacing: '.14em' }}>{t('menu.menuColophon')}</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Showcase Section with GSAP Animation */}
    {/*<Showcase />*/}

      {/* Services Section */}
      <EventTableExperience services={services} selectedIndex={currentEventIndex} onSelect={goToEvent} onDetails={handleEventClick} />

      {/* Event Details Dialog */}
      <Dialog
        open={eventDetailsOpen}
        onClose={handleCloseEventDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
                  backgroundColor: colors.surface,
          }
        }}
      >
        {selectedEvent !== null && (
          <>
            <DialogTitle sx={{
              fontSize: '2rem',
              fontWeight: 700,
              color: colors.text,
              fontFamily: 'Playfair Display, serif',
              pb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
                  <Box sx={{
                width: 60,
                height: 60,
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.background,
                  }}>
                {services[selectedEvent].icon}
                  </Box>
              {services[selectedEvent].title}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={services[selectedEvent].image}
                  alt={services[selectedEvent].title}
                  sx={{
                    borderRadius: 0,
                    objectFit: 'contain',
                    backgroundColor: '#eee5d6',
                    p: 1,
                    mb: 3
                  }}
                />
                    <Typography variant="body1" sx={{
                      color: colors.text,
                      lineHeight: 1.8,
                  fontSize: '1.1rem',
                  mb: 3
                }}>
                  {services[selectedEvent].fullDescription}
                    </Typography>
                        <Typography variant="h6" sx={{
                  color: colors.text,
                  fontWeight: 600,
                  mb: 2,
                  fontSize: '1.2rem'
                }}>
                  Features:
                        </Typography>
                <List>
                  {services[selectedEvent].features.map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <CheckCircleIcon sx={{ color: colors.accent }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{
                          sx: {
                          color: colors.textSecondary,
                            fontSize: '1rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
          </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
              <Button
                onClick={handleCloseEventDetails}
                sx={{
                  color: colors.textSecondary,
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  handleCloseEventDetails();
                  setReservationOpen(true);
                }}
                sx={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  textTransform: 'none',
                  fontSize: '1rem',
                  px: 3,
                  '&:hover': {
                    backgroundColor: colors.accentDark
                  }
                }}
              >
                Book Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Horizontal Scrolling Testimonials Section */}
      <HorizontalTestimonials 
        testimonials={[
          {
            id: '1',
            quote: 'The best coffee experience I\'ve ever had. Every cup tells a story of quality and care.',
            author: 'Sarah Johnson',
            role: 'Coffee Enthusiast',
            avatar: '/img/food/rose.webp',
            rating: 5,
          },
          {
            id: '2',
            quote: 'Amazing atmosphere and even better coffee. This place has become my daily ritual.',
            author: 'Martin',
            role: 'Regular Customer',
            avatar: '/img/food/martin.webp',
            rating: 5,
          },
          {
            id: '3',
            quote: 'The attention to detail in every brew is remarkable. Truly exceptional coffee.',
            author: 'Emily Rodriguez',
            role: 'Barista & Reviewer',
            avatar: '/img/food/justin.webp',
            rating: 5,
          },
          {
            id: '4',
            quote: 'I\'ve traveled the world for coffee, and this place ranks among the very best.',
            author: 'David Thompson',
            role: 'Coffee Blogger',
            avatar: '/img/food/nusret.webp',
            rating: 5,
          },
          {
            id: '5',
            quote: 'The perfect blend of tradition and innovation. A must-visit for any coffee lover.',
            author: 'Lisa Anderson',
            role: 'Food Critic',
            avatar: '/img/food/rose.webp',
            rating: 5,
          },
          {
            id: '6',
            quote: 'Outstanding quality and service. This is what coffee culture should be about.',
            author: 'James Wilson',
            role: 'Local Resident',
            avatar: '/img/food/martin.webp',
            rating: 5,
          },
        ]}
      />

      {/* Analog contact sheet gallery */}
      <Box component="section" aria-labelledby="cafert-gallery-title" className="cafert-gallery" sx={{ py: { xs: 8, md: 12 }, backgroundColor: colors.surface, color: colors.text, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          {(() => {
            const frames = [
              { src: '/img/coffee/coffee-hero.jpg', alt: t('gallery.frames.0.alt'), title: t('gallery.frames.0.title'), note: t('gallery.frames.0.note') },
              { src: '/img/coffee/coffee-shop.jpg', alt: t('gallery.frames.1.alt'), title: t('gallery.frames.1.title'), note: t('gallery.frames.1.note') },
              { src: '/img/cafe/tropical-outdoor-cafe.jpg', alt: t('gallery.frames.2.alt'), title: t('gallery.frames.2.title'), note: t('gallery.frames.2.note') },
              { src: '/img/cafe/istock-cafe.jpg', alt: t('gallery.frames.3.alt'), title: t('gallery.frames.3.title'), note: t('gallery.frames.3.note') },
              { src: '/img/coffee/coffee-gallery.jpg', alt: t('gallery.frames.4.alt'), title: t('gallery.frames.4.title'), note: t('gallery.frames.4.note') },
              { src: '/img/coffee/coffee-menu.jpg', alt: t('gallery.frames.5.alt'), title: t('gallery.frames.5.title'), note: t('gallery.frames.5.note') },
            ];
            const activeFrame = frames[galleryIndex] || frames[0];
            return <>
              <Box className="cafert-gallery__heading">
                <Box>
                  <Typography component="p" className="cafert-gallery__eyebrow">{t('gallery.eyebrow')}</Typography>
                  <Typography component="h2" id="cafert-gallery-title" className="cafert-gallery__title">{t('gallery.title')}</Typography>
                </Box>
                <Typography component="p" className="cafert-gallery__intro">{t('gallery.intro')}</Typography>
                <span className="cafert-gallery__archive-mark" aria-hidden="true">{t('gallery.archiveMark')}</span>
              </Box>

              <Box className="cafert-gallery__stage" aria-live="polite">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeFrame.src}
                    className="cafert-gallery__print"
                    initial={reduceMotion ? false : { opacity: 0, x: 24, rotate: 1.4 }}
                    animate={{ opacity: 1, x: 0, rotate: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, x: -18, rotate: -1 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.2, 0.75, 0.25, 1] }}
                  >
                    <span className="cafert-gallery__tape cafert-gallery__tape--left" aria-hidden="true" />
                    <span className="cafert-gallery__tape cafert-gallery__tape--right" aria-hidden="true" />
                    <Box component="img" src={activeFrame.src} alt={activeFrame.alt} className="cafert-gallery__large-image" />
                    <Box className="cafert-gallery__print-caption">
                      <Box>
                        <Typography component="p" className="cafert-gallery__print-title">{activeFrame.title}</Typography>
                        <Typography component="p" className="cafert-gallery__print-note">{activeFrame.note}</Typography>
                      </Box>
                      <span>{t('gallery.frame')} {String(galleryIndex + 1).padStart(2, '0')}</span>
                    </Box>
                  </motion.div>
                </AnimatePresence>
                <Box className="cafert-gallery__cutout" aria-hidden="true">
                  <img src="/img/coffee/coffee-branch-cutout.webp" alt="" />
                </Box>
                <Box className="cafert-gallery__stamp" aria-hidden="true"><span>CAFERT</span><strong>{t('gallery.archiveMark')}</strong><span>FRAME {String(galleryIndex + 1).padStart(2, '0')}</span></Box>
              </Box>

              <Box className="cafert-gallery__film" role="group" aria-label={t('gallery.chooseFrame')}>
                <span className="cafert-gallery__film-label">{t('gallery.rollLabel')}</span>
                <Box className="cafert-gallery__frames">
                  {frames.map((frame, index) => (
                    <button key={frame.src} type="button" className={`cafert-gallery__frame${galleryIndex === index ? ' is-active' : ''}`} aria-pressed={galleryIndex === index} aria-label={`${t('gallery.frame')} ${index + 1}: ${frame.title}`} onClick={() => setGalleryIndex(index)}>
                      <span className="cafert-gallery__negative-number">{String(index + 1).padStart(2, '0')}</span>
                      <img src={frame.src} alt="" />
                    </button>
                  ))}
                </Box>
                <span className="cafert-gallery__film-end" aria-hidden="true">36</span>
              </Box>

              <style>{`
                .cafert-gallery__heading{position:relative;display:flex;align-items:end;justify-content:space-between;gap:32px;margin:0 auto 34px;max-width:1050px}
                .cafert-gallery__eyebrow{margin:0 0 8px;color:${colors.accent};font:600 11px/1.3 monospace;letter-spacing:.2em;text-transform:uppercase}
                .cafert-gallery__title{margin:0;color:${colors.text};font:500 clamp(40px,5.5vw,68px)/.98 'Playfair Display',Georgia,serif;letter-spacing:-.035em}
                .cafert-gallery__intro{max-width:36ch;margin:0 70px 5px 0;color:${colors.textSecondary};font:italic 19px/1.45 'EB Garamond',Georgia,serif}
                .cafert-gallery__archive-mark{position:absolute;right:0;top:0;border:1px solid ${colors.accent};border-radius:50%;padding:20px 13px;color:${colors.accent};font:700 9px/1 monospace;letter-spacing:.1em;transform:rotate(11deg)}
                .cafert-gallery__stage{position:relative;max-width:940px;margin:0 auto;padding:18px 54px 42px 18px}
                .cafert-gallery__print{position:relative;z-index:1;width:100%;padding:13px 13px 0;background:#fffaf1;box-shadow:0 18px 34px #493b2d25;transform-origin:50% 50%}
                .cafert-gallery__large-image{display:block;width:100%;height:clamp(300px,46vw,520px);object-fit:cover;background:#e6dac7}
                .cafert-gallery__print-caption{display:flex;align-items:center;justify-content:space-between;gap:20px;min-height:78px;padding:12px 18px;color:#493b2d}
                .cafert-gallery__print-title{margin:0;font:600 23px/1.1 'EB Garamond',Georgia,serif}
                .cafert-gallery__print-note{margin:5px 0 0;color:#756852;font:italic 16px/1.25 'EB Garamond',Georgia,serif}
                .cafert-gallery__print-caption>span{flex:none;color:#967a59;font:10px/1 monospace;letter-spacing:.1em;text-transform:uppercase}
                .cafert-gallery__tape{position:absolute;z-index:2;top:-12px;width:88px;height:27px;background:#d5bb84b8;box-shadow:0 1px 2px #493b2d14;clip-path:polygon(2% 8%,98% 0,95% 90%,0 100%);pointer-events:none}
                .cafert-gallery__tape--left{left:11%;transform:rotate(-7deg)}.cafert-gallery__tape--right{right:12%;transform:rotate(5deg)}
                .cafert-gallery__cutout{position:absolute;z-index:3;right:-68px;bottom:-58px;width:250px;pointer-events:none}
                .cafert-gallery__cutout img{display:block;width:100%;height:auto;filter:drop-shadow(0 13px 11px #3b33262b)}
                .cafert-gallery__stamp{position:absolute;z-index:4;left:-27px;bottom:12px;width:108px;height:108px;border:2px solid #a74f40;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;color:#a74f40;text-align:center;transform:rotate(-13deg);background:#f6efe3d9}
                .cafert-gallery__stamp:before{content:'';position:absolute;inset:5px;border:1px dashed currentColor;border-radius:50%}
                .cafert-gallery__stamp span{font:8px/1 monospace;letter-spacing:.12em}.cafert-gallery__stamp strong{font:700 13px/1 'Playfair Display',Georgia,serif;letter-spacing:.04em}
                .cafert-gallery__film{position:relative;max-width:1050px;margin:15px auto 0;padding:22px 28px 19px;background:#51493d;box-shadow:0 8px 18px #3e352622}
                .cafert-gallery__film:before,.cafert-gallery__film:after{content:'';position:absolute;left:15px;right:15px;height:8px;background:repeating-linear-gradient(90deg,#f0e6d5 0 12px,transparent 12px 25px)}
                .cafert-gallery__film:before{top:6px}.cafert-gallery__film:after{bottom:6px}
                .cafert-gallery__film-label{display:block;margin:0 0 11px;color:#e6d3ad;font:9px/1 monospace;letter-spacing:.16em;text-transform:uppercase}
                .cafert-gallery__frames{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:11px}
                .cafert-gallery__frame{position:relative;min-width:0;padding:5px 5px 8px;border:1px solid #aa997c;background:#665c4d;cursor:pointer;transition:background .2s ease,transform .2s ease,box-shadow .2s ease}
                .cafert-gallery__frame img{display:block;width:100%;height:82px;object-fit:cover;filter:sepia(.22) saturate(.8);transition:filter .2s ease}
                .cafert-gallery__negative-number{display:block;margin:0 0 4px;text-align:left;color:#eadcc6;font:9px/1 monospace;letter-spacing:.1em}
                .cafert-gallery__frame:hover{transform:translateY(-4px);background:#796c59}
                .cafert-gallery__frame.is-active{background:#a36d49;border-color:#e7c28d;box-shadow:0 0 0 2px #d9b784;transform:translateY(-5px)}
                .cafert-gallery__frame.is-active img{filter:none}
                .cafert-gallery__frame:focus-visible{outline:3px solid #f3dcae;outline-offset:3px}
                .cafert-gallery__film-end{position:absolute;right:8px;top:50%;padding:4px;background:#51493d;color:#e6d3ad;font:9px/1 monospace;transform:translate(50%,-50%) rotate(90deg)}
                @media(max-width:700px){.cafert-gallery__heading{display:block;margin-bottom:24px}.cafert-gallery__intro{max-width:34ch;margin:12px 58px 0 0;font-size:18px}.cafert-gallery__archive-mark{top:7px}.cafert-gallery__stage{padding:14px 20px 70px 10px}.cafert-gallery__large-image{height:clamp(250px,68vw,420px)}.cafert-gallery__cutout{right:-22px;bottom:-44px;width:185px}.cafert-gallery__stamp{left:-10px;bottom:7px;width:83px;height:83px}.cafert-gallery__stamp span{font-size:7px}.cafert-gallery__stamp strong{font-size:10px}.cafert-gallery__film{margin-top:0;padding:21px 18px 19px;overflow:hidden}.cafert-gallery__frames{display:flex;overflow-x:auto;gap:10px;padding:2px 3px 7px;scroll-snap-type:x mandatory;scrollbar-width:thin;scrollbar-color:#c3a576 #51493d}.cafert-gallery__frame{flex:0 0 125px;scroll-snap-align:start}.cafert-gallery__frame img{height:78px}.cafert-gallery__film-end{display:none}}
                @media(prefers-reduced-motion:reduce){.cafert-gallery__frame,.cafert-gallery__frame img{transition:none}}
              `}</style>
            </>;
          })()}
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
            <Grid item xs={12}>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.2, 0.75, 0.25, 1] }}
                viewport={{ once: true }}
              >
                <Box className="cafert-community" sx={{ '--community-accent': colors.accent, '--community-ink': colors.text } as React.CSSProperties}>
                  <Box className="cafert-community__live-line">
                    <span className="cafert-community__live-dot" aria-hidden="true" />
                    <Typography component="p">{t('home.activeUsers')} <strong>{communityMembers.length}</strong></Typography>
                    <span className="cafert-community__live-caption">{t('home.communityOnline')}</span>
                  </Box>

                  <Box className="cafert-community__scene">
                    <Box className="cafert-community__house" role="group" aria-label={t('home.communityHouseLabel')}>
                      <Box className="cafert-community__roof">
                        <span className="cafert-community__sign-name">CAFERT</span>
                        <span className="cafert-community__sign-subtitle">{t('home.communityHouseSign')}</span>
                      </Box>
                      <Box className="cafert-community__awning" aria-hidden="true"><span>{Array.from({ length: 10 }).map((_, i) => <i key={i} />)}</span></Box>
                      <Box className="cafert-community__wall">
                        {communityMembers.length ? (
                          <Box className="cafert-community__windows" role="group" aria-label={t('home.communityChooseWindow')}>
                            {communityMembers.map((member, index) => (
                              <button
                                key={member.id || member.memberId || index}
                                type="button"
                                className={`cafert-community__window${currentUserIndex === index ? ' is-open' : ''}`}
                                aria-pressed={currentUserIndex === index}
                                aria-label={`${member.name}, ${member.activity}`}
                                onClick={() => setCurrentUserIndex(index)}
                              >
                                <span className="cafert-community__window-frame">
                                  <span className="cafert-community__window-glass">
                                    <img src={member.avatar} alt="" />
                                    <i className="cafert-community__window-glow" aria-hidden="true" />
                                    <i className="cafert-community__window-online" aria-hidden="true" />
                                  </span>
                                  <i className="cafert-community__shutter cafert-community__shutter--left" aria-hidden="true" />
                                  <i className="cafert-community__shutter cafert-community__shutter--right" aria-hidden="true" />
                                  <i className="cafert-community__window-sill" aria-hidden="true" />
                                </span>
                                <span className="cafert-community__window-name">{member.name}</span>
                                <span className="cafert-community__window-status"><i aria-hidden="true" />{t('home.communityOnline')}</span>
                              </button>
                            ))}
                          </Box>
                        ) : (
                          <Box className="cafert-community__empty-window">
                            <span aria-hidden="true">☕</span>
                            <p>{t('home.communityWaiting')}</p>
                          </Box>
                        )}
                        <span className="cafert-community__door" aria-hidden="true"><i /><b>CAFERT</b></span>
                        <span className="cafert-community__wall-sign" aria-hidden="true">{t('home.communityComeIn')}</span>
                      </Box>
                      <Box className="cafert-community__ground" aria-hidden="true" />
                    </Box>

                    {selectedCommunityMember && (
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.aside
                          key={selectedCommunityMember.id || selectedCommunityMember.memberId}
                          className="cafert-community__note"
                          initial={reduceMotion ? false : { opacity: 0, y: 12, rotate: 1 }}
                          animate={{ opacity: 1, y: 0, rotate: 0 }}
                          exit={reduceMotion ? undefined : { opacity: 0, y: -8, rotate: -0.5 }}
                          transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.2, 0.75, 0.25, 1] }}
                          aria-live="polite"
                        >
                          <span className="cafert-community__note-kicker">{t('home.communityWindowNote')}</span>
                          <Box className="cafert-community__note-person">
                            <img src={selectedCommunityMember.avatar} alt="" />
                            <Box>
                              <Typography component="h3">{selectedCommunityMember.name}</Typography>
                              <Typography component="p">{selectedCommunityMember.location}</Typography>
                            </Box>
                          </Box>
                          <span className="cafert-community__activity-label">{t('home.communityDoing')}</span>
                          <Typography component="p" className="cafert-community__activity">{selectedCommunityMember.activity}</Typography>
                          <span className="cafert-community__last-seen">{selectedCommunityMember.lastActivity}</span>
                          <span className="cafert-community__note-stamp" aria-hidden="true">{t('home.communityOnline')}</span>
                        </motion.aside>
                      </AnimatePresence>
                    )}
                  </Box>

                  <Box className="cafert-community__plant-cutout" aria-hidden="true">
                    <img src="/img/coffee/coffee-branch-cutout.webp" alt="" />
                  </Box>

                  <style>{`
                    .cafert-community{--community-accent:${colors.accent};--community-ink:${colors.text};position:relative;max-width:1160px;min-height:510px;margin:0 auto;padding:26px clamp(18px,4vw,48px) 54px;overflow:hidden;background:#f6efe3;border:1px solid #e2d4be;color:#534638;box-shadow:0 14px 35px #54412b12}
                    .cafert-community:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 39px,#a58b6710 40px,#a58b6710 41px);pointer-events:none}
                    .cafert-community__live-line{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:10px;margin:0 0 16px;color:#60513d}
                    .cafert-community__live-line p{margin:0;font:600 16px/1.2 'Playfair Display',Georgia,serif}.cafert-community__live-line strong{color:#9b6446;font-size:20px}
                    .cafert-community__live-dot,.cafert-community__window-status i{display:inline-block;width:9px;height:9px;border-radius:50%;background:#6a9b5e;box-shadow:0 0 0 3px #6a9b5e20}
                    .cafert-community__live-caption{color:#8a7860;font:10px/1 monospace;letter-spacing:.13em;text-transform:uppercase}
                    .cafert-community__scene{position:relative;z-index:1;display:grid;grid-template-columns:minmax(0,1fr) 285px;align-items:center;gap:clamp(22px,4vw,52px);max-width:1030px;margin:0 auto}
                    .cafert-community__house{position:relative;z-index:1;min-width:0;padding:0 25px 0;background:#ead8bc;box-shadow:0 14px 22px #4b37241c, inset 0 0 0 1px #d6c2a1;clip-path:polygon(0 1%,100% 0,99.5% 99%,.5% 100%)}
                    .cafert-community__roof{position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:74px;margin:0 -25px;background:#f6e8cd;box-shadow:0 4px 9px #48382518,inset 0 -1px #d6c1a0}
                    .cafert-community__sign-name{color:#604c36;font:700 25px/1 'Playfair Display',Georgia,serif;letter-spacing:.14em}
                    .cafert-community__sign-subtitle{margin-top:6px;color:#8b7255;font:9px/1 monospace;letter-spacing:.18em;text-transform:uppercase}
                    .cafert-community__awning{position:relative;z-index:2;height:53px;margin:0 -25px;padding:0 15px;background:#f6e8cd}
                    .cafert-community__awning>span{display:flex;height:44px;filter:drop-shadow(0 4px 2px #493b2d1c)}
                    .cafert-community__awning i{position:relative;flex:1;background:#b66b58;clip-path:polygon(0 0,100% 0,100% 80%,90% 100%,80% 80%,70% 100%,60% 80%,50% 100%,40% 80%,30% 100%,20% 80%,10% 100%,0 80%)}
                    .cafert-community__awning i:nth-child(even){background:#fff6e6}
                    .cafert-community__wall{position:relative;display:flex;align-items:flex-end;min-height:263px;padding:22px 12px 0;background-color:#f0e2c9;background-image:repeating-linear-gradient(90deg,#b79d7610 0 1px,transparent 1px 58px)}
                    .cafert-community__windows{position:relative;z-index:2;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));align-items:end;gap:clamp(8px,1.5vw,19px);width:100%;padding:0 82px 0 0}
                    .cafert-community__window{display:flex;flex-direction:column;align-items:center;min-width:0;padding:0 3px 14px;border:0;background:transparent;color:#5b4a36;cursor:pointer;font:inherit}
                    .cafert-community__window-frame{position:relative;display:block;width:min(100%,150px);height:151px;padding:9px 8px 13px;background:#faf0dd;border:1px solid #b99d76;box-shadow:0 5px 7px #4c3b281c,inset 0 0 0 3px #e3d0af;perspective:650px}
                    .cafert-community__window-glass{position:absolute;inset:10px 9px 13px;overflow:hidden;background:#514839;box-shadow:inset 0 0 0 3px #765f43}
                    .cafert-community__window-glass img{display:block;width:100%;height:100%;object-fit:cover;filter:sepia(.18) saturate(.82);transition:filter .3s ease,transform .45s ease}
                    .cafert-community__window-glow{position:absolute;inset:0;background:linear-gradient(145deg,#f1c97e35,transparent 68%);pointer-events:none}
                    .cafert-community__window-online{position:absolute;right:7px;top:7px;width:9px;height:9px;border:2px solid #fff6e6;border-radius:50%;background:#6a9b5e;box-shadow:0 0 0 3px #6a9b5e4d}
                    .cafert-community__shutter{position:absolute;top:10px;bottom:13px;width:50%;z-index:2;border:1px solid #875746;background:repeating-linear-gradient(0deg,#bc7962 0 8px,#ad6956 8px 10px);box-shadow:inset 0 0 0 2px #d29a7d70;transition:transform .58s cubic-bezier(.2,.75,.25,1);backface-visibility:hidden}
                    .cafert-community__shutter--left{left:9px;transform-origin:left center;border-right:2px solid #82513f}
                    .cafert-community__shutter--right{right:9px;transform-origin:right center;border-left:2px solid #82513f}
                    .cafert-community__window.is-open .cafert-community__shutter--left{transform:perspective(650px) rotateY(-105deg)}
                    .cafert-community__window.is-open .cafert-community__shutter--right{transform:perspective(650px) rotateY(105deg)}
                    .cafert-community__window-sill{position:absolute;z-index:3;left:-4px;right:-4px;bottom:6px;height:10px;background:#fff2dc;border:1px solid #b99c75;box-shadow:0 3px 3px #4635232b}
                    .cafert-community__window-name{max-width:100%;margin-top:13px;overflow:hidden;color:#4f4030;font:600 17px/1.1 'Playfair Display',Georgia,serif;text-overflow:ellipsis;white-space:nowrap}
                    .cafert-community__window-status{display:flex;align-items:center;gap:6px;margin-top:6px;color:#7a684f;font:8px/1 monospace;letter-spacing:.1em;text-transform:uppercase}
                    .cafert-community__window-status i{width:6px;height:6px;box-shadow:none}
                    .cafert-community__window:hover .cafert-community__window-frame,.cafert-community__window.is-open .cafert-community__window-frame{box-shadow:0 8px 12px #4c3b2828,inset 0 0 0 3px #e3d0af}
                    .cafert-community__window:hover img,.cafert-community__window.is-open img{filter:none;transform:scale(1.04)}
                    .cafert-community__window:focus-visible{outline:3px solid #a3654a;outline-offset:4px}
                    .cafert-community__door{position:absolute;right:10px;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;width:70px;height:132px;padding-bottom:12px;border:1px solid #a98965;border-bottom:0;border-radius:45px 45px 0 0;background:#dfc7a4;box-shadow:inset 0 0 0 4px #ecdcbf}
                    .cafert-community__door i{position:absolute;right:9px;top:58%;width:6px;height:6px;border-radius:50%;background:#99704d}
                    .cafert-community__door b{color:#8e704f;font:7px/1 monospace;letter-spacing:.1em;writing-mode:vertical-rl}
                    .cafert-community__wall-sign{position:absolute;right:88px;bottom:31px;color:#977653;font:italic 13px/1 'EB Garamond',Georgia,serif;transform:rotate(-4deg)}
                    .cafert-community__ground{height:17px;margin:0 -25px;background:linear-gradient(180deg,#cfb28b,#b89568);box-shadow:0 5px 7px #51402c29}
                    .cafert-community__note{position:relative;align-self:center;min-height:260px;padding:25px 23px 28px;background:#fff8e8;color:#554632;box-shadow:0 12px 25px #513d251f, inset 0 0 0 1px #ead7b8;clip-path:polygon(0 0,100% 0,100% 96%,94% 100%,88% 96%,82% 100%,76% 96%,70% 100%,64% 96%,58% 100%,52% 96%,46% 100%,40% 96%,34% 100%,28% 96%,22% 100%,16% 96%,10% 100%,4% 96%,0 100%)}
                    .cafert-community__note:before{content:'';position:absolute;inset:10px;border:1px dashed #b69a714d;pointer-events:none}
                    .cafert-community__note-kicker,.cafert-community__activity-label{position:relative;display:block;color:#98754f;font:9px/1.2 monospace;letter-spacing:.13em;text-transform:uppercase}
                    .cafert-community__note-person{position:relative;display:flex;align-items:center;gap:13px;margin:18px 0 21px}
                    .cafert-community__note-person img{width:60px;height:60px;object-fit:cover;border:4px solid #fffdf6;border-radius:50%;box-shadow:0 3px 9px #48362326}
                    .cafert-community__note-person h3{margin:0;color:#554632;font:600 22px/1.1 'Playfair Display',Georgia,serif}
                    .cafert-community__note-person p{margin:6px 0 0;color:#8a775d;font:italic 14px/1.2 'EB Garamond',Georgia,serif}
                    .cafert-community__activity{position:relative;margin:8px 0 0;color:#534638;font:italic 23px/1.16 'EB Garamond',Georgia,serif}
                    .cafert-community__last-seen{position:relative;display:block;margin-top:17px;color:#938169;font:10px/1 monospace}
                    .cafert-community__note-stamp{position:absolute;right:18px;top:17px;padding:8px 7px;border:1px solid #a65f4a;border-radius:50%;color:#a65f4a;font:700 7px/1 monospace;letter-spacing:.06em;text-transform:uppercase;transform:rotate(12deg)}
                    .cafert-community__empty-window{display:grid;place-items:center;align-content:center;gap:10px;min-height:180px;width:100%;color:#80694d;text-align:center}
                    .cafert-community__empty-window span{font-size:34px}.cafert-community__empty-window p{max-width:24ch;margin:0;font:italic 19px/1.3 'EB Garamond',Georgia,serif}
                    .cafert-community__plant-cutout{position:absolute;z-index:0;right:-45px;bottom:-60px;width:170px;pointer-events:none;transform:rotate(-12deg)}
                    .cafert-community__plant-cutout img{display:block;width:100%;height:auto;filter:drop-shadow(0 8px 6px #42352624)}
                    @media(max-width:850px){.cafert-community{padding:22px 18px 48px}.cafert-community__scene{grid-template-columns:1fr;gap:25px}.cafert-community__house{max-width:700px;width:100%;margin:0 auto}.cafert-community__note{width:min(100%,440px);min-height:220px;margin:0 auto}.cafert-community__plant-cutout{right:-38px;width:140px}}
                    @media(max-width:540px){.cafert-community{padding:18px 12px 42px;min-height:auto}.cafert-community__live-line{flex-wrap:wrap;margin-bottom:14px}.cafert-community__live-line p{font-size:14px}.cafert-community__live-caption{font-size:8px}.cafert-community__house{padding:0 13px}.cafert-community__roof{min-height:67px;margin:0 -13px}.cafert-community__awning{height:45px;margin:0 -13px;padding:0 9px}.cafert-community__awning>span{height:38px}.cafert-community__wall{min-height:220px;padding:16px 8px 0}.cafert-community__windows{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 5px;padding-right:44px}.cafert-community__window{padding-bottom:10px}.cafert-community__window-frame{height:116px;padding:7px 6px 10px}.cafert-community__window-glass{inset:8px 7px 10px}.cafert-community__shutter{top:8px;bottom:10px}.cafert-community__shutter--left{left:7px}.cafert-community__shutter--right{right:7px}.cafert-community__window-sill{bottom:4px}.cafert-community__window-name{font-size:14px;margin-top:9px}.cafert-community__window-status{font-size:7px;margin-top:4px}.cafert-community__door{right:4px;width:43px;height:106px}.cafert-community__wall-sign{right:49px;bottom:25px;font-size:9px}.cafert-community__ground{margin:0 -13px}.cafert-community__note{padding:22px 19px 26px;min-height:210px}.cafert-community__activity{font-size:21px}.cafert-community__plant-cutout{right:-31px;bottom:-49px;width:112px}}
                    @media(prefers-reduced-motion:reduce){.cafert-community__shutter,.cafert-community__window-glass img{transition:none}}
                  `}</style>
                </Box>
              </motion.div>
            </Grid>

          </Grid>
        </Container>
      </Box>

      {/* Place-setting invitation to reserve */}
      <Box component="section" aria-labelledby="cafert-reservation-title" className="cafert-reservation" sx={{ py: { xs: 8, md: 12 }, backgroundColor: colors.surface, color: colors.text, overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Box className="cafert-reservation__layout">
            <Box className="cafert-reservation__copy">
              <Typography component="p" className="cafert-reservation__eyebrow">{t('home.reservationEyebrow')}</Typography>
              <Typography component="h2" id="cafert-reservation-title" className="cafert-reservation__title">{t('home.reservationTitle')}</Typography>
              <Typography component="p" className="cafert-reservation__description">{t('home.reservationDescription')}</Typography>
              <span className="cafert-reservation__rule" aria-hidden="true" />
              <Typography component="p" className="cafert-reservation__aside">{t('home.reservationCardAction')}</Typography>
            </Box>

            <Box className="cafert-reservation__setting">
              <img className="cafert-reservation__cutout" src="/img/coffee/reservation-place-setting.webp" alt={t('home.reservationImageAlt')} />
              <Box className="cafert-reservation__stamp" aria-hidden="true">
                <span>CAFERT</span><strong>{t('home.reservationInvitation')}</strong><span>{t('home.reservationStampBottom')}</span>
              </Box>
              <Button className="cafert-reservation__place-card cafert-reservation__place-card--desktop" onClick={handleReservationOpen} aria-label={t('home.reservationCardAction')}>
                <span>{t('home.reservationCardLabel')}</span>
                <strong>{t('home.reservationCardName')}</strong>
                <i aria-hidden="true">↗</i>
              </Button>
            </Box>

            <Button className="cafert-reservation__place-card cafert-reservation__place-card--mobile" onClick={handleReservationOpen}>
              <span>{t('home.reservationCardLabel')}</span>
              <strong>{t('home.reservationCardName')}</strong>
              <i>{t('home.reservationCardAction')} <b aria-hidden="true">↗</b></i>
            </Button>
          </Box>
        </Container>
        <style>{`
          .cafert-reservation{position:relative}
          .cafert-reservation__layout{display:grid;grid-template-columns:minmax(250px,.78fr) minmax(450px,1.22fr);align-items:center;gap:20px;max-width:1120px;margin:0 auto}
          .cafert-reservation__copy{position:relative;z-index:2;padding:20px 0 25px 18px}
          .cafert-reservation__eyebrow{margin:0 0 13px;color:${colors.accent};font:600 11px/1.3 monospace;letter-spacing:.18em;text-transform:uppercase}
          .cafert-reservation__title{max-width:9ch;margin:0;color:${colors.text};font:500 clamp(44px,5vw,69px)/.96 'Playfair Display',Georgia,serif;letter-spacing:-.04em}
          .cafert-reservation__description{max-width:31ch;margin:20px 0 0;color:${colors.textSecondary};font:italic 21px/1.42 'EB Garamond',Georgia,serif}
          .cafert-reservation__rule{display:block;width:70px;height:1px;margin:25px 0 14px;background:${colors.accent}}
          .cafert-reservation__aside{margin:0;color:${colors.textSecondary};font:11px/1.4 monospace;letter-spacing:.1em;text-transform:uppercase}
          .cafert-reservation__setting{position:relative;isolation:isolate;max-width:760px;margin:0 auto}
          .cafert-reservation__setting:before{content:'';position:absolute;z-index:-1;left:9%;right:10%;top:22%;bottom:12%;border-radius:50%;background:radial-gradient(ellipse,#eadbc4 0%,#eadbc400 68%)}
          .cafert-reservation__cutout{display:block;width:100%;height:auto;filter:drop-shadow(0 18px 15px #4a39241f)}
          .cafert-reservation__stamp{position:absolute;z-index:2;right:3%;top:5%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:112px;height:112px;border:2px solid #a65f4a;border-radius:50%;color:#a65f4a;background:#f7efe3dd;text-align:center;transform:rotate(9deg)}
          .cafert-reservation__stamp:before{content:'';position:absolute;inset:5px;border:1px dashed currentColor;border-radius:50%}
          .cafert-reservation__stamp span{font:8px/1 monospace;letter-spacing:.1em}.cafert-reservation__stamp strong{font:700 12px/1.1 'Playfair Display',Georgia,serif;letter-spacing:.04em}
          .cafert-reservation__place-card{z-index:4;display:flex!important;flex-direction:column;align-items:flex-start!important;justify-content:center;gap:6px;min-width:0!important;padding:10px 12px!important;border:1px solid #bca27d!important;border-radius:2px!important;background:#fff9eb!important;color:#594731!important;text-align:left!important;box-shadow:0 4px 7px #4735212b, inset 0 0 0 3px #eadabd;transform:rotate(-2deg);transition:transform .22s ease,box-shadow .22s ease!important;text-transform:none!important}
          .cafert-reservation__place-card:hover{background:#fff9eb!important;box-shadow:0 12px 16px #47352130,inset 0 0 0 3px #eadabd;transform:translateY(-6px) rotate(-1deg)}
          .cafert-reservation__place-card span{color:#927653;font:8px/1 monospace;letter-spacing:.1em}
          .cafert-reservation__place-card strong{color:#594731;font:600 15px/1.1 'EB Garamond',Georgia,serif}
          .cafert-reservation__place-card i{color:#a65f4a;font:normal 13px/1 sans-serif}
          .cafert-reservation__place-card--desktop{position:absolute!important;left:15.5%;top:25%;width:21%;height:17%;min-height:76px}
          .cafert-reservation__place-card--mobile{display:none!important}
          .cafert-reservation__place-card:focus-visible{outline:3px solid #a65f4a;outline-offset:4px}
          @media(max-width:820px){.cafert-reservation__layout{grid-template-columns:minmax(220px,.8fr) minmax(340px,1.2fr);gap:4px}.cafert-reservation__copy{padding-left:0}.cafert-reservation__stamp{width:88px;height:88px}.cafert-reservation__stamp span{font-size:6px}.cafert-reservation__stamp strong{font-size:10px}.cafert-reservation__place-card--desktop{min-height:65px;gap:4px;padding:7px 8px!important}.cafert-reservation__place-card span{font-size:7px}.cafert-reservation__place-card strong{font-size:13px}}
          @media(max-width:600px){.cafert-reservation__layout{grid-template-columns:1fr;gap:0}.cafert-reservation__copy{padding:0 4px 6px}.cafert-reservation__title{max-width:12ch;font-size:clamp(42px,12vw,58px)}.cafert-reservation__description{max-width:34ch;margin-top:13px;font-size:19px}.cafert-reservation__rule{margin:17px 0 10px}.cafert-reservation__aside{font-size:9px}.cafert-reservation__setting{width:calc(100% + 16px);margin:0 -8px}.cafert-reservation__stamp{right:5%;top:3%;width:75px;height:75px}.cafert-reservation__stamp span{font-size:5px}.cafert-reservation__stamp strong{font-size:8px}.cafert-reservation__place-card--desktop{display:none!important}.cafert-reservation__place-card--mobile{display:flex!important;width:min(100%,390px);margin:-8px auto 0!important;padding:17px 19px!important;transform:rotate(-.6deg)}.cafert-reservation__place-card--mobile span{font-size:9px}.cafert-reservation__place-card--mobile strong{font-size:22px}.cafert-reservation__place-card--mobile i{display:flex;align-items:center;gap:8px;font:italic 15px/1.1 'EB Garamond',Georgia,serif}.cafert-reservation__place-card--mobile i b{font:normal 15px/1 sans-serif}}
          @media(prefers-reduced-motion:reduce){.cafert-reservation__place-card{transition:none!important}}
        `}</style>
      </Box>

      {/* Reservation Modal */}
      <Dialog
        open={reservationOpen}
        onClose={handleReservationClose}
        maxWidth="md"
        fullWidth
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.18)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: '18px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.10))',
            backdropFilter: 'blur(18px) saturate(140%)',
            WebkitBackdropFilter: 'blur(18px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.38)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
            position: 'relative',
            // Gradient overlay highlight using ::before
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.03))',
              mixBlendMode: 'overlay',
            },
            // Ensure text remains readable
            '& *': {
              color: colors.text,
            }
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
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
                          background: 'rgba(255, 255, 255, 0.16)',
                          border: '1px solid rgba(255, 255, 255, 0.24)',
                          '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.24)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.32)'
                          },
                          '&.Mui-focused': {
                            background: 'rgba(255, 255, 255, 0.18)',
                            '& fieldset': {
                              borderColor: 'rgba(180, 140, 90, 0.45)',
                            },
                            boxShadow: '0 0 0 4px rgba(180, 140, 90, 0.18)',
                            outline: 'none',
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.7)',
                          '&.Mui-focused': {
                            color: colors.accent || 'rgba(43, 38, 32, 0.9)'
                          }
                        },
                        '& .MuiOutlinedInput-input': {
                          color: colors.text || '#2b2620'
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: colors.textSecondary || 'rgba(43, 38, 32, 0.5)',
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

      <Footer />

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
