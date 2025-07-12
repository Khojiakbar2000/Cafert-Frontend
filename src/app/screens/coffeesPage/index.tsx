// @ts-nocheck
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Coffees from "./Coffees";
import ChosenCoffee from "./ChosenCoffee";
import { CartItem } from "../../../lib/types/search";
import VerticalMovingBasket from "../../../mui-coffee/components/VerticalMovingBasket";
import "../../../css/coffees.css";

// Simple placeholder component for testing
const SimpleChosenCoffee = ({ onAdd }: { onAdd: (item: CartItem) => void }) => (
  <div>
    <h1>Coffee Details</h1>
    <p>This is a simple coffee details component</p>
  </div>
);

interface CoffeesPageProps {
  onAdd: (item: CartItem) => void;
}

export default function CoffeesPage(props: CoffeesPageProps) {
  const { onAdd } = props;
  const coffees = useRouteMatch();

  return (
    <div className="coffees-page">
      <VerticalMovingBasket itemCount={3} />
      <Switch>
        <Route path={`${coffees.path}/:coffeeId`}>
          <ChosenCoffee onAdd={onAdd} />
        </Route>
        <Route path={`${coffees.path}`}>
          <Coffees onAdd={onAdd} />
        </Route>
      </Switch>
    </div>
  );
} 