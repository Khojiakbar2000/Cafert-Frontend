import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Avatar,
  Grid,
  Dialog,
  TextField
} from '@mui/material';
import HeroSection from '../../app/components/HeroSection';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Star as StarIcon,
  LocalCafe as CafeIcon,
  Restaurant as RestaurantIcon,
  Coffee as CoffeeIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import NewsletterSubscription from '../components/NewsletterSubscription';
import FloatingStyleSwitcher from '../components/FloatingStyleSwitcher';
import { useTheme as useThemeContext } from '../context/ThemeContext';

// Global Styles for Animations
const globalStyles = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes steam {
    0% {
      opacity: 0;
      transform: translateY(0) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translateY(-20px) scale(1.2);
    }
    100% {
      opacity: 0;
      transform: translateY(-40px) scale(0.8);
    }
  }
`;

interface CoffeeHomePageProps {
  setSignupOpen?: (isOpen: boolean) => void;
  setLoginOpen?: (isOpen: boolean) => void;
}

const CoffeeHomePage: React.FC<CoffeeHomePageProps> = ({ 
  setSignupOpen, 
  setLoginOpen 
}: CoffeeHomePageProps) => {
  const { isDarkMode, toggleTheme, colors } = useThemeContext();
  const [activeMenuTab, setActiveMenuTab] = useState('popular-coffees');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
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
  
  // Refs for smooth scrolling
  const heroRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const menuItems = {
    'popular-coffees': [
      { 
        id: 1, 
        name: 'Classic Espresso', 
        price: '$3.50', 
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop', 
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
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 
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
        image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop', 
        description: 'Smooth espresso with caramel and steamed milk', 
        ingredients: 'Espresso, caramel syrup, steamed milk',
        rating: 4.7,
        orders: 856,
        isPopular: true
      },
      { 
        id: 4, 
        name: 'Mocha Supreme', 
        price: '$5.50', 
        image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop', 
        description: 'Rich chocolate and espresso with whipped cream', 
        ingredients: 'Espresso, dark chocolate, steamed milk, cream',
        rating: 4.6,
        orders: 720,
        isPopular: true
      },
      { 
        id: 5, 
        name: 'Americano Classic', 
        price: '$3.20', 
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop', 
        description: 'Bold espresso diluted with hot water for a clean taste', 
        ingredients: 'Espresso, hot water',
        rating: 4.5,
        orders: 650,
        isPopular: true
      },
      { 
        id: 6, 
        name: 'Macchiato Art', 
        price: '$3.80', 
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop', 
        description: 'Espresso "marked" with a touch of steamed milk', 
        ingredients: 'Espresso, small amount of steamed milk',
        rating: 4.4,
        orders: 580,
        isPopular: true
      }
    ],
    'fresh-menu': [
      { 
        id: 7, 
        name: 'Avocado Toast Deluxe', 
        price: '$12.50', 
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop', 
        description: 'Fresh avocado on artisan sourdough with microgreens', 
        ingredients: 'Sourdough bread, ripe avocado, microgreens, sea salt',
        rating: 4.8,
        orders: 420,
        isNew: true
      },
      { 
        id: 8, 
        name: 'Acai Power Bowl', 
        price: '$14.00', 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 
        description: 'Fresh acai with granola, berries, and honey', 
        ingredients: 'Acai puree, granola, mixed berries, honey, coconut',
        rating: 4.9,
        orders: 380,
        isNew: true
      },
      { 
        id: 9, 
        name: 'Quinoa Buddha Bowl', 
        price: '$16.50', 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 
        description: 'Nutritious quinoa with roasted vegetables and tahini', 
        ingredients: 'Quinoa, roasted vegetables, tahini sauce, seeds',
        rating: 4.7,
        orders: 320,
        isNew: true
      },
      { 
        id: 10, 
        name: 'Eggs Benedict Royal', 
        price: '$18.00', 
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', 
        description: 'Poached eggs with hollandaise on English muffin', 
        ingredients: 'Fresh eggs, English muffin, ham, hollandaise sauce',
        rating: 4.8,
        orders: 450,
        isNew: true
      },
      { 
        id: 11, 
        name: 'Chia Pudding Paradise', 
        price: '$11.00', 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 
        description: 'Overnight chia pudding with fresh fruits and nuts', 
        ingredients: 'Chia seeds, almond milk, fresh fruits, nuts, honey',
        rating: 4.6,
        orders: 280,
        isNew: true
      },
      { 
        id: 12, 
        name: 'Smoothie Bowl Sunrise', 
        price: '$13.50', 
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop', 
        description: 'Vibrant smoothie bowl with tropical fruits and granola', 
        ingredients: 'Mixed tropical fruits, yogurt, granola, coconut, seeds',
        rating: 4.7,
        orders: 340,
        isNew: true
      }
    ]
  };

  const testimonials = [
    {
      id: 1,
      text: "The best coffee I've ever tasted! The atmosphere is perfect for working and the staff is incredibly friendly.",
      author: "Sarah Johnson",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 2,
      text: "Amazing food and coffee. This place has become my go-to spot for meetings and casual dining.",
      author: "Michael Chen",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face"
    },
    {
      id: 3,
      text: "Perfect blend of comfort and quality. The pastries are to die for and the coffee is consistently excellent.",
      author: "Emily Rodriguez",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face"
    }
  ];

  const services = [
    {
      id: 1,
      title: "Private Events",
      description: "Host your special occasions in our elegant private dining room",
      icon: <RestaurantIcon />,
      image: "/coffee-hero.jpg"
    },
    {
      id: 2,
      title: "Catering Services",
      description: "Let us cater your next event with our delicious menu",
      icon: <CafeIcon />,
      image: "/coffee-gallery.jpg"
    },
    {
      id: 3,
      title: "Coffee Workshops",
      description: "Learn the art of coffee brewing from our expert baristas",
      icon: <CoffeeIcon />,
      image: "/coffee-menu.jpg"
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

  // User profiles for active users (4 users)
  const userProfiles = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      status: 'online',
      lastActivity: '2 min ago',
      activity: 'Ordered Caramel Latte',
      location: 'New York, NY'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      status: 'online',
      lastActivity: '1 min ago',
      activity: 'Browsing menu',
      location: 'San Francisco, CA'
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      status: 'online',
      lastActivity: '3 min ago',
      activity: 'Added to favorites',
      location: 'Los Angeles, CA'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      status: 'online',
      lastActivity: 'just now',
      activity: 'Joined community',
      location: 'Chicago, IL'
    }
  ];

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active users simulation
  useEffect(() => {
    // Simulate active users count
    const updateActiveUsers = () => {
      const baseUsers = 45;
      const randomVariation = Math.floor(Math.random() * 20) - 10;
      setActiveUsers(Math.max(30, baseUsers + randomVariation));
    };

    // Initial update
    updateActiveUsers();

    // Update every 5 seconds
    const interval = setInterval(updateActiveUsers, 5000);

    return () => clearInterval(interval);
  }, []);

  // Recent activities simulation
  useEffect(() => {
    const generateActivity = () => {
      const randomUser = userProfiles[Math.floor(Math.random() * userProfiles.length)];
      const randomMessage = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      return {
        id: Date.now(),
        name: randomUser.name,
        avatar: randomUser.avatar,
        message: randomMessage,
        type: randomType.type,
        icon: randomType.icon,
        color: randomType.color,
        time: 'just now'
      };
    };

    const addActivity = () => {
      setRecentActivities(prev => {
        const newActivity = generateActivity();
        const updated = [newActivity, ...prev.slice(0, 4)]; // Keep only 5 activities
        return updated;
      });
    };

    // Add initial activities
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addActivity(), i * 1000);
    }

    // Add new activity every 3-8 seconds
    const interval = setInterval(() => {
      addActivity();
    }, Math.random() * 5000 + 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
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
              display: { xs: 'none', md: 'flex' }, 
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
                Home
              </Typography>
              <Typography
                variant="body1"
                onClick={() => window.location.href = '/coffees'}
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
                Menu
              </Typography>
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
                Orders
              </Typography>
              <Typography
                variant="body1"
                onClick={() => window.location.href = '/member-page'}
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
                Member
              </Typography>
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
                Help
              </Typography>
            </Box>
            
            {/* Right side controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
              <LanguageToggle isDarkMode={isDarkMode} />
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
                  '&:hover': {
                    backgroundColor: isDarkMode ? colors.accentDark : '#8B6B6B',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box ref={heroRef}>
        <HeroSection />
      </Box>

      {/* Happy Coffee Time Section */}
      <Box sx={{
        padding: '6rem 0',
        backgroundColor: colors.surface,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
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
                    Welcome to
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
                    Happy Coffee Time
                  </Typography>
                  <Typography variant="h5" sx={{
                    color: colors.textSecondary,
                    fontWeight: 400,
                    mb: 4,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    lineHeight: 1.4
                  }}>
                    Where every sip tells a story
                  </Typography>
                  <Typography variant="body1" sx={{
                    color: colors.textSecondary,
                    lineHeight: 1.8,
                    mb: 4,
                    fontSize: '1.1rem'
                  }}>
                    Experience the perfect blend of tradition and innovation in every cup. 
                    Our artisanal coffee creates moments of pure delight that awaken your senses.
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
                    src="/coffee-beans.jpg"
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
                      src="/coffee-beans.jpg"
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
                      src="/coffee-beans.jpg"
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
              Special Menu
            </Typography>
            <Typography variant="h6" sx={{
              color: colors.textSecondary,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Carefully crafted beverages and delicious treats made with the finest ingredients
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
                { key: 'popular-coffees', label: 'Popular Coffees', icon: '☕' },
                { key: 'fresh-menu', label: 'Fresh Menu', icon: '🥗' }
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
            {menuItems[activeMenuTab as keyof typeof menuItems].map((item, index) => (
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
                  '&:hover': {
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transform: 'translateY(-8px) scale(1.02)'
                  }
                }}>
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
                      {item.isPopular ? '🔥 Popular' : '✨ New'}
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

                    {/* Rating and Orders */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#FFD700', fontSize: '1.1rem' }} />
                        <Typography variant="body2" sx={{ 
                          color: colors.textSecondary,
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}>
                          {item.rating}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ 
                        color: colors.textSecondary,
                        fontSize: '0.85rem'
                      }}>
                        ({item.orders} orders)
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
                Join Our Active Community
              </Typography>
              <Typography variant="h6" sx={{
                color: colors.textSecondary,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                See what's happening right now in our coffee community
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
                      Active Users ({activeUsers})
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
                        </Box>

                        {/* User Info */}
                        <Box sx={{ textAlign: 'center' }}>
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
                    {userProfiles.map((_, index) => (
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
                    ))}
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
                    {recentActivities.map((activity, index) => (
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
                            borderColor: activity.color
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
                              backgroundColor: activity.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: colors.background,
                              fontSize: '0.7rem',
                              border: `2px solid ${colors.background}`
                            }}>
                              {activity.icon}
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
                    ))}
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
        backgroundColor: colors.primary,
        color: colors.background,
        padding: '4rem 0 2rem',
        position: 'relative'
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{
                fontWeight: 700,
                color: colors.accent,
                mb: 2,
                fontFamily: 'Playfair Display, serif'
              }}>
                Cafert
              </Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                mb: 3,
                lineHeight: 1.6
              }}>
                Experience the perfect blend of tradition and innovation in every cup. 
                Join our community of coffee lovers.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton sx={{ color: colors.accent, '&:hover': { color: colors.accentLight } }}>
                  <FacebookIcon />
                </IconButton>
                <IconButton sx={{ color: colors.accent, '&:hover': { color: colors.accentLight } }}>
                  <InstagramIcon />
                </IconButton>
                <IconButton sx={{ color: colors.accent, '&:hover': { color: colors.accentLight } }}>
                  <TwitterIcon />
                </IconButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                color: colors.text,
                fontWeight: 600,
                marginBottom: '1rem',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontFamily: 'Playfair Display, serif'
              }}>Quick Links</Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                fontSize: { xs: '0.9rem', md: '1rem' },
                mb: 1,
                '&:hover': { color: colors.accent }
              }}>Our Menu</Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                fontSize: { xs: '0.9rem', md: '1rem' },
                mb: 1,
                '&:hover': { color: colors.accent }
              }}>Services</Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                fontSize: { xs: '0.9rem', md: '1rem' },
                mb: 1,
                '&:hover': { color: colors.accent }
              }}>Gallery</Typography>
              <Typography variant="body2" sx={{
                color: colors.textSecondary,
                cursor: 'pointer',
                transition: 'color 0.3s ease',
                fontSize: { xs: '0.9rem', md: '1rem' },
                '&:hover': { color: colors.accent }
              }}>Contact</Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ 
                color: colors.text,
                fontWeight: 600,
                marginBottom: '1rem',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontFamily: 'Playfair Display, serif'
              }}>Contact Info</Typography>
              <Typography variant="body2" sx={{ 
                color: colors.textSecondary,
                marginBottom: '0.5rem',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                123 Coffee Street, Brewtown, BT 12345
              </Typography>
              <Typography variant="body2" sx={{ 
                color: colors.textSecondary,
                marginBottom: '1rem',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Phone: (555) 123-4567 | Email: info@cafert.com
              </Typography>
              <Typography variant="h6" sx={{ 
                color: colors.text,
                fontWeight: 600,
                marginBottom: '1rem',
                fontSize: { xs: '1rem', md: '1.1rem' },
                fontFamily: 'Playfair Display, serif'
              }}>Hours</Typography>
              <Typography variant="body2" sx={{ 
                color: colors.textSecondary,
                marginBottom: '0.5rem',
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Monday - Friday: 7:00 AM - 8:00 PM
              </Typography>
              <Typography variant="body2" sx={{ 
                color: colors.textSecondary,
                fontSize: { xs: '0.9rem', md: '1rem' }
              }}>
                Saturday - Sunday: 8:00 AM - 9:00 PM
              </Typography>
            </Grid>
          </Grid>
          
          <Box sx={{ 
            borderTop: `1px solid ${colors.border}`,
            marginTop: '3rem',
            paddingTop: '2rem',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ 
              color: colors.textSecondary,
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}>
              © 2024 Cafert. All rights reserved.
            </Typography>
          </Box>
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