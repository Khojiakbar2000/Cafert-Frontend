import { useState, SyntheticEvent } from "react";
import { Container, Stack, Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import LocationOnICon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import {useDispatch} from "react-redux";
import {Dispatch} from "@reduxjs/toolkit";
import {setPausedOrders, setProcessOrders, setFinishedOrders} from "./slice";
import "../../../css/order.css";
import { Order } from "../../../lib/types/order";



/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch)=>({
  setPausedOrders: (data: Order[])=>
      dispatch(setPausedOrders(data)),
  setProcessOrders:(data:Order[])=>dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data))
});

export default function OrdersPage() {
  const {setPausedOrders,setProcessOrders,setFinishedOrders  } = actionDispatch(useDispatch())
  const [value, setValue] = useState("1");

  /** HANDLERS **/

  const handleChange = (e: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack classNameorder-left>
          <TabContext value={value}>
            <Box className="order-nav-frame">
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic eabs example"
                  className="table-list"
                >
                  <Tab label="PAUSED ORDERS" value={"1"} />
                  <Tab label="PROCESS ORDERS" value={"2"} />
                  <Tab label="FINISHED ORDERS" value={"3"} />
                </Tabs>
              </Box>
            </Box>
            <Stack className="order-main-content">
              <PausedOrders />
              <ProcessOrders />
              <FinishedOrders />
            </Stack>
          </TabContext>
        </Stack>

        <Stack className="order-right">
          <Box className="order-right-top">
            <img src="/img/martin.webp" className="order-right-top-img" />
            <div className="order-right-top-text">
              <p className="order-right-top-name">Justin</p>
              <p className="order-right-top-user">USER</p>
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
              <p>South Korea, Busan</p>
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