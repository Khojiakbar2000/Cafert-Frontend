// @ts-nocheck
import React from "react";
import { Container } from "@mui/material";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { log } from "console";
import ChosenProduct from "./ChosenProduct";
import Coffees from "../coffeesPage/Coffees";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";


interface ProductsPageProps {
  onAdd: (item: CartItem)=> void
}

export default function ProductsPage(props:ProductsPageProps ) {
  const {onAdd} = props
  const products = useRouteMatch();
  console.log("products:", products);

  return (
    <div className="products-page">
      
      <Switch>
        <Route path={`${products.path}/:productId`}>
          <ChosenProduct onAdd={onAdd}/>
        </Route>
        <Route path={`${products.path}`}>
          <Coffees onAdd={onAdd} defaultCategory="all"/>
        </Route>
      </Switch>
    </div>
  );
}