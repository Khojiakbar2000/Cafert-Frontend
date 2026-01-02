import React, { useState, useEffect } from "react";
import { Box, Container, Stack, Typography, Divider, Paper } from "@mui/material";
import Button from "@mui/material/Button";

import { useSelector} from "react-redux";
import {createSelector} from "reselect";
import { retrieveProcessOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import ProductService from "../../services/ProductService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

/** REDUX SLICE & SELECTOR */
const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders)=> ({processOrders})
) 

interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props:ProcessOrdersProps) {
  const {setValue} = props;
  const {authMember, setOrderBuilder} = useGlobals();
  const {processOrders} = useSelector(processOrdersRetriever)
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
      if (processOrders && processOrders.length > 0) {
        for (const order of processOrders) {
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
  }, [processOrders]);

  /** HANDLERS **/
  const finishOrderHandler = async (e: T)=>{
    try{
      if(!authMember) throw new Error(Messages.error2)
        //PAYMENT PROCESS

      const orderId = e.target.value;
      const input: OrderUpdateInput = {
       orderId: orderId,
        orderStatus: OrderStatus.FINISH,
      }

      const confirmation = window.confirm("Have you received your order?")
      if(confirmation){
        const order = new OrderService()
        await order.updateOrder(input);
         setValue("3")
        setOrderBuilder(new Date())
      }

    }catch(err){
     console.log(err);
     sweetErrorHandling(err).then();
    }
  }

  return (
    <Stack spacing={2}>
      {processOrders?.map((order: Order) => {
        return (
          <Paper 
            key={order._id} 
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }
            }}
          >
            {/* Order Items */}
            <Box sx={{ 
              maxHeight: '280px', 
              overflowY: 'auto',
              p: 2,
              pb: 1.5
            }}>
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
                          borderBottom: index < (order.orderItems?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none'
                        }}
                      >
                        <Box
                          component="img"
                          src="/icons/noimage-list.svg"
                          sx={{ 
                            width: 56, 
                            height: 56, 
                            borderRadius: '12px',
                            objectFit: 'cover'
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
                        borderBottom: index < (order.orderItems?.length || 0) - 1 ? '1px solid #f0f0f0' : 'none'
                      }}
                    >
                      <Box
                        component="img"
                        src={imagePath}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/icons/noimage-list.svg';
                        }}
                        sx={{ 
                          width: 56, 
                          height: 56, 
                          borderRadius: '12px',
                          objectFit: 'cover'
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
              borderTop: '2px solid #f0f0f0',
              backgroundColor: '#fafafa',
              p: 2,
              pt: 1.5
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1.5
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
                <Button 
                  value={order._id}
                  variant="contained"
                  onClick={finishOrderHandler}
                  sx={{ 
                    minWidth: 160,
                    height: 38,
                    textTransform: 'none',
                    fontWeight: 600,
                    backgroundColor: '#8b4513',
                    '&:hover': {
                      backgroundColor: '#a0522d',
                    }
                  }}
                >
                  Verify to Fulfill
                </Button>
              </Box>
            </Box>
          </Paper>
        );
      })}

      {(!processOrders || processOrders.length === 0) && (
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