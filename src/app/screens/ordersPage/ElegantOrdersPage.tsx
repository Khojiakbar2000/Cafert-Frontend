import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Fade,
  Zoom
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setPausedOrders, setProcessOrders, setFinishedOrders } from './slice';
import { retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders } from './selector';
import { Order, OrderInquiry } from '../../../lib/types/order';
import { OrderStatus } from '../../../lib/enums/order.enum';
import OrderService from '../../services/OrderService';
import { useGlobals } from '../../hooks/useGlobals';
import { useHistory } from 'react-router-dom';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { serverApi } from '../../../lib/config';

const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data))
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data for demonstration
const mockOrders: Order[] = [
  {
    _id: 'order1',
    orderTotal: 45.99,
    orderDelivery: 5.00,
    orderStatus: OrderStatus.PAUSE,
    memberId: 'user1',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T10:30:00'),
    orderItems: [
      {
        _id: 'item1',
        itemQuantity: 2,
        itemPrice: 12.99,
        orderId: 'order1',
        productId: 'product1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'item2',
        itemQuantity: 1,
        itemPrice: 20.01,
        orderId: 'order1',
        productId: 'product2',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    productData: [
      {
        _id: 'product1',
        productStatus: 'ACTIVE' as any,
        productCollection: 'COFFEE' as any,
        productName: 'Espresso Shot',
        productPrice: 12.99,
        productLeftCount: 50,
        productSize: 'MEDIUM' as any,
        productVolume: 30,
        productDesc: 'Strong and bold espresso',
        productImages: ['/img/coffee/coffee-placeholder.jpg'],
        productViews: 120,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'product2',
        productStatus: 'ACTIVE' as any,
        productCollection: 'COFFEE' as any,
        productName: 'Cappuccino',
        productPrice: 20.01,
        productLeftCount: 30,
        productSize: 'LARGE' as any,
        productVolume: 350,
        productDesc: 'Creamy cappuccino with foam',
        productImages: ['/img/coffee/coffee-placeholder.jpg'],
        productViews: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    _id: 'order2',
    orderTotal: 32.50,
    orderDelivery: 5.00,
    orderStatus: OrderStatus.PROCESS,
    memberId: 'user1',
    createdAt: new Date('2024-01-14T15:45:00'),
    updatedAt: new Date('2024-01-14T15:45:00'),
    orderItems: [
      {
        _id: 'item3',
        itemQuantity: 1,
        itemPrice: 27.50,
        orderId: 'order2',
        productId: 'product3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    productData: [
      {
        _id: 'product3',
        productStatus: 'ACTIVE' as any,
        productCollection: 'DESSERT' as any,
        productName: 'Chocolate Cake',
        productPrice: 27.50,
        productLeftCount: 15,
        productSize: 'MEDIUM' as any,
        productVolume: 200,
        productDesc: 'Rich chocolate cake with cream',
        productImages: ['/img/coffee/coffee-placeholder.jpg'],
        productViews: 200,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  },
  {
    _id: 'order3',
    orderTotal: 18.75,
    orderDelivery: 5.00,
    orderStatus: OrderStatus.FINISH,
    memberId: 'user1',
    createdAt: new Date('2024-01-13T09:15:00'),
    updatedAt: new Date('2024-01-13T09:15:00'),
    orderItems: [
      {
        _id: 'item4',
        itemQuantity: 3,
        itemPrice: 6.25,
        orderId: 'order3',
        productId: 'product4',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    productData: [
      {
        _id: 'product4',
        productStatus: 'ACTIVE' as any,
        productCollection: 'DRINK' as any,
        productName: 'Iced Latte',
        productPrice: 6.25,
        productLeftCount: 40,
        productSize: 'MEDIUM' as any,
        productVolume: 400,
        productDesc: 'Refreshing iced latte',
        productImages: ['/img/coffee/coffee-placeholder.jpg'],
        productViews: 150,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
];

const ElegantOrdersPage: React.FC = () => {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  // Get orders from Redux store using selectors
  const pausedOrders = useSelector(retrievePausedOrders);
  const processOrders = useSelector(retrieveProcessOrders);
  const finishedOrders = useSelector(retrieveFinishedOrders);

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const tabConfig = [
    {
      label: 'Paused Orders',
      status: OrderStatus.PAUSE,
      icon: <ScheduleIcon />,
      color: '#F39C12',
      orders: pausedOrders
    },
    {
      label: 'Processing Orders',
      status: OrderStatus.PROCESS,
      icon: <ShippingIcon />,
      color: '#3498DB',
      orders: processOrders
    },
    {
      label: 'Completed Orders',
      status: OrderStatus.FINISH,
      icon: <CheckCircleIcon />,
      color: '#27AE60',
      orders: finishedOrders
    }
  ];

  useEffect(() => {
    if (!authMember) {
      history.push("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const orderService = new OrderService();
        
        // Fetch orders for each status
        const [pausedOrders, processOrders, finishedOrders] = await Promise.all([
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.PAUSE }),
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.PROCESS }),
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.FINISH })
        ]);

        console.log('Fetched paused orders:', pausedOrders);
        console.log('Fetched process orders:', processOrders);
        console.log('Fetched finished orders:', finishedOrders);

        // Update Redux state
        setPausedOrders(pausedOrders || []);
        setProcessOrders(processOrders || []);
        setFinishedOrders(finishedOrders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        // Fallback to mock data if API fails
        const fallbackPaused = mockOrders.filter(order => order.orderStatus === OrderStatus.PAUSE);
        const fallbackProcess = mockOrders.filter(order => order.orderStatus === OrderStatus.PROCESS);
        const fallbackFinished = mockOrders.filter(order => order.orderStatus === OrderStatus.FINISH);
        
        setPausedOrders(fallbackPaused);
        setProcessOrders(fallbackProcess);
        setFinishedOrders(fallbackFinished);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [authMember, history, orderBuilder]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    // Trigger a re-fetch of orders
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const orderService = new OrderService();
        
        // Fetch orders for each status
        const [pausedOrders, processOrders, finishedOrders] = await Promise.all([
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.PAUSE }),
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.PROCESS }),
          orderService.getMyOrders({ page: 1, limit: 50, orderStatus: OrderStatus.FINISH })
        ]);

        // Update Redux state
        setPausedOrders(pausedOrders || []);
        setProcessOrders(processOrders || []);
        setFinishedOrders(finishedOrders || []);
      } catch (error) {
        console.error('Error refreshing orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderService = new OrderService();
      await orderService.updateOrder({
        orderId: orderId,
        orderStatus: newStatus
      });
      
      // Refresh orders after update
      handleRefresh();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAUSE:
        return '#F39C12';
      case OrderStatus.PROCESS:
        return '#3498DB';
      case OrderStatus.FINISH:
        return '#27AE60';
      case OrderStatus.DELETE:
        return '#E74C3C';
      default:
        return '#7F8C8D';
    }
  };

  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAUSE:
        return <ScheduleIcon />;
      case OrderStatus.PROCESS:
        return <ShippingIcon />;
      case OrderStatus.FINISH:
        return <CheckCircleIcon />;
      case OrderStatus.DELETE:
        return <DeleteIcon />;
      default:
        return <ReceiptIcon />;
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (order: Order) => {
    return order.orderItems?.reduce((total, item) => {
      return total + (item.itemPrice * item.itemQuantity);
    }, 0) || 0;
  };

  const renderOrderCard = (order: Order, index: number) => (
    <motion.div
      key={order._id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        elevation={8}
        sx={{
          mb: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${getOrderStatusColor(order.orderStatus)}, ${getOrderStatusColor(order.orderStatus)}80)`,
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 700, mb: 1 }}>
                Order #{order._id?.slice(-8)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                {formatDate(order.createdAt)}
              </Typography>
            </Box>
            
            <Chip
              icon={getOrderStatusIcon(order.orderStatus)}
              label={order.orderStatus}
              sx={{
                background: `linear-gradient(45deg, ${getOrderStatusColor(order.orderStatus)}, ${getOrderStatusColor(order.orderStatus)}80)`,
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.875rem',
                px: 2,
                py: 1
              }}
            />
          </Box>

          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

          <List dense sx={{ mb: 3 }}>
            {order.orderItems?.map((item, itemIndex) => {
              const productData = order.productData?.find(p => p._id === item.productId);
              
              return (
                <ListItem key={itemIndex} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={productData?.productImages?.[0] ? `${serverApi}${productData.productImages[0]}` : "/img/coffee/coffee-placeholder.jpg"}
                      sx={{ 
                        width: 50, 
                        height: 50,
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: '#2C3E50', fontWeight: 600 }}>
                        {productData?.productName || `Product ${itemIndex + 1}`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                        Qty: {item.itemQuantity} × ${item.itemPrice}
                      </Typography>
                    }
                  />
                  <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700 }}>
                    ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                  </Typography>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.08)' }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ color: '#2C3E50', fontWeight: 700 }}>
                ${calculateTotal(order).toFixed(2)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                Total Amount
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              {order.orderStatus === OrderStatus.PAUSE && (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<ShippingIcon />}
                  onClick={() => handleUpdateOrderStatus(order._id, OrderStatus.PROCESS)}
                  sx={{
                    background: 'linear-gradient(45deg, #3498DB, #2980B9)',
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #2980B9, #1F618D)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Start Processing
                </Button>
              )}
              
              {order.orderStatus === OrderStatus.PROCESS && (
                <Button
                  variant="contained"
                  size="medium"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleUpdateOrderStatus(order._id, OrderStatus.FINISH)}
                  sx={{
                    background: 'linear-gradient(45deg, #27AE60, #229954)',
                    borderRadius: '12px',
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #229954, #1E8449)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Mark Complete
                </Button>
              )}
              
              <Button
                variant="outlined"
                size="medium"
                startIcon={<ViewIcon />}
                sx={{
                  borderColor: '#667eea',
                  color: '#667eea',
                  borderWidth: 2,
                  borderRadius: '12px',
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#5a6fd8',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>

          {order.orderStatus === OrderStatus.PROCESS && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Alert 
                severity="info" 
                icon={<ShippingIcon />}
                sx={{ 
                  background: 'linear-gradient(45deg, rgba(52, 152, 219, 0.1), rgba(52, 152, 219, 0.05))',
                  border: '2px solid rgba(52, 152, 219, 0.3)',
                  borderRadius: '12px',
                  color: '#2C3E50',
                  '& .MuiAlert-icon': {
                    color: '#3498DB',
                  }
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Your order is being prepared and will be ready soon! We'll notify you when it's ready for pickup.
                </Typography>
              </Alert>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (!authMember) {
    return null;
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#ffffff',
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {t('orders.title', 'My Orders')}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400,
                mb: 3
              }}
            >
              {t('orders.subtitle', 'Track your orders and view order history')}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{
                borderColor: 'rgba(255,255,255,0.8)',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                '&:disabled': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              Refresh Orders
            </Button>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Orders List */}
          <Box sx={{ flex: { xs: 1, lg: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper 
                elevation={24}
                sx={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                  <Tabs
                    value={value}
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons={isMobile ? "auto" : false}
                    sx={{
                      '& .MuiTab-root': {
                        color: '#7F8C8D',
                        fontWeight: 600,
                        fontSize: '1rem',
                        textTransform: 'none',
                        minHeight: 64,
                        '&.Mui-selected': {
                          color: '#667eea',
                        }
                      },
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#667eea',
                        height: 4,
                        borderRadius: 2,
                      }
                    }}
                  >
                    {tabConfig.map((tab, index) => (
                      <Tab
                        key={index}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {tab.icon}
                            <span>{tab.label}</span>
                            <Badge 
                              badgeContent={tab.orders.length} 
                              color="primary"
                              sx={{
                                '& .MuiBadge-badge': {
                                  background: tab.color,
                                  color: '#ffffff',
                                  fontWeight: 600,
                                }
                              }}
                            />
                          </Box>
                        }
                      />
                    ))}
                  </Tabs>
                </Box>

                <Box sx={{ p: 4 }}>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress 
                        size={60}
                        thickness={4}
                        sx={{ 
                          color: '#667eea',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          }
                        }}
                      />
                    </Box>
                  ) : (
                    <AnimatePresence mode="wait">
                      {tabConfig.map((tab, index) => (
                        <TabPanel key={index} value={value} index={index}>
                          <Box>
                            {tab.orders.length > 0 ? (
                              tab.orders.map((order, orderIndex) => renderOrderCard(order, orderIndex))
                            ) : (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                  <ReceiptIcon sx={{ fontSize: 80, color: '#BDC3C7', mb: 2 }} />
                                  <Typography variant="h6" sx={{ color: '#7F8C8D', fontWeight: 500, mb: 1 }}>
                                    No {tab.label.toLowerCase()} found
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: '#95A5A6' }}>
                                    When you place orders, they will appear here
                                  </Typography>
                                </Box>
                              </motion.div>
                            )}
                          </Box>
                        </TabPanel>
                      ))}
                    </AnimatePresence>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* User Info Sidebar */}
          <Box sx={{ flex: { xs: 1, lg: 1 } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Paper 
                elevation={24}
                sx={{ 
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  height: 'fit-content'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid #ffffff',
                      margin: '0 auto',
                      mb: 3,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                    }}
                  />
                  <Typography variant="h5" sx={{ color: '#2C3E50', fontWeight: 700, mb: 1 }}>
                    {authMember?.memberNick}
                  </Typography>
                  <Chip 
                    icon={<StarIcon />}
                    label={authMember?.memberType} 
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: '#ffffff',
                      fontWeight: 600,
                      px: 2,
                      py: 1
                    }}
                  />
                </Box>

                <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mb: 3 }}>
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: '#667eea', mr: 2 }} />
                    <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 500 }}>
                      {authMember?.memberPhone || 'No phone number'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: '#667eea', mr: 2 }} />
                    <Typography variant="body2" sx={{ color: '#2C3E50', fontWeight: 500 }}>
                      {authMember?.memberAddress || 'No address'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 4, borderColor: 'rgba(0,0,0,0.08)' }} />

                <Box>
                  <Typography variant="h6" sx={{ color: '#2C3E50', fontWeight: 700, mb: 3 }}>
                    Order Statistics
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(102, 126, 234, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#667eea', fontWeight: 700 }}>
                          {pausedOrders.length + processOrders.length + finishedOrders.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                          Total Orders
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(39, 174, 96, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#27AE60', fontWeight: 700 }}>
                          {finishedOrders.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                          Completed
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(243, 156, 18, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#F39C12', fontWeight: 700 }}>
                          {pausedOrders.length + processOrders.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                          Pending
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: '1 1 calc(50% - 8px)', minWidth: 120 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: '12px', background: 'rgba(52, 152, 219, 0.1)' }}>
                        <Typography variant="h4" sx={{ color: '#3498DB', fontWeight: 700 }}>
                          ${[...pausedOrders, ...processOrders, ...finishedOrders].reduce((total, order) => total + calculateTotal(order), 0).toFixed(0)}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#7F8C8D', fontWeight: 500 }}>
                          Total Spent
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ElegantOrdersPage; 