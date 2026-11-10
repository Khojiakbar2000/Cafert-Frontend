import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography, Divider, Paper } from "@mui/material";
import Button from "@mui/material/Button";

import { useSelector} from "react-redux";
import {createSelector} from "reselect";
import { retrievePausedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { T } from "../../../lib/types/common";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import OrderService from "../../services/OrderService";
import ProductService from "../../services/ProductService";

/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders)=> ({pausedOrders})
) ;

interface PausedOrderProps {
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrderProps) {
  const {setValue} = props
  const {authMember, setOrderBuilder} = useGlobals();
  const {pausedOrders} = useSelector(pausedOrdersRetriever)
  const [productCache, setProductCache] = useState<{[key: string]: Product}>({});

  // Function to fetch product data if not available
  const fetchProductData = async (productId: string): Promise<Product | null> => {
    try {
      // Check if we already have this product in cache
      if (productCache[productId]) {
        return productCache[productId];
      }

      // Fetch product from API - use a simple approach
      const productService = new ProductService();
      const products = await productService.getProducts({
        order: "createdAt",
        page: 1,
        limit: 100
      });
      
      if (products && products.length > 0) {
        // Find the specific product by ID
        const product = products.find(p => p._id === productId);
        if (product) {
          // Cache the product
          setProductCache(prev => ({ ...prev, [productId]: product }));
          return product;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  // Fetch product data for all orders when component loads
  useEffect(() => {
    const loadProductData = async () => {
      if (pausedOrders && pausedOrders.length > 0) {
        for (const order of pausedOrders) {
          if (order.orderItems && order.orderItems.length > 0) {
            for (const item of order.orderItems) {
              if (!productCache[item.productId]) {
                await fetchProductData(item.productId);
              }
            }
          }
        }
      }
    };
    
    loadProductData();
  }, [pausedOrders]);

  /** HANDLERS **/

  const deleteOrderHandler = async (e: T)=>{
    try{
      if(!authMember) throw new Error(Messages.error2)
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
       orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      }

      const confirmation = window.confirm("Do you want to delete the order?")
      if(confirmation){
        const order = new OrderService()
        await order.updateOrder(input);
        setValue("2")
        setOrderBuilder(new Date())
      }

    }catch(err){
     console.log(err);
     sweetErrorHandling(err).then();
    }
  }

  const processOrderHandler = async (e: T)=>{
    try{
      if(!authMember) throw new Error(Messages.error2)
        //PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
       orderId: orderId,
        orderStatus: OrderStatus.PROCESS,
      }

      const confirmation = window.confirm("Do you want to proceed this payment?")
      if(confirmation){
        const order = new OrderService()
        await order.updateOrder(input);
         
        setOrderBuilder(new Date())
        setValue("2") // Automatically switch to Process Orders tab
      }

    }catch(err){
     console.log(err);
     sweetErrorHandling(err).then();
    }
  }
  return (
    <Stack spacing={2}>
      {pausedOrders?.map((order: Order) => {
        return (
          <Paper
            className="cafert-pending-ticket"
            key={order._id} 
            elevation={0}
            sx={{
              position: 'relative',
              borderRadius: '4px',
              border: '1px solid #d9c5a5',
              backgroundColor: '#f8f0e4',
              overflow: 'hidden',
              boxShadow: '0 6px 14px rgba(83,73,49,.09)',
              '&:hover': {
                boxShadow: '0 9px 18px rgba(83,73,49,.13)',
              }
            }}
          >
            {/* Order Items */}
            <Box sx={{ 
              maxHeight: '280px', 
              overflowY: 'auto',
              px: { xs: 1.5, md: 2.5 },
              pt: 2,
              pb: 1.5
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1.1, mb: .3, borderBottom: '1px dashed #cbb797' }}>
                <Typography sx={{ font: '700 .66rem/1 monospace', letterSpacing: '.15em', color: '#8f4d40' }}>CAFERT · CUSTOMER COPY</Typography>
                <Typography sx={{ font: '600 .68rem/1 monospace', letterSpacing: '.1em', color: '#827762' }}>NO. {order._id?.slice(-4).toUpperCase()}</Typography>
              </Box>
              {order?.orderItems?.map((item: OrderItem, index: number) => {
                  // Handle case where productData might not exist in real API data
                  let product: Product | undefined;
                  if (order.productData && order.productData.length > 0) {
                    product = order.productData.filter(
                      (ele: Product) => item.productId === ele._id
                    )[0];
                  }
                  
                  // If product not found in order data, check cache
                  if (!product) {
                    product = productCache[item.productId];
                  }
                  
                  // Handle case where product is not found
                  if (!product) {
                    return (
                      <Box 
                        key={item._id} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2, 
                          py: 1.5,
                          borderBottom: index < (order.orderItems?.length || 0) - 1 ? '1px dashed #d8c8ae' : 'none'
                        }}
                      >
                        <Box
                          component="img"
                          src="/icons/noimage-list.svg"
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: '50%',
                            border: '2px solid #e5d5bd',
                            objectFit: 'cover',
                            backgroundColor: '#efe3d0'
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                            Product ID: {item.productId}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              ${item.itemPrice} × {item.itemQuantity}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a', minWidth: '60px', textAlign: 'right' }}>
                          ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  }
                  
                  // Fix image path - check if it's already a full URL or needs serverApi prefix
                  const imagePath = product?.productImages?.[0] 
                    ? (product.productImages[0].startsWith('http') 
                        ? product.productImages[0] 
                        : `${serverApi}${product.productImages[0]}`)
                    : '/icons/noimage-list.svg';
                  
                  return (
                    <Box 
                      key={item._id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        py: 1.5,
                        borderBottom: index < (order.orderItems?.length || 0) - 1 ? '1px dashed #d8c8ae' : 'none'
                      }}
                    >
                      <Box
                        component="img"
                        src={imagePath}
                        onError={(e) => {
                          const name = product?.productName?.toLowerCase() || '';
                          (e.target as HTMLImageElement).src = name.includes('cappuccino')
                            ? '/img/coffee/coffee-cappuccino.jpg'
                            : /croissant|pastry|dessert|sweet/.test(name)
                              ? '/img/food/sweets.webp'
                              : '/img/coffee/coffee-placeholder.jpg';
                        }}
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '50%',
                          border: '2px solid #e5d5bd',
                          objectFit: 'cover',
                          backgroundColor: '#efe3d0'
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.5 }}>
                          {product ? product.productName : `Product ID: ${item.productId}`}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            ${item.itemPrice} × {item.itemQuantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#1a1a1a', minWidth: '60px', textAlign: 'right' }}>
                        ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                      </Typography>
                    </Box>
                  );
                })}
            </Box>

            {/* Total and Actions */}
            <Box sx={{ 
              borderTop: '2px dashed #cbb797',
              backgroundColor: '#efe3d0',
              p: 2,
              pt: 1.5
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1.5,
                flexWrap: 'wrap',
                gap: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>Product price:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${(order.orderTotal - order.orderDelivery).toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{ color: '#666', mx: 0.5 }}>+</Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Delivery:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>${order.orderDelivery.toFixed(2)}</Typography>
                  <Typography variant="body2" sx={{ color: '#666', mx: 0.5 }}>=</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
                    ${order.orderTotal.toFixed(2)}
                  </Typography>
                </Box>
                <Box aria-label="Payment due" sx={{ display: { xs: 'none', sm: 'flex' }, width: 70, height: 52, flex: '0 0 70px', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: '1.5px solid #9c4840', outline: '1px dashed #9c4840', outlineOffset: -5, color: '#9c4840', transform: 'rotate(-7deg)', font: '700 .57rem/1.15 monospace', letterSpacing: '.06em' }}>
                  PAYMENT<br />DUE
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Button
                    value={order._id}
                    variant="outlined"
                    onClick={deleteOrderHandler}
                    sx={{ 
                      minWidth: 100,
                      height: 38,
                      textTransform: 'none',
                      fontWeight: 600,
                      borderColor: '#d0d0d0',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#999',
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    value={order._id}
                    variant="contained"
                    onClick={processOrderHandler}
                    sx={{ 
                      minWidth: 120,
                      height: 38,
                      textTransform: 'none',
                      fontWeight: 600,
                      backgroundColor: '#8b4513',
                      '&:hover': {
                        backgroundColor: '#a0522d',
                      }
                    }}
                  >
                    Payment
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        );
      })}

      {(!pausedOrders || pausedOrders.length === 0) && (
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} sx={{ py: 6 }}>
          <img
            src="/icons/noimage-list.svg"
            style={{ width: 300, height: 300 }}
          />
        </Box>
      )}
    </Stack>
  );
}
