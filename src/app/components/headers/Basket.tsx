import React from "react";
import { 
  Box, 
  Button, 
  Stack, 
  Typography, 
  IconButton, 
  Badge, 
  Menu, 
  Divider,
  Chip,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { Messages, serverApi } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const itemsPrice: number = cartItems.reduce((a: number, c: CartItem)=> a + c.quantity*c.price,0);
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
  const totalPrice = (itemsPrice + shippingCost).toFixed(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  /** HANDLERS **/
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const proceedOrderHandler = async () => {
    try{
      handleClose()
      
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
    <Box sx={{ position: 'relative' }}>
      <IconButton
        aria-label="cart"
        id="floating-cart-button"
        aria-controls={open ? "cart-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          width: 56,
          height: 56,
          backgroundColor: 'rgba(139, 69, 19, 0.1)',
          color: '#8b4513',
          borderRadius: '50%',
          border: '2px solid #8b4513',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(139, 69, 19, 0.2)',
            transform: 'scale(1.1)',
            boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
          },
          '&:active': {
            transform: 'scale(0.95)',
          },
        }}
      >
        <Badge 
          badgeContent={cartItems.length} 
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#e74c3c',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.8rem',
              minWidth: 20,
              height: 20,
              animation: cartItems.length > 0 ? 'pulse 2s infinite' : 'none',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(231, 76, 60, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(231, 76, 60, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(231, 76, 60, 0)',
                },
              },
            },
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="cart-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
            mt: 2,
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            minWidth: 350,
            maxWidth: 400,
            maxHeight: 500,
            border: '1px solid #e0e0e0',
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 12,
              height: 12,
              bgcolor: '#ffffff',
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderLeft: '1px solid #e0e0e0',
              borderTop: '1px solid #e0e0e0',
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b4513' }}>
              Shopping Cart
            </Typography>
            {cartItems.length > 0 && (
              <IconButton
                onClick={onDeleteAll}
                sx={{
                  color: '#e74c3c',
                  '&:hover': {
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                  }
                }}
              >
                <DeleteForeverIcon />
              </IconButton>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Cart Items */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            {cartItems.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Your cart is empty
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Add some delicious items to get started!
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
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: '12px',
                        backgroundColor: '#fafafa',
                        border: '1px solid #f0f0f0',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'translateX(-4px)',
                        }
                      }}
                    >
                      <Avatar
                        src={imagePath}
                        sx={{ width: 50, height: 50, borderRadius: '8px' }}
                        variant="rounded"
                      />
                      
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 0.5 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#8b4513', fontWeight: 600 }}>
                          ${item.price}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => onRemove(item)}
                          sx={{
                            backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            color: '#e74c3c',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              backgroundColor: 'rgba(231, 76, 60, 0.2)',
                            }
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        
                        <Chip
                          label={item.quantity}
                          size="small"
                          sx={{
                            backgroundColor: '#8b4513',
                            color: '#ffffff',
                            fontWeight: 600,
                            minWidth: 32,
                          }}
                        />
                        
                        <IconButton
                          size="small"
                          onClick={() => onAdd(item)}
                          sx={{
                            backgroundColor: 'rgba(139, 69, 19, 0.1)',
                            color: '#8b4513',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              backgroundColor: 'rgba(139, 69, 19, 0.2)',
                            }
                          }}
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => onDelete(item)}
                          sx={{
                            color: '#999',
                            width: 28,
                            height: 28,
                            '&:hover': {
                              color: '#e74c3c',
                              backgroundColor: 'rgba(231, 76, 60, 0.1)',
                            }
                          }}
                        >
                          <CancelIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>

          {/* Footer */}
          {cartItems.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Subtotal:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${itemsPrice.toFixed(2)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Shipping:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  ${shippingCost.toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b4513' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#8b4513' }}>
                  ${totalPrice}
                </Typography>
              </Box>
              
              <Button
                fullWidth
                variant="contained"
                onClick={proceedOrderHandler}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  backgroundColor: '#8b4513',
                  color: '#ffffff',
                  borderRadius: '12px',
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 4px 12px rgba(139, 69, 19, 0.3)',
                  '&:hover': {
                    backgroundColor: '#a0522d',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(139, 69, 19, 0.4)',
                  }
                }}
              >
                Proceed to Order
              </Button>
            </Box>
          )}
        </Box>
      </Menu>
    </Box>
  );
}
