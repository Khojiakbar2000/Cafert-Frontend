// @ts-nocheck
import React from "react";
import { Provider } from "react-redux";
import { store } from "../../app/store";
import CoffeeHomePage from "../screens/CoffeeHomePage";

/**
 * Demo component to test the new coffee shop HomePage in isolation
 * This does not affect the original app or its dependencies
 */
export default function CoffeeHomeDemo() {
  return (
    <Provider store={store}>
      <CoffeeHomePage />
    </Provider>
  );
} 