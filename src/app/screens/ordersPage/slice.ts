import {createSlice} from "@reduxjs/toolkit"
import {  OrdersPageState } from "../../../lib/types/screen"
import { Order } from "../../../lib/types/order"

// Utility function to serialize Date objects to ISO strings
const serializeDate = (date: any): string => {
  if (!date) return '';
  if (date instanceof Date) {
    return date.toISOString();
  }
  if (typeof date === 'string') {
    // If it's already a string, validate it's a valid date string
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? date : parsed.toISOString();
  }
  // Try to convert to Date and then to ISO string
  try {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? String(date) : parsed.toISOString();
  } catch {
    return String(date);
  }
};

const serializeOrder = (order: any): Order => {
  if (!order) return order;
  
  return {
    ...order,
    createdAt: serializeDate(order.createdAt),
    updatedAt: serializeDate(order.updatedAt),
    orderItems: order.orderItems?.map((item: any) => ({
      ...item,
      createdAt: serializeDate(item.createdAt),
      updatedAt: serializeDate(item.updatedAt),
    })) || [],
  };
};

const serializeOrders = (orders: any[]): Order[] => {
  if (!Array.isArray(orders)) return [];
  return orders.map(serializeOrder);
};

const initialState: OrdersPageState = {
    pausedOrders: [],
    processOrders: [],
    finishedOrders: [],
}

const OrdersPageSlice = createSlice({
    name: "ordersPage",
    initialState,
    reducers:{
        setPausedOrders: (state, action) => {
         state.pausedOrders = serializeOrders(action.payload || []);
        },
        setProcessOrders: (state, action) => {
            state.processOrders = serializeOrders(action.payload || []);
           },
           setFinishedOrders: (state, action) => {
            state.finishedOrders = serializeOrders(action.payload || []);
           },
           clearAllOrders: (state) => {
            state.pausedOrders = [];
            state.processOrders = [];
            state.finishedOrders = [];
           },
    },
})

export const {setPausedOrders, setProcessOrders, setFinishedOrders, clearAllOrders} = OrdersPageSlice.actions

const OrdersPageReducer = OrdersPageSlice.reducer;
export default OrdersPageReducer;