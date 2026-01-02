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
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  // Fix extra space caused by CSS scaling on all pages
  useEffect(() => {
    const fixScalingHeight = () => {
      const scaleRoot = document.getElementById('scale-root');
      if (!scaleRoot) return;

      // Get the computed scale value from media queries
      const width = window.innerWidth;
      let scale = 1;
      
      if (width <= 1280) {
        scale = 0.8;
      } else if (width <= 1440) {
        scale = 0.85;
      } else if (width <= 1799) {
        scale = 0.9;
      }

      // Wait for next frame to ensure layout is complete
      requestAnimationFrame(() => {
        // Calculate the actual content height
        const contentHeight = scaleRoot.scrollHeight;
        // Calculate what the scaled height should be
        const scaledHeight = contentHeight * scale;
        // Calculate the difference (extra space)
        const heightDiff = contentHeight - scaledHeight;

        // Apply negative margin-bottom to remove extra space
        if (heightDiff > 0 && scale < 1) {
          scaleRoot.style.marginBottom = `-${heightDiff}px`;
          console.log(`[Scaling Fix] Applied margin-bottom: -${heightDiff}px (scale: ${scale}, content: ${contentHeight}px)`);
        } else {
          scaleRoot.style.marginBottom = '0';
        }
      });
    };

    // Run multiple times to catch all render phases
    const timeouts = [
      setTimeout(fixScalingHeight, 100),
      setTimeout(fixScalingHeight, 300),
      setTimeout(fixScalingHeight, 500),
    ];
    
    window.addEventListener('resize', fixScalingHeight);
    window.addEventListener('load', fixScalingHeight);
    
    // Also watch for DOM changes (lazy loaded content, etc.)
    const observer = new MutationObserver(() => {
      setTimeout(fixScalingHeight, 100);
    });
    
    const scaleRoot = document.getElementById('scale-root');
    if (scaleRoot) {
      observer.observe(scaleRoot, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
    
    return () => {
      timeouts.forEach(id => clearTimeout(id));
      window.removeEventListener('resize', fixScalingHeight);
      window.removeEventListener('load', fixScalingHeight);
      observer.disconnect();
    };
  }, [location.pathname]); // Re-run when route changes




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







