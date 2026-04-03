import React from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  IconButton, 
  Badge, 
  Divider,
  Chip,
  Avatar,
  Popover,
  useTheme,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import { STITCH_THEME } from "../../../components/stitchUi";

const GROTESK = '"Space Grotesk", system-ui, sans-serif';
const ORDER_SUMMARY_SURFACE = "#FFF9F0";

const benDayLayer = {
  pointerEvents: 'none' as const,
  position: 'absolute' as const,
  inset: 0,
  backgroundImage: `radial-gradient(${STITCH_THEME.ink} 10%, transparent 11%)`,
  backgroundSize: '10px 10px',
  opacity: 0.07,
  zIndex: 0,
};

const COMIC_ERROR_TINT = '#ffdad6';

const comicIconBtn = {
  width: 32,
  height: 32,
  borderRadius: 0,
  border: `3px solid ${STITCH_THEME.ink}`,
  boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
  transition: 'transform 0.12s ease, box-shadow 0.12s ease',
  '&:hover': {
    transform: 'translate(-1px, -1px)',
    boxShadow: `3px 3px 0 0 ${STITCH_THEME.ink}`,
  },
};

interface BasketProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem)=> void;
  onRemove: (item: CartItem)=> void;
  onDelete: (item: CartItem)=> void;
  onDeleteAll: ()=> void;
}

