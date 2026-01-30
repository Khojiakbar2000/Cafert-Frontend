import React, { useState, useEffect } from "react";
import { Box, Stack, Typography, Paper, Button } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useGlobals } from "../../hooks/useGlobals";
import { Messages } from "../../../lib/config";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import { OrderUpdateInput } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";

import { useSelector} from "react-redux";
import {createSelector} from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import ProductService from "../../services/ProductService";

/** REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders)=> ({finishedOrders})
) 

interface FinishedOrdersProps {
  setValue?: (input: string) => void;
}

export default function FinishedOrders(props: FinishedOrdersProps = {}) {
  const { setValue } = props;
  const {finishedOrders} = useSelector(finishedOrdersRetriever)
  const {authMember, setOrderBuilder} = useGlobals();
  const [productCache, setProductCache] = useState<{[key: string]: Product}>({});

  /** HANDLERS **/
  const deleteOrderHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.DELETE,
      };

      const confirmation = window.confirm("Do you want to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        if (setValue) setValue("1");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const paymentHandler = async (e: T) => {
    try {
      if (!authMember) throw new Error(Messages.error2);
      
      const orderId = e.target.value;
      const confirmation = window.confirm("Do you want to proceed with payment?");
      if (confirmation) {
        // Here you would typically integrate with a payment gateway
        // For now, we'll just show a success message
        window.alert("Payment processed successfully!");
        setOrderBuilder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

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
      if (finishedOrders && finishedOrders.length > 0) {
        for (const order of finishedOrders) {
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
  }, [finishedOrders]);

  return (
    <Stack spacing={2}>
      {finishedOrders?.map((order: Order) => {
          // Filter out order items that don't have valid products
          const validItems = order?.orderItems?.filter((item: OrderItem) => {
            // Check if product exists in order data
            let product: Product | undefined;
            if (order.productData && order.productData.length > 0) {
              product = order.productData.find((ele: Product) => item.productId === ele._id);
            }
            
            // Check if product exists in cache
            if (!product) {
              product = productCache[item.productId];
            }
            
            return product !== undefined;
          });
          
          // If no valid items, don't render this order
          if (!validItems || validItems.length === 0) {
            return null;
          }
          
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
              {validItems.map((item: OrderItem, index: number) => {
                  console.log('Processing order item:', item);
                  console.log('Order productData:', order.productData);
                  
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
                  
                  console.log('Found product:', product);
                  
                  // Handle case where product is not found
                  if (!product) {
                    console.warn('Product not found for item:', item);
                    // Instead of showing "Product ID: xxx", skip this item entirely
                    return null;
                  }
                  
                  // Fix image path - check if it's already a full URL or needs serverApi prefix
                  const imagePath = product?.productImages?.[0] 
                    ? (product.productImages[0].startsWith('http') 
                        ? product.productImages[0] 
                        : `${serverApi}${product.productImages[0]}`)
                    : '/icons/noimage-list.svg';
                    
                  console.log('Image path:', imagePath);
                  
                  return (
                    <Box 
                      key={item._id} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2, 
                        py: 1.5,
                        borderBottom: index < validItems.length - 1 ? '1px solid #f0f0f0' : 'none'
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
                    onClick={paymentHandler}
                    startIcon={<PaymentIcon />}
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

      {(!finishedOrders || finishedOrders.length === 0) && (
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