import {
    Box,
    Button,
    Container,
    ListItemIcon,
    Menu,
    MenuItem,
    Stack,
    Typography,
  } from "@mui/material";
  import { NavLink } from "react-router-dom";
  import Basket from "./Basket";
  import { CartItem } from "../../../lib/types/search";
  
  import { serverApi } from "../../../lib/config";
  import { Logout } from "@mui/icons-material";
import { useGlobals } from "../../hooks/useGlobals";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

  
  interface OtherNavbarProps {
    cartItems: CartItem[];
    onAdd: (item: CartItem) => void;
    onRemove: (item: CartItem) => void;
    onDelete: (item: CartItem) => void;
    onDeleteAll: () => void;
    setSignupOpen: (isOpen: boolean) => void;
    setLoginOpen: (isOpen: boolean) => void;
    handleLogoutClick: (e: React.MouseEvent<HTMLElement>) => void;
    anchorEl: HTMLElement | null;
    handleCloseLogout: () => void;
    handleLogoutRequest: () => void;
  }
  
  export default function OtherNavbar(props: OtherNavbarProps) {
    const {
      cartItems,
      onAdd,
      onDelete,
      onDeleteAll,
      onRemove,
      setSignupOpen,
      setLoginOpen,
      handleLogoutClick,
      anchorEl,
      handleCloseLogout,
      handleLogoutRequest,
    } = props;
  
    const { authMember } = useGlobals();
    const { t } = useTranslation();
  
    return (
      <div className="other-navbar">
        <Container className="navbar-container">
          <Stack className="menu">
            <Box>
              <NavLink to="/">
                <Typography
                  variant="h5"
                  sx={{
                    color: '#8B4513',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    textDecoration: 'none'
                  }}
                >
                  Cafert
                </Typography>
              </NavLink>
            </Box>
            <Stack className="links">
              <Box className={"hover-line"}>
                <NavLink to="/">{t('navigation.home')}</NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/products" activeClassName="underline">
                  {t('navigation.products')}
                </NavLink>
              </Box>
              <Box className={"hover-line"}>
                <NavLink to="/coffees" activeClassName="underline">
                  {t('navigation.drinks')}
                </NavLink>
              </Box>
              {authMember ? (
                <Box className={"hover-line"}>
                  <NavLink to="/orders" activeClassName="underline">
                    {t('navigation.orders')}
                  </NavLink>
                </Box>
              ) : null}
              {authMember ? (
                <Box className={"hover-line"}>
                  <NavLink to="/my-page" className={({ isActive }) => isActive ? "underline" : ""}>
                    {t('navigation.profile')}
                  </NavLink>
                </Box>
              ) : null}
              <Box className={"hover-line"}>
                <NavLink to="/help" className={({ isActive }) => isActive ? "underline" : ""}>
                  {t('navigation.about')}
                </NavLink>
              </Box>
                            <Basket
                cartItems={cartItems}
                onAdd={onAdd}
                onRemove={onRemove}
                onDelete={onDelete}
                onDeleteAll={onDeleteAll}
              />

              {/* Language Switcher */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageSwitcher />
              </Box>

              {!authMember ? (
                <Box>
                  <Button
                    variant="contained"
                    className="login-button"
                    onClick={() => setLoginOpen(true)}
                  >
                    {t('common.login')}
                  </Button>
                </Box>
              ) : (
                <img
                  className="user-avatar"
                  src={
                    authMember?.memberImage
                      ? `${serverApi}${authMember?.memberImage}`
                      : "/icons/default-user.svg"
                  }
                  aria-haspopup={"true"}
                  onClick={handleLogoutClick}
                />
              )}
  
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={Boolean(anchorEl)}
                onClose={handleCloseLogout}
                onClick={handleCloseLogout}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleLogoutRequest}>
                  <ListItemIcon>
                    <Logout fontSize="small" style={{ color: "blue" }} />
                  </ListItemIcon>
                  {t('common.logout')}
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>
        </Container>
      </div>
    );
  }