export default function Basket(props:BasketProps) {
  const {cartItems, onAdd, onRemove, onDelete, onDeleteAll} = props;
  const {authMember, setOrderBuilder} = useGlobals();
  const history = useHistory();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const cartOpen = Boolean(anchorEl);

  const itemCount = cartItems.reduce((n, c) => n + c.quantity, 0);
  const itemsPrice: number = cartItems.reduce((a: number, c: CartItem)=> a + c.quantity*c.price,0);
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const estimatedTax: number =
    itemsPrice > 0 ? Math.round(itemsPrice * 0.062 * 100) / 100 : 0;
  const orderTotal = itemsPrice + shippingCost + estimatedTax;

  const closeCart = () => setAnchorEl(null);

  const proceedOrderHandler = async () => {
    try{
      closeCart();
      
      if(!authMember) throw new Error(Messages.error2);

      const order = new OrderService();
      const createdOrder = await order.createOrder(cartItems);
      console.log("Order created successfully:", createdOrder);

      onDeleteAll();
      setOrderBuilder(new Date())
      history.push("orders");

    }catch(err){
      console.log("=== ORDER CREATION ERROR ===");
      console.log("Error details:", err);
      sweetErrorHandling(err).then();
    }
  }

  return (
    <Box sx={{ position: 'relative', height: 60, width: 60 }}>
      <IconButton
        aria-label="cart"
        aria-expanded={cartOpen}
        aria-haspopup="true"
        onClick={(e) => setAnchorEl((prev) => (prev ? null : e.currentTarget))}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 0,
          bgcolor: STITCH_THEME.surface,
          color: STITCH_THEME.ink,
          border: `4px solid ${STITCH_THEME.ink}`,
          boxShadow: cartOpen
            ? `2px 2px 0 0 ${STITCH_THEME.ink}`
            : `6px 6px 0 0 ${STITCH_THEME.ink}`,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          '&:hover': {
            bgcolor: STITCH_THEME.primaryContainer,
            color: STITCH_THEME.ink,
            transform: 'translate(-2px, -2px)',
            boxShadow: `8px 8px 0 0 ${STITCH_THEME.ink}`,
          },
          '&:active': {
            transform: 'translate(2px, 2px)',
            boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
          },
        }}
      >
        <Badge 
          badgeContent={itemCount} 
          invisible={itemCount === 0}
          sx={{
            '& .MuiBadge-badge': {
              fontFamily: GROTESK,
              bgcolor: STITCH_THEME.primary,
              color: STITCH_THEME.onPrimary,
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '0.7rem',
              minWidth: 22,
              height: 22,
              borderRadius: 0,
              border: `2px solid ${STITCH_THEME.ink}`,
              boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
            },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 26 }} />
        </Badge>
      </IconButton>

      <Popover
        open={cartOpen}
        anchorEl={anchorEl}
        onClose={closeCart}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        marginThreshold={8}
        PaperProps={{
          elevation: 0,
          sx: {
            mt: 1,
            maxWidth: 'min(calc(100vw - 16px), 420px)',
            maxHeight: 'min(85vh, 680px)',
            overflow: 'hidden',
            borderRadius: 0,
            border: `4px solid ${STITCH_THEME.ink}`,
            boxShadow: `10px 10px 0 0 ${STITCH_THEME.ink}`,
            bgcolor: ORDER_SUMMARY_SURFACE,
          },
        }}
        sx={{ zIndex: theme.zIndex.modal }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 'min(85vh - 16px, 664px)',
            overflow: 'hidden',
          }}
        >
          <Box sx={benDayLayer} aria-hidden />
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: 2.5, pt: 2, flexShrink: 0 }}>
              <Typography
                sx={{
                  fontFamily: GROTESK,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  fontSize: '1.1rem',
                  color: STITCH_THEME.primary,
                  textShadow: `2px 2px 0 ${STITCH_THEME.ink}`,
                  mb: 0.5,
                }}
              >
                Your selection
              </Typography>
              <Typography
                sx={{
                  fontFamily: GROTESK,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  color: '#504442',
                  mb: 1.5,
                }}
              >
                Pulled fresh for checkout
              </Typography>
              <Divider sx={{ borderBottomWidth: 3, borderColor: STITCH_THEME.ink }} />
            </Box>

            <Box
              sx={{
                flex: 1,
                minHeight: 120,
                overflowY: 'auto',
                px: 2.5,
                py: 2,
              }}
            >
              {cartItems.length === 0 ? (
                <Box
                  sx={{
                    textAlign: 'center',
                    py: 3,
                    px: 2,
                    border: `3px dashed ${STITCH_THEME.ink}`,
                    bgcolor: STITCH_THEME.surface,
                    boxShadow: `4px 4px 0 0 ${STITCH_THEME.ink}`,
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: 44, color: STITCH_THEME.ink, opacity: 0.35, mb: 1.5 }} />
                  <Typography
                    sx={{
                      fontFamily: GROTESK,
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      color: STITCH_THEME.ink,
                      fontSize: '0.95rem',
                    }}
                  >
                    Empty loot bag
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: GROTESK,
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      color: '#504442',
                      mt: 1,
                      lineHeight: 1.45,
                    }}
                  >
                    Stack beans, mugs & merch here — then slam checkout.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {cartItems.map((item: CartItem) => {
                    const imagePath = `${serverApi}${item.image}`;
                    return (
                      <Box
                        key={item._id}
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 1.5,
                          p: 1.5,
                          bgcolor: STITCH_THEME.surface,
                          border: `3px solid ${STITCH_THEME.ink}`,
                          boxShadow: `4px 4px 0 0 ${STITCH_THEME.ink}`,
                        }}
                      >
                        <Avatar
                          src={imagePath}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 0,
                            border: `3px solid ${STITCH_THEME.ink}`,
                            flexShrink: 0,
                          }}
                          variant="square"
                        />
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: GROTESK,
                              fontWeight: 900,
                              fontStyle: 'italic',
                              textTransform: 'uppercase',
                              fontSize: '0.78rem',
                              letterSpacing: '0.02em',
                              color: STITCH_THEME.ink,
                              lineHeight: 1.25,
                              mb: 0.5,
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: GROTESK,
                              fontWeight: 900,
                              fontStyle: 'italic',
                              fontSize: '0.9rem',
                              color: STITCH_THEME.primary,
                              transform: 'skewX(-4deg)',
                            }}
                          >
                            ${(item.price * item.quantity).toFixed(2)}
                            {item.quantity > 1 && (
                              <Box component="span" sx={{ fontWeight: 600, fontSize: '0.65rem', color: '#504442', fontStyle: 'normal', transform: 'none', display: 'block', mt: 0.25 }}>
                                ({item.quantity} × ${item.price.toFixed(2)})
                              </Box>
                            )}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.75, mt: 1.25 }}>
                            <IconButton
                              size="small"
                              onClick={() => onRemove(item)}
                              sx={{
                                ...comicIconBtn,
                                bgcolor: STITCH_THEME.surfaceContainer,
                                color: STITCH_THEME.ink,
                                '&:hover': { bgcolor: COMIC_ERROR_TINT, color: '#93000a' },
                              }}
                            >
                              <RemoveIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <Chip
                              label={item.quantity}
                              size="small"
                              sx={{
                                fontFamily: GROTESK,
                                fontWeight: 900,
                                height: 32,
                                borderRadius: 0,
                                bgcolor: STITCH_THEME.primary,
                                color: STITCH_THEME.onPrimary,
                                border: `3px solid ${STITCH_THEME.ink}`,
                                boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
                                minWidth: 36,
                                '& .MuiChip-label': { px: 1 },
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => onAdd(item)}
                              sx={{
                                ...comicIconBtn,
                                bgcolor: STITCH_THEME.tertiaryContainer,
                                color: STITCH_THEME.ink,
                                '&:hover': { bgcolor: STITCH_THEME.primary, color: STITCH_THEME.onPrimary },
                              }}
                            >
                              <AddIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => onDelete(item)}
                              aria-label="Remove line"
                              sx={{
                                ...comicIconBtn,
                                ml: { xs: 0, sm: 0.5 },
                                bgcolor: 'transparent',
                                borderStyle: 'dashed',
                                boxShadow: 'none',
                                '&:hover': {
                                  bgcolor: COMIC_ERROR_TINT,
                                  color: '#93000a',
                                  borderStyle: 'solid',
                                  boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
                                },
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Box>

            {cartItems.length > 0 && (
              <Box
                sx={{
                  flexShrink: 0,
                  position: 'relative',
                  p: 2.5,
                  borderTop: `4px solid ${STITCH_THEME.ink}`,
                  bgcolor: STITCH_THEME.surface,
                  boxShadow: `inset 0 1px 0 0 rgba(26,15,13,0.06)`,
                }}
              >
                <Box
                  sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `radial-gradient(${STITCH_THEME.ink} 10%, transparent 11%)`,
                    backgroundSize: '10px 10px',
                    opacity: 0.06,
                    zIndex: 0,
                  }}
                />
                <Typography
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: GROTESK,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    fontSize: '1.15rem',
                    color: STITCH_THEME.ink,
                    mb: 2,
                  }}
                >
                  Order summary
                </Typography>
                <Stack spacing={1.5} sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.7rem', color: '#504442' }}>
                      Subtotal
                    </Typography>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 900, fontStyle: 'italic', fontSize: '1.02rem', color: STITCH_THEME.ink, transform: 'skewX(-4deg)' }}>
                      ${itemsPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.7rem', color: '#504442' }}>
                      Shipping
                    </Typography>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 900, fontStyle: 'italic', fontSize: '1.02rem', color: STITCH_THEME.ink, transform: 'skewX(-4deg)' }}>
                      ${shippingCost.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', fontSize: '0.7rem', color: '#504442' }}>
                      Est. tax
                    </Typography>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 900, fontStyle: 'italic', fontSize: '1.02rem', color: STITCH_THEME.ink, transform: 'skewX(-4deg)' }}>
                      ${estimatedTax.toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ borderColor: `${STITCH_THEME.ink}33`, my: 0.5 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 900, textTransform: 'uppercase', fontSize: '1.15rem', color: STITCH_THEME.ink }}>
                      Total
                    </Typography>
                    <Typography sx={{ fontFamily: GROTESK, fontWeight: 900, fontStyle: 'italic', fontSize: '1.55rem', color: STITCH_THEME.ink, transform: 'skewX(-4deg)' }}>
                      ${orderTotal.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  fullWidth
                  onClick={proceedOrderHandler}
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    mt: 2.5,
                    py: 1.75,
                    bgcolor: STITCH_THEME.primary,
                    color: '#fff',
                    borderRadius: 0,
                    border: `4px solid ${STITCH_THEME.ink}`,
                    boxShadow: `4px 4px 0 0 ${STITCH_THEME.ink}`,
                    fontFamily: GROTESK,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    fontSize: '1rem',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                    '&:hover': {
                      bgcolor: '#e04300',
                      transform: 'translate(2px, 2px)',
                      boxShadow: `2px 2px 0 0 ${STITCH_THEME.ink}`,
                    },
                  }}
                >
                  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <ShoppingCartIcon sx={{ fontSize: 22 }} />
                    Proceed to Order
                  </Box>
                </Button>
                <Stack alignItems="center" spacing={1} sx={{ position: 'relative', zIndex: 1, mt: 2 }}>
                  <Typography sx={{ fontFamily: GROTESK, fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#827471' }}>
                    Encrypted & Secure
                  </Typography>
                  <Stack direction="row" spacing={3} sx={{ opacity: 0.35 }}>
                    <CreditCardOutlinedIcon sx={{ fontSize: 26, color: STITCH_THEME.ink }} />
                    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 26, color: STITCH_THEME.ink }} />
                    <LockOutlinedIcon sx={{ fontSize: 26, color: STITCH_THEME.ink }} />
                  </Stack>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
