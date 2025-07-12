import React from "react";
import { Box, Button, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { isTemplateMiddle } from "typescript";
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
  const itemsPrice: number = cartItems.reduce((a: number, c: CartItem)=> a + c.quantity*c.price,0);
  const shippingCost: number = itemsPrice < 100 ? 5 : 0;
const totalPrice = (itemsPrice + shippingCost).toFixed(1)

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
    await order.createOrder(cartItems)

    onDeleteAll();
    
    setOrderBuilder(new Date())
    history.push("orders");

    //REFRESH VIA CONTEXT

    }catch(err){
      console.log(err)
      sweetErrorHandling(err).then();

    }
  }

  return (
    <Box className={"hover-line"}>
      <IconButton
        aria-label="cart"
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px) rotate(0deg)',
            },
            '25%': {
              transform: 'translateY(-3px) rotate(2deg)',
            },
            '50%': {
              transform: 'translateY(-1px) rotate(-1deg)',
            },
            '75%': {
              transform: 'translateY(-2px) rotate(1deg)',
            },
          },
          '&:hover': {
            animation: 'bounce 0.6s ease-in-out',
            '@keyframes bounce': {
              '0%, 20%, 50%, 80%, 100%': {
                transform: 'translateY(0px) scale(1)',
              },
              '40%': {
                transform: 'translateY(-8px) scale(1.1)',
              },
              '60%': {
                transform: 'translateY(-4px) scale(1.05)',
              },
            },
          },
          transition: 'all 0.3s ease',
          '&:active': {
            animation: 'shake 0.5s ease-in-out',
            '@keyframes shake': {
              '0%, 100%': {
                transform: 'translateX(0px)',
              },
              '25%': {
                transform: 'translateX(-3px)',
              },
              '75%': {
                transform: 'translateX(3px)',
              },
            },
          },
        }}
      >
        <Badge 
          badgeContent={cartItems.length} 
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(255, 193, 7, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(255, 193, 7, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(255, 193, 7, 0)',
                },
              },
            },
          }}
        >
          <Box
            component="img"
            src={"/icons/shopping-cart.svg"}
            sx={{
              animation: 'swing 2s ease-in-out infinite',
              '@keyframes swing': {
                '0%, 100%': {
                  transform: 'rotate(-2deg)',
                },
                '50%': {
                  transform: 'rotate(2deg)',
                },
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                animation: 'wiggle 0.5s ease-in-out',
                '@keyframes wiggle': {
                  '0%, 100%': {
                    transform: 'rotate(0deg)',
                  },
                  '25%': {
                    transform: 'rotate(-5deg)',
                  },
                  '75%': {
                    transform: 'rotate(5deg)',
                  },
                },
              },
            }}
          />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
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
        <Stack className={"basket-frame"}>
          <Box className={"all-check-box"}>
            {cartItems.length === 0 ?(
              <div>Cart is empty!</div>
            ):(
            <Stack direction={"row"}> <div>Cart Products:</div>
             <DeleteForeverIcon 
             sx={{ml:"5px", cursor:"pointer"}}
             color={"primary"}
                  onClick={()=>onDeleteAll()}/>
            </Stack>
            )}
            
          </Box>

          <Box className={"orders-main-wrapper"}>
            <Box className={"orders-wrapper"}>
            {cartItems.map((item: CartItem)=>{
            const imagePath = `${serverApi}${item.image}`
              return  (
                <Box className={"basket-info-box"} key={item._id}>
                <div className={"cancel-btn"}>
                  <CancelIcon 
                  color={"primary"}
                  onClick={()=>onDelete(item)} />
                </div>
                <img src={imagePath} className={"product-img"} />
                <span className={"product-name"}>{item.name}</span>
                <p className={"product-price"}>${item.price} x {item.quantity}</p>
                <Box sx={{ minWidth: 120 }}>
                  <div className="col-2">
                    <button onClick={()=> onRemove(item)} className="remove"
                      >
                      -
                      </button>{" "}
                    <button onClick={()=> onAdd(item)}  className="add">+</button>
                  </div>
                </Box>
              </Box>
              );
            })}
            </Box>
          </Box>
          {cartItems.length !==0 ? (  <Box className={"basket-order"}>
            <span className={"price"}>Total: ${totalPrice} ({itemsPrice}+{shippingCost})</span>
            <Button 
            onClick={proceedOrderHandler}
            startIcon={<ShoppingCartIcon />} variant={"contained"}>
              Order
            </Button>
          </Box>) : ("")}
        
        </Stack>
      </Menu>
    </Box>
  );
}
