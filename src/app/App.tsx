// @ts-nocheck
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

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

// Create an instance of MemberService
const memberService = new MemberService();

// Lazy load components for better performance
const OrdersPage = lazy(() => import("./screens/ordersPage"));
const UserProfilePage = lazy(() => import("./screens/userPage"));
const MyPage = lazy(() => import("../mui-coffee/screens/MyPage"));
const HelpPage = lazy(() => import("./screens/helpPage"));
const CoffeeHomePage = lazy(() => import("../mui-coffee/screens/CoffeeHomePage"));
const ImageTest = lazy(() => import("../mui-coffee/ImageTest"));
const VerticalBasketDemo = lazy(() => import("../mui-coffee/components/VerticalBasketDemo"));
const StatsPage = lazy(() => import("../mui-coffee/screens/StatsPage"));
const ProductsPage = lazy(() => import("./screens/productsPage"));

function App() {
  const location = useLocation();
  const { authMember, setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();

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

  // Fix extra space caused by CSS scaling - adjust body height dynamically
  useEffect(() => {
    const fixScalingHeight = () => {
      const scaleRoot = document.getElementById('scale-root');
      if (!scaleRoot) return;

      // Get current scale from media query
      const width = window.innerWidth;
      let scale = 1;
      if (width <= 1280) {
        scale = 0.8;
      } else if (width <= 1440) {
        scale = 0.85;
      } else if (width <= 1799) {
        scale = 0.9;
      }

      // Calculate actual content height
      const contentHeight = scaleRoot.scrollHeight;
      // Scaled visual height
      const scaledHeight = contentHeight * scale;
      // Extra space
      const extraSpace = contentHeight - scaledHeight;

      // Apply negative margin to #scale-root to remove extra space
      // This is better than limiting body height
      if (scale < 1 && extraSpace > 0) {
        scaleRoot.style.marginBottom = `-${extraSpace}px`;
      } else {
        scaleRoot.style.marginBottom = '0';
      }
    };

    // Run after render
    const timeoutId = setTimeout(fixScalingHeight, 100);
    window.addEventListener('resize', fixScalingHeight);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', fixScalingHeight);
    };
  }, [location.pathname]);




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
      setAuthMember(null);
      handleCloseLogout();
      sweetTopSuccessAlert("Logout successful", 700);
    } catch (err: any) {
      console.log("ERROR handleLogoutRequest ::", err);
      // Even if the server logout fails, clear the local state
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
              <Route path="/orders">
                <OrdersPage />
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
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;







