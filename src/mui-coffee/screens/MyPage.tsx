import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
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
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as OrdersIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  LocalShipping as ShippingIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Replay as ReplayIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Star as StarIcon,
  Dashboard as DashboardIcon,
  ShoppingBag as ShoppingBagIcon,
  CalendarMonth as CalendarMonthIcon,
  Payments as PaymentsIcon,
  EmojiEvents as EmojiEventsIcon,
  LocalCafe as LocalCafeIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  History as HistoryIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Notifications as NotificationsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Coffee as CoffeeIcon,
  Cake as CakeIcon
} from '@mui/icons-material';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGlobals } from '../../app/hooks/useGlobals';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { serverApi } from '../../lib/config';

import MemberService from '../../app/services/MemberService';
import OrderService from '../../app/services/OrderService';
import { OrderInquiry } from '../../lib/types/order';
import { OrderStatus } from '../../lib/enums/order.enum';
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

/** Tokens from `src/components/stitch.md` (Pulp Alchemist profile). */
const PULP = {
  surface: '#fcf6e8',
  ink: '#1A0F0D',
  primary: '#a83100',
  primaryContainer: '#ff784d',
  onSurface: '#312f26',
  onSurfaceVariant: '#5f5b51',
  tertiaryContainer: '#fecc00',
  surfaceContainer: '#eee8d8',
  surfaceContainerLow: '#f6f0e1',
  surfaceContainerHigh: '#e8e2d1',
  surfaceBright: '#fcf6e8',
  surfaceContainerHighest: '#e3ddcb',
  onPrimary: '#ffefeb',
  onPrimaryContainer: '#460f00',
  onTertiaryFixed: '#413200',
  onTertiaryFixedVariant: '#634e00',
  onBackground: '#312f26',
} as const;

