import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
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
  Avatar,
  Paper,
  Popover,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListSubheader,
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
  ExpandMore as ExpandMoreIcon,
  Language as LanguageIcon,
  DarkMode as DarkModeIcon,
  Home as HomeIcon,
  LocalCafe as CoffeeIcon,
  Help as HelpIcon,
  Star as StarIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Restaurant as RestaurantIcon,
  Coffee as CafeIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ReceiptLong as ReceiptLongIcon,
  CakeOutlined as CakeOutlinedIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { useGlobals } from '../../app/hooks/useGlobals';
import ProductService from '../../app/services/ProductService';
import MemberService from '../../app/services/MemberService';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import HeroSection from '../../app/components/HeroSection';
import CustomSection from '../../app/components/CustomSection';
import CircleText from '../../app/components/CircleText';
import CodeGrid3DCRTDisplay from '../../app/components/CodeGrid3DCRTDisplay';
import StorytellingTimeline from '../components/StorytellingTimeline';
import { coffeeShopTimelineData } from '../components/TimelineData';
import Showcase from '../components/Showcase';
import CollageHero from '../components/CollageHero';
import { StitchArchiveTestimonialsSection } from '../../app/components/StitchArchiveTestimonialsSection';
import TeamGridSection from '../../app/components/TeamGridSection';
import {
  StitchFirstRoastSection,
  StitchBeanJourneySection,
  StitchKeepItFreshSection,
} from '../../app/components/StitchDailyRoastSections';
import { StitchEventsSection } from '../../app/components/StitchEventsSection';
import { STITCH_THEME } from '../../components/stitchUi';
import { Product } from '../../lib/types/product';
import type { UserActivity, ActiveUsersStats } from '../../app/services/ActivityServiceTypes';
import { serverApi } from '../../lib/config';
import SEO from '../../components/SEO';
import { useHistory } from 'react-router-dom';

interface CoffeeHomePageProps {
  setSignupOpen?: (isOpen: boolean) => void;
  setLoginOpen?: (isOpen: boolean) => void;
  /** When true, App-level `OtherNavbar` is shown; hide this page’s duplicate header. */
  suppressBuiltInNavbar?: boolean;
}

type HomeNavItem = {
  path: string;
  labelKey: string;
  scrollTop?: boolean;
  Icon: SvgIconComponent;
};

/** Main bar — high-traffic routes only */
const PRIMARY_HOME_NAV: HomeNavItem[] = [
  { path: '/', labelKey: 'navigation.home', scrollTop: true, Icon: HomeIcon },
  { path: '/products', labelKey: 'navigation.menu', Icon: CoffeeIcon },
  { path: '/orders', labelKey: 'navigation.orders', Icon: ReceiptLongIcon },
  { path: '/help', labelKey: 'navigation.about', Icon: HelpIcon },
];

/** Secondary routes — hamburger menu (desktop) */
const MORE_HOME_NAV: HomeNavItem[] = [
  { path: '/stats', labelKey: 'navigation.analytics', Icon: TrendingUpIcon },
  { path: '/my-page', labelKey: 'navigation.myPage', Icon: PersonIcon },
  { path: '/birthday-cake', labelKey: 'navigation.birthdayCake', Icon: CakeOutlinedIcon },
];

const MENU_ITEMS_PER_PAGE = 4;

