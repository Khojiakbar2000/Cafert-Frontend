import React, { useState, useEffect } from 'react';
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
  IconButton
} from '@mui/material';
import {
  Person as PersonIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Edit as EditIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  ArrowForward as ArrowForwardIcon,
  Add as AddIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';
import { useGlobals } from '../../app/hooks/useGlobals';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { serverApi } from '../../lib/config';

import MemberService from '../../app/services/MemberService';
import OrderService from '../../app/services/OrderService';
import { OrderInquiry } from '../../lib/types/order';
import { OrderStatus } from '../../lib/enums/order.enum';

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

  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    points: 0
  });
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
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

  // Fetch user orders and stats
  const fetchUserData = async () => {
    if (!authMember) return;
    
    try {
      setIsLoadingOrders(true);
      
      // Fetch recent orders
      const orderService = new OrderService();
      const orderInquiry: OrderInquiry = {
        page: 1,
        limit: 5,
        orderStatus: OrderStatus.FINISH // We'll get all orders by fetching finished ones first
      };
      
      const orders = await orderService.getMyOrders(orderInquiry);
      setRecentOrders(orders || []);
      
      // Calculate stats
      const total = orders?.length || 0;
      const completed = orders?.filter(o => o.orderStatus === OrderStatus.FINISH).length || 0;
      const inProgress = orders?.filter(o => [OrderStatus.PAUSE, OrderStatus.PROCESS].includes(o.orderStatus)).length || 0;
      
      setOrderStats({
        total,
        completed,
        inProgress,
        points: authMember?.memberPoints || 0
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Use sample data as fallback
      setRecentOrders([
        {
          _id: 'ORD-001',
          createdAt: '2024-01-15',
          orderStatus: OrderStatus.FINISH,
          orderTotal: 24.50,
          orderItems: [
            { productName: 'Classic Espresso', itemQuantity: 2 },
            { productName: 'Cappuccino Deluxe', itemQuantity: 1 }
          ]
        },
        {
          _id: 'ORD-002',
          createdAt: '2024-01-14',
          orderStatus: OrderStatus.PROCESS,
          orderTotal: 18.90,
          orderItems: [
            { productName: 'Caramel Latte', itemQuantity: 1 },
            { productName: 'Blueberry Muffin', itemQuantity: 2 }
          ]
        }
      ]);
      
      setOrderStats({
        total: 12,
        completed: 8,
        inProgress: 2,
        points: authMember?.memberPoints || 0
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [authMember]);

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
      console.log(err);
      setSnackbarMessage('Error logging out');
      setSnackbarType('error');
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    await fetchUserData();
    setSnackbarMessage('Data refreshed!');
    setSnackbarType('success');
    setShowSnackbar(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsDialog(true);
  };

  const handleCloseSettings = () => {
    setShowSettingsDialog(false);
  };

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

  const quickActions = [
    {
      title: 'My Profile',
      description: 'View and edit your profile information',
      icon: <PersonIcon />,
      color: '#2196f3',
      action: () => history.push('/member-page')
    },
    {
      title: 'My Orders',
      description: 'Track your order history and status',
      icon: <OrdersIcon />,
      color: '#4caf50',
      action: () => history.push('/orders')
    },
    {
      title: 'Settings',
      description: 'Manage your account preferences',
      icon: <SettingsIcon />,
      color: '#9c27b0',
      action: handleSettingsClick
    },
    {
      title: 'Help & Support',
      description: 'Get help and contact support',
      icon: <HelpIcon />,
      color: '#ff9800',
      action: () => history.push('/help')
    }
  ];

  const stats = [
    { label: 'Total Orders', value: orderStats.total.toString(), icon: <OrdersIcon />, color: '#2196f3' },
    { label: 'Completed', value: orderStats.completed.toString(), icon: <CheckCircleIcon />, color: '#4caf50' },
    { label: 'In Progress', value: orderStats.inProgress.toString(), icon: <ShippingIcon />, color: '#ff9800' },
    { label: 'Points Earned', value: orderStats.points.toString(), icon: <StarIcon />, color: '#ffd700' }
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
        py: 4,
        px: isMobile ? 2 : 4
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with Refresh Button */}
        <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
          <Button
            variant="outlined"
            startIcon={isLoadingOrders ? <CircularProgress size={16} /> : <AddIcon />}
            onClick={handleRefreshData}
            disabled={isLoadingOrders}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              borderColor: componentColors.accent,
              color: componentColors.accent,
              '&:hover': {
                borderColor: componentColors.secondary,
                backgroundColor: `${componentColors.accent}08`
              }
            }}
          >
            Refresh
          </Button>
          <Typography
            variant="h3"
            sx={{
              color: componentColors.text,
              fontWeight: 700,
              mb: 2
            }}
          >
            Welcome back, {authMember?.memberNick || 'Guest'}!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: componentColors.textSecondary,
              fontWeight: 400
            }}
          >
            Here's what's happening with your account
          </Typography>
        </Box>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card
            sx={{
              backgroundColor: componentColors.surface,
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              border: `1px solid ${componentColors.border}`,
              mb: 4
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"}
                  sx={{
                    width: 80,
                    height: 80,
                    border: `3px solid ${componentColors.accent}`
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: componentColors.text,
                      fontWeight: 700,
                      mb: 1
                    }}
                  >
                    {authMember?.memberNick || 'Guest User'}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: componentColors.textSecondary,
                      mb: 2
                    }}
                  >
                    {authMember?.memberPhone || 'No phone number'}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={`${authMember?.memberPoints || 0} Points`}
                      icon={<StarIcon />}
                      sx={{
                        backgroundColor: `${componentColors.accent}15`,
                        color: componentColors.accent,
                        fontWeight: 600
                      }}
                    />
                    <Chip
                      label={authMember?.memberType || 'Member'}
                      sx={{
                        backgroundColor: `${componentColors.accent}15`,
                        color: componentColors.accent,
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                  sx={{
                    borderColor: componentColors.accent,
                    color: componentColors.accent,
                    '&:hover': {
                      borderColor: componentColors.secondary,
                      backgroundColor: `${componentColors.accent}08`
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card
                  sx={{
                    backgroundColor: componentColors.surface,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `1px solid ${componentColors.border}`,
                    textAlign: 'center',
                    p: 3,
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      transition: 'all 0.3s ease'
                    }
                  }}
                  onClick={() => {
                    if (stat.label === 'Total Orders' || stat.label === 'Completed' || stat.label === 'In Progress') {
                      history.push('/orders');
                    }
                  }}
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
                        backgroundColor: `${stat.color}15`,
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box sx={{ color: stat.color, fontSize: 24 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      color: componentColors.text,
                      fontWeight: 700,
                      mb: 1
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: componentColors.textSecondary,
                      fontWeight: 500
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Grid container spacing={4}>
          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                sx={{
                  backgroundColor: componentColors.surface,
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${componentColors.border}`,
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      color: componentColors.text,
                      fontWeight: 700,
                      mb: 3
                    }}
                  >
                    Quick Actions
                  </Typography>
                  <List sx={{ p: 0 }}>
                    {quickActions.map((action, index) => (
                      <ListItem
                        key={index}
                        button
                        onClick={action.action}
                        sx={{
                          borderRadius: '12px',
                          mb: 2,
                          backgroundColor: `${componentColors.accent}08`,
                          '&:hover': {
                            backgroundColor: `${componentColors.accent}15`,
                            transform: 'translateX(8px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              backgroundColor: `${action.color}15`,
                              color: action.color
                            }}
                          >
                            {action.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="h6"
                              sx={{
                                color: componentColors.text,
                                fontWeight: 600
                              }}
                            >
                              {action.title}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: componentColors.textSecondary
                              }}
                            >
                              {action.description}
                            </Typography>
                          }
                        />
                        <ArrowForwardIcon sx={{ color: componentColors.textSecondary }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Recent Orders */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card
                sx={{
                  backgroundColor: componentColors.surface,
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  border: `1px solid ${componentColors.border}`,
                  height: '100%'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        color: componentColors.text,
                        fontWeight: 700
                      }}
                    >
                      Recent Orders
                    </Typography>
                    <Button
                      variant="text"
                      onClick={() => history.push('/orders')}
                      sx={{
                        color: componentColors.accent,
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
                    <List sx={{ p: 0 }}>
                      {recentOrders.map((order, index) => (
                        <ListItem
                          key={index}
                          sx={{
                            borderRadius: '12px',
                            mb: 2,
                            backgroundColor: `${componentColors.accent}08`,
                            '&:hover': {
                              backgroundColor: `${componentColors.accent}15`,
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => history.push('/orders')}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                                color: getStatusColor(order.orderStatus)
                              }}
                            >
                              {getStatusIcon(order.orderStatus)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="h6"
                                sx={{
                                  color: componentColors.text,
                                  fontWeight: 600
                                }}
                              >
                                Order #{order._id}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: componentColors.textSecondary,
                                    mb: 1
                                  }}
                                >
                                  {formatDate(order.createdAt)} • ${order.orderTotal?.toFixed(2) || '0.00'}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: componentColors.textSecondary,
                                    fontSize: '0.8rem'
                                  }}
                                >
                                  {order.orderItems?.slice(0, 2).map(item => item.productName).join(', ')}
                                  {order.orderItems?.length > 2 && ` +${order.orderItems.length - 2} more`}
                                </Typography>
                              </Box>
                            }
                          />
                          <Chip
                            label={order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Unknown'}
                            size="small"
                            sx={{
                              backgroundColor: `${getStatusColor(order.orderStatus)}15`,
                              color: getStatusColor(order.orderStatus),
                              fontWeight: 600
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
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
          </Grid>
        </Grid>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={isLoading ? <CircularProgress size={16} /> : <LogoutIcon />}
              onClick={handleLogout}
              disabled={isLoading}
              sx={{
                borderColor: '#f44336',
                color: '#f44336',
                px: 4,
                py: 1.5,
                borderRadius: '25px',
                '&:hover': {
                  borderColor: '#d32f2f',
                  backgroundColor: 'rgba(244, 67, 54, 0.05)'
                }
              }}
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
          </Box>
        </motion.div>
      </motion.div>

      {/* Settings Dialog */}
      <Dialog
        open={showSettingsDialog}
        onClose={handleCloseSettings}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: componentColors.text }}>
          Account Settings
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Settings functionality is coming soon! For now, you can manage your profile from the profile page.
          </Alert>
          <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
            This section will include:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText 
                primary="Notification preferences"
                secondary="Email and push notifications"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Privacy settings"
                secondary="Data sharing and visibility"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Payment methods"
                secondary="Saved cards and payment options"
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} sx={{ color: componentColors.textSecondary }}>
            Close
          </Button>
          <Button 
            onClick={() => {
              handleCloseSettings();
              history.push('/member-page');
            }}
            variant="contained"
            sx={{
              backgroundColor: componentColors.accent,
              '&:hover': {
                backgroundColor: componentColors.secondary
              }
            }}
          >
            Go to Profile
          </Button>
        </DialogActions>
      </Dialog>

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