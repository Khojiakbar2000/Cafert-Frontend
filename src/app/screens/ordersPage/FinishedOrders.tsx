import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";

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

export default function FinishedOrders() {
  const {finishedOrders} = useSelector(finishedOrdersRetriever)
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
    <div>
      <Stack>
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
            <Box key={order._id} className="order-main-box">
              <Box className="order-box-scroll">
              {validItems.map((item: OrderItem) => {
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
                    <Box key={item._id} className="orders-name-price">
                      <img
                        src={imagePath}
                        className="order-dish-img"
                        alt="Product"
                        onError={(e) => {
                          console.log('Image failed to load:', imagePath);
                          e.currentTarget.src = '/icons/noimage-list.svg';
                        }}
                      />
                     <p className="title-dish">{product ? product.productName : `Product ID: ${item.productId}`}</p>
                      <Box className="price-box">
                      <p>${item.itemPrice}</p>
                        <img src="/icons/close.svg" alt="" />
                        <p>{item.itemQuantity}</p>
                        <img src="/icons/pause.svg" alt="" />
                        <p style={{ marginLeft: "15px" }}>
                        ${item.itemQuantity * item.itemPrice}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className="total-price-box">
                <Box className="box-total">
                  <p>Product price</p>
                  <p>${order.orderTotal - order.orderDelivery}</p>
                  <img src="/icons/plus.svg" style={{ marginLeft: "20px" }} />
                  <p>Delivery Cost</p>
                  <p>${order.orderDelivery}</p>
                  <img src="/icons/pause.svg" style={{ marginLeft: "20px" }} />
                  <p>Total</p>
                  <p>${order.orderTotal}</p>
                </Box>
              </Box>
            </Box>
          );
        })}

{!finishedOrders ||(finishedOrders.length === 0 && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src="/icons/noimage-list.svg"
              
              style={{ width: 300, height: 300 }}
            />
          </Box>
        ))}
      </Stack>
    </div>
  );
}