const CoffeeHomePage: React.FC<CoffeeHomePageProps> = ({
  setSignupOpen,
  setLoginOpen,
  suppressBuiltInNavbar = false,
}: CoffeeHomePageProps) => {
  const { t, i18n } = useTranslation();
  const { isDarkMode, toggleTheme, colors } = useThemeContext();
  const { authMember, setAuthMember } = useGlobals();
  const history = useHistory();
  const [menuListPage, setMenuListPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
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
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  /** Anchor for secondary-nav Popover (portaled — avoids overflow clipping). */
  const [moreMenuAnchorEl, setMoreMenuAnchorEl] = useState<null | HTMLElement>(null);

  /** stitch.tsx navbar ink on cream / cream on dark */
  const navInk = isDarkMode ? STITCH_THEME.surface : STITCH_THEME.ink;
  const navHoverBg = isDarkMode ? 'rgba(252, 246, 232, 0.12)' : 'rgba(26, 15, 13, 0.08)';
  const navBorder = isDarkMode ? 'rgba(252, 246, 232, 0.88)' : STITCH_THEME.ink;
  const navBarBg = navbarScrolled
    ? isDarkMode
      ? 'rgba(20, 17, 14, 0.92)'
      : 'rgba(253, 246, 232, 0.9)'
    : isDarkMode
      ? 'rgba(22, 18, 15, 0.82)'
      : 'rgba(253, 246, 232, 0.86)';
  const navGlassBorder = isDarkMode ? 'rgba(252, 246, 232, 0.14)' : 'rgba(26, 15, 13, 0.11)';
  const navDividerMuted = isDarkMode ? 'rgba(252, 246, 232, 0.16)' : 'rgba(26, 15, 13, 0.12)';

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
        
        // Fetch popular products (by views) - fetch more products for menu
        const popularData = await productService.getProducts({
          page: 1,
          limit: 20, // Increased to show more products
          order: "productViews" // Backend sorts by views
        });
        
        // Fetch fresh products (by creation date) - fetch more products for menu
        const freshData = await productService.getProducts({
          page: 1,
          limit: 20, // Increased to show more products
          order: "createdAt" // Backend sorts by creation date
        });
        
        console.log('✅ Fetched popular products:', popularData.length);
        console.log('✅ Fetched fresh products:', freshData.length);
        
        setPopularProducts(popularData || []);
        setFreshProducts(freshData || []);
      } catch (error) {
        console.error('❌ Error fetching products:', error);
        // Keep empty arrays if API fails - will use fallback
        setPopularProducts([]);
        setFreshProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Register ScrollTrigger plugin
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  // Transform backend products to frontend format
  const transformProduct = (product: Product, isPopular: boolean = false, isFresh: boolean = false, index: number = 0) => {
    // Use actual product images from backend if available, otherwise fallback to menu PNGs
    const menuImages = [
      '/img/coffee/menu1.png',
      '/img/coffee/menu2.png', 
      '/img/coffee/menu3.png',
      '/img/coffee/menu.png'
    ];
    
    // Use first product image if available, otherwise cycle through menu PNGs
    const productImage = product.productImages && product.productImages.length > 0
      ? product.productImages[0]
      : menuImages[index % menuImages.length];
    
    return {
      id: product._id,
      name: product.productName,
      price: `$${product.productPrice}`,
      image: productImage, // Use real product image or fallback to menu PNGs
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
    'popular-coffees': popularProducts.map((product, index) => transformProduct(product, true, false, index)),
    'fresh-menu': freshProducts.map((product, index) => transformProduct(product, false, true, index))
  };

  // Fallback menu items if no data is available - using your beautiful coffee images
  const fallbackMenuItems = {
    'popular-coffees': [
      { 
        id: 1, 
        name: 'Classic Espresso', 
        price: '$3.50', 
        image: '/img/coffee/menu1.png', 
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
        image: '/img/coffee/menu2.png', 
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
        image: '/img/coffee/menu3.png', 
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
        image: '/img/coffee/menu.png', 
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
        image: '/img/coffee/menu1.png', 
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
        image: '/img/coffee/menu2.png', 
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

  // Always prioritize real data - only use fallback if no real data is available
  const currentMenuItems = {
    'popular-coffees': menuItems['popular-coffees'].length > 0 
      ? menuItems['popular-coffees'] 
      : (loading ? [] : fallbackMenuItems['popular-coffees']),
    'fresh-menu': menuItems['fresh-menu'].length > 0 
      ? menuItems['fresh-menu'] 
      : (loading ? [] : fallbackMenuItems['fresh-menu'])
  };

  const freshMenuList = currentMenuItems['fresh-menu'];
  const popularMenuList = currentMenuItems['popular-coffees'];
  const menuTotalPages = Math.max(
    1,
    Math.ceil(freshMenuList.length / MENU_ITEMS_PER_PAGE),
    Math.ceil(popularMenuList.length / MENU_ITEMS_PER_PAGE)
  );
  const freshPageItems = freshMenuList.slice(
    (menuListPage - 1) * MENU_ITEMS_PER_PAGE,
    menuListPage * MENU_ITEMS_PER_PAGE
  );
  const popularPageItems = popularMenuList.slice(
    (menuListPage - 1) * MENU_ITEMS_PER_PAGE,
    menuListPage * MENU_ITEMS_PER_PAGE
  );

  useEffect(() => {
    setMenuListPage((p) => Math.min(Math.max(1, p), menuTotalPages));
  }, [menuTotalPages]);

  // Log current menu items for debugging
  useEffect(() => {
    if (!loading) {
      console.log('📋 Current menu items - Popular:', currentMenuItems['popular-coffees'].length);
      console.log('📋 Current menu items - Fresh:', currentMenuItems['fresh-menu'].length);
      console.log('📋 Using real data:', {
        popular: menuItems['popular-coffees'].length > 0,
        fresh: menuItems['fresh-menu'].length > 0
      });
    }
  }, [loading, currentMenuItems, menuItems]);

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
      image: "/img/coffee/coffee-hero.jpg"
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
      image: "/img/coffee/coffee-gallery.jpg"
    },
    {
      id: 3,
      title: "Host your own Gathering in our cafe",
      description: "Reserve our café for celebrations, meetings, and shared coffee moments",
      fullDescription:
        "Host your own gathering in our café—we’ll help you shape the menu, seating, and flow. Whether it’s a birthday, team meet-up, tasting, or an intimate get-together, you get our space, our baristas, and the same drinks and pastries guests love from the daily menu. Tell us your date and headcount; we’ll handle the rest.",
      features: [
        "Private or semi-private café space",
        "Custom coffee and pastry options",
        "Dedicated coordinator for your event",
        "Flexible timing and group sizes",
        "Perfect for birthdays and team gatherings",
        "Barista service included"
      ],
      icon: <CoffeeIcon />,
      image: "/img/coffee/coffee-menu.jpg"
    }
  ];

  // Fetch active users stats (navbar drawer) & profiles (optional testimonials)
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchActiveUsersData = async () => {
      try {
        const ActivityServiceModule = await import('../../app/services/ActivityService');
        const ActivityService = ActivityServiceModule.default;
        const activityService = new ActivityService();
        
        const activeUsersData = await activityService.getActiveUsers();
        if (isMounted) {
          setUserProfiles(activeUsersData);
        }

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
      setNavbarScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700;800;900&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
    
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
    <Box
      id="top"
      sx={{
      backgroundColor: colors.background,
      color: colors.text,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}
    >
      {/* Global Styles */}
      <style>{globalStyles}</style>



      {/* Header — floating glass bar (skipped when App renders `OtherNavbar`) */}
      {!suppressBuiltInNavbar && (
      <>
      <Box
        sx={{
          position: navbarScrolled ? 'fixed' : 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          pt: { xs: 1, sm: 1.1, md: 1.25 },
          px: { xs: 1.25, sm: 1.6, md: 2.25 },
          pointerEvents: 'none',
          transition: 'padding 0.28s ease',
          fontFamily: '"Space Grotesk", sans-serif',
          '& .MuiTypography-root': { fontFamily: '"Space Grotesk", sans-serif' },
          '& .MuiButton-root': { fontFamily: '"Space Grotesk", sans-serif' },
          '& .MuiAccordion-root, & .MuiAccordionSummary-root, & .MuiAccordionDetails-root': {
            fontFamily: '"Space Grotesk", sans-serif',
          },
        }}
      >
        <Box
          sx={{
            pointerEvents: 'auto',
            maxWidth: 'min(1320px, 100%)',
            mx: 'auto',
            borderRadius: { xs: '12px', md: '14px' },
            backgroundColor: navBarBg,
            backdropFilter: 'blur(20px) saturate(170%)',
            WebkitBackdropFilter: 'blur(20px) saturate(170%)',
            border: `1px solid ${navGlassBorder}`,
            boxShadow: isDarkMode
              ? '0 14px 44px rgba(0,0,0,0.42), 0 5px 16px rgba(0,0,0,0.28), inset 0 1px 0 rgba(252,246,232,0.07)'
              : '0 18px 52px rgba(26, 15, 13, 0.11), 0 6px 16px rgba(26, 15, 13, 0.07), inset 0 1px 0 rgba(255,255,255,0.72)',
            transition: 'background-color 0.32s ease, box-shadow 0.32s ease',
            overflow: 'visible',
          }}
        >
        <Container maxWidth={false} sx={{ maxWidth: '100%', px: { xs: '16px', sm: '22px', md: '28px' } }}>
          <Box
            sx={{
              display: { xs: 'flex', md: 'grid' },
              flexDirection: { xs: 'row' },
              justifyContent: { xs: 'space-between' },
              alignItems: 'center',
              gridTemplateColumns: { md: 'auto minmax(0, 1fr) auto auto' },
              columnGap: { md: 1.75 },
              rowGap: 1,
              py: { xs: 1.1, md: 1.45 },
              minHeight: { xs: 54, md: 60 },
              width: '100%',
            }}
          >
            {/* Logo */}
            <Typography 
              variant="h4" 
              sx={{
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: navInk,
                fontSize: { xs: '1.6rem', md: '2.05rem', lg: '2.5rem' },
                letterSpacing: { xs: '0.035em', md: '0.05em' },
                textShadow: 'none',
                transition: 'color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                justifySelf: { md: 'start' },
                lineHeight: 1,
              }}
            >
              Cafert
            </Typography>
            
            {/* Primary navigation only (md+) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                justifySelf: 'center',
                flexWrap: 'wrap',
                rowGap: 0.5,
                columnGap: { md: 3, lg: 3.75 },
                minWidth: 0,
                width: '100%',
              }}
            >
              {PRIMARY_HOME_NAV.map((item) => {
                const Icon = item.Icon;
                return (
                  <Typography
                    key={item.path + item.labelKey}
                    variant="body1"
                    onClick={() => {
                      if (item.scrollTop) scrollToTop();
                      else history.push(item.path);
                    }}
                    sx={{
                      position: 'relative',
                      fontWeight: 700,
                      fontSize: { md: '13px', lg: '14px' },
                      color: navInk,
                      cursor: 'pointer',
                      textShadow: 'none',
                      pb: 0.45,
                      transition: 'color 0.22s ease',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 0.45,
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: 2,
                        bgcolor: STITCH_THEME.primary,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left center',
                        transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
                      },
                      '&:hover': {
                        color: STITCH_THEME.primary,
                      },
                      '&:hover::after': {
                        transform: 'scaleX(1)',
                      },
                    }}
                  >
                    <Icon sx={{ fontSize: 13, opacity: 0.32 }} />
                    {t(item.labelKey)}
                  </Typography>
                );
              })}
            </Box>

            {/* Separate floating burger — opens portaled menu (not clipped by bar) */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                justifySelf: 'end',
              }}
            >
              <Box
                sx={{
                  borderRadius: '14px',
                  border: `1px solid ${navGlassBorder}`,
                  backgroundColor: isDarkMode ? 'rgba(252,246,232,0.07)' : 'rgba(255,255,255,0.55)',
                  boxShadow: isDarkMode
                    ? '0 6px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(252,246,232,0.08)'
                    : '0 8px 24px rgba(26, 15, 13, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
              >
                <IconButton
                  type="button"
                  aria-expanded={Boolean(moreMenuAnchorEl)}
                  aria-haspopup="true"
                  aria-label={t('navigation.more')}
                  onClick={(e) => {
                    setMoreMenuAnchorEl((prev) => (prev ? null : e.currentTarget));
                  }}
                  sx={{
                    color: moreMenuAnchorEl ? STITCH_THEME.primary : navInk,
                    width: 44,
                    height: 44,
                    borderRadius: '13px',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    '&:hover': {
                      backgroundColor: navHoverBg,
                      color: STITCH_THEME.primary,
                    },
                  }}
                >
                  <MenuIcon sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>

              <Popover
                open={Boolean(moreMenuAnchorEl)}
                anchorEl={moreMenuAnchorEl}
                onClose={() => setMoreMenuAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                disableScrollLock
                sx={{ zIndex: 10050 }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.25,
                    borderRadius: '12px',
                    border: `1px solid ${navGlassBorder}`,
                    backgroundColor: navBarBg,
                    backdropFilter: 'blur(20px) saturate(170%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(170%)',
                    boxShadow: isDarkMode
                      ? '0 16px 40px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)'
                      : '0 18px 44px rgba(26, 15, 13, 0.13), 0 6px 14px rgba(26, 15, 13, 0.08)',
                    width: 'min(100%, 300px)',
                    minWidth: 260,
                    py: 1.25,
                    px: 1.25,
                    overflow: 'visible',
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                  <Accordion
                    disableGutters
                    elevation={0}
                    defaultExpanded={false}
                    sx={{
                      border: `1px solid ${navGlassBorder}`,
                      borderRadius: '10px',
                      bgcolor: 'transparent',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { margin: 0 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: navInk, fontSize: 22 }} />}
                      sx={{
                        minHeight: 48,
                        px: 1,
                        '&.Mui-expanded': { minHeight: 48 },
                        '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, my: 0.5 },
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 20, color: STITCH_THEME.primary, opacity: 0.9 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: navInk }}>
                        {t('navigation.searchProducts')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, px: 1, pb: 1.5 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant="outlined"
                        startIcon={<SearchIcon sx={{ fontSize: 20 }} />}
                        onClick={() => {
                          history.push('/products');
                          setMoreMenuAnchorEl(null);
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: navInk,
                          borderColor: navGlassBorder,
                          borderRadius: '10px',
                          py: 1,
                          '&:hover': {
                            borderColor: STITCH_THEME.primary,
                            color: STITCH_THEME.primary,
                            backgroundColor: navHoverBg,
                          },
                        }}
                      >
                        {t('navigation.startSearching')}
                      </Button>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{
                      border: `1px solid ${navGlassBorder}`,
                      borderRadius: '10px',
                      bgcolor: 'transparent',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { margin: 0 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: navInk, fontSize: 22 }} />}
                      sx={{
                        minHeight: 48,
                        px: 1,
                        '&.Mui-expanded': { minHeight: 48 },
                        '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, my: 0.5 },
                      }}
                    >
                      <LanguageIcon sx={{ fontSize: 20, color: STITCH_THEME.primary, opacity: 0.9 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: navInk }}>
                        {t('common.language')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, px: 1, pb: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                      <Button
                        fullWidth
                        type="button"
                        variant={i18n.language.startsWith('en') ? 'contained' : 'outlined'}
                        onClick={() => {
                          i18n.changeLanguage('en');
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          justifyContent: 'flex-start',
                          borderRadius: '10px',
                          py: 1,
                          ...(i18n.language.startsWith('en')
                            ? { bgcolor: STITCH_THEME.primary, color: STITCH_THEME.onPrimary, '&:hover': { bgcolor: '#e04300' } }
                            : { color: navInk, borderColor: navGlassBorder }),
                        }}
                      >
                        🇺🇸 {t('common.english')}
                      </Button>
                      <Button
                        fullWidth
                        type="button"
                        variant={i18n.language.startsWith('ko') ? 'contained' : 'outlined'}
                        onClick={() => {
                          i18n.changeLanguage('ko');
                        }}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          justifyContent: 'flex-start',
                          borderRadius: '10px',
                          py: 1,
                          ...(i18n.language.startsWith('ko')
                            ? { bgcolor: STITCH_THEME.primary, color: STITCH_THEME.onPrimary, '&:hover': { bgcolor: '#e04300' } }
                            : { color: navInk, borderColor: navGlassBorder }),
                        }}
                      >
                        🇰🇷 {t('common.korean')}
                      </Button>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{
                      border: `1px solid ${navGlassBorder}`,
                      borderRadius: '10px',
                      bgcolor: 'transparent',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { margin: 0 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: navInk, fontSize: 22 }} />}
                      sx={{
                        minHeight: 48,
                        px: 1,
                        '&.Mui-expanded': { minHeight: 48 },
                        '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, my: 0.5 },
                      }}
                    >
                      <DarkModeIcon sx={{ fontSize: 20, color: STITCH_THEME.primary, opacity: 0.9 }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: navInk }}>
                        {t('common.appearance')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, px: 1, pb: 1.5, display: 'flex', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          '& .MuiIconButton-root': {
                            color: `${navInk} !important`,
                            borderColor: `${isDarkMode ? 'rgba(252,246,232,0.25)' : 'rgba(26,15,13,0.22)'} !important`,
                            backgroundColor: `${navHoverBg} !important`,
                            width: 48,
                            height: 48,
                            '&:hover': {
                              backgroundColor: `${isDarkMode ? 'rgba(252, 246, 232, 0.18)' : 'rgba(26, 15, 13, 0.12)'} !important`,
                            },
                          },
                        }}
                      >
                        <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    disableGutters
                    elevation={0}
                    sx={{
                      border: `1px solid ${navGlassBorder}`,
                      borderRadius: '10px',
                      bgcolor: 'transparent',
                      '&:before': { display: 'none' },
                      '&.Mui-expanded': { margin: 0 },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: navInk, fontSize: 22 }} />}
                      sx={{
                        minHeight: 48,
                        px: 1,
                        '&.Mui-expanded': { minHeight: 48 },
                        '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1, my: 0.5 },
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.08em', color: navInk, textTransform: 'uppercase' }}>
                        {t('navigation.more')}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, px: 0.5, pb: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {MORE_HOME_NAV.map((item) => {
                        const Icon = item.Icon;
                        return (
                          <Button
                            key={item.path + item.labelKey}
                            fullWidth
                            type="button"
                            variant="text"
                            onClick={() => {
                              history.push(item.path);
                              setMoreMenuAnchorEl(null);
                            }}
                            startIcon={<Icon sx={{ fontSize: 18, opacity: 0.48 }} />}
                            sx={{
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              textTransform: 'none',
                              color: navInk,
                              fontWeight: 600,
                              fontSize: '0.8125rem',
                              letterSpacing: '0.02em',
                              py: 1,
                              px: 1,
                              borderRadius: '10px',
                              minHeight: 44,
                              '&:hover': {
                                backgroundColor: navHoverBg,
                                color: STITCH_THEME.primary,
                              },
                            }}
                          >
                            {t(item.labelKey)}
                          </Button>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Popover>
            </Box>
            
            {/* Utilities + account cluster */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifySelf: { md: 'end' },
                height: '100%',
                flexShrink: 0,
                gap: { xs: 0.5, md: 0.75 },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.25, md: 0.5 },
                }}
              >
              <IconButton
                sx={{
                  color: navInk,
                  width: { xs: 40, md: 42 },
                  height: { xs: 40, md: 42 },
                  transition: 'all 0.25s ease',
                  display: { xs: 'none', sm: 'inline-flex', md: 'none' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    opacity: 0.92,
                    backgroundColor: navHoverBg,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '21px', md: '23px' }
                  }
                }}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              
              <Box
                sx={{
                  display: { md: 'none' },
                  '& .MuiAccordion-root': {
                    backgroundColor: `${navHoverBg} !important`,
                    borderColor: `${isDarkMode ? 'rgba(252,246,232,0.25)' : 'rgba(26,15,13,0.2)'} !important`,
                  },
                  '& .MuiTypography-root': {
                    color: `${navInk} !important`,
                  },
                  '& .MuiSvgIcon-root': {
                    color: `${navInk} !important`,
                  },
                }}
              >
                <LanguageToggle isDarkMode={isDarkMode} />
              </Box>
            
              <IconButton
                onClick={() => history.push('/orders?tab=menu')}
                sx={{
                  color: navInk,
                  width: { xs: 40, md: 42 },
                  height: { xs: 40, md: 42 },
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    opacity: 0.92,
                    backgroundColor: navHoverBg,
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: { xs: '22px', md: '24px' }
                  }
                }}
                aria-label="cart"
              >
                <ShoppingCartIcon />
              </IconButton>
              
              <Box
                sx={{
                  display: { md: 'none' },
                  '& .MuiIconButton-root': { 
                    color: `${navInk} !important`,
                    borderColor: `${isDarkMode ? 'rgba(252,246,232,0.25)' : 'rgba(26,15,13,0.22)'} !important`,
                    backgroundColor: `${navHoverBg} !important`,
                    '&:hover': {
                      backgroundColor: `${isDarkMode ? 'rgba(252, 246, 232, 0.18)' : 'rgba(26, 15, 13, 0.12)'} !important`,
                    },
                  },
                }}
              >
                <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 0.75, md: 1.35 },
                  pl: { md: 2 },
                  ml: { md: 1.25 },
                  borderLeft: { md: `1px solid ${navDividerMuted}` },
                }}
              >
              {!authMember ? (
                <>
                  <Button
                    variant="text"
                    onClick={() => setLoginOpen && setLoginOpen(true)}
                    sx={{
                      color: navInk,
                      fontWeight: 700,
                      fontSize: { xs: '14px', md: '16px' },
                      px: { xs: 1, md: 2 },
                      py: 1,
                      textTransform: 'none',
                      textShadow: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: STITCH_THEME.primary,
                        backgroundColor: navHoverBg,
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t('common.login')}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSignup}
                    disableElevation
                    sx={{
                      bgcolor: STITCH_THEME.primary,
                      color: STITCH_THEME.onPrimary,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      fontSize: { xs: '12px', md: '13px' },
                      letterSpacing: '0.06em',
                      px: { xs: 1.65, md: 2.4 },
                      py: { xs: 0.85, md: 1.05 },
                      textTransform: 'uppercase',
                      textShadow: 'none',
                      border: `3px solid ${navBorder}`,
                      borderRadius: 0,
                      boxShadow: `4px 4px 0 0 ${navBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: STITCH_THEME.primaryContainer,
                        color: STITCH_THEME.ink,
                        transform: 'translate(2px, 2px)',
                        boxShadow: `2px 2px 0 0 ${navBorder}`,
                      },
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease'
                    }}
                  >
                    {t('common.signup')}
                  </Button>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.75 } }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: navInk,
                      fontWeight: 500,
                      fontSize: { xs: '14px', md: '17px' },
                      textShadow: 'none',
                      transition: 'color 0.3s ease',
                      display: { xs: 'none', sm: 'flex' },
                      alignItems: 'center',
                      maxWidth: { sm: 160, md: 200 },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {t('common.welcome')}, {authMember.memberNick || t('common.user')}
                  </Typography>
                  <Button
                    variant="text"
                    startIcon={<LogoutIcon sx={{ color: navInk, fontSize: { md: '20px' } }} />}
                    onClick={handleLogout}
                    sx={{
                      color: navInk,
                      fontWeight: 600,
                      fontSize: { xs: '14px', md: '16px' },
                      px: { xs: 1, md: 1.5 },
                      py: 0.85,
                      minWidth: 0,
                      textTransform: 'none',
                      textShadow: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        color: STITCH_THEME.primary,
                        backgroundColor: navHoverBg,
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {t('navigation.logout')}
                  </Button>
                </Box>
              )}
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: navInk,
                    textShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      opacity: 0.92,
                      backgroundColor: navHoverBg,
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              </Box>
            </Box>
          </Box>
        </Container>
        </Box>
      </Box>

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
        <Box sx={{
          width: 280,
          pt: 2,
          fontFamily: '"Space Grotesk", sans-serif',
          '& .MuiTypography-root': { fontFamily: '"Space Grotesk", sans-serif' },
          '& .MuiButton-root': { fontFamily: '"Space Grotesk", sans-serif' },
          '& .MuiListItemText-primary': { fontFamily: '"Space Grotesk", sans-serif' },
        }}>
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
          
          <List disablePadding dense>
            {PRIMARY_HOME_NAV.map((item) => {
              const Icon = item.Icon;
              return (
                <ListItem
                  key={item.path + item.labelKey}
                  onClick={() => {
                    if (item.scrollTop) {
                      scrollToTop();
                    } else {
                      history.push(item.path);
                    }
                    handleDrawerToggle();
                  }}
                  sx={{
                    color: isDarkMode ? colors.text : '#6B4F4F',
                    py: 0.85,
                    '&:hover': {
                      backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <Icon sx={{ fontSize: 20, opacity: 0.5 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.labelKey)}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                  />
                </ListItem>
              );
            })}
            <ListSubheader
              disableSticky
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 800,
                fontSize: '0.68rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: isDarkMode ? colors.textSecondary : '#8B7373',
                lineHeight: 2.4,
                px: 2,
                bgcolor: 'transparent',
              }}
            >
              {t('navigation.more')}
            </ListSubheader>
            {MORE_HOME_NAV.map((item) => {
              const Icon = item.Icon;
              return (
                <ListItem
                  key={item.path + item.labelKey}
                  onClick={() => {
                    history.push(item.path);
                    handleDrawerToggle();
                  }}
                  sx={{
                    color: isDarkMode ? colors.text : '#6B4F4F',
                    py: 0.85,
                    pl: 2,
                    '&:hover': {
                      backgroundColor: isDarkMode ? `${colors.accent}10` : 'rgba(107, 79, 79, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <Icon sx={{ fontSize: 20, opacity: 0.5 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.labelKey)}
                    primaryTypographyProps={{ fontWeight: 600, fontSize: '0.95rem' }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2, borderColor: isDarkMode ? colors.border : 'rgba(107, 79, 79, 0.2)' }} />

          {/* Mobile Stats Section */}
          <Box sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" sx={{
              color: isDarkMode ? colors.accent : '#6B4F4F',
              fontWeight: 600,
              fontSize: '1rem',
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
                }}>
                  {activeUsersStats.totalActive}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
                }}>
                  {t('common.active')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}>
                  {activeUsersStats.onlineUsers}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
                }}>
                  {t('common.online')}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{
                  color: isDarkMode ? colors.accent : '#6B4F4F',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                }}>
                  {activeUsersStats.recentJoiners}
                </Typography>
                <Typography variant="caption" sx={{
                  color: isDarkMode ? colors.textSecondary : '#8B6B6B',
                  fontSize: '0.7rem',
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
      </>
      )}

      {/* Hero — .hero-section uses stitch-sized viewport (100svh); child fills */}
      <Box
        ref={heroRef}
        className="hero-section"
        sx={{
          alignItems: 'stretch',
          background: 'none',
          backgroundImage: 'none',
        }}
      >
        <HeroSection onReservationClick={handleReservationOpen} />
      </Box>

      {/* stitch.tsx: The First Roast → The Bean Journey (after hero) */}
      <StitchFirstRoastSection isDarkMode={isDarkMode} />
      <StitchBeanJourneySection isDarkMode={isDarkMode} />

      {/* Custom Section with Two Picture Boxes — off for now */}
      {false && <CustomSection />}

      {/* Storytelling Timeline - turned off for now */}
      {false && (
        <StorytellingTimeline 
          title={t('about.title')}
          subtitle={t('about.subtitle')}
          items={coffeeShopTimelineData}
        />
      )}

      {/* Happy Coffee Time Section - turned off for now */}
      {false && (
      <Box 
        className="happy-coffee-time-section"
        sx={{
        padding: '6rem 0',
        backgroundImage: `url('/img/coffee/coffee-beans.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
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
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.7)' 
            : 'rgba(255, 255, 255, 0.9)',
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
                      alt="Coffee beans decoration"
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
                      alt="Coffee beans decoration"
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
      )}

      {/* Menu — stitch.tsx “The Daily Transmission” (#menu) */}
      <Box
        ref={menuRef}
        id="menu"
        sx={{
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 3 },
          bgcolor: isDarkMode ? '#1a1814' : '#f6f0e1',
          color: isDarkMode ? '#fcf6e8' : '#312f26',
          position: 'relative',
          zIndex: 10,
          WebkitFontSmoothing: 'antialiased',
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 10 } }}>
            <Box
              component="h2"
              sx={{
                display: 'inline-block',
                m: 0,
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.75rem' },
                lineHeight: 1.05,
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                px: { xs: 3, md: 4 },
                py: { xs: 1.5, md: 2 },
                bgcolor: '#a83100',
                color: '#ffefeb',
                border: `6px solid ${isDarkMode ? '#fcf6e8' : '#1A0F0D'}`,
                boxShadow: `6px 6px 0 0 ${isDarkMode ? '#fcf6e8' : '#1A0F0D'}`,
                transform: 'rotate(-1deg)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                '@media (hover: hover)': {
                  '&:hover': {
                    transform: 'rotate(-1deg) scale(1.02) translateY(-4px)',
                    boxShadow: `12px 12px 0 0 ${isDarkMode ? '#fcf6e8' : '#1A0F0D'}`,
                  },
                },
              }}
            >
              {t('menu.transmissionTitle')}
            </Box>
          </Box>

          {/* stitch.tsx #menu: md:grid-cols-2 gap-16; 4 items per column per page */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 8 },
            }}
          >
            {[
              { titleKey: 'menu.freshFromOven' as const, items: freshPageItems },
              { titleKey: 'menu.popularBrews' as const, items: popularPageItems },
            ].map((column, colIdx) => (
              <Box key={column.titleKey} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Typography
                  component="h3"
                  sx={{
                    m: 0,
                    mb: 4,
                    fontSize: { xs: '1.875rem', md: '1.875rem' },
                    lineHeight: 1.2,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.02em',
                    borderBottom: '8px solid #a83100',
                    display: 'inline-block',
                    alignSelf: 'flex-start',
                    pb: 0.5,
                    color: isDarkMode ? '#fcf6e8' : '#312f26',
                  }}
                >
                  {t(column.titleKey)}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {column.items.length === 0 && (
                    <Typography sx={{ opacity: 0.7, fontWeight: 500 }}>
                      {t('menu.subtitle')}
                    </Typography>
                  )}
                  {column.items.map((item, index) => {
                    const ink = isDarkMode ? '#fcf6e8' : '#1A0F0D';
                    const easeInk = [0.34, 1.56, 0.64, 1] as const;
                    const showElite = 'isNew' in item && Boolean((item as { isNew?: boolean }).isNew);
                    return (
                      <Box
                        key={`${colIdx}-${item.id}`}
                        component={motion.div}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.06 + colIdx * 0.1 }}
                        sx={{
                          position: 'relative',
                          bgcolor: isDarkMode ? 'rgba(252,246,232,0.06)' : '#fcf6e8',
                          border: `6px solid ${ink}`,
                          boxShadow: `4px 4px 0px 0px ${ink}`,
                          p: 3,
                          display: 'flex',
                          flexDirection: { xs: 'column', md: 'row' },
                          gap: 3,
                          transition: `transform 0.3s cubic-bezier(${easeInk.join(',')}), box-shadow 0.3s cubic-bezier(${easeInk.join(',')}), background-color 0.3s cubic-bezier(${easeInk.join(',')})`,
                          '@media (hover: hover)': {
                            '&:hover': {
                              bgcolor: isDarkMode ? 'rgba(242,219,215,0.12)' : '#f2dbd7',
                              transform: 'scale(1.02) translateY(-2px)',
                              boxShadow: `8px 8px 0px 0px ${ink}`,
                            },
                            '&:hover .menu-trans-img': {
                              transform: 'scale(1.1)',
                            },
                          },
                        }}
                      >
                        {showElite && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -16,
                              right: -16,
                              bgcolor: '#705900',
                              color: '#fff1d4',
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              p: 1,
                              transform: 'rotate(12deg)',
                              border: `6px solid ${ink}`,
                              zIndex: 2,
                              lineHeight: 1.2,
                            }}
                          >
                            {t('menu.eliteBadge')}
                          </Box>
                        )}
                        <Box
                          sx={{
                            width: { xs: '100%', md: 128 },
                            height: 128,
                            flexShrink: 0,
                            border: `6px solid ${ink}`,
                            overflow: 'hidden',
                            alignSelf: { xs: 'stretch', md: 'flex-start' },
                          }}
                        >
                          <Box
                            component="img"
                            className="menu-trans-img"
                            src={item.image}
                            alt={item.name}
                            onClick={() => handleProductClick(String(item.id))}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/img/coffee/coffee-placeholder.jpg';
                            }}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                              cursor: 'pointer',
                              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              gap: 2,
                              mb: 1,
                            }}
                          >
                            <Typography
                              component="h4"
                              onClick={() => handleProductClick(String(item.id))}
                              sx={{
                                m: 0,
                                fontSize: '1.5rem',
                                lineHeight: 1.2,
                                fontWeight: 900,
                                fontStyle: 'italic',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                color: isDarkMode ? '#fcf6e8' : '#312f26',
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography
                              component="span"
                              sx={{
                                fontSize: '1.25rem',
                                lineHeight: 1.2,
                                fontWeight: 700,
                                color: '#a83100',
                                flexShrink: 0,
                              }}
                            >
                              {item.price}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontSize: '0.875rem',
                              fontWeight: 500,
                              lineHeight: 1.5,
                              opacity: 0.8,
                              mb: 2,
                              color: 'inherit',
                            }}
                          >
                            {item.description}
                          </Typography>
                          <Button
                            variant="contained"
                            disableElevation
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleProductClick(String(item.id));
                            }}
                            sx={{
                              alignSelf: 'flex-start',
                              bgcolor: '#ff784d',
                              color: '#460f00',
                              fontWeight: 900,
                              fontSize: '0.875rem',
                              lineHeight: 1.25,
                              textTransform: 'uppercase',
                              px: 2,
                              py: 1,
                              border: `6px solid ${ink}`,
                              borderRadius: 0,
                              boxShadow: 'none',
                              transition: `all 0.3s cubic-bezier(${easeInk.join(',')})`,
                              '&:hover': {
                                bgcolor: '#ff784d',
                                transform: 'translateY(-2px) scale(1.05)',
                                boxShadow: `8px 8px 0px 0px ${ink}`,
                              },
                              '&:active': {
                                transform: 'translateY(2px) scale(0.98)',
                                boxShadow: `2px 2px 0px 0px ${ink}`,
                              },
                            }}
                          >
                            {t('menu.snagIt')}
                          </Button>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>

          {menuTotalPages > 1 && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                mt: '4rem',
                pt: '2rem',
                borderTop: `6px solid ${isDarkMode ? 'rgba(252,246,232,0.2)' : '#1A0F0D'}`,
              }}
            >
              <IconButton
                aria-label="Previous page"
                disabled={menuListPage <= 1}
                onClick={() => setMenuListPage((p) => Math.max(1, p - 1))}
                size="small"
                sx={{
                  color: '#a83100',
                  border: `3px solid ${isDarkMode ? '#fcf6e8' : '#1A0F0D'}`,
                  borderRadius: 0,
                  '&.Mui-disabled': { opacity: 0.35 },
                }}
              >
                <ArrowLeftIcon />
              </IconButton>
              <Box
                component="span"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: isDarkMode ? 'rgba(252,246,232,0.85)' : '#312f26',
                  minWidth: '5rem',
                  textAlign: 'center',
                }}
              >
                {menuListPage} / {menuTotalPages}
              </Box>
              <IconButton
                aria-label="Next page"
                disabled={menuListPage >= menuTotalPages}
                onClick={() => setMenuListPage((p) => Math.min(menuTotalPages, p + 1))}
                size="small"
                sx={{
                  color: '#a83100',
                  border: `3px solid ${isDarkMode ? '#fcf6e8' : '#1A0F0D'}`,
                  borderRadius: 0,
                  '&.Mui-disabled': { opacity: 0.35 },
                }}
              >
                <ArrowRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Team Grid (from TeamGrids) - after menu */}
      <TeamGridSection
        titleBefore="Meet the"
        titleAccent="Team Members"
        titleAfter=""
        colors={{ text: colors.text, background: colors.background }}
        isDarkMode={isDarkMode}
      />

      {/* Showcase Section with GSAP Animation */}
    {/*<Showcase />*/}

      {/* Events */}
      <Box id="services">
        <StitchEventsSection
          sectionRef={servicesRef}
          isDarkMode={isDarkMode}
          services={services.map((s) => ({
            id: s.id,
            title: s.title,
            description: s.description,
            image: s.image,
          }))}
          onEnlist={() => setReservationOpen(true)}
          onJoinDossier={() => history.push('/products')}
          onSecureSpot={() => handleEventClick(2)}
          onBookVault={() => setReservationOpen(true)}
        />
      </Box>

      {/* Collage Hero Section - Starbucks Style Polaroid */}
      <CollageHero />

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
                    borderRadius: '15px',
                    objectFit: 'cover',
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


      {/* Keep it Fresh (replaces former “Book your reservation” block); reservation modal still used from hero & elsewhere */}
      <StitchKeepItFreshSection isDarkMode={isDarkMode} />

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

      {/* Voices From The Archive — stitch.tsx testimonials grid */}
      <StitchArchiveTestimonialsSection
        sectionRef={testimonialsRef}
        isDarkMode={isDarkMode}
        testimonials={[
          {
            id: '1',
            quote:
              "The best coffee experience I've ever had. Every cup tells a story of quality and care.",
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
            quote: "I've traveled the world for coffee, and this place ranks among the very best.",
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
        onSubmitReview={handleSignup}
      />

      {/* CodeGrid 3D CRT Display */}
      <CodeGrid3DCRTDisplay />

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