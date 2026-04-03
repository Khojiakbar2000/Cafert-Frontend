// @ts-nocheck
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Route, Switch, useLocation, Redirect, useHistory } from "react-router-dom";
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
import { ThemeProvider, useTheme } from "../mui-coffee/context/ThemeContext";
import Footer from "./components/footer";


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
import CursorMask from "./components/CursorMask";

// Create an instance of MemberService
const memberService = new MemberService();

function GlobalFooter() {
  const { isDarkMode } = useTheme();
  return <Footer isDarkMode={isDarkMode} />;
}

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
const GalleryPage = lazy(() => import("./screens/galleryPage/GalleryPage"));
const JeskoJetsPage = lazy(() => import("./screens/jeskoJetsPage/JeskoJetsPage"));
const CoffeeScrollPage = lazy(() => import("../mui-coffee/screens/CoffeeScrollPage"));
const OrderOnlinePage = lazy(() => import("./screens/orderOnlinePage/OrderOnlinePage"));
const StitchArchivePage = lazy(() => import("./screens/stitchArchivePage/StitchArchivePage"));
const BirthdayCakePage = lazy(() => import("./screens/birthdayCakePage/BirthdayCakePage"));
const StitchLoginPage = lazy(() => import("./screens/stitchAuth/StitchLoginPage"));
const StitchSignupPage = lazy(() => import("./screens/stitchAuth/StitchSignupPage"));

function App() {
  const location = useLocation();
  const history = useHistory();
  /** Login/signup use site navbar; hide duplicate footer + mood widget only. */
  const hideAuthFooterAndWidget =
    location.pathname === "/login" || location.pathname === "/signup";
  const { authMember, setAuthMember } = useGlobals();
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const dispatch = useAppDispatch();

  // Keep `document.documentElement.style.zoom` in sync on client-side navigations.
  // Auth routes: force zoom 1 and skip synthetic resize — re-applying VPS zoom on every
  // navigation fights layout (scrollbar / innerWidth) and makes login/signup "shake".
  useEffect(() => {
    const allowedHosts = ["72.60.236.97", "cafert.uz", "localhost", "127.0.0.1"];
    if (!allowedHosts.includes(window.location.hostname)) return;

    const isAuthRoute =
      location.pathname === "/login" || location.pathname === "/signup";
    const skip =
      document.documentElement.getAttribute("data-disable-viewport-zoom") === "true";

    const zs = (window as any).__ZOOM_STATE__;

    if (isAuthRoute) {
      document.documentElement.style.zoom = "1";
      if (zs) zs.lastAppliedZoom = "1";
      return;
    }

    if (skip) {
      document.documentElement.style.zoom = "1";
      if (zs) zs.lastAppliedZoom = "1";
    } else {
      window.dispatchEvent(new Event("resize"));
    }
  }, [location.pathname]);

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




  /** Legacy modal signup; primary UX is `/signup` (stitch). */
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  /** Legacy modal login; primary UX is `/login` (stitch). */
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const setLoginOpen = (open: boolean) => {
    if (open) history.push("/login");
    else setLoginModalOpen(false);
  };

  const handleLoginClose = () => setLoginModalOpen(false);
  const setSignupOpen = (open: boolean) => {
    if (open) history.push("/signup");
    else setSignupModalOpen(false);
  };

  const handleSignupClose = () => setSignupModalOpen(false);

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
        <Box
          id="scale-root"
          sx={{
            width: '100%',
            flex: '1 0 auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
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
              <Route path="/login">
                <StitchLoginPage />
              </Route>
              <Route path="/signup">
                <StitchSignupPage />
              </Route>
              <Route path="/products">
                <ProductsPage onAdd={onAdd} />
              </Route>
              <Route path="/gallery">
                <GalleryPage />
              </Route>
              <Route path="/jesko-jets">
                <JeskoJetsPage />
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
                <CoffeeHomePage
                  suppressBuiltInNavbar
                  setSignupOpen={setSignupOpen}
                  setLoginOpen={setLoginOpen}
                />
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
              <Route path="/kinetic-archive">
                <StitchArchivePage />
              </Route>
              <Route path="/birthday-cake">
                <BirthdayCakePage />
              </Route>
              <Route path="/order-online">
                <Redirect to="/orders?tab=menu" />
              </Route>
              <Route path="/">
                <CoffeeHomePage
                  suppressBuiltInNavbar
                  setSignupOpen={setSignupOpen}
                  setLoginOpen={setLoginOpen}
                />
              </Route>
            </Switch>
          </Suspense>

          {!hideAuthFooterAndWidget && <GlobalFooter />}

          <AuthenticationModal
            signupOpen={signupModalOpen}
            loginOpen={loginModalOpen}
            handleLoginClose={handleLoginClose}
            handleSignupClose={handleSignupClose}
          />
          
          {!hideAuthFooterAndWidget && <CoffeeMoodWidget />}
          
          {/* Global Cursor Mask Effect - disabled, cursor restored to normal */}
          {/* <CursorMask /> */}
        </Box>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;







