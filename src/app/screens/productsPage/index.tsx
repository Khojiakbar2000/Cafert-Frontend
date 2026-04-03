import React from "react";
import { Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Coffees from "../coffeesPage/Coffees";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import {
  StitchPageShell,
  StitchKineticProductsHero,
} from "../../../components/stitchUi";

/** Shop content width — use most of large monitors so cards can scale up */
const SHOP_MAIN_MAX_PX = 1920;

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
  const { onAdd } = props;
  const { pathname } = useLocation();
  const { isDarkMode } = useCoffeeTheme();
  const isProductDetail = /^\/products\/[^/]+$/.test(pathname);

  if (isProductDetail) {
    return <ChosenProduct onAdd={onAdd} />;
  }

  return (
    <StitchPageShell isDarkMode={isDarkMode}>
      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          flex: "1 1 auto",
          alignSelf: "stretch",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
          py: { xs: 1.5, md: 2 },
        }}
      >
        <StitchKineticProductsHero isDarkMode={isDarkMode} />
        <Box
          id="shop"
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", md: `${SHOP_MAIN_MAX_PX}px` },
            mx: "auto",
            px: { xs: 2, sm: 2.5, md: 3, lg: 3 },
            boxSizing: "border-box",
            scrollMarginTop: { xs: "6rem", md: "7rem" },
          }}
        >
          <Coffees onAdd={onAdd} stitchShop />
        </Box>
      </Box>
    </StitchPageShell>
  );
}
