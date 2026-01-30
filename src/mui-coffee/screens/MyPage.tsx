import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Snackbar,
  TextField,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as OrdersIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Replay as ReplayIcon,
  TrackChanges as TrackChangesIcon,
  LocationOn as LocationOnIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  PlayArrow as PlayArrowIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGlobals } from '../../app/hooks/useGlobals';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { serverApi } from '../../lib/config';

import MemberService from '../../app/services/MemberService';
import OrderService from '../../app/services/OrderService';
import { OrderInquiry } from '../../lib/types/order';
import { OrderStatus } from '../../lib/enums/order.enum';
import { ProductStatus, ProductCollection, ProductSize } from '../../lib/enums/product.enum';
import { CartItem } from '../../lib/types/search';
import { retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders } from '../../app/screens/ordersPage/selector';

interface MyPageProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    surface: string;
  };
}

const MyPage: React.FC<MyPageProps> = ({ colors }) => {
  const { authMember, setAuthMember } = useGlobals();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const history = useHistory();

  // Get orders from Redux store
  const pausedOrders = useSelector(retrievePausedOrders);
  const processOrders = useSelector(retrieveProcessOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    active: 0,
    monthly: 0,
    totalSpent: 0,
    loyaltyPoints: 0
  });

  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Profile editing form state
  const [profileForm, setProfileForm] = useState({
    memberNick: '',
    memberPhone: '',
    memberAddress: '',
    memberDesc: ''
  });
  
  // Image upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Debug logging
  console.log('MyPage - authMember:', authMember);
  console.log('MyPage - localStorage memberData:', localStorage.getItem('memberData'));

  const componentColors = colors || {
    primary: isDarkMode ? '#ffd700' : '#b38e6a',
    secondary: isDarkMode ? '#ffed4e' : '#8b6b4a',
    accent: isDarkMode ? '#ffd700' : '#b38e6a',
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#2c2c2c',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa'
  };

  // Remove hardcoded mock data - now using Redux store data
  const fetchUserData = useCallback(async () => {
    if (!authMember?._id) {
      console.log('No authMember._id found');
      return;
    }
    
    console.log('=== MY PAGE DEBUG ===');
    console.log('Fetching orders for user:', authMember._id);
    setIsLoadingOrders(true);
    try {
      const orderService = new OrderService();
      
      // Try to fetch real orders first
      console.log('=== TEST 1: Fetching orders by status ===');
      
      let allOrders: any[] = [];
      
      try {
        const allOrdersInquiry: OrderInquiry = {
          page: 1,
          limit: 50,
          orderStatus: undefined
        };
        
        console.log('Fetching all orders with inquiry:', allOrdersInquiry);
        allOrders = await orderService.getMyOrders(allOrdersInquiry);
        console.log('Real orders received:', allOrders);
        
        if (!allOrders || allOrders.length === 0) {
          console.log('No real orders found, using Redux store data');
          // Combine all orders from Redux store
          allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];
        }
      } catch (error) {
        console.log('API failed, using Redux store data:', error);
        // Combine all orders from Redux store
        allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];
      }
      
      console.log('Final orders to display:', allOrders);
      console.log('Number of orders:', allOrders?.length || 0);
      
      if (allOrders && allOrders.length > 0) {
        console.log('Order statuses found:', allOrders.map(o => o.orderStatus));
        console.log('Completed orders:', allOrders.filter(o => o.orderStatus === OrderStatus.FINISH));
        console.log('Process orders:', allOrders.filter(o => o.orderStatus === OrderStatus.PROCESS));
        console.log('Paused orders:', allOrders.filter(o => o.orderStatus === OrderStatus.PAUSE));
        
        // Log each order details
        allOrders.forEach((order, index) => {
          console.log(`Order ${index + 1}:`, {
            id: order._id,
            status: order.orderStatus,
            total: order.orderTotal,
            createdAt: order.createdAt,
            memberId: order.memberId
          });
        });
      } else {
        console.log('No orders found at all');
      }
      
      // Set recent orders (show all orders, sorted by creation date)
      const sortedOrders = allOrders?.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
      
      console.log('Sorted orders for recent orders:', sortedOrders.slice(0, 5));
      setRecentOrders(sortedOrders);
      
      // Calculate enhanced stats
      const total = allOrders?.length || 0;
      const completed = allOrders?.filter(o => o.orderStatus === OrderStatus.FINISH).length || 0;
      const inProgress = allOrders?.filter(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus)).length || 0;
      const active = allOrders?.filter(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus)).length || 0;
      
      // Calculate monthly orders
      const now = new Date();
      const thisMonth = allOrders?.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }).length || 0;
      
      // Calculate total spent
      const totalSpent = allOrders?.reduce((sum, o) => sum + (o.orderTotal || 0), 0) || 0;
      
      // Calculate loyalty points (1 point per $1 spent)
      const loyaltyPoints = Math.floor(totalSpent);
      
      console.log('Final order stats:', { total, completed, inProgress, active, monthly: thisMonth, totalSpent, loyaltyPoints });
      
      setOrderStats({
        total,
        completed,
        inProgress,
        active,
        monthly: thisMonth,
        totalSpent,
        loyaltyPoints
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use Redux store data as fallback
      console.log('Using Redux store data as fallback');
      const allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];
      setRecentOrders(allOrders);
      const now = new Date();
      const thisMonth = allOrders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }).length;
      const totalSpent = allOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);
      setOrderStats({
        total: allOrders.length,
        completed: allOrders.filter(o => o.orderStatus === OrderStatus.FINISH).length,
        inProgress: allOrders.filter(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus)).length,
        active: allOrders.filter(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus)).length,
        monthly: thisMonth,
        totalSpent,
        loyaltyPoints: Math.floor(totalSpent)
      });
    } finally {
      setIsLoadingOrders(false);
    }
  }, [authMember, pausedOrders, processOrders, finishedOrders]);

  useEffect(() => {
    if (authMember?._id) {
      fetchUserData();
    }
  }, [authMember?._id, fetchUserData]);

  // Add a periodic refresh to catch completed orders
  useEffect(() => {
    if (!authMember?._id) return;
    
    const interval = setInterval(() => {
      fetchUserData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [authMember?._id, fetchUserData]);

  // Ensure orders are loaded from Redux store on component mount
  useEffect(() => {
    if (authMember?._id && (pausedOrders.length === 0 && processOrders.length === 0 && finishedOrders.length === 0)) {
      fetchUserData();
    }
  }, [authMember?._id, pausedOrders.length, processOrders.length, finishedOrders.length, fetchUserData]);

  // Remove createTestOrder function - no longer needed since we're using Redux data

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const member = new MemberService();
      await member.logout();
      setAuthMember(null);
      setSnackbarMessage('Logged out successfully!');
      setSnackbarType('success');
      setShowSnackbar(true);
      setTimeout(() => {
        history.push('/');
      }, 1000);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
      setSnackbarMessage('Error logging out');
      setSnackbarType('error');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove handleRefreshData function - no longer needed since we're using Redux data

  const handleEditProfile = () => {
    // Initialize form with current user data
    setProfileForm({
      memberNick: authMember?.memberNick || '',
      memberPhone: authMember?.memberPhone || '',
      memberAddress: authMember?.memberAddress || '',
      memberDesc: authMember?.memberDesc || ''
    });
    // Reset image state
    setSelectedImage(null);
    setImagePreview(null);
    setShowProfileDialog(true);
  };

  const handleCloseProfileDialog = () => {
    setShowProfileDialog(false);
    setProfileForm({
      memberNick: '',
      memberPhone: '',
      memberAddress: '',
      memberDesc: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleProfileFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSnackbarMessage('Please select a valid image file.');
        setSnackbarType('error');
        setShowSnackbar(true);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarMessage('Image size should be less than 5MB.');
        setSnackbarType('error');
        setShowSnackbar(true);
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSaveProfile = async () => {
    if (!authMember) return;
    
    try {
      setIsEditingProfile(true);
      
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("memberNick", profileForm.memberNick || "");
      formData.append("memberPhone", profileForm.memberPhone || "");
      formData.append("memberAddress", profileForm.memberAddress || "");
      formData.append("memberDesc", profileForm.memberDesc || "");
      
      // Add image if selected
      if (selectedImage) {
        formData.append("memberImage", selectedImage);
      }
      
      // Make direct API call for image upload
      const result = await fetch(`${serverApi}member/update`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      
      if (!result.ok) {
        throw new Error('Failed to update profile');
      }
      
      const updatedMember = await result.json();
      
      if (updatedMember) {
        setAuthMember(updatedMember);
        localStorage.setItem("memberData", JSON.stringify(updatedMember));
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarType('success');
        setShowSnackbar(true);
        handleCloseProfileDialog();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Failed to update profile. Please try again.');
      setSnackbarType('error');
      setShowSnackbar(true);
    } finally {
      setIsEditingProfile(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case OrderStatus.PAUSE: return '#ff9800';
      case OrderStatus.PROCESS: return '#2196f3';
      case OrderStatus.FINISH: return '#4caf50';
      case OrderStatus.DELETE: return '#f44336';
      default: return componentColors.textSecondary;
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAUSE: return 'Paused';
      case OrderStatus.PROCESS: return 'Processing';
      case OrderStatus.FINISH: return 'Finished';
      case OrderStatus.DELETE: return 'Cancelled';
      default: return 'Unknown';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case OrderStatus.PAUSE: return <ScheduleIcon />;
      case OrderStatus.PROCESS: return <ShippingIcon />;
      case OrderStatus.FINISH: return <CheckCircleIcon />;
      case OrderStatus.DELETE: return <CheckCircleIcon />;
      default: return <ScheduleIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get last order for reorder action
  const lastOrder = recentOrders.length > 0 ? recentOrders[0] : null;
  const activeOrder = recentOrders.find(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus));

  // Smart Actions based on user state
  const smartActions = useMemo(() => {
    const actions: Array<{
      title: string;
      description: string;
      icon: React.ReactElement;
      color: string;
      action: () => void;
    }> = [];
    
    if (lastOrder) {
      actions.push({
        title: 'Reorder Last Order',
        description: `Quick reorder from ${formatDate(lastOrder.createdAt)}`,
        icon: <ReplayIcon />,
        color: componentColors.accent,
        action: () => {
          history.push('/orders');
        }
      });
    }
    
    if (activeOrder) {
      actions.push({
        title: `Track Order #${activeOrder._id?.slice(-4) || '0001'}`,
        description: 'View real-time order status',
        icon: <TrackChangesIcon />,
        color: '#2196f3',
        action: () => history.push('/orders')
      });
    }
    
    if (authMember?.memberAddress) {
      actions.push({
        title: 'Update Delivery Info',
        description: 'Change your delivery address',
        icon: <LocationOnIcon />,
        color: '#4caf50',
        action: handleEditProfile
      });
    }
    
    return actions;
  }, [recentOrders, authMember, componentColors.accent, history]);

  // Enhanced stats with trends
  const stats = [
    { 
      label: 'Active Orders', 
      value: orderStats.active.toString(), 
      icon: <ShippingIcon />, 
      color: '#2196f3',
      trend: '+1 today',
      highlighted: true
    },
    {
      label: 'Orders This Month', 
      value: orderStats.monthly.toString(), 
      icon: <OrdersIcon />,
      color: componentColors.accent,
      trend: '↑ from last week'
    },
    { 
      label: 'Total Spent', 
      value: `$${orderStats.totalSpent.toFixed(0)}`, 
      icon: <AttachMoneyIcon />, 
      color: '#4caf50',
      trend: 'All time'
    },
    { 
      label: 'Loyalty Points', 
      value: orderStats.loyaltyPoints.toString(), 
      icon: <StarIcon />, 
      color: '#ff9800',
      trend: `${Math.floor(orderStats.loyaltyPoints / 10)} free drinks`
    },
  ];

  // Temporarily comment out auth check for debugging
  // if (!authMember) {
  //   history.push('/');
  //   return null;
  // }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: componentColors.background,
        background: isDarkMode
          ? `radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(179, 142, 106, 0.1) 0%, transparent 50%),
             ${componentColors.background}`
          : `radial-gradient(circle at 20% 50%, rgba(179, 142, 106, 0.08) 0%, transparent 50%),
             radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
             ${componentColors.background}`,
        backgroundAttachment: 'fixed',
        pt: 12,
        pb: 4,
        px: isMobile ? 2 : 4,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode
            ? 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(179, 142, 106, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Bento Grid Container */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile 
              ? '1fr' 
              : 'repeat(12, 1fr)',
            gridAutoRows: 'minmax(200px, auto)',
            gap: 3,
            mb: 4
          }}
        >
          {/* Profile Header - Large Card (spans 2 columns on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              gridColumn: isMobile ? '1' : 'span 12',
              gridRow: 'span 1'
            }}
          >
            <Card
              sx={{
                backgroundColor: componentColors.surface,
                borderRadius: '20px',
                border: `1px solid ${componentColors.border}`,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                height: '100%',
                background: isDarkMode 
                  ? `linear-gradient(135deg, ${componentColors.surface} 0%, ${componentColors.surface}dd 100%)`
                  : `linear-gradient(135deg, ${componentColors.surface} 0%, #ffffff 100%)`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"}
                      sx={{
                        width: 80,
                        height: 80,
                        border: isDarkMode
                          ? '3px solid rgba(255, 255, 255, 0.2)'
                          : '3px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: isDarkMode
                          ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.02), 0 0 20px ${componentColors.accent}30`
                          : `inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.9), 0 0 20px ${componentColors.accent}20`
                      }}
                    />
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: isDarkMode ? '#e0e0e0' : '#2c2c2c',
                          fontWeight: 700,
                          mb: 0.5,
                          fontSize: isMobile ? '1.5rem' : '2rem'
                        }}
                      >
                        {authMember?.memberNick || 'Guest User'}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: componentColors.textSecondary,
                          fontSize: '1rem'
                        }}
                      >
                        {authMember?.memberType || 'Regular customer'} • Last order {lastOrder ? `${Math.floor((Date.now() - new Date(lastOrder.createdAt).getTime()) / (1000 * 60 * 60))} hours ago` : 'never'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEditProfile}
                      sx={{
                        backgroundColor: isDarkMode 
                          ? 'rgba(42, 42, 42, 0.3)'
                          : 'rgba(248, 249, 250, 0.5)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderColor: isDarkMode
                          ? 'rgba(255, 255, 255, 0.15)'
                          : 'rgba(255, 255, 255, 0.6)',
                        color: componentColors.text,
                        px: 2.5,
                        py: 1.5,
                        borderRadius: '12px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        boxShadow: isDarkMode
                          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 4px 4px 8px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.02)'
                          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 4px 4px 8px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          borderColor: componentColors.accent,
                          backgroundColor: isDarkMode
                            ? 'rgba(42, 42, 42, 0.5)'
                            : 'rgba(248, 249, 250, 0.7)',
                          boxShadow: isDarkMode
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.03)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 0, 0, 0.12), -3px -3px 6px rgba(255, 255, 255, 0.9)',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      Edit Profile
                    </Button>
                    {activeOrder ? (
                      <Button
                        variant="contained"
                        startIcon={<TrackChangesIcon />}
                        onClick={() => history.push('/orders')}
                        sx={{
                          backgroundColor: componentColors.accent,
                          color: 'white',
                          px: 3,
                          py: 1.5,
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: isDarkMode
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 6px 6px 12px rgba(0, 0, 0, 0.4), -3px -3px 6px rgba(255, 255, 255, 0.1)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 6px 6px 12px rgba(0, 0, 0, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            backgroundColor: componentColors.secondary,
                            boxShadow: isDarkMode
                              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 8px 8px 16px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.15)'
                              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 8px 8px 16px rgba(0, 0, 0, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.6)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Track Active Order
                      </Button>
                    ) : lastOrder ? (
                      <Button
                        variant="contained"
                        startIcon={<ReplayIcon />}
                        onClick={() => history.push('/orders')}
                        sx={{
                          backgroundColor: componentColors.accent,
                          color: 'white',
                          px: 3,
                          py: 1.5,
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: isDarkMode
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 6px 6px 12px rgba(0, 0, 0, 0.4), -3px -3px 6px rgba(255, 255, 255, 0.1)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 6px 6px 12px rgba(0, 0, 0, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            backgroundColor: componentColors.secondary,
                            boxShadow: isDarkMode
                              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 8px 8px 16px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.15)'
                              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 8px 8px 16px rgba(0, 0, 0, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.6)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Order Again
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => history.push('/coffees')}
                        sx={{
                          backgroundColor: componentColors.accent,
                          color: 'white',
                          px: 3,
                          py: 1.5,
                          borderRadius: '12px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: isDarkMode
                            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 6px 6px 12px rgba(0, 0, 0, 0.4), -3px -3px 6px rgba(255, 255, 255, 0.1)'
                            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 6px 6px 12px rgba(0, 0, 0, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.5)',
                          '&:hover': {
                            backgroundColor: componentColors.secondary,
                            boxShadow: isDarkMode
                              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 8px 8px 16px rgba(0, 0, 0, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.15)'
                              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 8px 8px 16px rgba(0, 0, 0, 0.25), -4px -4px 8px rgba(255, 255, 255, 0.6)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Place First Order
                      </Button>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards - Bento Grid Layout */}
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
              style={{
                gridColumn: isMobile 
                  ? '1' 
                  : index === 0 ? 'span 6' : index === 1 ? 'span 6' : index === 2 ? 'span 4' : 'span 4',
                gridRow: 'span 1'
              }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  sx={{
                    backgroundColor: stat.highlighted 
                      ? (isDarkMode 
                          ? 'rgba(33, 150, 243, 0.25)' 
                          : 'rgba(33, 150, 243, 0.15)')
                      : (isDarkMode 
                          ? 'rgba(42, 42, 42, 0.4)' 
                          : 'rgba(248, 249, 250, 0.6)'),
                    backdropFilter: 'blur(20px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    borderRadius: '24px',
                    border: isDarkMode
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: isDarkMode
                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.02)'
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 6px 6px 12px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '1px',
                      background: isDarkMode
                        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                      zIndex: 1
                    },
                    '&:hover': {
                      boxShadow: isDarkMode
                        ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.03), 0 0 20px ${stat.color}20`
                        : `inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9), 0 0 20px ${stat.color}15`,
                      borderColor: stat.color,
                      transform: 'translateY(-4px) scale(1.02)',
                      backgroundColor: stat.highlighted 
                        ? (isDarkMode 
                            ? 'rgba(33, 150, 243, 0.3)' 
                            : 'rgba(33, 150, 243, 0.2)')
                        : (isDarkMode 
                            ? 'rgba(42, 42, 42, 0.5)' 
                            : 'rgba(248, 249, 250, 0.7)')
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                      boxShadow: isDarkMode
                        ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.02)'
                        : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
                    }
                  }}
                  onClick={() => history.push('/orders')}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: `${stat.color}20`,
                        borderRadius: '16px',
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 12px ${stat.color}20`
                      }}
                    >
                      <Box sx={{ color: stat.color, fontSize: 28 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : '#2c2c2c',
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: isMobile ? '1.75rem' : '2.25rem'
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: componentColors.textSecondary,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      mb: 1
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: componentColors.textSecondary,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 14 }} />
                    {stat.trend}
                  </Typography>
                </Card>
              </motion.div>
            </motion.div>
          ))}

          {/* Quick Actions - Medium Card */}
          {smartActions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                gridColumn: isMobile ? '1' : 'span 4',
                gridRow: 'span 2'
              }}
            >
              <Card
                sx={{
                  backgroundColor: isDarkMode 
                    ? 'rgba(42, 42, 42, 0.4)'
                    : 'rgba(248, 249, 250, 0.6)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderRadius: '24px',
                  border: isDarkMode
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: isDarkMode
                    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 8px 8px 16px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.02)'
                    : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 8px 8px 16px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)',
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: isDarkMode
                      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                    zIndex: 1
                  },
                  '&:hover': {
                    boxShadow: isDarkMode
                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 12px 12px 24px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.03)'
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 12px 12px 24px rgba(0, 0, 0, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-4px)',
                    borderColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : '#2c2c2c',
                      fontWeight: 700,
                      mb: 3,
                      fontSize: '1.25rem'
                    }}
                  >
                    Quick Actions
                  </Typography>
                  <Stack spacing={2}>
                    {smartActions.map((action, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          fullWidth
                          startIcon={action.icon}
                          onClick={action.action}
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            p: 2,
                            borderRadius: '12px',
                            backgroundColor: isDarkMode
                              ? 'rgba(42, 42, 42, 0.3)'
                              : 'rgba(248, 249, 250, 0.5)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: isDarkMode
                              ? '1px solid rgba(255, 255, 255, 0.1)'
                              : '1px solid rgba(255, 255, 255, 0.5)',
                            color: componentColors.text,
                            textTransform: 'none',
                            boxShadow: isDarkMode
                              ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 4px 4px 8px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.02)'
                              : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 4px 4px 8px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                              backgroundColor: isDarkMode
                                ? 'rgba(42, 42, 42, 0.5)'
                                : 'rgba(248, 249, 250, 0.7)',
                              boxShadow: isDarkMode
                                ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.03), 0 0 15px ${action.color}20`
                                : `inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 0, 0, 0.12), -3px -3px 6px rgba(255, 255, 255, 0.9), 0 0 15px ${action.color}15`,
                              transform: 'translateX(4px)',
                              borderColor: action.color,
                            },
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <Box sx={{ flex: 1, textAlign: 'left' }}>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 600,
                                color: componentColors.text,
                                mb: 0.5
                              }}
                            >
                              {action.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: componentColors.textSecondary,
                                fontSize: '0.8rem',
                                display: 'block'
                              }}
                            >
                              {action.description}
                            </Typography>
                          </Box>
                        </Button>
                      </motion.div>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Recent Orders - Large Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              gridColumn: isMobile ? '1' : smartActions.length > 0 ? 'span 8' : 'span 12',
              gridRow: 'span 2'
            }}
          >
            <Card
              sx={{
                backgroundColor: isDarkMode 
                  ? 'rgba(42, 42, 42, 0.4)'
                  : 'rgba(248, 249, 250, 0.6)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRadius: '24px',
                border: isDarkMode
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: isDarkMode
                  ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 8px 8px 16px rgba(0, 0, 0, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.02)'
                  : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 8px 8px 16px rgba(0, 0, 0, 0.1), -4px -4px 8px rgba(255, 255, 255, 0.8)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: isDarkMode
                    ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                  zIndex: 1
                },
                '&:hover': {
                  boxShadow: isDarkMode
                    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 12px 12px 24px rgba(0, 0, 0, 0.4), -6px -6px 12px rgba(255, 255, 255, 0.03)'
                    : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 12px 12px 24px rgba(0, 0, 0, 0.15), -6px -6px 12px rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-4px)',
                  borderColor: isDarkMode
                    ? 'rgba(255, 255, 255, 0.15)'
                    : 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: isDarkMode ? '#e0e0e0' : '#2c2c2c',
                      fontWeight: 700,
                      fontSize: '1.25rem'
                    }}
                  >
                    Recent Orders
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() => history.push('/orders')}
                    sx={{
                      color: componentColors.accent,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: `${componentColors.accent}08`
                      }
                    }}
                  >
                    View All
                  </Button>
                </Box>
                {isLoadingOrders ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: componentColors.accent }} />
                  </Box>
                ) : recentOrders.length > 0 ? (
                  <Box sx={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 20,
                        top: 0,
                        bottom: 0,
                        width: 2,
                        backgroundColor: componentColors.border,
                      }}
                    />
                    <Stack spacing={2}>
                      {recentOrders.slice(0, 5).map((order, index) => {
                          const statusColor = getStatusColor(order.orderStatus);
                          const getActionButton = () => {
                            switch (order.orderStatus) {
                              case OrderStatus.PAUSE:
                                return (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      history.push('/orders');
                                    }}
                                    sx={{
                                      backgroundColor: statusColor,
                                      backdropFilter: 'blur(10px)',
                                      WebkitBackdropFilter: 'blur(10px)',
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: '8px',
                                      boxShadow: isDarkMode
                                        ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.2), 3px 3px 6px rgba(0, 0, 0, 0.3), -1px -1px 3px rgba(255, 255, 255, 0.1)'
                                        : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.3), 3px 3px 6px rgba(0, 0, 0, 0.15), -1px -1px 3px rgba(255, 255, 255, 0.5)',
                                      '&:hover': {
                                        backgroundColor: statusColor,
                                        boxShadow: isDarkMode
                                          ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.25), 4px 4px 8px rgba(0, 0, 0, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.15)'
                                          : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 4px 4px 8px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.6)',
                                        transform: 'scale(1.05)',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    Resume
                                  </Button>
                                );
                              case OrderStatus.PROCESS:
                                return (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<PaymentIcon />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      history.push('/orders');
                                    }}
                              sx={{
                                      backgroundColor: statusColor,
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1.5,
                                      py: 0.5,
                                      '&:hover': {
                                        backgroundColor: statusColor,
                                        opacity: 0.9,
                                        transform: 'scale(1.05)',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    Pay
                                  </Button>
                                );
                              case OrderStatus.FINISH:
                                return (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<ReceiptIcon />}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      history.push('/orders');
                                    }}
                                sx={{
                                      backgroundColor: isDarkMode
                                        ? 'rgba(42, 42, 42, 0.3)'
                                        : 'rgba(248, 249, 250, 0.5)',
                                      backdropFilter: 'blur(10px)',
                                      WebkitBackdropFilter: 'blur(10px)',
                                      borderColor: statusColor,
                                      color: statusColor,
                                      textTransform: 'none',
                                      fontSize: '0.75rem',
                                      px: 1.5,
                                      py: 0.5,
                                      borderRadius: '8px',
                                      boxShadow: isDarkMode
                                        ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 3px 3px 6px rgba(0, 0, 0, 0.2), -1px -1px 3px rgba(255, 255, 255, 0.02)'
                                        : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 3px 3px 6px rgba(0, 0, 0, 0.08), -1px -1px 3px rgba(255, 255, 255, 0.8)',
                                      '&:hover': {
                                        borderColor: statusColor,
                                        backgroundColor: isDarkMode
                                          ? 'rgba(42, 42, 42, 0.5)'
                                          : 'rgba(248, 249, 250, 0.7)',
                                        boxShadow: isDarkMode
                                          ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 4px 4px 8px rgba(0, 0, 0, 0.3), -2px -2px 4px rgba(255, 255, 255, 0.03), 0 0 10px ${statusColor}20`
                                          : `inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 4px 4px 8px rgba(0, 0, 0, 0.12), -2px -2px 4px rgba(255, 255, 255, 0.9), 0 0 10px ${statusColor}15`,
                                        transform: 'scale(1.05)',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                  >
                                    Receipt
                                  </Button>
                                );
                              default:
                                return null;
                            }
                          };

                          return (
                            <motion.div
                              key={order._id || index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              whileHover={{ x: 4 }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  gap: 2,
                                  alignItems: 'flex-start',
                                  pl: 4,
                                  position: 'relative',
                                  cursor: 'pointer',
                                  '&:hover': {
                                    '& .order-content': {
                                      backgroundColor: isDarkMode
                                        ? 'rgba(42, 42, 42, 0.5)'
                                        : 'rgba(248, 249, 250, 0.7)',
                                      boxShadow: isDarkMode
                                        ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.03)'
                                        : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 6px 6px 12px rgba(0, 0, 0, 0.12), -3px -3px 6px rgba(255, 255, 255, 0.9)',
                                      borderColor: isDarkMode
                                        ? 'rgba(255, 255, 255, 0.15)'
                                        : 'rgba(255, 255, 255, 0.7)',
                                      transform: 'translateX(4px)'
                                    }
                                  }
                                }}
                                onClick={() => history.push('/orders')}
                              >
                                {/* Timeline dot */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: 14,
                                    top: 8,
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: statusColor,
                                    border: `2px solid ${componentColors.surface}`,
                                    zIndex: 1,
                                  }}
                                />

                                {/* Order Content */}
                                <Box
                                  className="order-content"
                                  sx={{
                                    flex: 1,
                                    p: 2,
                                    borderRadius: '16px',
                                    backgroundColor: isDarkMode 
                                      ? 'rgba(42, 42, 42, 0.3)'
                                      : 'rgba(248, 249, 250, 0.5)',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: isDarkMode
                                      ? '1px solid rgba(255, 255, 255, 0.1)'
                                      : '1px solid rgba(255, 255, 255, 0.5)',
                                    boxShadow: isDarkMode
                                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 4px 4px 8px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.02)'
                                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 4px 4px 8px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.8)',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      right: 0,
                                      height: '1px',
                                      background: isDarkMode
                                        ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                                        : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                                      zIndex: 1
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Box>
                                <Typography
                                        variant="body1"
                                  sx={{
                                          fontWeight: 700,
                                          color: isDarkMode ? '#e0e0e0' : '#2c2c2c',
                                          mb: 0.5
                                  }}
                                >
                                        Order #{order._id?.slice(-4) || String(index + 1).padStart(3, '0')}
                                </Typography>
                                <Typography
                                        variant="caption"
                                  sx={{
                                    color: componentColors.textSecondary,
                                    fontSize: '0.8rem'
                                  }}
                                >
                                        {formatDate(order.createdAt)} • ${order.orderTotal?.toFixed(2) || '0.00'}
                                </Typography>
                              </Box>
                          <Chip
                                      label={getStatusLabel(order.orderStatus as OrderStatus)}
                            size="small"
                            sx={{
                                        backgroundColor: `${statusColor}15`,
                                        color: statusColor,
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                        height: 24
                                      }}
                                    />
                                  </Box>

                                  {/* Order Progress Bar (for active orders) */}
                                  {[OrderStatus.PROCESS, OrderStatus.PAUSE].includes(order.orderStatus) && (
                                    <Box sx={{ mb: 1.5, mt: 1 }}>
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: componentColors.textSecondary }}>
                                          Ordered
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: componentColors.textSecondary }}>
                                          {order.orderStatus === OrderStatus.PROCESS ? 'Preparing' : 'Paused'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: componentColors.textSecondary }}>
                                          Ready
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: componentColors.textSecondary }}>
                                          Delivered
                                        </Typography>
                                      </Box>
                                      <Box
                                        sx={{
                                          height: 4,
                                          backgroundColor: componentColors.border,
                                          borderRadius: 2,
                                          position: 'relative',
                                          overflow: 'hidden'
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            height: '100%',
                                            width: order.orderStatus === OrderStatus.PROCESS ? '50%' : '25%',
                                            backgroundColor: statusColor,
                                            borderRadius: 2,
                                            transition: 'width 0.3s ease'
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  )}

                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5 }}>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: componentColors.textSecondary,
                                        fontSize: '0.75rem'
                                      }}
                                    >
                                      {order.orderItems?.length || 0} item(s)
                                    </Typography>
                                    {getActionButton()}
                                  </Box>
                                </Box>
                              </Box>
                            </motion.div>
                          );
                        })}
                      </Stack>
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <OrdersIcon sx={{ fontSize: 48, color: componentColors.textSecondary, mb: 2 }} />
                      <Typography
                        variant="h6"
                        sx={{
                          color: componentColors.textSecondary,
                          mb: 1
                        }}
                      >
                        No orders yet
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: componentColors.textSecondary,
                          mb: 2
                        }}
                      >
                        Start your coffee journey by placing your first order!
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => history.push('/coffees')}
                        sx={{
                          backgroundColor: componentColors.accent,
                          '&:hover': {
                            backgroundColor: componentColors.secondary
                          }
                        }}
                      >
                        Browse Menu
                      </Button>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Actions - Small Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            style={{
              gridColumn: isMobile ? '1' : 'span 12',
              gridRow: 'span 1'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card
                sx={{
                  backgroundColor: isDarkMode 
                    ? 'rgba(42, 42, 42, 0.4)'
                    : 'rgba(248, 249, 250, 0.6)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  borderRadius: '24px',
                  border: isDarkMode
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: isDarkMode
                    ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 6px 6px 12px rgba(0, 0, 0, 0.3), -3px -3px 6px rgba(255, 255, 255, 0.02)'
                    : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.6), 6px 6px 12px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 0.8)',
                  p: 2,
                  maxWidth: 400,
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: isDarkMode
                      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
                      : 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                    zIndex: 1
                  },
                  '&:hover': {
                    boxShadow: isDarkMode
                      ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 8px 8px 16px rgba(0, 0, 0, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.03)'
                      : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.8), 8px 8px 16px rgba(0, 0, 0, 0.15), -4px -4px 8px rgba(255, 255, 255, 0.9)',
                    transform: 'translateY(-4px)',
                    borderColor: isDarkMode
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                <Button
                  variant="text"
                  startIcon={isLoading ? <CircularProgress size={16} /> : <LogoutIcon />}
                  onClick={handleLogout}
                  disabled={isLoading}
                  fullWidth
                  sx={{
                    color: componentColors.textSecondary,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.08)',
                      color: '#f44336',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? 'Logging out...' : 'Logout'}
                </Button>
              </Card>
            </Box>
          </motion.div>
        </Box>
      </motion.div>



      {/* Profile Editing Dialog */}
      <Dialog
        open={showProfileDialog}
        onClose={handleCloseProfileDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ color: componentColors.text, pb: 1 }}>
          Edit Profile
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Profile Image Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  color: componentColors.text,
                  fontWeight: 600,
                  mb: 2
                }}
              >
                Profile Photo
              </Typography>
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Avatar
                  src={imagePreview || (authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg")}
                  sx={{
                    width: 120,
                    height: 120,
                    border: `3px solid ${componentColors.accent}`,
                    mb: 2
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton
                      component="span"
                      sx={{
                        backgroundColor: componentColors.accent,
                        color: 'white',
                        '&:hover': {
                          backgroundColor: componentColors.secondary,
                        },
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </label>
                  {imagePreview && (
                    <IconButton
                      onClick={handleRemoveImage}
                      sx={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#d32f2f',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
                {imagePreview && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: componentColors.textSecondary,
                      display: 'block',
                      mt: 1
                    }}
                  >
                    New image selected
                  </Typography>
                )}
              </Box>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nickname"
                  value={profileForm.memberNick}
                  onChange={(e) => handleProfileFormChange('memberNick', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: componentColors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: componentColors.accent,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: componentColors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: componentColors.textSecondary,
                    },
                    '& .MuiInputBase-input': {
                      color: componentColors.text,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileForm.memberPhone}
                  onChange={(e) => handleProfileFormChange('memberPhone', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: componentColors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: componentColors.accent,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: componentColors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: componentColors.textSecondary,
                    },
                    '& .MuiInputBase-input': {
                      color: componentColors.text,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={profileForm.memberAddress}
                  onChange={(e) => handleProfileFormChange('memberAddress', e.target.value)}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: componentColors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: componentColors.accent,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: componentColors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: componentColors.textSecondary,
                    },
                    '& .MuiInputBase-input': {
                      color: componentColors.text,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="About Me"
                  value={profileForm.memberDesc}
                  onChange={(e) => handleProfileFormChange('memberDesc', e.target.value)}
                  multiline
                  rows={3}
                  placeholder="Tell us a bit about yourself..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: componentColors.border,
                      },
                      '&:hover fieldset': {
                        borderColor: componentColors.accent,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: componentColors.accent,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: componentColors.textSecondary,
                    },
                    '& .MuiInputBase-input': {
                      color: componentColors.text,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={handleCloseProfileDialog}
            sx={{ 
              color: componentColors.textSecondary,
              mr: 1
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveProfile}
            disabled={isEditingProfile}
            variant="contained"
            sx={{
              backgroundColor: componentColors.accent,
              '&:hover': {
                backgroundColor: componentColors.secondary
              },
              '&:disabled': {
                backgroundColor: componentColors.textSecondary
              }
            }}
          >
            {isEditingProfile ? (
              <>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity={snackbarType}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyPage; 