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
  ListItemAvatar
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setPausedOrders, setProcessOrders, setFinishedOrders } from './slice';
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

const EnhancedOrdersPageWithMock: React.FC = () => {
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#2c2c2c',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    accent: isDarkMode ? '#ffd700' : '#b38e6a',
    accentDark: isDarkMode ? '#ffed4e' : '#8b6b4a',
    cream: isDarkMode ? '#2c2c2c' : '#f8f8ff',
    shadow: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    border: isDarkMode ? '#404040' : '#e0e0e0'
  };

  const tabConfig = [
    {
      label: 'Paused Orders',
      status: OrderStatus.PAUSE,
      icon: <ScheduleIcon />,
      color: '#ff9800',
      orders: mockOrders.filter(order => order.orderStatus === OrderStatus.PAUSE)
    },
    {
      label: 'Processing Orders',
      status: OrderStatus.PROCESS,
      icon: <ShippingIcon />,
      color: '#2196f3',
      orders: mockOrders.filter(order => order.orderStatus === OrderStatus.PROCESS)
    },
    {
      label: 'Completed Orders',
      status: OrderStatus.FINISH,
      icon: <CheckCircleIcon />,
      color: '#4caf50',
      orders: mockOrders.filter(order => order.orderStatus === OrderStatus.FINISH)
    }
  ];

  useEffect(() => {
    if (!authMember) {
      history.push("/");
      return;
    }

    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setPausedOrders(mockOrders.filter(order => order.orderStatus === OrderStatus.PAUSE));
      setProcessOrders(mockOrders.filter(order => order.orderStatus === OrderStatus.PROCESS));
      setFinishedOrders(mockOrders.filter(order => order.orderStatus === OrderStatus.FINISH));
      setIsLoading(false);
    }, 1000);
  }, [authMember, history]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const getOrderStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PAUSE:
        return '#ff9800';
      case OrderStatus.PROCESS:
        return '#2196f3';
      case OrderStatus.FINISH:
        return '#4caf50';
      case OrderStatus.DELETE:
        return '#f44336';
      default:
        return colors.textSecondary;
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card
        elevation={isDarkMode ? 8 : 2}
        sx={{
          mb: 2,
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '16px',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 25px ${colors.shadow}`,
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600, mb: 1 }}>
                Order #{order._id?.slice(-8)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                {formatDate(order.createdAt)}
              </Typography>
            </Box>
            
            <Chip
              icon={getOrderStatusIcon(order.orderStatus)}
              label={order.orderStatus}
              sx={{
                backgroundColor: getOrderStatusColor(order.orderStatus),
                color: '#ffffff',
                fontWeight: 600
              }}
            />
          </Box>

          <Divider sx={{ my: 2, borderColor: colors.border }} />

          <List dense>
            {order.orderItems?.map((item, itemIndex) => {
              // Find corresponding product data
              const productData = order.productData?.find(p => p._id === item.productId);
              
              return (
                <ListItem key={itemIndex} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={productData?.productImages?.[0] ? `${serverApi}${productData.productImages[0]}` : "/img/coffee/coffee-placeholder.jpg"}
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ color: colors.text, fontWeight: 500 }}>
                        {productData?.productName || `Product ${itemIndex + 1}`}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Qty: {item.itemQuantity} × ${item.itemPrice}
                      </Typography>
                    }
                  />
                  <Typography variant="body1" sx={{ color: colors.accent, fontWeight: 600 }}>
                    ${(item.itemPrice * item.itemQuantity).toFixed(2)}
                  </Typography>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2, borderColor: colors.border }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600 }}>
              Total: ${calculateTotal(order).toFixed(2)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ViewIcon />}
                sx={{
                  borderColor: colors.accent,
                  color: colors.accent,
                  '&:hover': {
                    borderColor: colors.accentDark,
                    backgroundColor: 'rgba(179, 142, 106, 0.1)',
                  }
                }}
              >
                View Details
              </Button>
            </Box>
          </Box>

          {order.orderStatus === OrderStatus.PROCESS && (
            <Alert 
              severity="info" 
              sx={{ 
                mt: 2,
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                border: '1px solid #2196f3',
                color: colors.text
              }}
            >
              Your order is being prepared and will be ready soon!
            </Alert>
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
      backgroundColor: colors.background,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                color: colors.text,
                fontWeight: 700
              }}
            >
              {t('orders.title', 'My Orders')} (Demo with Mock Data)
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{
                borderColor: colors.accent,
                color: colors.accent,
                '&:hover': {
                  borderColor: colors.accentDark,
                  backgroundColor: 'rgba(179, 142, 106, 0.1)',
                }
              }}
            >
              Refresh
            </Button>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          {/* Orders List */}
          <Box sx={{ flex: 1 }}>
            <Paper 
              elevation={isDarkMode ? 8 : 2}
              sx={{ 
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: '20px',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: colors.border }}>
                <Tabs
                  value={value}
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : false}
                  sx={{
                    '& .MuiTab-root': {
                      color: colors.textSecondary,
                      fontWeight: 600,
                      '&.Mui-selected': {
                        color: colors.accent,
                      }
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: colors.accent,
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
                          <Badge badgeContent={tab.orders.length} color="primary" />
                        </Box>
                      }
                    />
                  ))}
                </Tabs>
              </Box>

              <Box sx={{ p: 3 }}>
                {isLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress sx={{ color: colors.accent }} />
                  </Box>
                ) : (
                  <AnimatePresence mode="wait">
                    {tabConfig.map((tab, index) => (
                      <TabPanel key={index} value={value} index={index}>
                        <Box>
                          {tab.orders.length > 0 ? (
                            tab.orders.map((order, orderIndex) => renderOrderCard(order, orderIndex))
                          ) : (
                            <Typography variant="body1" sx={{ color: colors.textSecondary, textAlign: 'center', py: 4 }}>
                              No {tab.label.toLowerCase()} found.
                            </Typography>
                          )}
                        </Box>
                      </TabPanel>
                    ))}
                  </AnimatePresence>
                )}
              </Box>
            </Paper>
          </Box>

          {/* User Info Sidebar */}
          <Box sx={{ width: { xs: '100%', lg: '350px' } }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper 
                elevation={isDarkMode ? 8 : 2}
                sx={{ 
                  p: 3,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '20px'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    src={authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"}
                    sx={{
                      width: 80,
                      height: 80,
                      border: `3px solid ${colors.accent}`,
                      margin: '0 auto',
                      mb: 2
                    }}
                  />
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600, mb: 1 }}>
                    {authMember?.memberNick}
                  </Typography>
                  <Chip 
                    label={authMember?.memberType} 
                    sx={{ 
                      backgroundColor: colors.accent,
                      color: colors.background,
                      fontWeight: 600
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.border }} />

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600, mb: 2 }}>
                    Contact Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ color: colors.textSecondary, mr: 2 }} />
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {authMember?.memberPhone || 'No phone number'}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ color: colors.textSecondary, mr: 2 }} />
                    <Typography variant="body2" sx={{ color: colors.text }}>
                      {authMember?.memberAddress || 'No address'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: colors.border }} />

                <Box>
                  <Typography variant="h6" sx={{ color: colors.text, fontWeight: 600, mb: 2 }}>
                    Order Statistics
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Total Orders:
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.text, fontWeight: 600 }}>
                      {mockOrders.length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Completed:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>
                      {mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH).length}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                      Pending:
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#ff9800', fontWeight: 600 }}>
                      {mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE || o.orderStatus === OrderStatus.PROCESS).length}
                    </Typography>
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

export default EnhancedOrdersPageWithMock; 