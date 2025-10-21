// @ts-nocheck
import React from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Coffees from "./Coffees";
import ChosenCoffee from "./ChosenCoffee";
import { CartItem } from "../../../lib/types/search";

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
  defaultCategory?: 'all' | 'drinks' | 'desserts' | 'salads' | 'dishes' | 'other';
}

export default function CoffeesPage(props: CoffeesPageProps) {
  const { onAdd, defaultCategory } = props;
  const coffees = useRouteMatch();

  return (
    <div className="coffees-page">
      
      <Switch>
        <Route path={`${coffees.path}/:coffeeId`}>
          <ChosenCoffee onAdd={onAdd} />
        </Route>
        <Route path={`${coffees.path}`}>
          <Coffees onAdd={onAdd} defaultCategory={defaultCategory} />
        </Route>
      </Switch>
    </div>
  );
} 