import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Snackbar,
  Alert
} from '@mui/material';
import OrderService from '../../app/services/OrderService';
import { Order as ApiOrder } from '../../lib/types/order';
import { OrderStatus } from '../../lib/enums/order.enum';
import {
  LocalCafe as CafeIcon,
  ShoppingCart as CartIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  specialInstructions?: string;
}

interface Order {
  id: string;
  date: string;
  time: string;
  status: 'pause' | 'process' | 'finish' | 'delete';
  total: number;
  items: OrderItem[];
  orderType: 'dine-in' | 'takeaway' | 'delivery';
  paymentMethod: 'card' | 'cash' | 'online';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  estimatedTime?: string;
  actualTime?: string;
  rating?: number;
  review?: string;
}

interface OrdersPageProps {
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

const OrdersPage: React.FC<OrdersPageProps> = ({ colors }) => {
  console.log('🔄 OrdersPage component loaded - VERSION WITH NEW BUTTONS');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default colors if not provided
  const defaultColors = {
    primary: '#2C1810',
    secondary: '#8B4513',
    accent: '#D2691E',
    background: '#FDF6F0',
    text: '#2C1810',
    textSecondary: '#6B4423',
    border: '#E8D5C4',
    surface: '#F8F4F0'
  };

  const componentColors = colors || defaultColors;

  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Function to get a real product ID from the menu
  const getRealProductId = async () => {
    try {
      const productService = new (await import('../../app/services/ProductService')).default();
      const products = await productService.getProducts({
        page: 1,
        limit: 1,
        order: 'productViews'
      });
      
      if (products && products.length > 0) {
        console.log('🎯 Found real product:', products[0]);
        return products[0]._id;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting real product ID:', error);
      return null;
    }
  };

  // Sample orders data
  const sampleOrders: Order[] = useMemo(() => [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      time: '14:30',
      status: 'finish',
      total: 24.50,
      items: [
        { id: 1, name: 'Classic Espresso', price: 3.50, quantity: 2, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop' },
        { id: 2, name: 'Cappuccino Deluxe', price: 4.80, quantity: 1, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop' },
        { id: 3, name: 'Avocado Toast', price: 12.50, quantity: 1, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=100&h=100&fit=crop' }
      ],
      orderType: 'dine-in',
      paymentMethod: 'card',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '(555) 123-4567',
      actualTime: '15:15',
      rating: 5,
      review: 'Excellent coffee and service! Will definitely come back.'
    },
    {
      id: 'ORD-002',
      date: '2024-01-14',
      time: '09:15',
      status: 'process',
      total: 18.90,
      items: [
        { id: 4, name: 'Caramel Latte', price: 5.20, quantity: 1, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=100&h=100&fit=crop' },
        { id: 5, name: 'Blueberry Muffin', price: 3.50, quantity: 2, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop' },
        { id: 6, name: 'Americano', price: 3.20, quantity: 1, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' }
      ],
      orderType: 'takeaway',
      paymentMethod: 'cash',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '(555) 987-6543',
      estimatedTime: '09:45'
    },
    {
      id: 'ORD-003',
      date: '2024-01-13',
      time: '16:45',
      status: 'process',
      total: 32.80,
      items: [
        { id: 7, name: 'Mocha Supreme', price: 5.50, quantity: 2, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=100&h=100&fit=crop' },
        { id: 8, name: 'Chicken Panini', price: 12.80, quantity: 1, image: 'https://images.unsplash.com/photo-1528735602786-469f11263408?w=100&h=100&fit=crop' },
        { id: 9, name: 'Caesar Salad', price: 9.00, quantity: 1, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&h=100&fit=crop' }
      ],
      orderType: 'delivery',
      paymentMethod: 'online',
      customerName: 'Mike Wilson',
      customerEmail: 'mike.w@email.com',
      customerPhone: '(555) 456-7890',
      deliveryAddress: '123 Main St, Apt 4B, Brewtown, BT 12345',
      estimatedTime: '17:30'
    },
    {
      id: 'ORD-004',
      date: '2024-01-12',
      time: '11:20',
      status: 'pause',
      total: 15.60,
      items: [
        { id: 10, name: 'Macchiato Art', price: 3.80, quantity: 1, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop' },
        { id: 11, name: 'Croissant', price: 4.20, quantity: 2, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=100&h=100&fit=crop' },
        { id: 12, name: 'Green Tea', price: 3.40, quantity: 1, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop' }
      ],
      orderType: 'dine-in',
      paymentMethod: 'card',
      customerName: 'Emma Davis',
      customerEmail: 'emma.d@email.com',
      customerPhone: '(555) 321-6547',
      estimatedTime: '11:50'
    }
  ], []);

  // Fetch real orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const orderService = new OrderService();
      const orderInquiry = {
        page: 1,
        limit: 50,
        orderStatus: undefined // Get all orders
      };
      
      console.log('=== FETCHING ORDERS DEBUG ===');
      console.log('🔍 Order inquiry:', orderInquiry);
      
      // Check current user authentication
      const memberData = localStorage.getItem("memberData");
      if (memberData) {
        const member = JSON.parse(memberData);
        console.log('✅ Current user when fetching orders:', member);
        console.log('✅ User ID:', member._id);
        console.log('✅ User email:', member.memberEmail);
        console.log('✅ User nick:', member.memberNick);
        console.log('✅ Member data type:', typeof member);
        console.log('✅ Member data keys:', Object.keys(member));
      } else {
        console.log('❌ No member data found when fetching orders');
        setSnackbar({
          open: true,
          message: 'Please login to view your orders',
          severity: 'warning'
        });
        return;
      }
      
      // Check cookies
      console.log('🍪 All cookies:', document.cookie);
      
      console.log('🌐 Making API call to:', `${orderService['path']}order/all?page=1&limit=50`);
      
      const apiOrders = await orderService.getMyOrders(orderInquiry);
      console.log('📦 API Orders response:', apiOrders);
      console.log('📊 Number of orders:', apiOrders?.length || 0);
      console.log('📋 Orders type:', typeof apiOrders);
      console.log('📋 Is array:', Array.isArray(apiOrders));
      
      if (apiOrders && apiOrders.length > 0) {
        console.log('✅ First order sample:', apiOrders[0]);
        console.log('✅ First order keys:', Object.keys(apiOrders[0]));
        console.log('✅ First order memberId:', apiOrders[0].memberId);
        console.log('✅ First order status:', apiOrders[0].orderStatus);
      } else {
        console.log('⚠️ No orders returned from API');
        console.log('⚠️ This could mean:');
        console.log('   - No orders exist for this user');
        console.log('   - Orders exist but belong to different users');
        console.log('   - Backend filtering is working correctly');
      }
      
      // Transform API orders to match our interface
      const transformedOrders: Order[] = apiOrders.map((apiOrder: ApiOrder, index: number) => {
        console.log(`🔄 Transforming order ${index}:`, apiOrder);
        return {
          id: apiOrder._id,
          date: new Date(apiOrder.createdAt).toLocaleDateString(),
          time: new Date(apiOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: apiOrder.orderStatus.toLowerCase() as 'pause' | 'process' | 'finish' | 'delete',
          total: apiOrder.orderTotal || 0,
          items: apiOrder.orderItems?.map((item: any, index: number) => ({
            id: index + 1,
            name: item.productName || `Product ${index + 1}`,
            price: item.itemPrice || 0,
            quantity: item.itemQuantity || 1,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=100&h=100&fit=crop'
          })) || [],
          orderType: 'dine-in',
          paymentMethod: 'card',
          customerName: 'You',
          customerEmail: '',
          customerPhone: '',
          estimatedTime: new Date(new Date(apiOrder.createdAt).getTime() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });
      
      console.log('🎯 Transformed orders:', transformedOrders);
      console.log('📈 Final orders count:', transformedOrders.length);
      
      setOrders(transformedOrders);
      setFilteredOrders(transformedOrders);
      
      // Show a message if no orders are found
      if (transformedOrders.length === 0) {
        setSnackbar({
          open: true,
          message: 'No orders found for this account. Try placing an order first!',
          severity: 'info'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Found ${transformedOrders.length} orders!`,
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Fallback to sample data if API fails
      setOrders(sampleOrders);
      setFilteredOrders(sampleOrders);
      setSnackbar({
        open: true,
        message: 'Failed to load orders. Showing sample data.',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  }, [sampleOrders]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    filterOrders(newValue);
  };

  const filterOrders = (tabIndex: number) => {
    let filtered: Order[] = [];
    
    switch (tabIndex) {
      case 0: // All Orders
        filtered = orders;
        break;
      case 1: // Active Orders
        filtered = orders.filter(order => 
          ['pause', 'process'].includes(order.status)
        );
        break;
      case 2: // Completed Orders
        filtered = orders.filter(order => order.status === 'finish');
        break;
      case 3: // Cancelled Orders
        filtered = orders.filter(order => order.status === 'delete');
        break;
      default:
        filtered = orders;
    }
    
    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pause':
        return '#ff9800';
      case 'process':
        return '#2196f3';
      case 'finish':
        return '#4caf50';
      case 'delete':
        return '#f44336';
      default:
        return componentColors.textSecondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pause':
        return <ScheduleIcon />;
      case 'process':
        return <CafeIcon />;
      case 'finish':
        return <CheckCircleIcon />;
      case 'delete':
        return <CloseIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const orderService = new OrderService();
      await orderService.updateOrder({
        orderId: orderId,
        orderStatus: OrderStatus.DELETE
      });
      
      // Refresh orders after cancellation
      await fetchOrders();
      
      setSnackbar({
        open: true,
        message: 'Order cancelled successfully!',
        severity: 'success'
      });
      
      // Close order details if it was the cancelled order
      if (selectedOrder?.id === orderId) {
        setOrderDetailsOpen(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      setSnackbar({
        open: true,
        message: 'Failed to cancel order. Please try again.',
        severity: 'error'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const calculateTotalItems = (items: OrderItem[]) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <Box
      sx={{
        backgroundColor: componentColors.background,
        minHeight: '100vh',
        padding: { xs: '2rem 0', md: '3rem 0' }
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
                          <Typography
                variant="h3"
                sx={{
                  color: componentColors.text,
                  fontWeight: 700,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Your Orders
              </Typography>
              {(() => {
                const memberData = localStorage.getItem("memberData");
                if (memberData) {
                  const member = JSON.parse(memberData);
                  return (
                    <Typography
                      variant="body2"
                      sx={{
                        color: componentColors.textSecondary,
                        mb: 2
                      }}
                    >
                      Logged in as: {member.memberNick || member.memberEmail || 'Unknown User'}
                    </Typography>
                  );
                }
                return null;
              })()}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography
                variant="h6"
                sx={{
                  color: componentColors.textSecondary,
                  maxWidth: '600px',
                  lineHeight: 1.6
                }}
              >
                Track your coffee orders and stay updated on their status
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => {
                  console.log('Manual refresh clicked');
                  fetchOrders();
                }}
                disabled={loading}
                sx={{
                  borderColor: componentColors.accent,
                  color: componentColors.accent,
                  '&:hover': {
                    borderColor: componentColors.secondary,
                    backgroundColor: `${componentColors.accent}08`
                  }
                }}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    console.log('=== TEST ORDER CREATION ===');
                    const orderService = new OrderService();
                    
                    // Get a real product ID from the menu
                    const realProductId = await getRealProductId();
                    if (!realProductId) {
                      setSnackbar({
                        open: true,
                        message: 'Could not find a real product. Check if products exist in the menu.',
                        severity: 'warning'
                      });
                      return;
                    }
                    
                    const testOrder = [{
                      _id: realProductId,
                      quantity: 1,
                      price: 5.99,
                      name: 'Test Coffee',
                      image: '/test-image.jpg'
                    }];
                    
                    console.log('🎯 Creating test order with real product ID:', realProductId);
                    const result = await orderService.createOrder(testOrder);
                    console.log('✅ Test order created:', result);
                    
                    // Refresh orders after creating test order
                    setTimeout(() => {
                      fetchOrders();
                    }, 1000);
                    
                    setSnackbar({
                      open: true,
                      message: 'Test order created successfully!',
                      severity: 'success'
                    });
                  } catch (error) {
                    console.error('❌ Test order creation failed:', error);
                    setSnackbar({
                      open: true,
                      message: 'Test order creation failed. Check console for details.',
                      severity: 'error'
                    });
                  }
                }}
                sx={{
                  backgroundColor: componentColors.secondary,
                  '&:hover': {
                    backgroundColor: componentColors.primary
                  }
                }}
              >
                Test Order
              </Button>
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    console.log('=== CHECKING PRODUCTS ===');
                    const productService = new (await import('../../app/services/ProductService')).default();
                    const products = await productService.getProducts({
                      page: 1,
                      limit: 5,
                      order: 'productViews'
                    });
                    
                    console.log('📦 Available products:', products);
                    console.log('📊 Number of products:', products?.length || 0);
                    
                    if (products && products.length > 0) {
                      setSnackbar({
                        open: true,
                        message: `Found ${products.length} products in database`,
                        severity: 'info'
                      });
                    } else {
                      setSnackbar({
                        open: true,
                        message: 'No products found in database',
                        severity: 'warning'
                      });
                    }
                  } catch (error) {
                    console.error('❌ Error checking products:', error);
                    setSnackbar({
                      open: true,
                      message: 'Failed to check products. Check console for details.',
                      severity: 'error'
                    });
                  }
                }}
                sx={{
                  borderColor: componentColors.textSecondary,
                  color: componentColors.textSecondary,
                  '&:hover': {
                    borderColor: componentColors.text,
                    backgroundColor: `${componentColors.textSecondary}08`
                  }
                }}
              >
                Check Products
              </Button>
              <Button
                variant="outlined"
                onClick={async () => {
                  try {
                    console.log('=== CHECKING RESTAURANT ORDERS ===');
                    const orderService = new OrderService();
                    
                    // Try to get all orders without any filters
                    const allOrders = await orderService.getMyOrders({
                      page: 1,
                      limit: 100,
                      orderStatus: undefined
                    });
                    
                    console.log('🏪 All orders in system:', allOrders);
                    console.log('📊 Total orders found:', allOrders?.length || 0);
                    
                    if (allOrders && allOrders.length > 0) {
                      console.log('🔍 Checking order ownership:');
                      allOrders.forEach((order, index) => {
                        console.log(`Order ${index + 1}:`, {
                          orderId: order._id,
                          memberId: order.memberId,
                          status: order.orderStatus,
                          total: order.orderTotal,
                          createdAt: order.createdAt
                        });
                      });
                      
                      // Check if any orders belong to current user
                      const memberData = localStorage.getItem("memberData");
                      if (memberData) {
                        const member = JSON.parse(memberData);
                        const myOrders = allOrders.filter(order => order.memberId === member._id);
                        console.log('👤 Orders belonging to current user:', myOrders);
                        console.log('📈 My orders count:', myOrders.length);
                        
                        if (myOrders.length > 0) {
                          setSnackbar({
                            open: true,
                            message: `Found ${myOrders.length} orders for your account!`,
                            severity: 'success'
                          });
                        } else {
                          setSnackbar({
                            open: true,
                            message: 'No orders found for your account. Orders may be for customers only.',
                            severity: 'warning'
                          });
                        }
                      }
                    } else {
                      setSnackbar({
                        open: true,
                        message: 'No orders found in the system',
                        severity: 'info'
                      });
                    }
                  } catch (error) {
                    console.error('❌ Error checking restaurant orders:', error);
                    setSnackbar({
                      open: true,
                      message: 'Failed to check restaurant orders. Check console for details.',
                      severity: 'error'
                    });
                  }
                }}
                sx={{
                  borderColor: componentColors.textSecondary,
                  color: componentColors.textSecondary,
                  '&:hover': {
                    borderColor: componentColors.text,
                    backgroundColor: `${componentColors.textSecondary}08`
                  }
                }}
              >
                Check Restaurant Orders
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  console.log('=== CUSTOMER ACCOUNT INFO ===');
                  console.log('To test orders properly, you need a CUSTOMER account:');
                  console.log('1. Log out of current restaurant account');
                  console.log('2. Sign up as a new customer (not restaurant owner)');
                  console.log('3. Place orders as a customer');
                  console.log('4. View orders in this page');
                  
                  setSnackbar({
                    open: true,
                    message: 'Check console for instructions to create a customer account',
                    severity: 'info'
                  });
                }}
                sx={{
                  borderColor: '#2196f3',
                  color: '#2196f3',
                  '&:hover': {
                    borderColor: '#1976d2',
                    backgroundColor: '#2196f308'
                  }
                }}
              >
                Customer Account Info
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { title: 'Total Orders', value: orders.length, icon: CartIcon, color: componentColors.accent },
              { title: 'Active Orders', value: orders.filter(o => ['pause', 'process'].includes(o.status)).length, icon: ScheduleIcon, color: '#2196f3' },
              { title: 'Completed', value: orders.filter(o => o.status === 'finish').length, icon: CheckCircleIcon, color: '#4caf50' },
              { title: 'This Month', value: orders.filter(o => new Date(o.date).getMonth() === new Date().getMonth()).length, icon: ReceiptIcon, color: '#9c27b0' }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={stat.title}>
                <Card
                  sx={{
                    backgroundColor: componentColors.surface,
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: `1px solid ${componentColors.border}`,
                    textAlign: 'center',
                    padding: 2
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: `${stat.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <stat.icon sx={{ color: stat.color, fontSize: 24 }} />
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
                    {stat.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant={isMobile ? 'scrollable' : 'fullWidth'}
              scrollButtons={isMobile ? 'auto' : false}
              sx={{
                backgroundColor: componentColors.surface,
                borderRadius: '12px',
                padding: 1,
                '& .MuiTab-root': {
                  color: componentColors.textSecondary,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  '&.Mui-selected': {
                    color: componentColors.accent
                  }
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: componentColors.accent,
                  height: 3,
                  borderRadius: '2px'
                }
              }}
            >
              <Tab label={`All Orders (${orders.length})`} />
              <Tab label={`Active (${orders.filter(o => ['pause', 'process'].includes(o.status)).length})`} />
              <Tab label={`Completed (${orders.filter(o => o.status === 'finish').length})`} />
              <Tab label={`Cancelled (${orders.filter(o => o.status === 'delete').length})`} />
            </Tabs>
          </Box>
        </motion.div>

        {/* Orders List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Grid container spacing={4}>
            {filteredOrders.map((order, index) => (
              <Grid item xs={12} sm={6} md={4} key={order.id}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    onClick={() => handleOrderClick(order)}
                    sx={{
                      backgroundColor: componentColors.surface,
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      border: `1px solid ${componentColors.border}`,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography
                            variant="h5"
                            sx={{
                              color: componentColors.text,
                              fontWeight: 700,
                              mb: 1
                            }}
                          >
                            Order #{order.id}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: componentColors.textSecondary,
                              mb: 1
                            }}
                          >
                            {formatDate(order.date)} at {formatTime(order.time)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              sx={{
                                backgroundColor: `${getStatusColor(order.status)}15`,
                                color: getStatusColor(order.status),
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                  color: getStatusColor(order.status)
                                }
                              }}
                            />
                            <Chip
                              label={order.orderType}
                              size="small"
                              sx={{
                                backgroundColor: `${componentColors.accent}15`,
                                color: componentColors.accent,
                                fontWeight: 500
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="h4"
                            sx={{
                              color: componentColors.text,
                              fontWeight: 700
                            }}
                          >
                            ${order.total.toFixed(2)}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: componentColors.textSecondary
                            }}
                          >
                            {calculateTotalItems(order.items)} items
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      {/* Order Items Preview */}
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        {order.items.slice(0, 3).map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              backgroundColor: `${componentColors.accent}08`,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              flex: 1
                            }}
                          >
                            <Avatar
                              src={item.image}
                              sx={{ width: 48, height: 48 }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body1"
                                sx={{
                                  color: componentColors.text,
                                  fontWeight: 600,
                                  fontSize: '0.9rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: componentColors.textSecondary,
                                  fontSize: '0.7rem'
                                }}
                              >
                                Qty: {item.quantity}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                        {order.items.length > 3 && (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: `${componentColors.accent}08`,
                              padding: '8px 12px',
                              borderRadius: '8px',
                              minWidth: 60
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                color: componentColors.accent,
                                fontWeight: 600,
                                fontSize: '0.8rem'
                              }}
                            >
                              +{order.items.length - 3} more
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="medium"
                          startIcon={<CafeIcon />}
                          sx={{
                            borderColor: componentColors.accent,
                            color: componentColors.accent,
                            '&:hover': {
                              borderColor: componentColors.secondary,
                              backgroundColor: `${componentColors.accent}08`
                            }
                          }}
                        >
                          View Details
                        </Button>
                        {order.status === 'process' && (
                          <Button
                            variant="contained"
                            size="medium"
                            startIcon={<CheckCircleIcon />}
                            sx={{
                              backgroundColor: componentColors.accent,
                              '&:hover': {
                                backgroundColor: componentColors.secondary
                              }
                            }}
                          >
                            Pick Up
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {filteredOrders.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CafeIcon sx={{ fontSize: 64, color: componentColors.textSecondary, mb: 2 }} />
              <Typography
                variant="h6"
                sx={{
                  color: componentColors.textSecondary,
                  mb: 1
                }}
              >
                {activeTab === 0 ? 'No orders yet' : 'No orders in this category'}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: componentColors.textSecondary,
                  mb: 3
                }}
              >
                {activeTab === 0 
                  ? 'Ready to start your coffee journey? Browse our menu and place your first order!' 
                  : 'No orders match this filter. Try a different category or place a new order.'
                }
              </Typography>
              {activeTab === 0 && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CafeIcon />}
                  onClick={() => window.location.href = '/coffees'}
                  sx={{
                    backgroundColor: componentColors.accent,
                    '&:hover': {
                      backgroundColor: componentColors.secondary
                    }
                  }}
                >
                  Browse Menu
                </Button>
              )}
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={handleCloseOrderDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            backgroundColor: componentColors.background
          }
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ 
              color: componentColors.text,
              fontWeight: 700,
              fontFamily: 'Playfair Display, serif',
              borderBottom: `1px solid ${componentColors.border}`,
              pb: 2
            }}>
              Order Details - #{selectedOrder.id}
            </DialogTitle>
            <DialogContent sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {/* Order Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: componentColors.text, mb: 2 }}>
                    Order Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        Date:
                      </Typography>
                      <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                        {formatDate(selectedOrder.date)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        Time:
                      </Typography>
                      <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                        {formatTime(selectedOrder.time)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        Status:
                      </Typography>
                      <Chip
                        icon={getStatusIcon(selectedOrder.status)}
                        label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        sx={{
                          backgroundColor: `${getStatusColor(selectedOrder.status)}15`,
                          color: getStatusColor(selectedOrder.status),
                          fontWeight: 600
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        Order Type:
                      </Typography>
                      <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                        {selectedOrder.orderType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        Payment:
                      </Typography>
                      <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                        {selectedOrder.paymentMethod}
                      </Typography>
                    </Box>
                    {selectedOrder.estimatedTime && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                          Estimated Time:
                        </Typography>
                        <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                          {formatTime(selectedOrder.estimatedTime)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>

                {/* Customer Info */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ color: componentColors.text, mb: 2 }}>
                    Customer Information
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: componentColors.text, fontWeight: 500 }}>
                      {selectedOrder.customerName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                      {selectedOrder.customerEmail}
                    </Typography>
                    <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                      {selectedOrder.customerPhone}
                    </Typography>
                    {selectedOrder.deliveryAddress && (
                      <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                        {selectedOrder.deliveryAddress}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {/* Order Items */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: componentColors.text, mb: 2 }}>
                    Order Items
                  </Typography>
                  <List sx={{ backgroundColor: componentColors.surface, borderRadius: '12px' }}>
                    {selectedOrder.items.map((item) => (
                      <ListItem key={item.id} sx={{ borderBottom: `1px solid ${componentColors.border}` }}>
                        <ListItemAvatar>
                          <Avatar src={item.image} sx={{ width: 50, height: 50 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ color: componentColors.text, fontWeight: 500 }}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                              </Typography>
                              {item.specialInstructions && (
                                <Typography variant="body2" sx={{ color: componentColors.accent, fontStyle: 'italic' }}>
                                  Note: {item.specialInstructions}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Typography variant="h6" sx={{ color: componentColors.text, fontWeight: 600 }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Total */}
                <Grid item xs={12}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    backgroundColor: `${componentColors.accent}08`,
                    padding: 2,
                    borderRadius: '12px',
                    border: `1px solid ${componentColors.accent}20`
                  }}>
                    <Typography variant="h6" sx={{ color: componentColors.text, fontWeight: 600 }}>
                      Total
                    </Typography>
                    <Typography variant="h5" sx={{ color: componentColors.accent, fontWeight: 700 }}>
                      ${selectedOrder.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>

                {/* Rating & Review */}
                {selectedOrder.rating && (
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: componentColors.text, mb: 2 }}>
                      Your Review
                    </Typography>
                    <Box sx={{ 
                      backgroundColor: componentColors.surface, 
                      padding: 2, 
                      borderRadius: '12px',
                      border: `1px solid ${componentColors.border}`
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="body2" sx={{ color: componentColors.textSecondary }}>
                          Rating: {selectedOrder.rating}/5
                        </Typography>
                      </Box>
                      {selectedOrder.review && (
                        <Typography variant="body2" sx={{ color: componentColors.textSecondary, fontStyle: 'italic' }}>
                          "{selectedOrder.review}"
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: `1px solid ${componentColors.border}` }}>
              <Button
                onClick={handleCloseOrderDetails}
                sx={{
                  color: componentColors.textSecondary,
                  '&:hover': {
                    backgroundColor: `${componentColors.textSecondary}08`
                  }
                }}
              >
                Close
              </Button>
              {/* Cancel Order Button - only show for orders that can be cancelled */}
              {(selectedOrder.status === 'pause' || selectedOrder.status === 'process') && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  sx={{
                    borderColor: '#f44336',
                    color: '#f44336',
                    '&:hover': {
                      borderColor: '#d32f2f',
                      backgroundColor: '#ffebee'
                    }
                  }}
                >
                  Cancel Order
                </Button>
              )}
              {selectedOrder.status === 'process' && (
                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  sx={{
                    backgroundColor: componentColors.accent,
                    '&:hover': {
                      backgroundColor: componentColors.secondary
                    }
                  }}
                >
                  Confirm Pickup
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersPage; 