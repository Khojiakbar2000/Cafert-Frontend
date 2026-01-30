// @ts-nocheck
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Route, Switch, useLocation, Redirect } from "react-router-dom";
import { Box } from "@mui/material";
import { useAppDispatch } from "./hooks";
import { clearAllOrders } from "./screens/ordersPage/slice";

// Import i18n configuration
import "../i18n";

// Styles
import "../css/navbar.css";
import "../css/footer.css";

// Import components that are needed immediately
import OtherNavbar from "./components/headers/OtherNavbar";
import Footer from "./components/footer";
import { ThemeProvider } from "../mui-coffee/context/ThemeContext";


// Services and utilities
import { useGlobals } from "./hooks/useGlobals";
import useBasket from "./hooks/useBasket";
import MemberService from "./services/MemberService";
import { sweetTopSuccessAlert, sweetErrorHandling } from "../lib/sweetAlert";
import { Messages } from "../lib/config";



// Components
import AuthenticationModal from "./components/auth";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary";
import CoffeeMoodWidget from "../mui-coffee/components/CoffeeMoodWidget";

// Create an instance of MemberService
const memberService = new MemberService();

// Lazy load components for better performance
const OrdersPage = lazy(() => import("./screens/ordersPage/CheckoutOrdersPage"));
const UserProfilePage = lazy(() => import("./screens/userPage"));
const MyPage = lazy(() => import("../mui-coffee/screens/MyPage"));
const HelpPage = lazy(() => import("./screens/helpPage"));
const CoffeeHomePage = lazy(() => import("../mui-coffee/screens/CoffeeHomePage"));
const ImageTest = lazy(() => import("../mui-coffee/ImageTest"));
const VerticalBasketDemo = lazy(() => import("../mui-coffee/components/VerticalBasketDemo"));
const StatsPage = lazy(() => import("../mui-coffee/screens/StatsPage"));
const ProductsPage = lazy(() => import("./screens/productsPage"));
const CoffeeScrollPage = lazy(() => import("../mui-coffee/screens/CoffeeScrollPage"));
const OrderOnlinePage = lazy(() => import("./screens/orderOnlinePage/OrderOnlinePage"));

function App() {
  const location = useLocation();
  const { authMember, setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const dispatch = useAppDispatch();

  // Fix viewport height for mobile & VPS (critical fix)
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Clear orders and cart when user logs out or changes
  useEffect(() => {
    if (!authMember) {
      // User logged out - clear orders and cart
      dispatch(clearAllOrders());
      onDeleteAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMember]);




  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleLoginClose = () => setLoginOpen(false);
  const handleSignupClose = () => setSignupOpen(false);

  const handleLogoutClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseLogout = () => {
    setAnchorEl(null);
  };

  const handleLogoutRequest = async () => {
    try {
      const result = await memberService.logout();
      // Clear orders and cart before clearing auth
      dispatch(clearAllOrders());
      onDeleteAll();
      setAuthMember(null);
      handleCloseLogout();
      sweetTopSuccessAlert("Logout successful", 700);
    } catch (err: any) {
      console.log("ERROR handleLogoutRequest ::", err);
      // Even if the server logout fails, clear the local state
      dispatch(clearAllOrders());
      onDeleteAll();
      setAuthMember(null);
      handleCloseLogout();
      sweetErrorHandling(err).then();
    }
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Box id="scale-root" sx={{ width: '100%' }}>
          <OtherNavbar
            cartItems={cartItems}
            onAdd={onAdd}
            onRemove={onRemove}
            onDelete={onDelete}
            onDeleteAll={onDeleteAll}
            setSignupOpen={setSignupOpen}
            setLoginOpen={setLoginOpen}
            handleLogoutClick={handleLogoutClick}
            anchorEl={anchorEl}
            handleCloseLogout={handleCloseLogout}
            handleLogoutRequest={handleLogoutRequest}
          />
          
          <Suspense fallback={<LoadingSpinner />}>
            {/* @ts-ignore */}
            <Switch>
              <Route path="/products">
                <ProductsPage onAdd={onAdd} />
              </Route>
              <Route path="/order">
                <Redirect to="/orders?tab=menu" />
              </Route>
              <Route path="/orders">
                <OrdersPage 
                  onAdd={onAdd}
                  cartItems={cartItems}
                  onRemove={onRemove}
                  onDelete={onDelete}
                  onDeleteAll={onDeleteAll}
                />
              </Route>
              <Route path="/user-profile">
                <UserProfilePage />
              </Route>
              <Route path="/my-page">
                <MyPage />
              </Route>
              <Route path="/stats">
                <StatsPage />
              </Route>
              <Route path="/help">
                <HelpPage />
              </Route>
              <Route path="/coffee-demo">
                <CoffeeHomePage setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen} />
              </Route>
              <Route path="/image-test">
                <ImageTest />
              </Route>
              <Route path="/vertical-basket">
                <VerticalBasketDemo />
              </Route>
              <Route path="/coffee-scroll">
                <CoffeeScrollPage />
              </Route>
              <Route path="/order-online">
                <Redirect to="/orders?tab=menu" />
              </Route>
              <Route path="/">
                <CoffeeHomePage setSignupOpen={setSignupOpen} setLoginOpen={setLoginOpen} />
              </Route>
            </Switch>
          </Suspense>
          
          <AuthenticationModal
            signupOpen={signupOpen}
            loginOpen={loginOpen}
            handleLoginClose={handleLoginClose}
            handleSignupClose={handleSignupClose}
          />
          
          {/* Floating Coffee Mood Widget - appears on all pages */}
          <CoffeeMoodWidget />
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;







