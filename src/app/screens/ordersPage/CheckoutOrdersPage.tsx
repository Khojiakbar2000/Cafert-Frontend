import { useState, SyntheticEvent, useEffect, useRef, useCallback } from "react";
import {
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
import ContactlessIcon from "@mui/icons-material/Contactless";
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
import { useHistory, useLocation, Link } from "react-router-dom";
import { serverApi } from "../../../lib/config";
import { CartItem } from "../../../lib/types/search";
import ProductService from "../../services/ProductService";

/**
 * Pulp Alchemist checkout — same structure/tokens as `public/stitch-checkout-reference.html` + `src/components/stitch.tsx` notes.
 */
const PULP_INK = '#1A0F0D';
const PULP_BG = '#fdf9f3';
const PULP_PRIMARY = '#FF4E00';
const PULP_GROTESK = '"Space Grotesk", system-ui, sans-serif';
/** Match `public/stitch-checkout-reference.html` main: Tailwind `max-w-6xl` → 72rem / 1152px. */
const PULP_MAIN_MAX = 'min(100%, 72rem)';
const PULP_COMIC_SHADOW = '6px 6px 0 0 #1A0F0D';
const PULP_COMIC_SHADOW_8 = '8px 8px 0 0 #1A0F0D';
const PULP_INK_BORDER = `4px solid ${PULP_INK}`;
const PULP_INK_BORDER_HEAVY = `6px solid ${PULP_INK}`;
const MISSION_STEP_LABELS = ['PLACED', 'PREPARING', 'READY', 'COMPLETED'] as const;
const MISSION_STEP_ROT = [3, -2, 6, -3];

/** `src/components/stitch.md` — menu tab palette & borders */
const MENU_SURFACE = '#fcf6e8';
const MENU_ON_SURFACE = '#312f26';
const MENU_ON_SURFACE_VARIANT = '#5f5b51';
const MENU_PRIMARY = '#a83100';
const MENU_PRIMARY_CONTAINER = '#ff784d';
const MENU_SURFACE_CONTAINER = '#eee8d8';
const MENU_SURFACE_CONTAINER_LOW = '#f6f0e1';
const MENU_SURFACE_BRIGHT = '#fcf6e8';
const MENU_WHITE = '#ffffff';
const MENU_BORDER_HEAVY = `6px solid ${PULP_INK}`;
const MENU_BORDER_SM = `3px solid ${PULP_INK}`;

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

  const parchmentText = PULP_INK;

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

  // Calculate totals: prefer non-empty cart; otherwise use the order on screen (empty [] was still "truthy" → $0 bug)
  const calculateSubtotal = () => {
    if (mainView === 'checkout' && cartItems && cartItems.length > 0) {
      return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    if (!currentOrder) return 0;
    return currentOrder.orderItems?.reduce((sum, item) => sum + item.itemPrice * item.itemQuantity, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const delivery =
    mainView === 'checkout' &&
    (!cartItems || cartItems.length === 0) &&
    currentOrder &&
    typeof currentOrder.orderDelivery === 'number'
      ? currentOrder.orderDelivery
      : fulfillmentType === 'delivery'
        ? 5.0
        : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + delivery + tax;

  if (!authMember) history.push("/");

  /** 0 = pending tab, 1 = processing, 3 = completed (matches stitch.html 4-step rail; READY shares processing). */
  const missionProgressIdx = value === '1' ? 0 : value === '2' ? 1 : 3;
  const orderListCount =
    value === '1'
      ? (pausedOrders?.length || 0)
      : value === '2'
        ? (processOrders?.length || 0)
        : (finishedOrders?.length || 0);

  const pulpFieldSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: PULP_GROTESK,
      fontSize: { xs: '1rem', md: '1.0625rem' },
      backgroundColor: PULP_BG,
      borderRadius: 0,
      py: 0.25,
      '& fieldset': { borderWidth: 3, borderColor: PULP_INK },
      '&:hover fieldset': { borderColor: PULP_INK },
      '&.Mui-focused fieldset': { borderColor: PULP_PRIMARY },
    },
    '& .MuiOutlinedInput-input': {
      py: { xs: 1.5, md: 1.75 },
    },
  } as const;

  const menuFieldSx = {
    '& .MuiOutlinedInput-root': {
      fontFamily: PULP_GROTESK,
      borderRadius: 0,
      backgroundColor: MENU_WHITE,
      '& fieldset': { borderWidth: 3, borderColor: PULP_INK },
      '&:hover fieldset': { borderColor: PULP_INK },
      '&.Mui-focused fieldset': { borderColor: MENU_PRIMARY },
    },
    '& .MuiInputLabel-root': {
      fontFamily: PULP_GROTESK,
      color: MENU_ON_SURFACE_VARIANT,
    },
    '& .MuiOutlinedInput-input': { py: 1.5 },
  } as const;

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');`}
      </style>
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: PULP_BG,
        color: PULP_INK,
        pt: 15,
        pb: mainView === 'menu' && showCartSummary ? { xs: 20, md: 16 } : { xs: 4, md: 6 },
        fontFamily: PULP_GROTESK,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.03,
          backgroundImage:
            "url(https://www.transparenttextures.com/patterns/stardust.png)",
        },
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          maxWidth: PULP_MAIN_MAX,
          width: "100%",
          mx: "auto",
          px: { xs: 2.5, sm: 3, md: 4, lg: 5 },
          boxSizing: "border-box",
          position: 'relative',
          zIndex: 1,
          minHeight: 0,
        }}
      >
        {/* Main Tabs: Checkout / Menu — stitch-style top bar */}
        <Paper
          elevation={0}
          sx={{
            mb: { xs: 3, md: 5 },
            backgroundColor: PULP_BG,
            borderRadius: 0,
            borderBottom: `6px solid ${PULP_INK}`,
            boxShadow: PULP_COMIC_SHADOW,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={mainView}
            onChange={handleMainTabChange}
            sx={{
              minHeight: { xs: 52, md: 60 },
              "& .MuiTabs-indicator": {
                backgroundColor: PULP_PRIMARY,
                height: 5,
              },
            }}
          >
            <Tab
              label="Checkout"
              value="checkout"
              sx={{
                fontFamily: PULP_GROTESK,
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                py: 2,
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: mainView === "checkout" ? 800 : 600,
                color: mainView === "checkout" ? PULP_PRIMARY : PULP_INK,
                letterSpacing: "-0.02em",
              }}
            />
            <Tab
              label="Menu"
              value="menu"
              sx={{
                fontFamily: PULP_GROTESK,
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                py: 2,
                textTransform: "uppercase",
                fontStyle: "italic",
                fontWeight: mainView === "menu" ? 800 : 600,
                color: mainView === "menu" ? PULP_PRIMARY : PULP_INK,
                letterSpacing: "-0.02em",
              }}
            />
          </Tabs>
        </Paper>

        {/* Conditional Rendering: Checkout View — flex column so footer can sit at bottom of viewport */}
        {mainView === 'checkout' && (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', gap: { xs: 0, md: 1 } }}>
        {/* Page title — CHECKOUT kinetic type (stitch reference) */}
        <Box sx={{ textAlign: "center", mb: { xs: 5, md: 7 }, mt: { md: 1 }, position: "relative" }}>
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: { xs: -24, md: -32 },
              left: { xs: -8, md: -16 },
              width: 96,
              height: 96,
              backgroundImage: `radial-gradient(circle, ${PULP_INK} 1px, transparent 1px)`,
              backgroundSize: "8px 8px",
              opacity: 0.06,
              pointerEvents: "none",
            }}
          />
          <Typography
            component="h1"
            variant="h3"
            sx={{
              position: "relative",
              fontFamily: PULP_GROTESK,
              fontWeight: 900,
              fontStyle: "italic",
              textTransform: "uppercase",
              color: PULP_INK,
              mb: 2,
              letterSpacing: "-0.04em",
              fontSize: { xs: "3.25rem", sm: "5rem", md: "6.25rem", lg: "7rem" },
              lineHeight: 0.95,
              transform: "rotate(-1deg)",
              textShadow: `6px 6px 0 ${PULP_PRIMARY}`,
            }}
          >
            Checkout
          </Typography>
          <Typography
            sx={{
              fontFamily: PULP_GROTESK,
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              fontWeight: 700,
              lineHeight: 1.45,
              color: PULP_INK,
              opacity: 0.88,
              maxWidth: "48rem",
              mx: "auto",
              px: { xs: 1, sm: 0 },
            }}
          >
            Review and complete your order — direct from the board to your tray.
          </Typography>
        </Box>

        {/* Progress tracker — stitch-checkout-reference.html */}
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            border: PULP_INK_BORDER,
            p: { xs: 3, md: 4, lg: 5 },
            bgcolor: '#fff',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `radial-gradient(circle, ${PULP_INK} 1px, transparent 1px)`,
              backgroundSize: '8px 8px',
              opacity: 0.05,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 2.5, md: 3 },
            }}
          >
            {MISSION_STEP_LABELS.map((label, i) => {
              const isActive = i === missionProgressIdx;
              const isPast = i < missionProgressIdx || (missionProgressIdx === 3 && i < 3);
              const dim = i > missionProgressIdx && missionProgressIdx !== 3;
              return (
                <Box key={label} sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', md: 'auto' }, flex: { md: i < 3 ? 1 : 0 } }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      opacity: dim ? 0.4 : 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 44, md: 52 },
                        height: { xs: 44, md: 52 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: { xs: '1.05rem', md: '1.15rem' },
                        border: PULP_INK_BORDER,
                        bgcolor: isActive ? PULP_PRIMARY : '#fff',
                        color: isActive ? '#fff' : PULP_INK,
                        transform: `rotate(${MISSION_STEP_ROT[i]}deg)`,
                      }}
                    >
                      {i + 1}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: '0.78rem', md: '0.82rem' },
                        letterSpacing: '0.16em',
                        color: isPast && !isActive ? PULP_INK : 'inherit',
                      }}
                    >
                      {label}
                    </Typography>
                  </Box>
                  {i < 3 && (
                    <Box
                      sx={{
                        display: { xs: 'none', md: 'block' },
                        flex: 1,
                        height: 4,
                        bgcolor: PULP_INK,
                        opacity: 0.2,
                        mx: { md: 1 },
                        minWidth: { md: 24 },
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* 2-Column Layout — same as reference `lg:grid-cols-2` (50 / 50) */}
        <Grid container spacing={{ xs: 4, md: 5, lg: 6 }} sx={{ flex: 1, alignContent: 'flex-start' }}>
          <Grid item xs={12} lg={6}>
            <Stack spacing={3}>
              {/* Order Status Tabs */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 0,
                  backgroundColor: "#ffffff",
                  border: PULP_INK_BORDER,
                  boxShadow: PULP_COMIC_SHADOW_8,
                  overflow: "hidden",
                }}
              >
                <Box sx={{ borderBottom: `4px solid ${PULP_INK}` }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="order status tabs"
                    sx={{
                      px: 3,
                      "& .MuiTabs-indicator": {
                        backgroundColor: "#FF4E00",
                        height: 3,
                      },
                    }}
                  >
                    <Tab
                      label="Pending"
                      value={"1"}
                      sx={{
                        fontFamily: PULP_GROTESK,
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: value === "1" ? 600 : 400,
                      }}
                    />
                    <Tab
                      label="Processing"
                      value={"2"}
                      sx={{
                        fontFamily: PULP_GROTESK,
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: value === "2" ? 600 : 400,
                      }}
                    />
                    <Tab
                      label="Completed"
                      value={"3"}
                      sx={{
                        fontFamily: PULP_GROTESK,
                        fontSize: { xs: '0.95rem', md: '1.05rem' },
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: value === "3" ? 600 : 400,
                      }}
                    />
                  </Tabs>
                </Box>

              </Paper>

              {/* Orders List - Pending, Processing, Completed */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 0,
                  backgroundColor: "#ffffff",
                  border: PULP_INK_BORDER_HEAVY,
                  boxShadow: PULP_COMIC_SHADOW_8,
                  p: { xs: 3.5, md: 5, lg: 6 },
                  transform: 'rotate(0.5deg)',
                }}
              >
                <Box sx={{ mb: { xs: 3, md: 4 }, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: PULP_GROTESK,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      color: "#1A0F0D",
                      letterSpacing: '-0.02em',
                      fontSize: { xs: '1.45rem', md: '1.9rem', lg: '2.1rem' },
                    }}
                  >
                    Your order
                  </Typography>
                  <Chip
                    label={`${orderListCount} ${orderListCount === 1 ? 'LIST' : 'LISTS'}`}
                    sx={{
                      fontFamily: PULP_GROTESK,
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      borderRadius: 0,
                      border: PULP_INK_BORDER,
                      bgcolor: '#fecc00',
                      color: PULP_INK,
                      transform: 'rotate(-3deg)',
                    }}
                  />
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
                  borderRadius: 0,
                  backgroundColor: "#ffffff",
                  border: PULP_INK_BORDER,
                  boxShadow: PULP_COMIC_SHADOW_8,
                  p: { xs: 3.5, md: 5, lg: 6 },
                  transform: 'rotate(-0.5deg)',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: PULP_GROTESK,
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    color: "#1A0F0D",
                    mb: { xs: 3, md: 4 },
                    letterSpacing: "0.04em",
                    fontSize: { xs: '1.2rem', md: '1.45rem', lg: '1.55rem' },
                  }}
                >
                  Mission logistics
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: { xs: 3, md: 4 },
                    borderRadius: 0,
                    backgroundColor: 'rgba(253,249,243,0.95)',
                    border: PULP_INK_BORDER_HEAVY,
                  }}
                >
                  {fulfillmentType === "pickup" ? <StorefrontIcon sx={{ fontSize: "2rem", color: "#FF4E00" }} /> : <LocalShippingIcon sx={{ fontSize: "2rem", color: "#FF4E00" }} />}

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: PULP_GROTESK,
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        color: "#1A0F0D",
                        mb: 0.5,
                        textTransform: "capitalize",
                      }}
                    >
                      {fulfillmentType}
                    </Typography>

                    {fulfillmentType === "pickup" ? (
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: "0.95rem",
                          color: "#1A0F0D",
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
                              fontFamily: PULP_GROTESK,
                              fontSize: "0.95rem",
                              color: "#1A0F0D",
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
                                fontFamily: PULP_GROTESK,
                                textTransform: "none",
                                color: "#FF4E00",
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

          <Grid item xs={12} lg={6}>
            <Box
              sx={{
                position: { lg: "sticky" },
                top: { lg: 88 },
              }}
            >
              <Stack spacing={3}>
                {/* Payment Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    border: PULP_INK_BORDER_HEAVY,
                    boxShadow: PULP_COMIC_SHADOW_8,
                    backgroundColor: "#ffffff",
                    p: { xs: 3.5, md: 5, lg: 6 },
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <ContactlessIcon
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: 120,
                      opacity: 0.08,
                      color: PULP_INK,
                      pointerEvents: 'none',
                    }}
                  />
                  {/* Test Mode Badge */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 3,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: PULP_GROTESK,
                        fontWeight: 900,
                        fontStyle: 'italic',
                        textTransform: 'uppercase',
                        color: "#1A0F0D",
                        letterSpacing: "-0.02em",
                        fontSize: { xs: '1.35rem', md: '1.85rem', lg: '2rem' },
                        transform: 'rotate(0.5deg)',
                      }}
                    >
                      Payment terminal
                    </Typography>
                    <Chip
                      label="Demo Mode"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(255, 152, 0, 0.1)",
                        color: "#f57c00",
                        fontFamily: PULP_GROTESK,
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
                        fontFamily: PULP_GROTESK,
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
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '0.72rem', md: '0.78rem' },
                          color: "#1A0F0D",
                          mb: 0.75,
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
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
                              <CreditCardIcon sx={{ color: "#FF4E00", opacity: 0.5 }} />
                            </InputAdornment>
                          ),
                          endAdornment: cardBrand && (
                            <InputAdornment position="end">
                              <Chip label={cardBrand} size="small" sx={{ fontFamily: PULP_GROTESK, fontSize: "0.75rem" }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={pulpFieldSx}
                      />
                    </Box>

                    {/* Expiry and CVV */}
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: { xs: '0.72rem', md: '0.78rem' },
                            color: "#1A0F0D",
                            mb: 0.75,
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Expiry
                        </Typography>
                        <TextField
                          fullWidth
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          disabled={paymentProcessing || paymentSuccess}
                          sx={pulpFieldSx}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: { xs: '0.72rem', md: '0.78rem' },
                            color: "#1A0F0D",
                            mb: 0.75,
                            fontWeight: 900,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
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
                          sx={pulpFieldSx}
                        />
                      </Box>
                    </Box>

                    {/* Cardholder Name */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '0.72rem', md: '0.78rem' },
                          color: "#1A0F0D",
                          mb: 0.75,
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Cardholder name
                      </Typography>
                      <TextField
                        fullWidth
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="THE AGENT"
                        disabled={paymentProcessing || paymentSuccess}
                        sx={pulpFieldSx}
                      />
                    </Box>

                    {/* Billing ZIP (optional) */}
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '0.72rem', md: '0.78rem' },
                          color: "#1A0F0D",
                          mb: 0.75,
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ZIP
                      </Typography>
                      <TextField
                        fullWidth
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value.substring(0, 10))}
                        placeholder="10001"
                        disabled={paymentProcessing || paymentSuccess}
                        sx={pulpFieldSx}
                      />
                    </Box>
                  </Stack>
                </Paper>

                {/* Totals Card */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 0,
                    border: PULP_INK_BORDER,
                    boxShadow: PULP_COMIC_SHADOW_8,
                    backgroundColor: "#ffffff",
                    p: { xs: 3.5, md: 5, lg: 6 },
                  }}
                >
                  <Stack spacing={{ xs: 2.25, md: 2.75 }}>
                    {/* Subtotal */}
                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
                          opacity: 0.7,
                        }}
                      >
                        Subtotal
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
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
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
                          opacity: 0.7,
                        }}
                      >
                        Delivery
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
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
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
                          opacity: 0.7,
                        }}
                      >
                        Tax
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: "1rem",
                          color: "#1A0F0D",
                          fontWeight: 500,
                        }}
                      >
                        ${tax.toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: PULP_INK, borderWidth: 2, borderStyle: 'dashed' }} />

                    {/* Total — stitch "TOTAL MISSION COST" */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", pt: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '1.1rem', sm: '1.35rem' },
                          color: "#1A0F0D",
                          fontWeight: 900,
                          fontStyle: 'italic',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        Total mission cost
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '2rem', sm: '2.35rem' },
                          color: "#FF4E00",
                          fontWeight: 900,
                        }}
                      >
                        ${total.toFixed(2)}
                      </Typography>
                    </Box>

                    {/* Primary CTA — comic PAY NOW */}
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
                        py: 2.5,
                        backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#FF4E00",
                        color: "#ffffff",
                        fontFamily: PULP_GROTESK,
                        fontWeight: 900,
                        fontSize: { xs: '1.25rem', sm: '1.65rem' },
                        fontStyle: 'italic',
                        borderRadius: 0,
                        textTransform: "uppercase",
                        letterSpacing: '-0.02em',
                        border: PULP_INK_BORDER,
                        boxShadow: paymentSuccess || paymentProcessing ? 'none' : PULP_COMIC_SHADOW_8,
                        '&:hover': {
                          backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#E04300",
                          transform: paymentSuccess || paymentProcessing ? 'none' : 'rotate(-1deg)',
                          boxShadow: paymentSuccess || paymentProcessing ? 'none' : PULP_COMIC_SHADOW_8,
                        },
                        '&:active': {
                          transform: 'translate(4px, 4px)',
                          boxShadow: 'none',
                        },
                        "&:disabled": {
                          backgroundColor: paymentSuccess ? "#4caf50" : paymentProcessing ? "#9c6b3d" : "#d0d0d0",
                          color: "#ffffff",
                          opacity: paymentProcessing ? 1 : 0.7,
                          boxShadow: 'none',
                        },
                      }}
                    >
                      {paymentProcessing ? "Processing…" : paymentSuccess ? "Payment successful" : `Pay now — $${total.toFixed(2)}`}
                    </Button>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                        px: 2,
                        fontFamily: PULP_GROTESK,
                      }}
                    >
                      By transmitting, you agree to our terms of engagement and data retention policies.
                    </Typography>

                    {/* Secondary Button */}
                    <Button
                      fullWidth
                      variant="text"
                      onClick={() => history.push("/")}
                      sx={{
                        py: 1.5,
                        color: "#1A0F0D",
                        fontFamily: PULP_GROTESK,
                        fontSize: "0.95rem",
                        textTransform: "none",
                        opacity: 0.7,
                        "&:hover": {
                          backgroundColor: "rgba(26, 15, 13, 0.05)",
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
          </Box>
        )}

        {/* Conditional Rendering: Menu View — stitch.md pulp / catalog */}
        {mainView === 'menu' && (
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              width: '100%',
              maxWidth: 'min(100%, 80rem)',
              mx: 'auto',
              px: { xs: 0, sm: 0.5 },
              py: { xs: 2, md: 3 },
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: PULP_GROTESK,
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                fontSize: { xs: '2rem', md: '3.25rem' },
                color: MENU_ON_SURFACE,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textShadow: `6px 6px 0 ${MENU_PRIMARY}`,
                mb: { xs: 2, md: 3 },
              }}
            >
              Mission menu
            </Typography>
            <Paper
              elevation={0}
              sx={{
                mb: 4,
                p: { xs: 2, md: 4 },
                backgroundColor: MENU_WHITE,
                borderRadius: 0,
                border: MENU_BORDER_HEAVY,
                boxShadow: PULP_COMIC_SHADOW_8,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.05,
                  pointerEvents: 'none',
                  backgroundImage: `radial-gradient(circle, ${PULP_INK} 1px, transparent 1px)`,
                  backgroundSize: '8px 8px',
                }}
              />
              <Stack spacing={3} sx={{ position: 'relative' }}>
                {/* Order Type Selection */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: PULP_GROTESK,
                      color: MENU_ON_SURFACE,
                      mb: 2,
                      fontSize: '0.75rem',
                      fontWeight: 900,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Order type
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
                            color: PULP_INK,
                            '&.Mui-checked': { color: MENU_PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: '1.2rem', color: MENU_PRIMARY }} />
                          <Typography
                            sx={{
                              fontFamily: PULP_GROTESK,
                              fontSize: '1rem',
                              fontWeight: orderType === 'pickup' ? 800 : 600,
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
                            color: PULP_INK,
                            '&.Mui-checked': { color: MENU_PRIMARY },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: '1.2rem', color: MENU_PRIMARY }} />
                          <Typography
                            sx={{
                              fontFamily: PULP_GROTESK,
                              fontSize: '1rem',
                              fontWeight: orderType === 'delivery' ? 800 : 600,
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
                        fontFamily: PULP_GROTESK,
                        color: MENU_ON_SURFACE,
                        mb: 2,
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
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
                              color: PULP_INK,
                              '&.Mui-checked': { color: MENU_PRIMARY },
                            }}
                          />
                        }
                        label={
                          <Typography sx={{ fontFamily: PULP_GROTESK, fontSize: '1rem', fontWeight: 700 }}>
                            ASAP
                          </Typography>
                        }
                      />
                      <FormControlLabel
                        value="schedule"
                        control={
                          <Radio
                            sx={{
                              color: PULP_INK,
                              '&.Mui-checked': { color: MENU_PRIMARY },
                            }}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ScheduleIcon sx={{ fontSize: '1.2rem', color: MENU_PRIMARY }} />
                            <Typography sx={{ fontFamily: PULP_GROTESK, fontSize: '1rem', fontWeight: 700 }}>
                              Schedule
                            </Typography>
                          </Box>
                        }
                      />
                    </RadioGroup>
                    {timeOption === 'schedule' && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
                        <TextField
                          type="date"
                          label="Pickup Date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          sx={menuFieldSx}
                        />
                        <TextField
                          type="time"
                          label="Pickup Time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          fullWidth
                          sx={menuFieldSx}
                        />
                      </Stack>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: PULP_GROTESK,
                        color: MENU_ON_SURFACE,
                        mb: 2,
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Delivery address
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
                            sx={menuFieldSx}
                          />
                          {showSuggestions && addressSuggestions.length > 0 && (
                            <Paper
                              elevation={0}
                              sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                zIndex: 1000,
                                mt: 0.5,
                                maxHeight: '200px',
                                overflow: 'auto',
                                border: MENU_BORDER_SM,
                                borderRadius: 0,
                                boxShadow: PULP_COMIC_SHADOW,
                                bgcolor: MENU_WHITE,
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
                                      '&:hover': { bgcolor: MENU_SURFACE_CONTAINER_LOW },
                                    }}
                                  >
                                    <Typography sx={{ fontFamily: PULP_GROTESK, fontSize: '0.95rem', color: MENU_ON_SURFACE }}>
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
                            fontFamily: PULP_GROTESK,
                            fontWeight: 800,
                            backgroundColor: MENU_PRIMARY,
                            color: MENU_WHITE,
                            textTransform: 'uppercase',
                            border: MENU_BORDER_SM,
                            borderRadius: 0,
                            boxShadow: PULP_COMIC_SHADOW,
                            '&:hover': { backgroundColor: MENU_PRIMARY, filter: 'brightness(1.08)' },
                            '&:disabled': { backgroundColor: '#d0d0d0', color: '#999', boxShadow: 'none' },
                            '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
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
                        fontFamily: PULP_GROTESK,
                        fontWeight: 700,
                        borderColor: PULP_INK,
                        borderWidth: 3,
                        color: MENU_ON_SURFACE,
                        borderRadius: 0,
                        textTransform: 'none',
                        '&:hover': { borderColor: MENU_PRIMARY, borderWidth: 3, bgcolor: MENU_SURFACE_CONTAINER_LOW },
                      }}
                    >
                      Use my location
                    </Button>
                  </Box>
                )}
              </Stack>
            </Paper>

            {/* Category Navigation — stitch hard-line strip */}
            <Box
              sx={{
                position: 'sticky',
                top: 72,
                zIndex: 100,
                backgroundColor: MENU_SURFACE,
                py: 2,
                mb: 3,
                borderBottom: '8px solid',
                borderColor: PULP_INK,
                boxShadow: PULP_COMIC_SHADOW,
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{
                  overflowX: 'auto',
                  pb: 0.5,
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                }}
              >
                {categories.map((category, ci) => (
                  <Button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    sx={{
                      fontFamily: PULP_GROTESK,
                      textTransform: 'uppercase',
                      fontSize: '0.8rem',
                      fontWeight: 900,
                      letterSpacing: '0.06em',
                      minWidth: '92px',
                      flexShrink: 0,
                      borderRadius: 0,
                      border: MENU_BORDER_SM,
                      py: 1.25,
                      color: selectedCategory === category ? MENU_WHITE : MENU_ON_SURFACE,
                      bgcolor: selectedCategory === category ? MENU_PRIMARY : MENU_WHITE,
                      boxShadow: selectedCategory === category ? PULP_COMIC_SHADOW : 'none',
                      transform: selectedCategory === category ? `rotate(${ci % 2 === 0 ? -1 : 1}deg)` : 'none',
                      '&:hover': {
                        bgcolor: selectedCategory === category ? MENU_PRIMARY : MENU_SURFACE_CONTAINER_LOW,
                        borderColor: PULP_INK,
                      },
                    }}
                  >
                    {category === 'all' ? 'All' : category}
                  </Button>
                ))}
              </Stack>
            </Box>

            {/* Products Grid — stitch hard-line + ink-bleed cards */}
            <Box ref={setCategoryRef('all')} sx={{ mb: 6 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    md: 'repeat(2, 1fr)',
                    lg: 'repeat(2, 1fr)',
                  },
                  gap: { xs: 3, md: 4 },
                }}
              >
                {paginatedProducts.map((product, pi) => (
                  <Box
                    key={product._id}
                    onClick={() => handleProductClick(product)}
                    sx={{
                      cursor: 'pointer',
                      border: MENU_BORDER_HEAVY,
                      borderRadius: 0,
                      overflow: 'hidden',
                      backgroundColor: MENU_SURFACE_BRIGHT,
                      boxShadow: PULP_COMIC_SHADOW_8,
                      transform: `rotate(${pi % 2 === 0 ? 0.6 : -0.6}deg)`,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: `rotate(${pi % 2 === 0 ? 0.6 : -0.6}deg) translateY(-6px)`,
                        boxShadow: `10px 10px 0 0 ${PULP_INK}`,
                      },
                    }}
                  >
                    <Box sx={{ p: { xs: 2, md: 2.5 }, backgroundColor: MENU_SURFACE_CONTAINER_LOW }}>
                      <Box
                        sx={{
                          position: 'relative',
                          mb: 2.5,
                          overflow: 'hidden',
                          backgroundColor: MENU_SURFACE_CONTAINER,
                          border: MENU_BORDER_SM,
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
                            height: { xs: '220px', md: '260px' },
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: { xs: '1.15rem', md: '1.35rem' },
                            color: MENU_ON_SURFACE,
                            mb: 0.75,
                            fontWeight: 900,
                            fontStyle: 'italic',
                            textTransform: 'uppercase',
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {product.productName}
                        </Typography>

                        {product.productDesc && (
                          <Typography
                            sx={{
                              fontFamily: PULP_GROTESK,
                              fontSize: { xs: '0.85rem', md: '0.9rem' },
                              color: MENU_ON_SURFACE_VARIANT,
                              mb: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: 1.35,
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
                            pt: 2,
                            borderTop: '2px dashed',
                            borderColor: PULP_INK,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: PULP_GROTESK,
                              fontSize: { xs: '1.25rem', md: '1.4rem' },
                              color: MENU_PRIMARY,
                              fontWeight: 900,
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
                              fontFamily: PULP_GROTESK,
                              fontSize: '0.8rem',
                              fontWeight: 800,
                              borderColor: PULP_INK,
                              color: MENU_ON_SURFACE,
                              borderWidth: 3,
                              borderRadius: 0,
                              px: 2,
                              py: 0.5,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              '&:hover': {
                                borderColor: MENU_PRIMARY,
                                borderWidth: 3,
                                bgcolor: MENU_PRIMARY_CONTAINER,
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
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        fontFamily: PULP_GROTESK,
                        fontWeight: 800,
                        fontSize: '1rem',
                        borderRadius: 0,
                        color: MENU_ON_SURFACE,
                        border: `${MENU_BORDER_SM} !important`,
                        '&.Mui-selected': {
                          backgroundColor: MENU_PRIMARY,
                          color: MENU_WHITE,
                          boxShadow: PULP_COMIC_SHADOW,
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Add to Cart Modal — stitch comic panel */}
            <Dialog
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              maxWidth="lg"
              fullWidth
              PaperProps={{
                sx: {
                  backgroundColor: MENU_WHITE,
                  borderRadius: 0,
                  border: MENU_BORDER_HEAVY,
                  boxShadow: PULP_COMIC_SHADOW_8,
                  maxWidth: { xs: '92%', md: '1000px' },
                },
              }}
            >
              <DialogTitle
                sx={{
                  fontFamily: PULP_GROTESK,
                  color: MENU_ON_SURFACE,
                  fontSize: { xs: '1.35rem', md: '1.75rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  borderBottom: '4px solid',
                  borderColor: PULP_INK,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {selectedProduct?.productName}
                <IconButton
                  onClick={() => setModalOpen(false)}
                  sx={{ color: PULP_INK }}
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
                          border: MENU_BORDER_SM,
                          borderRadius: 0,
                          overflow: 'hidden',
                          backgroundColor: MENU_SURFACE_CONTAINER_LOW,
                          p: { xs: 2, md: 2.5 },
                          boxShadow: PULP_COMIC_SHADOW,
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
                            height: { xs: '240px', md: '320px' },
                            objectFit: 'cover',
                            border: `2px solid ${PULP_INK}`,
                          }}
                        />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      {selectedProduct.productDesc && (
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            color: MENU_ON_SURFACE_VARIANT,
                            fontSize: { xs: '0.95rem', md: '1rem' },
                            mb: 3,
                            lineHeight: 1.45,
                          }}
                        >
                          {selectedProduct.productDesc}
                        </Typography>
                      )}

                      {/* Size Selection */}
                      <Box sx={{ mb: 3 }}>
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            color: MENU_ON_SURFACE,
                            letterSpacing: '0.12em',
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
                            border: MENU_BORDER_SM,
                            borderRadius: 0,
                            backgroundColor: MENU_WHITE,
                            '&:before': { display: 'none' },
                          }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography
                              sx={{
                                fontFamily: PULP_GROTESK,
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: MENU_ON_SURFACE,
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
                                    fontFamily: PULP_GROTESK,
                                    textTransform: 'capitalize',
                                    borderRadius: 0,
                                    borderWidth: 2,
                                    borderColor: PULP_INK,
                                    fontWeight: 800,
                                    ...(selectedSize === size
                                      ? { bgcolor: MENU_PRIMARY, color: MENU_WHITE, '&:hover': { bgcolor: MENU_PRIMARY } }
                                      : { color: MENU_ON_SURFACE }),
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
                            fontFamily: PULP_GROTESK,
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            color: MENU_ON_SURFACE,
                            letterSpacing: '0.12em',
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
                            backgroundColor: MENU_SURFACE_CONTAINER_LOW,
                            border: MENU_BORDER_SM,
                            borderRadius: 0,
                            p: 1,
                            width: 'fit-content',
                          }}
                        >
                          <IconButton
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            sx={{ border: MENU_BORDER_SM, borderRadius: 0 }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography
                            sx={{
                              fontFamily: PULP_GROTESK,
                              fontSize: '1.3rem',
                              fontWeight: 900,
                              minWidth: '50px',
                              textAlign: 'center',
                              color: MENU_ON_SURFACE,
                            }}
                          >
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => setQuantity(quantity + 1)}
                            sx={{ border: MENU_BORDER_SM, borderRadius: 0 }}
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
                          borderTop: '2px dashed',
                          borderColor: PULP_INK,
                          mb: 3,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: '0.7rem',
                            fontWeight: 900,
                            color: MENU_ON_SURFACE_VARIANT,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: PULP_GROTESK,
                            fontSize: { xs: '1.5rem', md: '1.85rem' },
                            color: MENU_PRIMARY,
                            fontWeight: 900,
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
                          backgroundColor: MENU_PRIMARY,
                          fontFamily: PULP_GROTESK,
                          fontSize: { xs: '1rem', md: '1.15rem' },
                          fontWeight: 900,
                          fontStyle: 'italic',
                          py: { xs: 1.75, md: 2 },
                          textTransform: 'uppercase',
                          letterSpacing: '-0.02em',
                          border: MENU_BORDER_SM,
                          borderRadius: 0,
                          boxShadow: PULP_COMIC_SHADOW_8,
                          '&:hover': { backgroundColor: MENU_PRIMARY, filter: 'brightness(1.06)' },
                          '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
                        }}
                      >
                        Add to cart
                      </Button>
                    </Box>
                  </Stack>
                )}
              </DialogContent>
            </Dialog>

            {/* Sticky Cart Summary — stitch bottom bar */}
            <Slide direction="up" in={showCartSummary} mountOnEnter unmountOnExit>
              <Paper
                ref={cartSummaryRef}
                elevation={0}
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  p: 2,
                  backgroundColor: MENU_SURFACE,
                  borderTop: '8px solid',
                  borderColor: PULP_INK,
                  boxShadow: '0 -6px 0 0 rgba(26,15,13,0.08)',
                }}
              >
                <Box sx={{ maxWidth: 'min(100%, 80rem)', mx: 'auto', px: { xs: 1, md: 2 } }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: '0.75rem',
                          fontWeight: 900,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: MENU_ON_SURFACE_VARIANT,
                        }}
                      >
                        {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontSize: '1.65rem',
                          color: MENU_PRIMARY,
                          fontWeight: 900,
                        }}
                      >
                        ${cartTotal.toFixed(2)}
                      </Typography>
                    </Box>
                    <Stack direction="row" spacing={1.5} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={handleViewCart}
                        sx={{
                          fontFamily: PULP_GROTESK,
                          fontWeight: 800,
                          borderColor: PULP_INK,
                          borderWidth: 3,
                          color: MENU_ON_SURFACE,
                          borderRadius: 0,
                          textTransform: 'uppercase',
                          '&:hover': { borderWidth: 3, borderColor: MENU_PRIMARY },
                        }}
                      >
                        View cart
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => {
                          setMainView('checkout');
                          history.push('/orders?tab=checkout');
                        }}
                        sx={{
                          backgroundColor: MENU_PRIMARY,
                          fontFamily: PULP_GROTESK,
                          fontSize: '1rem',
                          fontWeight: 900,
                          fontStyle: 'italic',
                          px: 3,
                          border: MENU_BORDER_SM,
                          borderRadius: 0,
                          boxShadow: PULP_COMIC_SHADOW,
                          textTransform: 'uppercase',
                          '&:hover': { backgroundColor: MENU_PRIMARY, filter: 'brightness(1.06)' },
                          '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
                        }}
                      >
                        Checkout
                      </Button>
                    </Stack>
                  </Stack>
                </Box>
              </Paper>
            </Slide>
          </Box>
        )}
      </Box>

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
                fontFamily: PULP_GROTESK,
                fontWeight: 700,
                color: "#1A0F0D",
                mb: 1,
              }}
            >
              Payment Successful!
            </Typography>
          </DialogTitle>
          <Typography
            sx={{
              fontFamily: PULP_GROTESK,
              fontSize: "1rem",
              color: "#1A0F0D",
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
              backgroundColor: "#FF4E00",
              color: "#ffffff",
              fontFamily: PULP_GROTESK,
              fontWeight: 600,
              px: 4,
              py: 1.5,
              borderRadius: "16px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#E04300",
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
    </>
  );
}


