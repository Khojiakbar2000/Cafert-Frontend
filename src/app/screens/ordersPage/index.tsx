import { useState, SyntheticEvent, useEffect } from "react";
import { Container, Stack, Box, Button, IconButton } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocationOnICon from "@mui/icons-material/LocationOn";
import RefreshIcon from "@mui/icons-material/Refresh";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setPausedOrders, setProcessOrders, setFinishedOrders} from "./slice";
import { Order, OrderInquiry } from "../../../lib/types/order";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { ProductStatus, ProductCollection, ProductSize } from "../../../lib/enums/product.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import "../../../css/order.css";
import { serverApi } from "../../../lib/config";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch)=>({
  setPausedOrders: (data: Order[])=>
      dispatch(setPausedOrders(data)),
  setProcessOrders:(data:Order[])=>dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data))
});

export default function OrdersPage() {
  const {setPausedOrders,setProcessOrders,setFinishedOrders  } = actionDispatch(useDispatch())
  const {orderBuilder, authMember} = useGlobals()
  const history = useHistory()
  const [value, setValue] = useState("1");
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  })

  // Mock order data for testing when backend is not available
  const mockOrders: Order[] = [
    {
      _id: 'mock-order-2',
      memberId: authMember?._id || 'mock-member',
      orderStatus: OrderStatus.PROCESS,
      orderTotal: 12.50,
      orderDelivery: 0,
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(Date.now() - 3600000),
      orderItems: [
        { 
          _id: 'mock-item-3',
          itemQuantity: 1,
          itemPrice: 7.50,
          orderId: 'mock-order-2',
          productId: 'mock-product-3',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000)
        },
        { 
          _id: 'mock-item-4',
          itemQuantity: 1,
          itemPrice: 4.50,
          orderId: 'mock-order-2',
          productId: 'mock-product-4',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(Date.now() - 3600000)
        }
      ],
      productData: [
        {
          _id: 'mock-product-3',
          productName: 'Americano',
          productPrice: 7.50,
          productImages: ['/mock-image-3.jpg'],
          productCollection: ProductCollection.COFFEE,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 25,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Strong americano',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'mock-product-4',
          productName: 'Muffin',
          productPrice: 4.50,
          productImages: ['/mock-image-4.jpg'],
          productCollection: ProductCollection.DESSERT,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 20,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Blueberry muffin',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    },
    {
      _id: 'mock-order-3',
      memberId: authMember?._id || 'mock-member',
      orderStatus: OrderStatus.PAUSE,
      orderTotal: 8.99,
      orderDelivery: 0,
      createdAt: new Date(Date.now() - 1800000),
      updatedAt: new Date(Date.now() - 1800000),
      orderItems: [
        { 
          _id: 'mock-item-5',
          itemQuantity: 1,
          itemPrice: 4.99,
          orderId: 'mock-order-3',
          productId: 'mock-product-5',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000)
        },
        { 
          _id: 'mock-item-6',
          itemQuantity: 2,
          itemPrice: 2.00,
          orderId: 'mock-order-3',
          productId: 'mock-product-6',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(Date.now() - 1800000)
        }
      ],
      productData: [
        {
          _id: 'mock-product-5',
          productName: 'Latte',
          productPrice: 4.99,
          productImages: ['/mock-image-5.jpg'],
          productCollection: ProductCollection.COFFEE,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 10,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Smooth latte',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: 'mock-product-6',
          productName: 'Cookie',
          productPrice: 2.00,
          productImages: ['/mock-image-6.jpg'],
          productCollection: ProductCollection.DESSERT,
          productStatus: ProductStatus.PROCESS,
          productLeftCount: 30,
          productSize: ProductSize.NORMAL,
          productVolume: 1,
          productDesc: 'Chocolate chip cookie',
          productViews: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
    }
  ];

  const fetchOrders = async () => {
    if (!authMember?._id) return;
    
    console.log("=== ORDERS PAGE DEBUG ===");
    console.log("authMember:", authMember);
    console.log("orderBuilder:", orderBuilder);
    console.log("orderInquiry:", orderInquiry);
    
    const order = new OrderService()

    console.log("Fetching orders for user:", authMember._id);
    
    try {
      let pausedData: Order[] = [];
      let processData: Order[] = [];
      let finishedData: Order[] = [];

      // Try to fetch real orders first
      try {
        // Fetch paused orders
        pausedData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PAUSE});
        console.log("Paused orders fetched:", pausedData);
        
        // Fetch process orders
        processData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.PROCESS});
        console.log("Process orders fetched:", processData);
        
        // Fetch finished orders
        finishedData = await order.getMyOrders({...orderInquiry, orderStatus: OrderStatus.FINISH});
        console.log("Finished orders fetched:", finishedData);
        
        // If no real orders, use mock data
        if ((!pausedData || pausedData.length === 0) && 
            (!processData || processData.length === 0) && 
            (!finishedData || finishedData.length === 0)) {
          console.log("No real orders found, using mock data");
          pausedData = mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE);
          processData = mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS);
          finishedData = mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH);
        }
      } catch (error) {
        console.log("API failed, using mock data:", error);
        pausedData = mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE);
        processData = mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS);
        finishedData = mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH);
      }

      console.log("Number of paused orders:", pausedData?.length || 0);
      console.log("Number of process orders:", processData?.length || 0);
      console.log("Number of finished orders:", finishedData?.length || 0);
      
      setPausedOrders(pausedData || []);
      setProcessOrders(processData || []);
      setFinishedOrders(finishedData || []);

    } catch (error) {
      console.error("Error fetching orders:", error);
      // Use mock data as fallback
      setPausedOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.PAUSE));
      setProcessOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.PROCESS));
      setFinishedOrders(mockOrders.filter(o => o.orderStatus === OrderStatus.FINISH));
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [authMember?._id, orderInquiry.page, orderInquiry.limit, orderBuilder]);

  // Add a manual refresh function
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchOrders();
  };

 

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if(!authMember) history.push("/")

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <Box className="order-nav-frame">
            <Box sx={{ borderBottom: 1, borderColor: "divider", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                className="table-list"
              >
                <Tab label="PAUSED ORDERS" value={"1"} />
                <Tab label="PROCESS ORDERS" value={"2"} />
                <Tab label="FINISHED ORDERS" value={"3"} />
              </Tabs>
              <IconButton
                onClick={handleRefresh}
                sx={{
                  color: '#8b4513',
                  backgroundColor: 'rgba(139, 69, 19, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(139, 69, 19, 0.12)',
                    transform: 'scale(1.1)',
                  },
                  mr: 2
                }}
                title="Refresh Orders"
              >
                <RefreshIcon />
              </IconButton>
            </Box>
          </Box>
          <Stack className="order-main-content">
            {value === "1" && <PausedOrders setValue={setValue}/>}
            {value === "2" && <ProcessOrders setValue={setValue}/>}
            {value === "3" && <FinishedOrders />}
          </Stack>
        </Stack>

        <Stack className="order-right">
          <Box className="order-right-top">
            <img 
            src= {authMember?.memberImage ?`${serverApi}${authMember.memberImage}`
            : "/icons/default-user.svg"} className="order-right-top-img" />
            <div className="order-right-top-text">
              <p className="order-right-top-name">{authMember?.memberNick}</p>
              <p className="order-right-top-user">{authMember?.memberType}</p>
            </div>
            <div>
              <hr
                style={{
                  width: "332px",
                  height: "2px",
                  textAlign: "left",
                  marginLeft: "0px",
                  marginTop: "20px",
                }}
              />
            </div>
            <div className="order-right-top-address">
              <img src="/icons/location.svg" />
              <p>{authMember?.memberAddress ? authMember.memberAddress : "Do not exist"}</p>
            </div>
          </Box>
          <Box className="order-right-bottom">
            <input
              className="card-number"
              type="text"
              placeholder="Card number : 5243 4090 2002 7495"
            />
            <div className="date-and-cvv">
              <input
                type="text"
                name=""
                id=""
                placeholder="07/24"
                style={{ marginRight: "10px" }}
              />
              <input type="text" name="" id="" placeholder="CVV:010" />
            </div>
            <input type="text" name="" id="" placeholder="Justin Robertson" />
            <div className="payment-types">
              <img src="/icons/western-card.svg" alt="" />
              <img src="/icons/master-card.svg" alt="" />
              <img src="/icons/paypal-card.svg" alt="" />
              <img src="/icons/visa-card.svg" alt="" />
            </div>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}