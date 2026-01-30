import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import reduxLogger from "redux-logger";
import ProductsPageReducer from "./screens/productsPage/slice";
import OrdersPageReducer from "./screens/ordersPage/slice";

const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware();
    if (isDevelopment) {
      //@ts-ignore
      return middleware.concat(reduxLogger);
    }
    return middleware;
  },
  reducer: {
    productsPage: ProductsPageReducer,
    ordersPage: OrdersPageReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
