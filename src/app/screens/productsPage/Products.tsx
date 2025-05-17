import React from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Margin, Rowing } from "@mui/icons-material";
import {Dispatch} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {setProducts} from "./slice";
import {createSelector} from "reselect";
import { Product } from "../../../lib/types/product";
import {retrieveProducts} from "./selector";




/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch)=>({
  setProducts: (data: Product[])=>
        dispatch(setProducts(data)),
});

/** REDUX SLICE & SELECTOR */
const productsRetriever = createSelector(
  retrieveProducts,
  (products)=> ({products,})
) 

const products = [
  { productName: "Cutlet", imagePAth: "/img/cutlet.webp" },
  { productName: "Kebab", imagePAth: "/img/kebab-fresh.webp" },
  { productName: "Kebab", imagePAth: "/img/kebab.webp" },
  { productName: "Lavash", imagePAth: "/img/lavash.webp" },
  { productName: "Lavash", imagePAth: "/img/lavash.webp" },
  { productName: "Cutlet", imagePAth: "/img/cutlet.webp" },
  { productName: "Kebab", imagePAth: "/img/kebab-fresh.webp" },
  { productName: "Kebab", imagePAth: "/img/kebab-fresh.webp" },
];

export default function Products() {
  return (
    <div className="products">
      <Container>
        <Stack flexDirection={"column"} alignItems={"center"}>
          <Stack
            className="avatar-big-box"
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
          >
            <div className="avatar-title">Burak Restaurant</div>
            <div className="avatar-search-box">
              <TextField
                variant="outlined"
                placeholder="Type here"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "transparent",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "transparent",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        endIcon={<SearchIcon />}
                      >
                        Search
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Stack>
          <Stack className="dishes-filter-section" sx={{ display: "flex" }}>
            <Stack className="dishes-filter-box">
              <Button
                variant={"contained"}
                color={"primary"}
                className={"order"}
              >
                New
              </Button>
              <Button
                variant={"contained"}
                color={"secondary"}
                className={"order"}
              >
                Price
              </Button>
              <Button
                variant={"contained"}
                color={"secondary"}
                className={"order"}
              >
                Views
              </Button>
            </Stack>
          </Stack>
          <Stack
            className="list-category-section"
            sx={{
              display: "flex",
              flexDirection: "row",
              marginTop: "41px",
              justifyContent: "flex-end",
              width: "100%",
              height: "auto",
            }}
          >
            <Stack className="product-category" sx={{ marginRight: "10px" }}>
              <div className="category-main">
                <Button variant="contained" color="primary">
                  Dish
                </Button>

                <Button variant="contained" color="secondary">
                  Salad
                </Button>

                <Button variant="contained" color="secondary">
                  Drink
                </Button>

                <Button variant="contained" color="secondary">
                  Dessert
                </Button>

                <Button variant="contained" color="secondary">
                  Other
                </Button>
              </div>
            </Stack>
            <Stack className="product-wrapper">
              {products.length !== 0 ? (
                products.map((product, index) => {
                  return (
                    <Stack key={index} className="product-card">
                      <Stack
                        className="product-img"
                        sx={{ backgroundImage: `url(${product.imagePAth})` }}
                      >
                        <div className="product-sale">Normal size</div>
                        <Button className="shop-btn">
                          <img
                            src={"icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                          />
                        </Button>
                        <Button className="view-btn" sx={{ right: "36px" }}>
                          <Badge badgeContent={20} color="secondary">
                            <RemoveRedEyeIcon
                              sx={{ color: (20 >0) ? "gray" : "white" }}
                            />
                          </Badge>
                        </Button>
                      </Stack>
                      <Box className="product-desc">
                        <span className="product-title">
                          {product.productName}
                        </span>
                        <div className="product-price">
                          <MonetizationOnIcon />
                          {12}
                        </div>
                      </Box>
                    </Stack>
                  );
                })
              ) : (
                <Box className={"no-data"}>Products are not available</Box>
              )}
            </Stack>
          </Stack>
          <Stack className="pagination-section">
            <Pagination
              count={3}
              page={1}
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                  color={"secondary"}
                />
              )}
            />
          </Stack>
        </Stack>
      </Container>

      <div className="brands-logo">
        <Container>
          <Stack className="brand-title">
            <Box className="brand-title-text">Our Family Brands</Box>
          </Stack>
          <Stack className="brand-logos">
            <Box className="logo-box">
              <img
                src="img/gurme.webp"
                style={{ width: "238px", height: "329px" }}
              />
            </Box>

            <Box className="logo-box">
              <img
                src="img/seafood.webp"
                style={{ width: "230px", height: "329px" }}
              />
            </Box>

            <Box className="logo-box">
              <img
                src="img/sweets.webp"
                style={{ width: "238px", height: "329px" }}
              />
            </Box>

            <Box className="logo-box">
              <img
                src="img/doner.webp"
                style={{ width: "238px", height: "329px" }}
              />
            </Box>
          </Stack>
        </Container>
      </div>
      <div className="address">
        <Container>
          <Stack
            className="address-area"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box className="title">Our address</Box>
            <iframe
              style={{ marginTop: "60px" }}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3234.279488067767!2d127.13298197622382!3d35.8421497725358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357023379e824939%3A0xd35dd0a46a73b0f0!2s1549-18%20Geumam-dong%2C%20Deokjin-gu%2C%20Jeonju%2C%20Jeollabuk-do!5e0!3m2!1sen!2skr!4v1720974938245!5m2!1sen!2skr"
              width="1300"
              height="500"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Stack>
        </Container>
      </div>
    </div>
  );
}