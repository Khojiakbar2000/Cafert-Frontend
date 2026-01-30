import { useState, SyntheticEvent, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  IconButton,
  Grid,
  Card,
  CardContent,
  Typography,
  Divider,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Badge,
  InputAdornment,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Pagination,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slide,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import PaymentIcon from "@mui/icons-material/Payment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ScheduleIcon from "@mui/icons-material/Schedule";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { setPausedOrders, setProcessOrders, setFinishedOrders } from "./slice";
import { retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders } from "./selector";
import { createSelector } from "reselect";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { ProductStatus, ProductCollection, ProductSize } from "../../../lib/enums/product.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory, useLocation } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

const ordersRetriever = createSelector(
  [retrievePausedOrders, retrieveProcessOrders, retrieveFinishedOrders],
  (pausedOrders, processOrders, finishedOrders) => ({
    pausedOrders,
    processOrders,
    finishedOrders,
  })
);

interface CheckoutOrdersPageProps {
  onAdd?: (item: CartItem) => void;
  cartItems?: CartItem[];
  onRemove?: (item: CartItem) => void;
  onDelete?: (item: CartItem) => void;
  onDeleteAll?: () => void;
}

type OrderType = 'pickup' | 'delivery';
type TimeOption = 'asap' | 'schedule';

interface Product {
  _id: string;
  productName: string;
  productPrice: number;
  productImages: string[];
  productCollection?: string;
  productDesc?: string;
  productLeftCount?: number;
}

export default function CheckoutOrdersPage(props: CheckoutOrdersPageProps = {}) {
  const { onAdd, cartItems = [], onRemove, onDelete, onDeleteAll } = props;
  const { setPausedOrders, setProcessOrders, setFinishedOrders } = actionDispatch(useDispatch());
  const { pausedOrders, processOrders, finishedOrders } = useSelector(ordersRetriever);
  const { orderBuilder, authMember } = useGlobals();
  const history = useHistory();
  const location = useLocation();
  
  // Helper to get search string from location
  const getLocationSearch = () => {
    const loc = location as { search?: string };
    return loc.search || window.location.search || '';
  };
  
  // Main view tab: "checkout" or "menu"
  const getInitialView = () => {
    const params = new URLSearchParams(getLocationSearch());
    const tab = params.get('tab');
    return tab === 'menu' ? 'menu' : 'checkout';
  };
  const [mainView, setMainView] = useState<'checkout' | 'menu'>(getInitialView());
  
  // Update view when URL changes
  useEffect(() => {
    const params = new URLSearchParams(getLocationSearch());
    const tab = params.get('tab');
    if (tab === 'menu') {
      setMainView('menu');
    } else if (tab === 'checkout' || !tab) {
      setMainView('checkout');
    }
  }, [location]);
  
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
  const [billingZip, setBillingZip] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  // Fulfillment state
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP");

  // Menu browsing state (for Menu tab)
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [timeOption, setTimeOption] = useState<TimeOption>('asap');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [menuDeliveryAddress, setMenuDeliveryAddress] = useState<string>('');
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'drinks', 'desserts', 'salads', 'dishes'];
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('regular');
  const [quantity, setQuantity] = useState(1);
  const [sizeAccordionExpanded, setSizeAccordionExpanded] = useState(false);
  const [showCartSummary, setShowCartSummary] = useState(false);
  const cartSummaryRef = useRef<HTMLDivElement>(null);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  
  const mockAddressSuggestions = [
    '123 Main Street, Downtown',
    '456 Oak Avenue, Midtown',
    '789 Pine Road, Uptown',
    '321 Elm Street, Riverside',
    '654 Maple Drive, Parkview',
  ];

  // Mock order data
  const mockOrders: Order[] = [
    {
      _id: "mock-order-1",
      memberId: authMember?._id || "mock-member",
      orderStatus: OrderStatus.PAUSE,
      orderTotal: 24.99,
      orderDelivery: 5.0,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
      orderItems: [
        {
          _id: "mock-item-1",
          itemQuantity: 2,
          itemPrice: 4.99,
          orderId: "mock-order-1",
          productId: "mock-product-1",
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000),
        },
        {
          _id: "mock-item-2",
          itemQuantity: 3,
          itemPrice: 3.0,
          orderId: "mock-order-1",
          productId: "mock-product-2",
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000),
        },
      ],
      productData: [
        {
          _id: "mock-product-1",
          productName: "Cappuccino",
          productPrice: 4.99,
          productImages: ["/uploads/cappuccino.jpg"],
          productCollection: ProductCollection.COFFEE,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 15,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: "Classic cappuccino",
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "mock-product-2",
          productName: "Croissant",
          productPrice: 3.0,
          productImages: ["/uploads/croissant.jpg"],
          productCollection: ProductCollection.DESSERT,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 10,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: "Butter croissant",
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ];

  // Get current orders based on tab
  const getCurrentOrders = () => {
    switch (value) {
      case "1":
        return pausedOrders?.length > 0 ? pausedOrders : mockOrders.filter((o) => o.orderStatus === OrderStatus.PAUSE);
      case "2":
        return processOrders?.length > 0 ? processOrders : mockOrders.filter((o) => o.orderStatus === OrderStatus.PROCESS);
      case "3":
        return finishedOrders?.length > 0 ? finishedOrders : [];
      default:
        return [];
    }
  };

  const currentOrders = getCurrentOrders();
  const currentOrder = currentOrders[0]; // Display first order for now

  const fetchOrders = async () => {
    if (!authMember?._id) return;

    const order = new OrderService();

    try {
      let pausedData: Order[] = [];
      let processData: Order[] = [];
      let finishedData: Order[] = [];

      try {
        pausedData = await order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE });
        processData = await order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PROCESS });
        finishedData = await order.getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.FINISH });

        if ((!pausedData || pausedData.length === 0) && (!processData || processData.length === 0) && (!finishedData || finishedData.length === 0)) {
          pausedData = mockOrders.filter((o) => o.orderStatus === OrderStatus.PAUSE);
          processData = mockOrders.filter((o) => o.orderStatus === OrderStatus.PROCESS);
          finishedData = mockOrders.filter((o) => o.orderStatus === OrderStatus.FINISH);
        }
      } catch (error) {
        pausedData = mockOrders.filter((o) => o.orderStatus === OrderStatus.PAUSE);
        processData = mockOrders.filter((o) => o.orderStatus === OrderStatus.PROCESS);
        finishedData = mockOrders.filter((o) => o.orderStatus === OrderStatus.FINISH);
      }

      setPausedOrders(pausedData || []);
      setProcessOrders(processData || []);
      setFinishedOrders(finishedData || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setPausedOrders(mockOrders.filter((o) => o.orderStatus === OrderStatus.PAUSE));
      setProcessOrders(mockOrders.filter((o) => o.orderStatus === OrderStatus.PROCESS));
      setFinishedOrders(mockOrders.filter((o) => o.orderStatus === OrderStatus.FINISH));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [authMember?._id, orderInquiry.page, orderInquiry.limit, orderBuilder]);

  // Fetch products for menu tab
  useEffect(() => {
    if (mainView === 'menu') {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const productService = new ProductService();
          const fetchedProducts = await productService.getProducts({
            page: 1,
            limit: 100,
            order: 'createdAt',
          });
          setProducts(fetchedProducts);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [mainView]);

  // Show cart summary when cart has items (menu tab)
  useEffect(() => {
    if (mainView === 'menu' && cartItems) {
      setShowCartSummary(cartItems.length > 0);
    }
  }, [cartItems, mainView]);

  // Save order context to localStorage when order configuration changes (menu tab)
  useEffect(() => {
    if (mainView === 'menu') {
      const orderContext = {
        orderSource: 'orders',
        fulfillmentType: orderType,
        deliveryAddress: orderType === 'delivery' ? menuDeliveryAddress : undefined,
        scheduledTime: orderType === 'pickup' && timeOption === 'schedule' 
          ? { date: scheduledDate, time: scheduledTime }
          : timeOption === 'asap' ? 'asap' : undefined,
      };
      localStorage.setItem('orderContext', JSON.stringify(orderContext));
    }
  }, [orderType, menuDeliveryAddress, timeOption, scheduledDate, scheduledTime, mainView]);

  // Try to get fulfillment info from localStorage (for checkout tab)
  useEffect(() => {
    if (mainView === 'checkout') {
    try {
      const contextStr = localStorage.getItem("orderContext");
      if (contextStr) {
        const context = JSON.parse(contextStr);
        if (context.fulfillmentType) {
          setFulfillmentType(context.fulfillmentType);
        }
        if (context.deliveryAddress) {
          setDeliveryAddress(context.deliveryAddress);
        }
        if (context.scheduledTime) {
          setPickupTime(
            context.scheduledTime.date && context.scheduledTime.time
              ? `${context.scheduledTime.date} at ${context.scheduledTime.time}`
              : "ASAP"
          );
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    }
  }, [mainView]);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Menu tab handlers
  const handleMainTabChange = (event: SyntheticEvent, newValue: 'checkout' | 'menu') => {
    setMainView(newValue);
    const newUrl = newValue === 'menu' ? '/orders?tab=menu' : '/orders?tab=checkout';
    history.push(newUrl);
  };

  const handleAddressChange = (value: string) => {
    setMenuDeliveryAddress(value);
    if (value.length > 2) {
      const filtered = mockAddressSuggestions.filter(addr =>
        addr.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setAddressSuggestions([]);
    }
  };

  const handleAddressEnter = () => {
    if (menuDeliveryAddress.trim()) {
      setShowSuggestions(false);
      // Address is confirmed/entered
      console.log('Address confirmed:', menuDeliveryAddress);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMenuDeliveryAddress(suggestion);
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMenuDeliveryAddress('Current location');
        setShowSuggestions(false);
      },
      (error) => {
        // Handle error silently
      }
    );
  };

  const scrollToCategory = useCallback((category: string) => {
    const element = categoryRefs.current[category];
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }, []);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    scrollToCategory(category);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSize('regular');
    setQuantity(1);
    setModalOpen(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !onAdd) return;

    const cartItem: CartItem = {
      _id: selectedProduct._id,
      name: selectedProduct.productName,
      price: selectedProduct.productPrice,
      image: selectedProduct.productImages?.[0] 
        ? `${serverApi}${selectedProduct.productImages[0]}`
        : '/icons/noimage-list.svg',
      quantity: quantity,
    };

    onAdd(cartItem);
    setModalOpen(false);
  };

  const handleViewCart = () => {
    window.dispatchEvent(new CustomEvent('openBasket'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Menu tab calculations
  const cartTotal = cartItems?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const cartItemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === 'all') return true;
    const collection = product.productCollection?.toLowerCase();
    if (selectedCategory === 'drinks') {
      return collection === 'coffee' || collection === 'drink';
    }
    if (selectedCategory === 'desserts') {
      return collection === 'dessert';
    }
    if (selectedCategory === 'salads') {
      return collection === 'salad';
    }
    if (selectedCategory === 'dishes') {
      return collection === 'dish';
    }
    return false;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    if (mainView === 'menu') {
      setPage(1);
    }
  }, [selectedCategory, mainView]);

  const setCategoryRef = (category: string) => (el: HTMLDivElement | null) => {
    categoryRefs.current[category] = el;
  };

  const parchmentText = '#3a3429';

  // Card brand detection
  const detectCardBrand = (number: string): string => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "";
  };

  const cardBrand = detectCardBrand(cardNumber);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  // Format expiry MM/YY
  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  // Payment form validation
  const isPaymentFormValid = (): boolean => {
    return cardNumber.replace(/\s/g, "").length >= 13 && cardExpiry.length === 5 && cardCVV.length >= 3 && cardName.trim() !== "";
  };

  // Payment handler
  const handlePayment = () => {
    if (!isPaymentFormValid()) {
      return;
    }

    // Start processing
    setPaymentProcessing(true);

    // Simulate payment processing (2.5 seconds)
    setTimeout(() => {
      // Payment processed successfully
      setPaymentProcessing(false);
      setPaymentSuccess(true);
      setShowSuccessDialog(true);
      setShowSuccessSnackbar(true);

      // Auto-close success dialog after 3 seconds
      setTimeout(() => {
        setShowSuccessDialog(false);
      }, 3000);

      // Auto-close snackbar after 3 seconds
      setTimeout(() => {
        setShowSuccessSnackbar(false);
      }, 3000);

      // Switch to completed tab after 2 seconds
      setTimeout(() => {
        setValue("3");
        setOrderInquiry({ ...orderInquiry, orderStatus: OrderStatus.FINISH });
      }, 2000);
    }, 2500);
  };

  // Calculate totals from cart items (for checkout view)
  const calculateSubtotal = () => {
    if (mainView === 'checkout' && cartItems) {
      return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    // Fallback to order items if no cart (for backward compatibility)
    if (!currentOrder) return 0;
    return currentOrder.orderItems?.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const delivery = (fulfillmentType === "delivery" ? 5.0 : 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + delivery + tax;

  if (!authMember) history.push("/");

  // Status stepper
  const getActiveStep = () => {
    switch (value) {
      case "1":
        return 0; // Paused
      case "2":
        return 1; // Processing
      case "3":
        return 3; // Completed
      default:
        return 0;
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        background: "#fbfbf8",
        pt: 15,
        pb: mainView === 'menu' && showCartSummary ? { xs: 20, md: 16 } : 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Main Tabs: Checkout / Menu */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            overflow: "hidden",
          }}
        >
          <Tabs
            value={mainView}
            onChange={handleMainTabChange}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#8B4513",
                height: 3,
              },
            }}
          >
            <Tab
              label="Checkout"
              value="checkout"
              sx={{
                fontFamily: '"EB Garamond", serif',
                fontSize: "1.1rem",
                textTransform: "none",
                fontWeight: mainView === "checkout" ? 600 : 400,
                color: mainView === "checkout" ? "#8B4513" : "#3a3429",
              }}
            />
            <Tab
              label="Menu"
              value="menu"
              sx={{
                fontFamily: '"EB Garamond", serif',
                fontSize: "1.1rem",
                textTransform: "none",
                fontWeight: mainView === "menu" ? 600 : 400,
                color: mainView === "menu" ? "#8B4513" : "#3a3429",
              }}
            />
          </Tabs>
        </Paper>

        {/* Conditional Rendering: Checkout View */}
        {mainView === 'checkout' && (
          <>
        {/* Page Title */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              fontFamily: '"Cinzel", "Cormorant Garamond", serif',
              fontWeight: 600,
              color: "#3a3429",
              mb: 1,
              letterSpacing: "0.02em",
            }}
          >
            Checkout
          </Typography>
          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: "1rem",
              color: "#3a3429",
              opacity: 0.6,
            }}
          >
            Review and complete your order
          </Typography>
        </Box>

        {/* 2-Column Layout */}
        <Grid container spacing={4}>
          {/* Left Column: Order Details (60-65%) */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={3}>
              {/* Order Status Tabs */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ borderBottom: "1px solid rgba(58, 52, 41, 0.08)" }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="order status tabs"
                    sx={{
                      px: 3,
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#8B4513",
                        height: 3,
                      },
                    }}
                  >
                    <Tab
                      label="Pending"
                      value={"1"}
                      sx={{
                        fontFamily: '"EB Garamond", serif',
                        fontSize: "1rem",
                        textTransform: "none",
                        fontWeight: value === "1" ? 600 : 400,
                      }}
                    />
                    <Tab
                      label="Processing"
                      value={"2"}
                      sx={{
                        fontFamily: '"EB Garamond", serif',
                        fontSize: "1rem",
                        textTransform: "none",
                        fontWeight: value === "2" ? 600 : 400,
                      }}
                    />
                    <Tab
                      label="Completed"
                      value={"3"}
                      sx={{
                        fontFamily: '"EB Garamond", serif',
                        fontSize: "1rem",
                        textTransform: "none",
                        fontWeight: value === "3" ? 600 : 400,
                      }}
                    />
                  </Tabs>
                </Box>

                {/* Status Stepper */}
                <Box sx={{ p: 4, pb: 3 }}>
                  <Stepper activeStep={getActiveStep()} alternativeLabel>
                    <Step>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.95rem",
                          },
                        }}
                      >
                        Placed
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.95rem",
                          },
                        }}
                      >
                        Preparing
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.95rem",
                          },
                        }}
                      >
                        Ready
                      </StepLabel>
                    </Step>
                    <Step>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.95rem",
                          },
                        }}
                      >
                        Completed
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              </Paper>

              {/* Orders List - Pending, Processing, Completed */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  p: { xs: 3, md: 4 },
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: '"Cinzel", serif',
                      fontWeight: 600,
                      color: "#3a3429",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Orders
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  {value === "1" && <PausedOrders setValue={setValue} />}
                  {value === "2" && <ProcessOrders setValue={setValue} />}
                  {value === "3" && <FinishedOrders setValue={setValue} />}
                </Box>
              </Paper>

              {/* Fulfillment Card */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  p: { xs: 3, md: 4 },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 600,
                    color: "#3a3429",
                    mb: 3,
                    letterSpacing: "0.01em",
                  }}
                >
                  Fulfillment
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 3,
                    borderRadius: "16px",
                    backgroundColor: "rgba(139, 69, 19, 0.04)",
                    border: "1px solid rgba(139, 69, 19, 0.1)",
                  }}
                >
                  {fulfillmentType === "pickup" ? <StorefrontIcon sx={{ fontSize: "2rem", color: "#8B4513" }} /> : <LocalShippingIcon sx={{ fontSize: "2rem", color: "#8B4513" }} />}

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#3a3429",
                        mb: 0.5,
                        textTransform: "capitalize",
                      }}
                    >
                      {fulfillmentType}
                    </Typography>

                    {fulfillmentType === "pickup" ? (
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "0.95rem",
                          color: "#3a3429",
                          opacity: 0.7,
                        }}
                      >
                        {pickupTime}
                      </Typography>
                    ) : (
                      <>
                        {deliveryAddress ? (
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: "0.95rem",
                              color: "#3a3429",
                              opacity: 0.7,
                            }}
                          >
                            {deliveryAddress}
                          </Typography>
                        ) : (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                            <Chip label="Address required" size="small" color="warning" />
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => {
                                setMainView('menu');
                                history.push("/orders?tab=menu");
                              }}
                              sx={{
                                fontFamily: '"EB Garamond", serif',
                                textTransform: "none",
                                color: "#8B4513",
                              }}
                            >
                              Add address
                            </Button>
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Right Column: Payment (35-40%, sticky) */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                position: { lg: "sticky" },
                top: { lg: 100 },
              }}
            >
              <Stack spacing={3}>
                {/* Payment Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "24px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    p: { xs: 3, md: 4 },
                  }}
                >
                  {/* Test Mode Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        fontWeight: 600,
                        color: "#3a3429",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Payment
                    </Typography>
                    <Chip
                      label="Demo Mode"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 152, 0, 0.1)",
                        color: "#f57c00",
                        fontFamily: '"EB Garamond", serif',
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  {/* Secure Checkout Indicator */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 3,
                      p: 1.5,
                      borderRadius: "12px",
                      backgroundColor: "rgba(76, 175, 80, 0.08)",
                    }}
                  >
                    <LockIcon sx={{ fontSize: "1.2rem", color: "#4caf50" }} />
                    <Typography
                      sx={{
                        fontFamily: '"EB Garamond", serif',
                        fontSize: "0.9rem",
                        color: "#2e7d32",
                        fontWeight: 500,
                      }}
                    >
                      Secure checkout
                    </Typography>
                  </Box>

                  {/* Payment Form */}
                  <Stack spacing={2.5}>
                    {/* Card Number */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "0.9rem",
                          color: "#3a3429",
                          opacity: 0.7,
                          mb: 0.75,
                          fontWeight: 500,
                        }}
                      >
                        Card number
                      </Typography>
                      <TextField
                        fullWidth
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        disabled={paymentProcessing || paymentSuccess}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <CreditCardIcon sx={{ color: "#8B4513", opacity: 0.5 }} />
                            </InputAdornment>
                          ),
                          endAdornment: cardBrand && (
                            <InputAdornment position="end">
                              <Chip label={cardBrand} size="small" sx={{ fontFamily: '"EB Garamond", serif', fontSize: "0.75rem" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontFamily: '"EB Garamond", serif',
                            backgroundColor: "#fafafa",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.15)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8B4513",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Expiry and CVV */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.9rem",
                            color: "#3a3429",
                            opacity: 0.7,
                            mb: 0.75,
                            fontWeight: 500,
                          }}
                        >
                          Expiration
                        </Typography>
                        <TextField
                          fullWidth
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          disabled={paymentProcessing || paymentSuccess}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontFamily: '"EB Garamond", serif',
                              backgroundColor: "#fafafa",
                              borderRadius: "12px",
                              "& fieldset": {
                                borderColor: "rgba(58, 52, 41, 0.15)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(58, 52, 41, 0.3)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#8B4513",
                              },
                            },
                          }}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: '"EB Garamond", serif',
                            fontSize: "0.9rem",
                            color: "#3a3429",
                            opacity: 0.7,
                            mb: 0.75,
                            fontWeight: 500,
                          }}
                        >
                          CVV
                        </Typography>
                        <TextField
                          fullWidth
                          type="password"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").substring(0, 4))}
                          placeholder="123"
                          disabled={paymentProcessing || paymentSuccess}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              fontFamily: '"EB Garamond", serif',
                              backgroundColor: "#fafafa",
                              borderRadius: "12px",
                              "& fieldset": {
                                borderColor: "rgba(58, 52, 41, 0.15)",
                              },
                              "&:hover fieldset": {
                                borderColor: "rgba(58, 52, 41, 0.3)",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#8B4513",
                              },
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Cardholder Name */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "0.9rem",
                          color: "#3a3429",
                          opacity: 0.7,
                          mb: 0.75,
                          fontWeight: 500,
                        }}
                      >
                        Name on card
                      </Typography>
                      <TextField
                        fullWidth
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        disabled={paymentProcessing || paymentSuccess}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontFamily: '"EB Garamond", serif',
                            backgroundColor: "#fafafa",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.15)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8B4513",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Billing ZIP (optional) */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "0.9rem",
                          color: "#3a3429",
                          opacity: 0.7,
                          mb: 0.75,
                          fontWeight: 500,
                        }}
                      >
                        Billing ZIP code
                      </Typography>
                      <TextField
                        fullWidth
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.substring(0, 10))}
                        placeholder="12345"
                        disabled={paymentProcessing || paymentSuccess}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontFamily: '"EB Garamond", serif',
                            backgroundColor: "#fafafa",
                            borderRadius: "12px",
                            "& fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.15)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(58, 52, 41, 0.3)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#8B4513",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Stack>
                </Paper>

                {/* Totals Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "24px",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    p: { xs: 3, md: 4 },
                  }}
                >
                  <Stack spacing={2}>
                    {/* Subtotal */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          opacity: 0.7,
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          fontWeight: 500,
                        }}
                      >
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Delivery */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          opacity: 0.7,
                        }}
                      >
                        Delivery
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          fontWeight: 500,
                        }}
                      >
                        ${delivery.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Tax */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          opacity: 0.7,
                        }}
                      >
                        Tax
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          fontSize: "1rem",
                          color: "#3a3429",
                          fontWeight: 500,
                        }}
                      >
                        ${tax.toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: "rgba(58, 52, 41, 0.15)" }} />

                    {/* Total */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: "1.3rem",
                          color: "#3a3429",
                          fontWeight: 600,
                          letterSpacing: "0.01em",
                        }}
                      >
                        Total
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: "1.5rem",
                          color: "#8B4513",
                          fontWeight: 700,
                        }}
                      >
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Primary CTA */}
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handlePayment}
                      disabled={paymentProcessing || paymentSuccess || !isPaymentFormValid()}
                      startIcon={
                        paymentProcessing ? (
                          <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                        ) : paymentSuccess ? (
                          <CheckCircleIcon />
                        ) : (
                          <PaymentIcon />
                        )
                      }
                      sx={{
                        mt: 2,
                        py: 2,
                        height: 56,
                        backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#8B4513",
                        color: "#ffffff",
                        fontFamily: '"EB Garamond", serif',
                        fontWeight: 600,
                        fontSize: "1.1rem",
                        borderRadius: "16px",
                        textTransform: "none",
                        boxShadow: paymentSuccess || paymentProcessing ? "none" : "0 4px 12px rgba(139, 69, 19, 0.3)",
                        "&:hover": {
                          backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#A0522D",
                          transform: paymentSuccess || paymentProcessing ? "none" : "translateY(-2px)",
                          boxShadow: paymentSuccess || paymentProcessing ? "none" : "0 6px 20px rgba(139, 69, 19, 0.4)",
                        },
                        "&:disabled": {
                          backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#d0d0d0",
                          color: "#ffffff",
                          opacity: paymentProcessing ? 1 : 0.7,
                        },
                      }}
                    >
                      {paymentProcessing ? "Processing payment..." : paymentSuccess ? "Payment Successful" : `Pay $${total.toFixed(2)}`}
                    </Button>

                    {/* Secondary Button */}
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => history.push("/")}
                      sx={{
                        py: 1.5,
                        color: "#3a3429",
                        fontFamily: '"EB Garamond", serif',
                        fontSize: "0.95rem",
                        textTransform: "none",
                        opacity: 0.7,
                        "&:hover": {
                          backgroundColor: "rgba(58, 52, 41, 0.05)",
                          opacity: 1,
                        },
                      }}
                    >
                      Cancel order
                    </Button>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Grid>
        </Grid>
          </>
        )}

        {/* Conditional Rendering: Menu View */}
        {mainView === 'menu' && (
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            {/* Compact Order Type Controls at Top */}
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: { xs: 2, md: 3 },
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <Stack spacing={3}>
                {/* Order Type Selection */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: '"Cinzel", serif',
                      color: parchmentText,
                      mb: 2,
                      fontSize: { xs: '1.1rem', md: '1.2rem' },
                      fontWeight: 600,
                    }}
                  >
                    Order Type
                  </Typography>
                  <RadioGroup
                    row
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value as OrderType)}
                    sx={{ gap: { xs: 2, md: 4 } }}
                  >
                    <FormControlLabel
                      value="pickup"
                      control={
                        <Radio
                          sx={{
                            color: parchmentText,
                            '&.Mui-checked': { color: '#8B4513' },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: '1.2rem', color: '#8B4513' }} />
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: '1rem',
                              fontWeight: orderType === 'pickup' ? 600 : 400,
                            }}
                          >
                            Pickup
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="delivery"
                      control={
                        <Radio
                          sx={{
                            color: parchmentText,
                            '&.Mui-checked': { color: '#8B4513' },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: '1.2rem', color: '#8B4513' }} />
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: '1rem',
                              fontWeight: orderType === 'delivery' ? 600 : 400,
                            }}
                          >
                            Delivery
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                </Box>

                {/* Conditional Content */}
                {orderType === 'pickup' ? (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        color: parchmentText,
                        mb: 2,
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        fontWeight: 600,
                      }}
                    >
                      When
                    </Typography>
                    <RadioGroup
                      row
                      value={timeOption}
                      onChange={(e) => setTimeOption(e.target.value as TimeOption)}
                      sx={{ mb: timeOption === 'schedule' ? 2 : 0 }}
                    >
                      <FormControlLabel
                        value="asap"
                        control={
                          <Radio
                            sx={{
                              color: parchmentText,
                              '&.Mui-checked': { color: '#8B4513' },
                            }}
                          />
                        }
                        label={
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: '1rem',
                            }}
                          >
                            ASAP
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="schedule"
                        control={
                          <Radio
                            sx={{
                              color: parchmentText,
                              '&.Mui-checked': { color: '#8B4513' },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: '1.2rem' }} />
                            <Typography
                              sx={{
                                fontFamily: '"EB Garamond", serif',
                                fontSize: '1rem',
                              }}
                            >
                              Schedule
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    {timeOption === 'schedule' && (
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        sx={{ mt: 2 }}
                      >
                        <TextField
                          type="date"
                          label="Pickup Date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontFamily: '"EB Garamond", serif',
                              backgroundColor: '#fafafa',
                            },
                          }}
                        />
                        <TextField
                          type="time"
                          label="Pickup Time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontFamily: '"EB Garamond", serif',
                              backgroundColor: '#fafafa',
                            },
                          }}
                        />
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Cinzel", serif',
                        color: parchmentText,
                        mb: 2,
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        fontWeight: 600,
                      }}
                    >
                      Delivery Address
                    </Typography>
                    <Box sx={{ position: 'relative' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <Box sx={{ position: 'relative', flex: 1 }}>
                          <TextField
                            fullWidth
                            label="Enter your delivery address"
                            value={menuDeliveryAddress}
                            onChange={(e) => handleAddressChange(e.target.value)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddressEnter();
                              }
                            }}
                            required
                            error={menuDeliveryAddress === ''}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                fontFamily: '"EB Garamond", serif',
                                backgroundColor: '#fafafa',
                              },
                            }}
                          />
                          {showSuggestions && addressSuggestions.length > 0 && (
                            <Paper
                              elevation={4}
                              sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 1000,
                                mt: 0.5,
                                maxHeight: '200px',
                                overflow: 'auto',
                              }}
                            >
                              <Stack>
                                {addressSuggestions.map((suggestion, index) => (
                                  <Box
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    sx={{
                                      p: 2,
                                      cursor: 'pointer',
                                      '&:hover': {
                                        backgroundColor: 'rgba(139, 69, 19, 0.05)',
                                      },
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontFamily: '"EB Garamond", serif',
                                        fontSize: '0.95rem',
                                        color: parchmentText,
                                      }}
                                    >
                                      {suggestion}
                                    </Typography>
                                  </Box>
                                ))}
                              </Stack>
                            </Paper>
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          onClick={handleAddressEnter}
                          disabled={!menuDeliveryAddress.trim()}
                          sx={{
                            mt: 0.5,
                            minWidth: 100,
                            height: 56,
                            fontFamily: '"EB Garamond", serif',
                            backgroundColor: '#8B4513',
                            color: '#ffffff',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: '#A0522D',
                            },
                            '&:disabled': {
                              backgroundColor: '#d0d0d0',
                              color: '#999',
                            },
                          }}
                        >
                          Enter
                        </Button>
                      </Box>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<LocationOnIcon />}
                      onClick={handleUseLocation}
                      sx={{
                        mt: 2,
                        fontFamily: '"EB Garamond", serif',
                        borderColor: 'rgba(58, 52, 41, 0.3)',
                        color: parchmentText,
                        textTransform: 'none',
                      }}
                    >
                      Use My Location
                    </Button>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Category Navigation */}
            <Box
              sx={{
                position: 'sticky',
                top: 80,
                zIndex: 100,
                backgroundColor: '#fbfbf8',
                py: 2,
                mb: 3,
                borderBottom: '1px solid rgba(58, 52, 41, 0.1)',
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  overflowX: 'auto',
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    variant={selectedCategory === category ? 'contained' : 'outlined'}
                    sx={{
                      fontFamily: '"EB Garamond", serif',
                      textTransform: 'capitalize',
                      fontSize: '1rem',
                      minWidth: '100px',
                      backgroundColor:
                        selectedCategory === category
                          ? '#8B4513'
                          : 'transparent',
                      color:
                        selectedCategory === category ? '#fff' : parchmentText,
                      borderColor: '#8B4513',
                      '&:hover': {
                        backgroundColor:
                          selectedCategory === category ? '#A0522D' : 'rgba(139, 69, 19, 0.1)',
                        borderColor: '#8B4513',
                      },
                    }}
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Products Grid */}
            <Box ref={setCategoryRef('all')} sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                  },
                  gap: { xs: 4, md: 6 },
                }}
              >
                {paginatedProducts.map((product) => (
                  <Box
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    sx={{
                      cursor: 'pointer',
                      border: '1px solid rgba(58, 52, 41, 0.15)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      transition: 'border-color 0.2s ease',
                      '&:hover': {
                        borderColor: 'rgba(58, 52, 41, 0.3)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        p: { xs: 2, md: 3 },
                        backgroundColor: '#faf8f3',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          mb: 3,
                          borderRadius: '80px 80px 8px 8px',
                          overflow: 'hidden',
                          backgroundColor: '#f5f1e8',
                          border: '1px solid rgba(58, 52, 41, 0.08)',
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            product.productImages?.[0]
                              ? `${serverApi}${product.productImages[0]}`
                              : '/icons/noimage-list.svg'
                          }
                          alt={product.productName}
                          sx={{
                            width: '100%',
                            height: { xs: '320px', md: '400px' },
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", "Cormorant Garamond", serif',
                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                            color: parchmentText,
                            mb: 1,
                            fontWeight: 500,
                          }}
                        >
                          {product.productName}
                        </Typography>

                        {product.productDesc && (
                          <Typography
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: { xs: '0.95rem', md: '1rem' },
                              color: parchmentText,
                              opacity: 0.65,
                              mb: 2.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {product.productDesc}
                          </Typography>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            pt: 1,
                            borderTop: '1px solid rgba(58, 52, 41, 0.1)',
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: '"Cinzel", serif',
                              fontSize: { xs: '1.2rem', md: '1.3rem' },
                              color: '#8B4513',
                              fontWeight: 500,
                            }}
                          >
                            ${product.productPrice.toFixed(2)}
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                            sx={{
                              fontFamily: '"EB Garamond", serif',
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              borderColor: 'rgba(58, 52, 41, 0.3)',
                              color: parchmentText,
                              px: { xs: 2, md: 3 },
                              py: 0.75,
                              textTransform: 'none',
                              '&:hover': {
                                borderColor: 'rgba(58, 52, 41, 0.5)',
                                backgroundColor: 'rgba(58, 52, 41, 0.05)',
                              },
                            }}
                          >
                            Add
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
              
              {totalPages > 1 && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 6,
                  }}
                >
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontFamily: '"EB Garamond", serif',
                        fontSize: '1rem',
                        color: parchmentText,
                        '&.Mui-selected': {
                          backgroundColor: '#8B4513',
                          color: '#fff',
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Add to Cart Modal */}
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              maxWidth="lg"
              fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  maxWidth: { xs: '90%', md: '1000px' },
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontFamily: '"Cinzel", serif',
                  color: parchmentText,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {selectedProduct?.productName}
                <IconButton
                  onClick={() => setModalOpen(false)}
                  sx={{
                    color: parchmentText,
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                {selectedProduct && (
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 3, md: 4 }}
                  >
                    <Box sx={{ flex: { xs: 'none', md: '0 0 45%' } }}>
                      <Box
                        sx={{
                          border: '1px solid rgba(58, 52, 41, 0.12)',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          backgroundColor: '#faf8f3',
                          p: { xs: 2, md: 3 },
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            selectedProduct.productImages?.[0]
                              ? `${serverApi}${selectedProduct.productImages[0]}`
                              : '/icons/noimage-list.svg'
                          }
                          alt={selectedProduct.productName}
                          sx={{
                            width: '100%',
                            height: { xs: '280px', md: '400px' },
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      {selectedProduct.productDesc && (
                        <Typography
                          sx={{
                            fontFamily: '"EB Garamond", serif',
                            color: parchmentText,
                            opacity: 0.65,
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            mb: 3,
                          }}
                        >
                          {selectedProduct.productDesc}
                        </Typography>
                      )}

                      {/* Size Selection */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", serif',
                            fontSize: '0.75rem',
                            color: parchmentText,
                            opacity: 0.7,
                            textTransform: 'uppercase',
                            mb: 1.5,
                          }}
                        >
                          Size
                        </Typography>
                        <Accordion
                          expanded={sizeAccordionExpanded}
                          onChange={(e, expanded) => setSizeAccordionExpanded(expanded)}
                          sx={{
                            boxShadow: 'none',
                            border: '1px solid rgba(58, 52, 41, 0.2)',
                            borderRadius: '4px',
                            backgroundColor: '#fafafa',
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography
                              sx={{
                                fontFamily: '"EB Garamond", serif',
                                fontSize: '1rem',
                                color: parchmentText,
                                textTransform: 'capitalize',
                              }}
                            >
                              {selectedSize === 'small'
                                ? 'Small (+$0.00)'
                                : selectedSize === 'regular'
                                ? 'Regular (+$0.00)'
                                : 'Large (+$1.50)'}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Stack spacing={1}>
                              {['small', 'regular', 'large'].map((size) => (
                                <Button
                                  key={size}
                                  onClick={() => {
                                    setSelectedSize(size);
                                    setSizeAccordionExpanded(false);
                                  }}
                                  variant={selectedSize === size ? 'contained' : 'outlined'}
                                  sx={{
                                    fontFamily: '"EB Garamond", serif',
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {size} (+${size === 'large' ? '1.50' : '0.00'})
                                </Button>
                              ))}
                            </Stack>
                          </AccordionDetails>
                        </Accordion>
                      </Box>

                      {/* Quantity */}
                      <Box sx={{ mb: 4 }}>
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", serif',
                            fontSize: '0.75rem',
                            color: parchmentText,
                            opacity: 0.7,
                            textTransform: 'uppercase',
                            mb: 1.5,
                          }}
                        >
                          Quantity
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: '#fafafa',
                            borderRadius: '4px',
                            p: 1,
                            width: 'fit-content',
                          }}
                        >
                          <IconButton
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            sx={{
                              border: '1px solid rgba(58, 52, 41, 0.15)',
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography
                            sx={{
                              fontFamily: '"Cinzel", serif',
                              fontSize: '1.3rem',
                              minWidth: '50px',
                              textAlign: 'center',
                              color: parchmentText,
                            }}
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => setQuantity(quantity + 1)}
                            sx={{
                              border: '1px solid rgba(58, 52, 41, 0.15)',
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {/* Total and Add Button */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 3,
                          mt: 'auto',
                          borderTop: '1px solid rgba(58, 52, 41, 0.1)',
                          mb: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", serif',
                            fontSize: '0.75rem',
                            color: parchmentText,
                            opacity: 0.7,
                            textTransform: 'uppercase',
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: '"Cinzel", serif',
                            fontSize: { xs: '1.5rem', md: '1.8rem' },
                            color: '#8B4513',
                            fontWeight: 600,
                          }}
                        >
                          ${(selectedProduct.productPrice * quantity).toFixed(2)}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleAddToCart}
                        sx={{
                          backgroundColor: '#8B4513',
                          fontFamily: '"EB Garamond", serif',
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          py: { xs: 1.5, md: 1.75 },
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#A0522D',
                          },
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Stack>
                )}
              </DialogContent>
            </Dialog>

            {/* Sticky Cart Summary */}
            <Slide direction="up" in={showCartSummary} mountOnEnter unmountOnExit>
              <Paper
                ref={cartSummaryRef}
                elevation={8}
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  p: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderTop: '2px solid #8B4513',
                }}
              >
                <Container maxWidth="lg">
                  <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: '1.1rem',
                          color: parchmentText,
                        }}
                      >
                        {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: '1.5rem',
                          color: '#8B4513',
                          fontWeight: 600,
                        }}
                      >
                        ${cartTotal.toFixed(2)}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        onClick={handleViewCart}
                        sx={{
                          fontFamily: '"EB Garamond", serif',
                          borderColor: '#8B4513',
                          color: '#8B4513',
                          textTransform: 'none',
                        }}
                      >
                        View Cart
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setMainView('checkout');
                          history.push('/orders?tab=checkout');
                        }}
                        sx={{
                          backgroundColor: '#8B4513',
                          fontFamily: '"EB Garamond", serif',
                          fontSize: '1.1rem',
                          px: 4,
                          '&:hover': { backgroundColor: '#A0522D' },
                        }}
                      >
                        Checkout
                      </Button>
                    </Stack>
                  </Stack>
                </Container>
              </Paper>
            </Slide>
          </Container>
        )}
      </Container>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "24px",
            textAlign: "center",
            p: 4,
          },
        }}
      >
        <DialogContent>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: "#4caf50",
              mb: 2,
              animation: "scaleIn 0.3s ease-out",
              "@keyframes scaleIn": {
                "0%": { transform: "scale(0)", opacity: 0 },
                "100%": { transform: "scale(1)", opacity: 1 },
              },
            }}
          />
          <DialogTitle sx={{ p: 0, mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: "#3a3429",
                mb: 1,
              }}
            >
              Payment Successful!
            </Typography>
          </DialogTitle>
          <Typography
            sx={{
              fontFamily: '"EB Garamond", serif',
              fontSize: "1rem",
              color: "#3a3429",
              opacity: 0.7,
              mb: 3,
            }}
          >
            Your order has been placed successfully.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowSuccessDialog(false)}
            sx={{
              backgroundColor: "#8B4513",
              color: "#ffffff",
              fontFamily: '"EB Garamond", serif',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#A0522D",
              },
            }}
          >
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar open={showSuccessSnackbar} autoHideDuration={3000} onClose={() => setShowSuccessSnackbar(false)} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            width: "100%",
            backgroundColor: "#4caf50",
            color: "#ffffff",
            fontWeight: 600,
            borderRadius: "16px",
            "& .MuiAlert-icon": {
              color: "#ffffff",
            },
          }}
        >
          Payment Successful! Your order has been placed.
        </Alert>
      </Snackbar>
    </Box>
  );
}


