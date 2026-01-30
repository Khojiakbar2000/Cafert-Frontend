import React from "react";
import { Container, Box } from "@mui/material";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Coffees from "../coffeesPage/Coffees";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";

interface ProductsPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage(props: ProductsPageProps) {
  const { onAdd } = props;
  const products = useRouteMatch();
  const { isDarkMode } = useCoffeeTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDarkMode ? '#0a0a0a' : '#fafafa',
        // Simplified static background instead of animated gradient
        background: isDarkMode
          ? 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)'
          : 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // Reduced to single gradient for better performance
          background: isDarkMode
            ? 'radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 30%, rgba(139, 69, 19, 0.06) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
          willChange: 'opacity',
        },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          overflowX: "hidden",
          paddingTop: { xs: "2.5rem", sm: "3rem", md: "4rem", lg: "5rem" },
          paddingBottom: { xs: "3.5rem", sm: "4.5rem", md: "6rem", lg: "7rem" },
          paddingLeft: { xs: "1.25rem", sm: "2rem", md: "2.5rem" },
          paddingRight: { xs: "1.25rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            borderRadius: { xs: '0', md: '24px' },
            backgroundColor: isDarkMode
              ? 'rgba(26, 26, 26, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            // Reduced blur for better performance
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: isDarkMode
              ? '0 4px 16px rgba(0, 0, 0, 0.4)'
              : '0 4px 16px rgba(0, 0, 0, 0.08)',
            padding: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '3rem' },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: isDarkMode
                ? 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 50%, transparent 100%)'
                : 'linear-gradient(90deg, transparent 0%, rgba(139, 69, 19, 0.5) 50%, transparent 100%)',
              borderRadius: '24px 24px 0 0',
              zIndex: 0,
            },
          }}
        >
          <div className="products-page">
            <Switch>
              <Route path={`${products.path}/:productId`}>
                <ChosenProduct onAdd={onAdd} />
              </Route>
              <Route path={`${products.path}`}>
                <Coffees onAdd={onAdd} />
              </Route>
            </Switch>
          </div>
        </Box>
      </Container>
    </Box>
  );
}
