import React, { useState, useEffect } from "react";
import { Box, Container, Stack } from "@mui/material";
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
    <div>
      <Stack>
      {processOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-box-scroll">
              {order?.orderItems?.map((item: OrderItem) => {
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
                      <Box key={item._id} className="orders-name-price">
                        <img
                          src="/icons/noimage-list.svg"
                          className={"order-dish-img"}
                        />
                        <p className="title-dish">Product ID: {item.productId}</p>
                        <Box className="price-box">
                          <p>${item.itemPrice}</p>
                          <img src="/icons/close.svg" alt="" />
                          <p>{item.itemQuantity}</p>
                          <img src="/icons/pause.svg" alt="" />
                          <p style={{ marginLeft: "15px" }}>${item.itemQuantity * item.itemPrice}</p>
                        </Box>
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
                    <Box key={item._id} className="orders-name-price">
                      <img
                        src={imagePath}
                        className={"order-dish-img"}
                        alt="Product"
                        onError={(e) => {
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
                  <p>Delivery cost</p>
                  <p>${order.orderDelivery}</p>
                  <img src="/icons/pause.svg" style={{ marginLeft: "20px" }} />
                  <p>Total</p>
                  <p>${order.orderTotal}</p>
                </Box>
                <Button value={order._id}
                  variant="contained"
                  color="secondary"
                  className="verify-button"
                  onClick={finishOrderHandler}
                  sx={{ marginRight: "10px", marginLeft: "10px" }}
                >
                  VERIFY TO FULFIL
                </Button>
              </Box>
            </Box>
          );
        })}

        {!processOrders || (processOrders.length === 0 && (
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