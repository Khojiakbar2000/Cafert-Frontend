import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box, Button, IconButton, Grid, Card, CardContent, Typography, Divider, Paper, Snackbar, Alert, Dialog, DialogContent, DialogTitle } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocationOnICon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setPausedOrders, setProcessOrders, setFinishedOrders} from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { ProductStatus, ProductCollection, ProductSize } from "../../../lib/enums/product.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import "../../../css/order.css";
import { serverApi } from "../../../lib/config";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch)=>({
  setPausedOrders: (data: Order[])=>
      dispatch(setPausedOrders(data)),
  setProcessOrders:(data:Order[])=>dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data))
});

export default function OrdersPage() {
  const {setPausedOrders,setProcessOrders,setFinishedOrders  } = actionDispatch(useDispatch())
  const {orderBuilder, authMember} = useGlobals()
  const history = useHistory()
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });
  
  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardName, setCardName] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Mock order data for testing when backend is not available
  const mockOrders: Order[] = [
    {
      _id: 'mock-order-2',
      memberId: authMember?._id || 'mock-member',
      orderStatus: OrderStatus.PROCESS,
      orderTotal: 12.50,
      orderDelivery: 0,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      orderItems: [
        { 
          _id: 'mock-item-3',
          itemQuantity: 1,
          itemPrice: 7.50,
          orderId: 'mock-order-2',
          productId: 'mock-product-3',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000)
        },
        { 
          _id: 'mock-item-4',
          itemQuantity: 1,
          itemPrice: 4.50,
          orderId: 'mock-order-2',
          productId: 'mock-product-4',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000)
        }
      ],
      productData: [
        {
          _id: 'mock-product-3',
          productName: 'Americano',
          productPrice: 7.50,
          productImages: ['/mock-image-3.jpg'],
          productCollection: ProductCollection.COFFEE,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 25,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Strong americano',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'mock-product-4',
          productName: 'Muffin',
          productPrice: 4.50,
          productImages: ['/mock-image-4.jpg'],
          productCollection: ProductCollection.DESSERT,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 20,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Blueberry muffin',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      _id: 'mock-order-3',
      memberId: authMember?._id || 'mock-member',
      orderStatus: OrderStatus.PAUSE,
      orderTotal: 8.99,
      orderDelivery: 0,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
      orderItems: [
        { 
          _id: 'mock-item-5',
          itemQuantity: 1,
          itemPrice: 4.99,
          orderId: 'mock-order-3',
          productId: 'mock-product-5',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000)
        },
        { 
          _id: 'mock-item-6',
          itemQuantity: 2,
          itemPrice: 2.00,
          orderId: 'mock-order-3',
          productId: 'mock-product-6',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000)
        }
      ],
      productData: [
        {
          _id: 'mock-product-5',
          productName: 'Latte',
          productPrice: 4.99,
          productImages: ['/mock-image-5.jpg'],
          productCollection: ProductCollection.COFFEE,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 10,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Smooth latte',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'mock-product-6',
          productName: 'Cookie',
          productPrice: 2.00,
          productImages: ['/mock-image-6.jpg'],
          productCollection: ProductCollection.DESSERT,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 30,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Chocolate chip cookie',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  const fetchOrders = async () => {
    if (!authMember?._id) return;
    
    console.log("=== ORDERS PAGE DEBUG ===");
    console.log("authMember:", authMember);
    console.log("orderBuilder:", orderBuilder);
    console.log("orderInquiry:", orderInquiry);
    
    const order = new OrderService()

    console.log("Fetching orders for user:", authMember._id);
    
    try {
      let pausedData: Order[] = [];
      let processData: Order[] = [];
      let finishedData: Order[] = [];

      // Try to fetch real orders first
      try {
        // Fetch paused orders
        pausedData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PAUSE});
        console.log("Paused orders fetched:", pausedData);
        
        // Fetch process orders
        processData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS});
        console.log("Process orders fetched:", processData);
        
        // Fetch finished orders
        finishedData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH});
        console.log("Finished orders fetched:", finishedData);
        
        // If no real orders, use mock data
        if ((!pausedData || pausedData.length === 0) && 
            (!processData || processData.length === 0) && 
            (!finishedData || finishedData.length === 0)) {
          console.log("No real orders found, using mock data");
          pausedData = mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE);
          processData = mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS);
          finishedData = mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH);
        }
      } catch (error) {
        console.log("API failed, using mock data:", error);
        pausedData = mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE);
        processData = mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS);
        finishedData = mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH);
      }

      console.log("Number of paused orders:", pausedData?.length || 0);
      console.log("Number of process orders:", processData?.length || 0);
      console.log("Number of finished orders:", finishedData?.length || 0);
      
      setPausedOrders(pausedData || []);
      setProcessOrders(processData || []);
      setFinishedOrders(finishedData || []);

    } catch (error) {
      console.error("Error fetching orders:", error);
      // Use mock data as fallback
      setPausedOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE));
      setProcessOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS));
      setFinishedOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [authMember?._id, orderInquiry.page, orderInquiry.limit, orderBuilder]);

  // Add a manual refresh function
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchOrders();
  };

 

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Payment form validation
  const isPaymentFormValid = (): boolean => {
    return cardNumber.trim() !== "" && 
           cardExpiry.trim() !== "" && 
           cardCVV.trim() !== "" && 
           cardName.trim() !== "";
  };

  // Payment handler
  const handlePayment = () => {
    if (!isPaymentFormValid()) {
      return;
    }

    // Simulate payment processing (fake success)
    setPaymentSuccess(true);
    setShowSuccessDialog(true);
    setShowSuccessSnackbar(true);

    // Auto-close dialog after 3 seconds
    setTimeout(() => {
      setShowSuccessDialog(false);
    }, 3000);

    // Auto-close snackbar after 3 seconds
    setTimeout(() => {
      setShowSuccessSnackbar(false);
    }, 3000);

    // Optionally switch to "Finished Orders" tab after success
    setTimeout(() => {
      setValue("3");
      setOrderInquiry({ ...orderInquiry, orderStatus: OrderStatus.FINISH });
    }, 2000);
  };

  if(!authMember) history.push("/")

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: '100vh', 
      background: '#f8f8ff',
      pt: 15,
      pb: 6
    }}>
      <Container maxWidth="xl">
        {/* Page Title */}
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            mb: 4, 
            color: '#1a1a1a',
            textAlign: 'center'
          }}
        >
          My Orders
        </Typography>

        {/* 2-Column Grid Layout */}
        <Grid container spacing={3}>
          {/* Left Column: Orders List (65%) */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              height: '100%'
            }}>
              <CardContent sx={{ p: 2.5 }}>
                {/* Section Title */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 1.5,
                  pb: 1.5,
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Orders
                  </Typography>
              <IconButton
                onClick={handleRefresh}
                sx={{
                  color: '#8b4513',
                  backgroundColor: 'rgba(139, 69, 19, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 69, 19, 0.12)',
                    transform: 'scale(1.1)',
                      }
                }}
                title="Refresh Orders"
              >
                <RefreshIcon />
              </IconButton>
            </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="order tabs"
                  >
                    <Tab label="Paused Orders" value={"1"} />
                    <Tab label="Process Orders" value={"2"} />
                    <Tab label="Finished Orders" value={"3"} />
                  </Tabs>
          </Box>

                {/* Orders Content */}
                <Box sx={{ mt: 1 }}>
            {value === "1" && <PausedOrders setValue={setValue}/>}
            {value === "2" && <ProcessOrders setValue={setValue}/>}
            {value === "3" && <FinishedOrders />}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: User & Payment (35%) */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* User Card */}
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Section Title */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    <PersonIcon sx={{ color: '#8b4513' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                      User Info
                    </Typography>
                  </Box>

                  {/* User Content */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box
                      component="img"
                      src={authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"}
                      sx={{
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        mb: 2
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                      {authMember?.memberNick || 'User'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                      {authMember?.memberType || 'Customer'}
                    </Typography>
                    <Divider sx={{ width: '100%', my: 2 }} />
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, width: '100%' }}>
                      <LocationOnICon sx={{ color: '#8b4513', mt: 0.5 }} />
                      <Typography variant="body2" sx={{ color: '#666', flex: 1 }}>
                        {authMember?.memberAddress || 'Address not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Payment Card */}
              <Card sx={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
              }}>
                <CardContent sx={{ p: 3 }}>
                  {/* Section Title */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    mb: 3,
                    pb: 2,
                    borderBottom: '2px solid #e0e0e0'
                  }}>
                    <PaymentIcon sx={{ color: '#8b4513' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                      Payment
                    </Typography>
          </Box>

                  {/* Payment Form */}
                  <Stack spacing={2}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5, 
                          color: '#666', 
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        Card Number
                      </Typography>
                      <Box
                        component="input"
              type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="5243 4090 2002 7495"
                        disabled={paymentSuccess}
                        sx={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #b4aaaa',
                          background: paymentSuccess ? '#e0e0e0' : '#f5f5f5',
                          px: 2,
                          fontSize: '14px',
                          fontFamily: 'Commissioner, sans-serif',
                          color: '#1a1a1a',
                          cursor: paymentSuccess ? 'not-allowed' : 'text',
                          transition: 'all 0.3s ease',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#8b4513',
                            boxShadow: '0 0 0 2px rgba(139, 69, 19, 0.1)',
                          },
                          '&:hover': {
                            borderColor: paymentSuccess ? '#b4aaaa' : '#8b4513',
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 0.5, 
                            color: '#666', 
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          Expiry Date
                        </Typography>
                        <Box
                          component="input"
                type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="07/24"
                          disabled={paymentSuccess}
                          sx={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid #b4aaaa',
                            background: paymentSuccess ? '#e0e0e0' : '#f5f5f5',
                            px: 2,
                            fontSize: '14px',
                            fontFamily: 'Commissioner, sans-serif',
                            color: '#1a1a1a',
                            cursor: paymentSuccess ? 'not-allowed' : 'text',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              outline: 'none',
                              borderColor: '#8b4513',
                              boxShadow: '0 0 0 2px rgba(139, 69, 19, 0.1)',
                            },
                            '&:hover': {
                              borderColor: paymentSuccess ? '#b4aaaa' : '#8b4513',
                            },
                            '&:disabled': {
                              opacity: 0.6,
                              cursor: 'not-allowed',
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            mb: 0.5, 
                            color: '#666', 
                            fontWeight: 500,
                            fontSize: '0.875rem'
                          }}
                        >
                          CVV
                        </Typography>
                        <Box
                          component="input"
                          type="password"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value)}
                          placeholder="010"
                          disabled={paymentSuccess}
                          sx={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '8px',
                            border: '1px solid #b4aaaa',
                            background: paymentSuccess ? '#e0e0e0' : '#f5f5f5',
                            px: 2,
                            fontSize: '14px',
                            fontFamily: 'Commissioner, sans-serif',
                            color: '#1a1a1a',
                            cursor: paymentSuccess ? 'not-allowed' : 'text',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              outline: 'none',
                              borderColor: '#8b4513',
                              boxShadow: '0 0 0 2px rgba(139, 69, 19, 0.1)',
                            },
                            '&:hover': {
                              borderColor: paymentSuccess ? '#b4aaaa' : '#8b4513',
                            },
                            '&:disabled': {
                              opacity: 0.6,
                              cursor: 'not-allowed',
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mb: 0.5, 
                          color: '#666', 
                          fontWeight: 500,
                          fontSize: '0.875rem'
                        }}
                      >
                        Card Holder Name
                      </Typography>
                      <Box
                        component="input"
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Justin Robertson"
                        disabled={paymentSuccess}
                        sx={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #b4aaaa',
                          background: paymentSuccess ? '#e0e0e0' : '#f5f5f5',
                          px: 2,
                          fontSize: '14px',
                          fontFamily: 'Commissioner, sans-serif',
                          color: '#1a1a1a',
                          cursor: paymentSuccess ? 'not-allowed' : 'text',
                          transition: 'all 0.3s ease',
                          '&:focus': {
                            outline: 'none',
                            borderColor: '#8b4513',
                            boxShadow: '0 0 0 2px rgba(139, 69, 19, 0.1)',
                          },
                          '&:hover': {
                            borderColor: paymentSuccess ? '#b4aaaa' : '#8b4513',
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                      <Box component="img" src="/icons/western-card.svg" alt="Western Union" sx={{ height: 24 }} />
                      <Box component="img" src="/icons/master-card.svg" alt="Mastercard" sx={{ height: 24 }} />
                      <Box component="img" src="/icons/paypal-card.svg" alt="PayPal" sx={{ height: 24 }} />
                      <Box component="img" src="/icons/visa-card.svg" alt="Visa" sx={{ height: 24 }} />
          </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handlePayment}
                      disabled={paymentSuccess || !isPaymentFormValid()}
                      startIcon={paymentSuccess ? <CheckCircleIcon /> : <PaymentIcon />}
                      sx={{
                        mt: 2,
                        py: 1.5,
                        backgroundColor: paymentSuccess ? '#4caf50' : '#8b4513',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '1rem',
                        borderRadius: '12px',
                        textTransform: 'none',
                        boxShadow: paymentSuccess ? 'none' : '0 4px 12px rgba(139, 69, 19, 0.3)',
                        '&:hover': {
                          backgroundColor: paymentSuccess ? '#4caf50' : '#a0522d',
                          transform: paymentSuccess ? 'none' : 'translateY(-2px)',
                          boxShadow: paymentSuccess ? 'none' : '0 6px 20px rgba(139, 69, 19, 0.4)',
                        },
                        '&:disabled': {
                          backgroundColor: '#4caf50',
                          color: '#ffffff',
                        },
                      }}
                    >
                      {paymentSuccess ? 'Payment Successful' : 'Process Payment'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
        </Stack>
          </Grid>
        </Grid>
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            textAlign: 'center',
            p: 3,
          }
        }}
      >
        <DialogContent>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: '#4caf50', 
              mb: 2,
              animation: 'scaleIn 0.3s ease-out',
              '@keyframes scaleIn': {
                '0%': { transform: 'scale(0)', opacity: 0 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              }
            }} 
          />
          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
              Payment Successful!
            </Typography>
          </DialogTitle>
          <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
            Your order has been placed successfully.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              backgroundColor: '#8b4513',
              color: '#ffffff',
              fontWeight: 600,
              px: 4,
              py: 1,
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#a0522d',
              },
            }}
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            width: '100%',
            backgroundColor: '#4caf50',
            color: '#ffffff',
            fontWeight: 600,
            borderRadius: '12px',
            '& .MuiAlert-icon': {
              color: '#ffffff',
            },
          }}
        >
          Payment Successful! Your order has been placed.
        </Alert>
      </Snackbar>
    </Box>
  );
}