const PULP_INK_BORDER = `6px solid ${PULP.ink}`;
const PULP_INK_BORDER_SM = `3px solid ${PULP.ink}`;
const PULP_COMIC_SHADOW = '6px 6px 0 0 #1A0F0D';
const PULP_COMIC_SHADOW_LG = '8px 8px 0 0 #1A0F0D';
const PULP_GROTESK = '"Space Grotesk", system-ui, sans-serif';

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
      return;
    }
    
    setIsLoadingOrders(true);
    try {
      const orderService = new OrderService();
      
      let allOrders: any[] = [];
      
      try {
        const allOrdersInquiry: OrderInquiry = {
          page: 1,
          limit: 50,
          orderStatus: undefined
        };
        
        allOrders = await orderService.getMyOrders(allOrdersInquiry);
        
        if (!allOrders || allOrders.length === 0) {
          // Combine all orders from Redux store
          allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('API failed, using Redux store data:', error);
        }
        // Combine all orders from Redux store
        allOrders = [...pausedOrders, ...processOrders, ...finishedOrders];
      }
      
      // Set recent orders (show all orders, sorted by creation date)
      const sortedOrders = allOrders?.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ) || [];
      
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error fetching user data:', error);
      }
      // Use Redux store data as fallback
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
      if (process.env.NODE_ENV === 'development') {
        console.error('Error updating profile:', error);
      }
      setSnackbarMessage('Failed to update profile. Please try again.');
      setSnackbarType('error');
      setShowSnackbar(true);
    } finally {
      setIsEditingProfile(false);
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
  const activeOrder = recentOrders.find(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus));

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

  const surfaceBg = isDarkMode ? PULP.ink : PULP.surface;
  const textMain = isDarkMode ? PULP.surface : PULP.onSurface;
  const memberLevel = Math.min(99, Math.max(1, Math.floor(orderStats.loyaltyPoints / 30) + 1));
  const nextPerkPts = Math.max(0, 50 - (orderStats.loyaltyPoints % 50));
  const memberSinceYear = authMember?.createdAt
    ? new Date(authMember.createdAt as any).getFullYear()
    : 2021;

  const getOrderLineTitle = (order: any) => {
    const names = order?.productData?.map((p: any) => p.productName).filter(Boolean);
    if (names?.length) return names.slice(0, 2).join(' & ');
    return `Order #${order?._id?.slice(-4) || '—'}`;
  };

  const activeProgressWidth = (status: string) => {
    if (status === OrderStatus.PAUSE) return '45%';
    if (status === OrderStatus.PROCESS) return '66%';
    if (status === OrderStatus.FINISH) return '100%';
    return '20%';
  };

  const avatarSrc = authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : '/icons/default-user.svg';

  // Temporarily comment out auth check for debugging
  // if (!authMember) {
  //   history.push('/');
  //   return null;
  // }

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');`}
      </style>
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: surfaceBg,
          color: textMain,
          fontFamily: PULP_GROTESK,
          position: 'relative',
          pb: { xs: 10, md: 0 },
          '&::after': {
            content: '""',
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.03,
            backgroundImage: "url(https://www.transparenttextures.com/patterns/stardust.png)",
          },
        }}
      >
        {/* Top nav — stitch.md */}
        <Box
          component="nav"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
            px: { xs: 2, md: 3 },
            py: 2,
            bgcolor: surfaceBg,
            borderBottom: '8px solid',
            borderColor: PULP.ink,
            boxShadow: PULP_COMIC_SHADOW,
          }}
        >
          <Typography
            component="button"
            type="button"
            onClick={() => history.push('/')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontFamily: PULP_GROTESK,
              fontSize: { xs: '1.35rem', md: '1.85rem' },
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              color: isDarkMode ? PULP.surface : PULP.ink,
              letterSpacing: '-0.04em',
              textShadow: isDarkMode ? `4px 4px 0 ${PULP.primary}` : `4px 4px 0 ${PULP.primary}`,
              textAlign: 'left',
            }}
          >
            The Pulp Alchemist
          </Typography>
          <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Typography
              onClick={handleEditProfile}
              sx={{
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                color: PULP.primary,
                textDecoration: 'underline',
                textDecorationThickness: 4,
                cursor: 'pointer',
                '&:hover': { transform: 'translate(4px, 4px)' },
                transition: 'transform 0.15s',
              }}
            >
              Profile
            </Typography>
            <Typography
              onClick={() => history.push('/products')}
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                '&:hover': { transform: 'translate(4px, 4px)' },
                transition: 'transform 0.15s',
              }}
            >
              Inventory
            </Typography>
            <Typography
              onClick={() => history.push('/kinetic-archive')}
              sx={{
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                '&:hover': { transform: 'translate(4px, 4px)' },
                transition: 'transform 0.15s',
              }}
            >
              The Lab
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2}>
            <IconButton onClick={() => history.push('/orders?tab=menu')} sx={{ color: PULP.primary }}>
              <OrdersIcon />
            </IconButton>
            <IconButton sx={{ color: PULP.primary }}>
              <NotificationsIcon />
            </IconButton>
            <Box
              component="img"
              src={avatarSrc}
              alt=""
              sx={{
                width: 40,
                height: 40,
                objectFit: 'cover',
                border: PULP_INK_BORDER_SM,
                transform: 'rotate(3deg)',
              }}
            />
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', minHeight: 'calc(100vh - 80px)', position: 'relative', zIndex: 1 }}>
          {/* Sidebar — desktop */}
          <Box
            component="aside"
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              p: 2,
              gap: 3,
              bgcolor: surfaceBg,
              width: 256,
              flexShrink: 0,
              borderRight: '8px solid',
              borderColor: PULP.ink,
              position: 'sticky',
              top: 80,
              alignSelf: 'flex-start',
              height: 'calc(100vh - 80px)',
            }}
          >
            <Box sx={{ py: 2 }}>
              <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', color: textMain }}>
                The Archive
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  color: PULP.primary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  mt: 0.5,
                }}
              >
                Rank: Master Alchemist
              </Typography>
            </Box>
            <Stack spacing={1}>
              {[
                { icon: <DashboardIcon />, label: 'Dashboard', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
                { icon: <HistoryIcon />, label: 'Order History', onClick: () => history.push('/orders') },
                { icon: <StarIcon />, label: 'Roast Points', onClick: () => window.scrollTo({ top: 400, behavior: 'smooth' }) },
                { icon: <LocalCafeIcon />, label: 'Brew Methods', onClick: () => history.push('/coffee-demo') },
                {
                  icon: <SettingsIcon />,
                  label: 'Settings',
                  onClick: handleEditProfile,
                  active: true,
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  onClick={item.onClick}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: textMain,
                    bgcolor: item.active ? PULP.primaryContainer : 'transparent',
                    border: item.active ? '4px solid' : 'none',
                    borderColor: PULP.ink,
                    transform: item.active ? 'rotate(-1deg)' : 'none',
                    boxShadow: item.active ? '4px 4px 0 #1A0F0D' : 'none',
                    '&:hover': { bgcolor: PULP.surfaceContainerLow, transform: item.active ? 'rotate(-1deg) scale(1.02)' : 'scale(1.02)' },
                  }}
                >
                  {item.icon}
                  {item.label}
                </Box>
              ))}
            </Stack>
            <Box sx={{ pt: 4, mt: 'auto' }}>
              <Button
                fullWidth
                onClick={() => history.push('/orders?tab=menu')}
                sx={{
                  py: 2,
                  bgcolor: PULP.primary,
                  color: PULP.onPrimary,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  border: PULP_INK_BORDER,
                  borderRadius: 0,
                  boxShadow: PULP_COMIC_SHADOW,
                  '&:hover': { bgcolor: PULP.primary, transform: 'translate(4px, 4px)' },
                }}
              >
                New Order
              </Button>
              <Button
                fullWidth
                onClick={handleLogout}
                disabled={isLoading}
                sx={{ mt: 1, color: PULP.ink, textTransform: 'none', fontWeight: 700 }}
                startIcon={isLoading ? <CircularProgress size={16} /> : <LogoutIcon />}
              >
                Log out
              </Button>
            </Box>
          </Box>

          {/* Main */}
          <Box
            component="main"
            sx={{
              flex: 1,
              p: { xs: 2, md: 6 },
              maxWidth: { md: '80rem' },
              mx: 'auto',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { md: 'flex-end' },
                justifyContent: 'space-between',
                gap: 4,
                pb: 4,
                borderBottom: '4px dashed',
                borderColor: textMain,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ position: 'relative' }}>
                  <Box
                    sx={{
                      width: 128,
                      height: 128,
                      border: PULP_INK_BORDER,
                      transform: 'rotate(-3deg)',
                      overflow: 'hidden',
                      bgcolor: PULP.surfaceContainerHigh,
                      boxShadow: PULP_COMIC_SHADOW,
                    }}
                  >
                    <Box component="img" src={avatarSrc} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -8,
                      right: -8,
                      bgcolor: PULP.tertiaryContainer,
                      color: PULP.onTertiaryFixed,
                      fontWeight: 900,
                      px: 1.5,
                      py: 0.5,
                      border: `2px solid ${PULP.onBackground}`,
                      transform: 'rotate(12deg)',
                    }}
                  >
                    LVL {memberLevel}
                  </Box>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: { xs: '3.5rem', md: '6rem' },
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.04em',
                      lineHeight: 0.95,
                      color: textMain,
                      textShadow: `6px 6px 0 ${PULP.primary}`,
                    }}
                  >
                    {authMember?.memberNick || 'Agent'}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: '#22c55e', border: `2px solid ${PULP.onBackground}` }} />
                    <Typography sx={{ fontSize: '1.15rem', fontWeight: 700, fontStyle: 'italic', color: isDarkMode ? PULP.surfaceContainer : PULP.onSurfaceVariant }}>
                      Brewing excellence since {memberSinceYear}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
              <Stack direction="row" spacing={2}>
                <Box sx={{ bgcolor: PULP.surfaceContainer, p: 2, border: PULP_INK_BORDER_SM, transform: 'rotate(1deg)', textAlign: 'center', minWidth: 120 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: PULP.onSurfaceVariant }}>Status</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: PULP.primary }}>ELITE</Typography>
                </Box>
                <Box sx={{ bgcolor: PULP.surfaceContainer, p: 2, border: PULP_INK_BORDER_SM, transform: 'rotate(-2deg)', textAlign: 'center', minWidth: 120 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: PULP.onSurfaceVariant }}>Next perk</Typography>
                  <Typography sx={{ fontSize: '1.5rem', fontWeight: 900, color: textMain }}>{nextPerkPts}pts</Typography>
                </Box>
              </Stack>
            </Box>

            {/* Stat cards */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
                gap: 3,
              }}
            >
              {[
                {
                  icon: <ShoppingBagIcon sx={{ fontSize: 40, color: PULP.primary }} />,
                  badge: 'Active',
                  value: stats[0].value,
                  sub: stats[0].label,
                  foot: activeOrder ? 'In progress — track in Orders' : 'All clear',
                  bg: PULP.surfaceBright,
                  rot: '1deg',
                },
                {
                  icon: <CalendarMonthIcon sx={{ fontSize: 40, color: PULP.primary }} />,
                  value: stats[1].value,
                  sub: stats[1].label,
                  foot: stats[1].trend,
                  bg: PULP.surfaceBright,
                  rot: '-1deg',
                },
                {
                  icon: <PaymentsIcon sx={{ fontSize: 40, color: PULP.onPrimary }} />,
                  value: stats[2].value,
                  sub: stats[2].label,
                  foot: 'Master tier member',
                  bg: PULP.primary,
                  rot: '1deg',
                  darkCard: true,
                },
                {
                  icon: <EmojiEventsIcon sx={{ fontSize: 40, color: PULP.onTertiaryFixed }} />,
                  value: stats[3].value,
                  sub: stats[3].label,
                  foot: stats[3].trend,
                  bg: PULP.tertiaryContainer,
                  rot: '-2deg',
                  dots: true,
                },
              ].map((card, i) => (
                <Box
                  key={i}
                  onClick={() => history.push('/orders')}
                  sx={{
                    p: 3,
                    border: PULP_INK_BORDER,
                    boxShadow: PULP_COMIC_SHADOW_LG,
                    transform: `rotate(${card.rot})`,
                    bgcolor: card.bg,
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    '&:hover': { transform: `rotate(${card.rot}) translateY(-8px)` },
                    transition: 'transform 0.2s',
                  }}
                >
                  {card.dots && (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        pointerEvents: 'none',
                        backgroundImage: `radial-gradient(circle, ${PULP.ink} 1px, transparent 1px)`,
                        backgroundSize: '8px 8px',
                      }}
                    />
                  )}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                    {card.icon}
                    {card.badge && (
                      <Typography sx={{ bgcolor: '#705900', color: PULP.tertiaryContainer, fontSize: '0.65rem', fontWeight: 900, px: 1, py: 0.25, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                        {card.badge}
                      </Typography>
                    )}
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: '2.25rem',
                      fontWeight: 900,
                      fontStyle: 'italic',
                      color: card.darkCard ? PULP.onPrimary : textMain,
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', color: card.darkCard ? PULP.onPrimaryContainer : PULP.onSurfaceVariant, mt: 0.5 }}>
                    {card.sub}
                  </Typography>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '2px dotted', borderColor: card.darkCard ? PULP.onPrimary : PULP.onBackground }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: card.darkCard ? PULP.onPrimary : PULP.primary }}>{card.foot}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
                gap: 6,
              }}
            >
              {/* Recent orders */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                  <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', color: textMain, textShadow: `4px 4px 0 ${PULP.primary}` }}>
                    Recent Orders
                  </Typography>
                  <Button onClick={() => history.push('/orders')} sx={{ fontWeight: 900, textTransform: 'uppercase', color: PULP.primary, borderBottom: '4px solid', borderRadius: 0, borderColor: PULP.primary, pb: 0.25 }}>
                    View All
                  </Button>
                </Stack>

                {isLoadingOrders ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress sx={{ color: PULP.primary }} />
                  </Box>
                ) : recentOrders.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6, border: PULP_INK_BORDER, bgcolor: PULP.surfaceContainerLow }}>
                    <OrdersIcon sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} />
                    <Typography sx={{ fontWeight: 700, mb: 2 }}>No orders yet</Typography>
                    <Button variant="contained" onClick={() => history.push('/orders?tab=menu')} sx={{ bgcolor: PULP.primary, borderRadius: 0, border: PULP_INK_BORDER_SM, boxShadow: PULP_COMIC_SHADOW }}>
                      Browse menu
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={3}>
                    {recentOrders[0] && (
                      <Box sx={{ border: PULP_INK_BORDER, p: 3, bgcolor: PULP.surfaceContainerLow, position: 'relative', overflow: 'hidden' }}>
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0.05,
                            pointerEvents: 'none',
                            backgroundImage: `radial-gradient(circle, ${PULP.ink} 1px, transparent 1px)`,
                            backgroundSize: '8px 8px',
                          }}
                        />
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3, position: 'relative' }}>
                          <Box>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, bgcolor: PULP.onBackground, color: surfaceBg, px: 1, py: 0.5, display: 'inline-block', textTransform: 'uppercase' }}>
                              Order #{recentOrders[0]._id?.slice(-6)}
                            </Typography>
                            <Typography sx={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic', mt: 1.5, color: textMain }}>
                              {getOrderLineTitle(recentOrders[0])}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: '1.25rem', fontWeight: 900 }}>${recentOrders[0].orderTotal?.toFixed(2) ?? '0.00'}</Typography>
                        </Stack>
                        <Box sx={{ position: 'relative', pt: 3 }}>
                          <Box sx={{ height: 8, bgcolor: PULP.surfaceContainerHighest, width: '100%', position: 'absolute', top: 24 }} />
                          <Box sx={{ height: 8, bgcolor: PULP.primary, width: activeProgressWidth(recentOrders[0].orderStatus), position: 'absolute', top: 24 }} />
                          <Stack direction="row" justifyContent="space-between" sx={{ position: 'relative', zIndex: 1 }}>
                            {['Roasting', 'Brewing', 'Dispatch', 'Delivered'].map((step, si) => (
                              <Box key={step} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Box
                                  sx={{
                                    width: 22,
                                    height: 22,
                                    bgcolor: si < 3 ? PULP.primary : PULP.surfaceContainer,
                                    border: PULP_INK_BORDER_SM,
                                    transform: 'rotate(45deg)',
                                  }}
                                />
                                <Typography sx={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', mt: 1 }}>{step}</Typography>
                              </Box>
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                    )}
                    {recentOrders.slice(1, 4).map((order: any, idx: number) => {
                      const icon = idx % 2 === 0 ? <CoffeeIcon /> : <CakeIcon />;
                      return (
                        <Stack
                          key={order._id || idx}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          onClick={() => history.push('/orders')}
                          sx={{
                            border: PULP_INK_BORDER_SM,
                            p: 2,
                            bgcolor: '#fff',
                            cursor: 'pointer',
                            '&:hover': { bgcolor: PULP.surfaceContainerLow },
                          }}
                        >
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Box sx={{ width: 48, height: 48, bgcolor: PULP.surfaceContainer, border: PULP_INK_BORDER_SM, display: 'flex', alignItems: 'center', justifyContent: 'center', color: PULP.onSurfaceVariant }}>
                              {icon}
                            </Box>
                            <Box>
                              <Typography sx={{ fontWeight: 900, fontStyle: 'italic' }}>{getOrderLineTitle(order)}</Typography>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: PULP.onSurfaceVariant }}>{formatDate(order.createdAt)}</Typography>
                            </Box>
                          </Stack>
                          <Typography sx={{ fontWeight: 900 }}>${order.orderTotal?.toFixed(2) ?? '0.00'}</Typography>
                        </Stack>
                      );
                    })}
                  </Stack>
                )}
              </Box>

              {/* Quick actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography sx={{ fontSize: { xs: '2rem', md: '2.5rem' }, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', color: textMain, textShadow: `4px 4px 0 ${PULP.primary}` }}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <Button
                    fullWidth
                    onClick={() => history.push('/orders')}
                    sx={{
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      py: 3,
                      px: 3,
                      bgcolor: PULP.primaryContainer,
                      color: PULP.onPrimaryContainer,
                      border: PULP_INK_BORDER,
                      borderRadius: 0,
                      boxShadow: PULP_COMIC_SHADOW_LG,
                      transform: 'rotate(1deg)',
                      fontFamily: PULP_GROTESK,
                      '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>One click</Typography>
                      <Typography sx={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic' }}>Reorder last</Typography>
                    </Box>
                    <ReplayIcon sx={{ fontSize: 36 }} />
                  </Button>
                  <Button
                    fullWidth
                    onClick={() => history.push('/orders')}
                    sx={{
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      py: 3,
                      px: 3,
                      bgcolor: PULP.surfaceBright,
                      color: textMain,
                      border: PULP_INK_BORDER,
                      borderRadius: 0,
                      boxShadow: PULP_COMIC_SHADOW_LG,
                      transform: 'rotate(-1deg)',
                      fontFamily: PULP_GROTESK,
                      '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: '0.65rem', fontWeight: 900, textTransform: 'uppercase', color: PULP.onSurfaceVariant, mb: 0.5 }}>Live tracking</Typography>
                      <Typography sx={{ fontSize: '1.35rem', fontWeight: 900, fontStyle: 'italic' }}>Track order</Typography>
                    </Box>
                    <LocationOnIcon sx={{ fontSize: 36, color: PULP.primary }} />
                  </Button>
                  <Box sx={{ bgcolor: PULP.onBackground, p: 4, border: PULP_INK_BORDER, boxShadow: PULP_COMIC_SHADOW_LG, transform: 'rotate(2deg)', position: 'relative', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.2,
                        pointerEvents: 'none',
                        color: '#fff',
                        backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
                        backgroundSize: '8px 8px',
                      }}
                    />
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 900, fontStyle: 'italic', color: PULP.tertiaryContainer, mb: 1 }}>BOOM!</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', mb: 3, lineHeight: 1.35 }}>
                      You&apos;ve unlocked the &quot;Midnight Roast&quot; secret menu item.
                    </Typography>
                    <Button
                      onClick={() => history.push('/orders?tab=menu')}
                      sx={{
                        bgcolor: PULP.tertiaryContainer,
                        color: PULP.onTertiaryFixed,
                        fontWeight: 900,
                        px: 2,
                        py: 1,
                        textTransform: 'uppercase',
                        fontStyle: 'italic',
                        border: PULP_INK_BORDER_SM,
                        borderRadius: 0,
                      }}
                    >
                      Claim now
                    </Button>
                    <AutoAwesomeIcon sx={{ position: 'absolute', top: -12, right: -12, fontSize: 120, color: 'rgba(255,255,255,0.1)', transform: 'rotate(12deg)' }} />
                  </Box>
                  <Button variant="outlined" onClick={handleEditProfile} startIcon={<EditIcon />} sx={{ borderColor: PULP.ink, color: PULP.ink, borderWidth: 2, borderRadius: 0, fontWeight: 700 }}>
                    Edit dossier
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Mobile bottom nav */}
        <Box
          component="nav"
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            zIndex: 50,
            justifyContent: 'space-around',
            alignItems: 'center',
            py: 1.5,
            px: 1,
            bgcolor: surfaceBg,
            borderTop: '8px solid',
            borderColor: PULP.ink,
          }}
        >
          {[
            { icon: <HomeIcon />, label: 'Home', onClick: () => history.push('/') },
            { icon: <HistoryIcon />, label: 'Orders', onClick: () => history.push('/orders') },
            { icon: <WorkspacePremiumIcon />, label: 'Points', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { icon: <PersonIcon />, label: 'Profile', onClick: handleEditProfile, highlight: true },
          ].map((item) => (
            <Box
              key={item.label}
              onClick={item.onClick}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 0.5,
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: item.highlight ? PULP.surface : textMain,
                bgcolor: item.highlight ? PULP.primary : 'transparent',
                border: item.highlight ? `2px solid ${PULP.ink}` : 'none',
                transform: item.highlight ? 'rotate(-2deg)' : 'none',
                cursor: 'pointer',
              }}
            >
              {item.icon}
              <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>      {/* Profile Editing Dialog */}
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
    </>
  );
};

export default MyPage; 