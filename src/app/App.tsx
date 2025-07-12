// @ts-nocheck
import React, { useState, Suspense, lazy } from "react";
import { Route, Switch, useLocation } from "react-router-dom";

// Import i18n configuration
import "../i18n";

// Import components that are needed immediately
import HomeNavbar from "./components/headers/HomeNavbar";
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

// Styles
import "../css/navbar.css";
import "../css/footer.css";

// Lazy load components for better performance
const OrdersPage = lazy(() => import("../mui-coffee/screens/OrdersPage"));
const UserPage = lazy(() => import("./screens/userPage"));
const MyPage = lazy(() => import("../mui-coffee/screens/MyPage"));
const HelpPage = lazy(() => import("./screens/helpPage"));
const CoffeeHomePage = lazy(() => import("../mui-coffee/screens/CoffeeHomePage"));
const ImageTest = lazy(() => import("../mui-coffee/ImageTest"));
const VerticalBasketDemo = lazy(() => import("../mui-coffee/components/VerticalBasketDemo"));
const CoffeesPage = lazy(() => import("./screens/coffeesPage"));
const SaladsPage = lazy(() => import("./screens/saladsPage"));
const DessertsPage = lazy(() => import("./screens/dessertsPage"));
const DrinksPage = lazy(() => import("./screens/drinksPage"));

function App() {
  const location = useLocation();
  const { setAuthMember } = useGlobals()
  const { cartItems, onAdd, onRemove, onDelete, onDeleteAll } = useBasket();
  const [signupOpen, setSignupOpen] = useState<boolean>(false)
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  /** HANDLERS */
  const handleSignupClose = () => setSignupOpen(false);
  const handleLoginClose = () => setLoginOpen(false);

  const handleLogoutClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseLogout = () => setAnchorEl(null);
  const handleLogoutRequest = async () => {
    try {
      const member = new MemberService();
      await member.logout
      await sweetTopSuccessAlert("success", 700);
      setAuthMember(null)
    } catch (err) {
      console.log(err);
      sweetErrorHandling(Messages.error1)
    }
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {location.pathname === "/" ? (
          <HomeNavbar
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
        ) : (
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
        )}
        
        <Suspense fallback={<LoadingSpinner />}>
          {/* @ts-ignore */}
          <Switch>
            <Route path="/coffees">
              <CoffeesPage onAdd={onAdd} />
            </Route>
            <Route path="/salads">
              <SaladsPage />
            </Route>
            <Route path="/desserts">
              <DessertsPage />
            </Route>
            <Route path="/drinks">
              <DrinksPage />
            </Route>
            <Route path="/products">
              <CoffeesPage onAdd={onAdd} />
            </Route>
            <Route path="/orders">
              <OrdersPage />
            </Route>
            <Route path="/member-page">
              <UserPage />
            </Route>
            <Route path="/my-page">
              <MyPage />
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
        
        <Footer />

        <AuthenticationModal
          signupOpen={signupOpen}
          loginOpen={loginOpen}
          handleLoginClose={handleLoginClose}
          handleSignupClose={handleSignupClose}
        />
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;







