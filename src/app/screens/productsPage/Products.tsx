import React, { ChangeEvent, useEffect, useState, } from "react";
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
import { Product, ProductInquiry } from "../../../lib/types/product";
import {retrieveProducts} from "./selector";
import ProductService from "../../services/ProductService";
import { ProductCollection, ProductSize } from "../../../lib/enums/product.enum";
import { serverApi } from "../../../lib/config";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";







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

interface ProductsProps {
  onAdd: (item: CartItem)=> void
}

export default function Products(props:ProductsProps) {
  const {onAdd} = props;
  
  const dispatch = useDispatch();
  const { setProducts } = actionDispatch(dispatch);
  //const {setProducts} = actionDispatch(useDispatch)
  const {products} = useSelector(productsRetriever)
  const [productSearch, setProductSearch] = useState<ProductInquiry>({
    page: 1,
    limit:8,
    order: "createdAt",
    productCollection: ProductCollection.DISH,
    search: "",})

   const [searchText, setSearchText] = useState<string>("")
   const history = useHistory()
  useEffect(()=>{
    const product = new ProductService();
    product.getProducts(productSearch).then((data) =>setProducts(data) ).catch(
     (err)=>console.log(err)
    );
    }, [productSearch]);

    useEffect (()=>{
     if(searchText === ""){
      productSearch.search = ""
      setProductSearch({...productSearch})
     }
    }, [searchText])

    /** HANDLERS SECTION */

    const searchCollectionHandler = (collection: ProductCollection) => {
     productSearch.page = 1;
     productSearch.productCollection = collection
     setProductSearch({...productSearch});
    };

    const searchOrderHandler = (order: string) =>{
      productSearch.page = 1;
      productSearch.order = order;
      setProductSearch({...productSearch});
    }

    const searchProductHandler = () =>{
      productSearch.search = searchText;
      setProductSearch({...productSearch});
    }

    const paginationHandler = (e: ChangeEvent<any>, value: number) =>{
     productSearch.page = value;
     setProductSearch({...productSearch});
    }

    
    const chooseDishHandler = (id: string) => {
      history.push(`/products/${id}`);
    };
    


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
  
              <Stack className="single-search-big-box">
                <input
                  type="search"
                  className="single-search-input"
                  name="singleResearch"
                  placeholder="Type here"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if(e.key === "Enter") searchProductHandler();
                  }}
                />
                <Button
                  className="single-button-search"
                  variant="contained"
                  endIcon={<SearchIcon />}
                  onClick={searchProductHandler}
                >
                  Search
                </Button>
              </Stack>
            </Stack>
          <Stack className="dishes-filter-section" sx={{ display: "flex" }}>
            <Stack className="dishes-filter-box">
              <Button
                variant={"contained"}
                className={"order"}
                color={productSearch.order === "createdAt" ? "primary": "secondary"}
                onClick={()=>searchOrderHandler("createdAt")}
              >
                New
              </Button>
              <Button
                variant={"contained"}
                className={"order"}
                color={productSearch.order === "productPrice" ? "primary": "secondary"}
                onClick={()=>searchOrderHandler("productPrice")}
              >
                Price
              </Button>
              <Button
                variant={"contained"}
                className={"order"}
                color={productSearch.order === "productViews" ? "primary": "secondary"}
                onClick={()=>searchOrderHandler("productViews")}
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
                <Button 
                variant={"contained"} 
                color={
                  productSearch.productCollection === ProductCollection.OTHER
                  ? "primary" 
                  : "secondary"
                }

                onClick={()=>searchCollectionHandler(ProductCollection.OTHER)}>
                  Other
                </Button>

                <Button variant={"contained"}    color={
                  productSearch.productCollection === ProductCollection.DESSERT
                  ? "primary" 
                  : "secondary"
                }
                onClick={()=>searchCollectionHandler(ProductCollection.DESSERT)}>
                  Dessert
                </Button>

                <Button variant="contained" 
                   color={
                    productSearch.productCollection === ProductCollection.DRINK
                    ? "primary" 
                    : "secondary"
                  }
                onClick={()=>searchCollectionHandler(ProductCollection.DRINK)}>
                  Drink
                </Button>

                <Button variant="contained" 
                   color={
                    productSearch.productCollection === ProductCollection.SALAD
                    ? "primary" 
                    : "secondary"
                  }
                onClick={()=>searchCollectionHandler(ProductCollection.SALAD)}>
                 Salad
                </Button>

                <Button variant="contained" 
                color={
                  productSearch.productCollection === ProductCollection.DISH 
                  ? "primary" 
                  : "secondary"
                }
                onClick={()=>searchCollectionHandler(ProductCollection.DISH)}>
                  Dish
                </Button>
              </div>
            </Stack>
            <Stack className="product-wrapper">
              {products.length !== 0 ? (
                products.map((product: Product) => {
                  const imagePAth=`${serverApi}${product.productImages[0]}`
                  const sizeVolume = product.productCollection === ProductCollection.DRINK ? product.productVolume + "litre" :product.productSize + "size"
                  return (
                    <Stack key={product._id} className="product-card" onClick={()=> chooseDishHandler(product._id)}>
                      <Stack
                        className="product-img"
                        sx={{ backgroundImage: `url(${imagePAth})` }}
                      >
                        <div className="product-sale">{sizeVolume}</div>
                        <Button className="shop-btn"
                        onClick = {(e)=>{
                          console.log("BUTTON PRESSED")
                          onAdd({
                            _id: product._id,
                            quantity:1,
                            name: product.productName,
                            price: product.productPrice,
                            image: product.productImages[0]
                          });
                         e.stopPropagation()
                        }}
                        >
                          <img
                            src={"icons/shopping-cart.svg"}
                            style={{ display: "flex" }}
                          />
                        </Button>
                        <Button className="view-btn" sx={{ right: "36px" }}>
                          <Badge badgeContent={product.productViews} color="secondary">
                            <RemoveRedEyeIcon
                              sx={{ color: product.productViews === 0 ? "gray" : "white" }}
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
                          {product.productPrice}
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
              count={products.length !== 0 ? productSearch.page + 1 : productSearch.page }
              page={productSearch.page}
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
              onChange={paginationHandler}
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
