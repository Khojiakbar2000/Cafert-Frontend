import React, {
  useEffect,
  useMemo,
  useState,
  Suspense,
} from "react";

import {
  Container,
  Stack,
  Box,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  ListItemText,
  IconButton,
  Tabs,
  Tab,
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton,
  CircularProgress,
} from "@mui/material";

import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCart as AddShoppingCartIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  LocalCafe as LocalCafeIcon,
  RestaurantMenu as RestaurantMenuIcon,
  EmojiFoodBeverage as EmojiFoodBeverageIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import ProductService from "../../services/ProductService";
import { serverApi } from "../../../lib/config";
import { useSelector } from "react-redux";
import { retrieveProducts } from "./selector";


// Lazy loaded components
const AwardsStrip = React.lazy(
  () => import("../../../mui-coffee/components/AwardsStrip")
);


// ============================================================
// TYPES
// ============================================================

interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category:
    | "drinks"
    | "desserts"
    | "salads"
    | "dishes"
    | "other";
  origin: string;
  roast: string;
  rating: number;
  reviews: number;
  views: number;
  isNew: boolean;
  inStock: boolean;
  isFavorite: boolean;
  preparationTime: string;
  calories: number;
  ingredients: string[];
}

interface ProductsProps {
  onAdd: (item: CartItem) => void;
  defaultCategory?:
    | "all"
    | "drinks"
    | "desserts"
    | "salads"
    | "dishes"
    | "other";
}


// ============================================================
// LOADING CARD
// ============================================================

const CardSkeleton = () => (
  <Card
    sx={{
      height: "100%",
      borderRadius: "18px",
      overflow: "hidden",
    }}
  >
    <Skeleton
      variant="rectangular"
      sx={{
        width: "100%",
        height: 220,
      }}
    />

    <CardContent sx={{ p: 2 }}>
      <Skeleton variant="text" width="70%" height={28} />
      <Skeleton variant="text" width="35%" height={24} />
      <Skeleton variant="text" width="100%" height={20} />
      <Skeleton variant="text" width="80%" height={20} />

      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={38} />
      </Box>
    </CardContent>
  </Card>
);


// ============================================================
// GRID SKELETON
// ============================================================

const GridSkeleton = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        md: "repeat(3, 1fr)",
        lg: "repeat(4, 1fr)",
      },
      gap: {
        xs: 2,
        md: 2.5,
      },
    }}
  >
    {Array.from({ length: 8 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </Box>
);


// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Products(props: ProductsProps) {
  const {
    onAdd,
    defaultCategory = "all",
  } = props;

  const history = useHistory();

  const theme = useTheme();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const {
    colors,
    isDarkMode,
  } = useCoffeeTheme();

  const { t } = useTranslation();

  const reduxProducts = useSelector(retrieveProducts);

  // ==========================================================
  // STATE
  // ==========================================================

  const [loading, setLoading] = useState(true);

  const [productsList, setProductsList] =
    useState<ProductItem[]>([]);

  const [filteredProducts, setFilteredProducts] =
    useState<ProductItem[]>([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(defaultCategory);

  const [sortBy, setSortBy] =
    useState("newest");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [sortAccordionExpanded, setSortAccordionExpanded] =
    useState(false);

  const [orderAccordionExpanded, setOrderAccordionExpanded] =
    useState(false);

  const [favorites, setFavorites] =
    useState<string[]>([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;


  // ==========================================================
  // FETCH PRODUCTS
  // ==========================================================

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const productService =
          new ProductService();

        const products =
          await productService.getProducts({
            page: 1,
            limit: 50,
            order: "createdAt",
            productCollection: undefined,
            search: "",
          });

        const transformedProducts: ProductItem[] =
          products.map((product: any) => {
            const collection =
              product.productCollection?.toLowerCase();

            let category:
              | "drinks"
              | "desserts"
              | "salads"
              | "dishes"
              | "other" = "other";

            if (
              collection === "coffee" ||
              collection === "drink"
            ) {
              category = "drinks";
            } else if (
              collection === "dessert"
            ) {
              category = "desserts";
            } else if (
              collection === "salad"
            ) {
              category = "salads";
            } else if (
              collection === "dish"
            ) {
              category = "dishes";
            }

            return {
              id: product._id,

              name:
                product.productName ||
                "Unnamed Product",

              description:
                product.productDesc ||
                "No description available",

              price:
                Number(product.productPrice) || 0,

              image:
                product.productImages?.[0]
                  ? `${serverApi}${product.productImages[0]}`
                  : "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600",

              category,

              origin: "Local",

              roast: "Medium",

              rating: 4.5,

              reviews:
                Math.floor(
                  Math.random() * 200
                ) + 50,

              views:
                product.productViews ||
                Math.floor(
                  Math.random() * 1000
                ) + 100,

              isNew: false,

              inStock:
                product.productLeftCount > 0,

              isFavorite: false,

              preparationTime: "5 min",

              calories:
                Math.floor(
                  Math.random() * 300
                ) + 50,

              ingredients: [
                "Fresh ingredients",
              ],
            };
          });

        setProductsList(
          transformedProducts
        );

        setFilteredProducts(
          transformedProducts
        );

      } catch (error: any) {
        console.error(
          "Error fetching products:",
          error
        );

        console.error(
          "Error details:",
          error?.response?.data ||
            error?.message
        );

        setProductsList([]);
        setFilteredProducts([]);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  useEffect(() => {
    let filtered = [...productsList];

    if (searchTerm.trim()) {
      const query =
        searchTerm.toLowerCase();

      filtered =
        filtered.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(query) ||
            product.description
              .toLowerCase()
              .includes(query)
        );
    }

    if (
      selectedCategory !== "all"
    ) {
      filtered =
        filtered.filter(
          (product) =>
            product.category ===
            selectedCategory
        );
    }

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "price":
          comparison =
            a.price - b.price;
          break;

        case "views":
          comparison =
            a.views - b.views;
          break;

        case "newest":
        default:
          comparison = 0;
          break;
      }

      return sortOrder === "desc"
        ? -comparison
        : comparison;
    });

    setFilteredProducts(filtered);

    setCurrentPage(1);
  }, [
    productsList,
    searchTerm,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);


  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.ceil(
    filteredProducts.length /
      itemsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const currentProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + itemsPerPage
    );


  // ==========================================================
  // STATS
  // ==========================================================

  const heroStats = useMemo(() => {
    const totalProducts =
      productsList.length;

    const totalCategories =
      new Set(
        productsList.map(
          (product) =>
            product.category
        )
      ).size;

    const avgRating =
      productsList.length > 0
        ? (
            productsList.reduce(
              (sum, product) =>
                sum + product.rating,
              0
            ) /
            productsList.length
          ).toFixed(1)
        : "4.5";

    const inStockProducts =
      productsList.filter(
        (product) =>
          product.inStock
      ).length;

    return {
      totalProducts,
      totalCategories,
      avgRating,
      inStockProducts,
    };
  }, [productsList]);


  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleExploreProduct =
    (productId: string) => {
      history.push(
        `/products/${productId}`
      );
    };


  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const handleCategoryChange = (
    _event: React.SyntheticEvent,
    newValue:
      | "all"
      | "drinks"
      | "desserts"
      | "salads"
      | "dishes"
      | "other"
  ) => {
    setSelectedCategory(
      newValue
    );
  };


  const toggleFavorite = (
    productId: string
  ) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter(
            (id) =>
              id !== productId
          )
        : [
            ...prev,
            productId,
          ]
    );
  };


  const handleAddToCart = (
    product: ProductItem
  ) => {
    onAdd({
      _id: product.id,
      quantity: 1,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };


  // ==========================================================
  // DATA
  // ==========================================================

  const categories = [
    {
      value: "all",
      label: "All Items",
    },
    {
      value: "drinks",
      label: "Drinks",
    },
    {
      value: "desserts",
      label: "Desserts",
    },
    {
      value: "salads",
      label: "Salads",
    },
    {
      value: "dishes",
      label: "Dishes",
    },
    {
      value: "other",
      label: "Other",
    },
  ];


  const sortOptions = [
    {
      value: "newest",
      label: "Newest",
    },
    {
      value: "price",
      label: "Price",
    },
    {
      value: "views",
      label: "Views",
    },
  ];


  // ==========================================================
  // COLORS
  // ==========================================================

  const pageBackground =
    isDarkMode
      ? "#171412"
      : "#faf8f5";

  const surface =
    isDarkMode
      ? "#211c19"
      : "#ffffff";

  const softSurface =
    isDarkMode
      ? "rgba(255,255,255,0.045)"
      : "rgba(255,255,255,0.78)";

  const border =
    isDarkMode
      ? "rgba(255,255,255,0.08)"
      : "rgba(91,68,54,0.10)";

  const textPrimary =
    isDarkMode
      ? "#ffffff"
      : "#352a25";

  const textSecondary =
    isDarkMode
      ? "rgba(255,255,255,0.68)"
      : "#756a64";

  const accent =
    colors.primary ||
    "#9b7653";


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor:
          pageBackground,
        pb: 8,
      }}
    >

      {/* ======================================================
          MAIN CONTENT CONTAINER
      ====================================================== */}

      <Container
        maxWidth="xl"
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
        }}
      >

        {/* ====================================================
            HERO
        ==================================================== */}

        <Box
          sx={{
            position: "relative",

            width: "100%",

            maxWidth: "1240px",

            mx: "auto",

            minHeight: {
              xs: 430,
              sm: 390,
              md: 400,
            },

            mt: {
              xs: 2,
              md: 3,
            },

            mb: {
              xs: 4,
              md: 5,
            },

            px: {
              xs: 2.5,
              sm: 4,
              md: 5,
            },

            py: {
              xs: 4,
              md: 3.5,
            },

            display: "flex",

            alignItems: "center",

            justifyContent:
              "center",

            textAlign: "center",

            overflow: "hidden",

            borderRadius: {
              xs: "20px",
              md: "26px",
            },

            background:
              isDarkMode
                ? "linear-gradient(135deg, #211b18 0%, #30251f 55%, #211c19 100%)"
                : "linear-gradient(135deg, #f3ebe3 0%, #faf7f3 52%, #eee4da 100%)",

            border:
              `1px solid ${border}`,

            boxShadow:
              isDarkMode
                ? "0 20px 50px rgba(0,0,0,0.22)"
                : "0 20px 50px rgba(76,54,40,0.08)",

            "&::before": {
              content: '""',

              position: "absolute",

              width: {
                xs: 240,
                md: 360,
              },

              height: {
                xs: 240,
                md: 360,
              },

              borderRadius: "50%",

              top: -160,

              right: -100,

              background:
                isDarkMode
                  ? "rgba(179,142,106,0.14)"
                  : "rgba(179,142,106,0.18)",

              filter:
                "blur(70px)",

              pointerEvents:
                "none",
            },

            "&::after": {
              content: '""',

              position: "absolute",

              width: 280,

              height: 280,

              borderRadius: "50%",

              bottom: -170,

              left: -120,

              background:
                "rgba(212,175,55,0.08)",

              filter:
                "blur(65px)",

              pointerEvents:
                "none",
            },
          }}
        >

          {/* HERO CONTENT */}

          <Box
            sx={{
              position:
                "relative",

              zIndex: 2,

              width: "100%",

              maxWidth: "900px",

              mx: "auto",
            }}
          >

            <motion.div
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >

              {/* SMALL ICON */}

              <Box
                sx={{
                  display:
                    "flex",

                  justifyContent:
                    "center",

                  mb: {
                    xs: 1.5,
                    md: 2,
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: 52,
                      md: 62,
                    },

                    height: {
                      xs: 52,
                      md: 62,
                    },

                    borderRadius:
                      "50%",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "center",

                    background:
                      isDarkMode
                        ? "rgba(255,215,0,0.10)"
                        : "rgba(179,142,106,0.12)",

                    border:
                      `1px solid ${
                        isDarkMode
                          ? "rgba(255,215,0,0.20)"
                          : "rgba(179,142,106,0.20)"
                      }`,
                  }}
                >
                  <RestaurantMenuIcon
                    sx={{
                      fontSize: {
                        xs: 27,
                        md: 32,
                      },

                      color: accent,
                    }}
                  />
                </Box>
              </Box>


              {/* TITLE */}

              <Typography
                component="h1"
                sx={{
                  fontFamily:
                    '"Playfair Display", Georgia, serif',

                  fontWeight: 600,

                  fontSize: {
                    xs: "2.4rem",
                    sm: "3rem",
                    md: "3.6rem",
                    lg: "4rem",
                  },

                  lineHeight: 1.05,

                  letterSpacing:
                    "-0.025em",

                  mb: 1.5,

                  color:
                    textPrimary,
                }}
              >
                Our Premium Menu
              </Typography>


              {/* SUBTITLE */}

              <Typography
                sx={{
                  color:
                    textSecondary,

                  maxWidth:
                    "650px",

                  mx: "auto",

                  fontSize: {
                    xs: "0.92rem",
                    sm: "1rem",
                    md: "1.08rem",
                  },

                  lineHeight: 1.6,

                  mb: {
                    xs: 2.5,
                    md: 3,
                  },
                }}
              >
                Discover our carefully
                curated selection of
                artisanal coffee,
                handcrafted beverages,
                and delightful treats.
              </Typography>


              {/* STATS */}

              <Box
                sx={{
                  display: "grid",

                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(4, 1fr)",
                  },

                  gap: {
                    xs: 1,
                    sm: 1.5,
                  },

                  maxWidth:
                    "700px",

                  mx: "auto",

                  mb: {
                    xs: 2.5,
                    md: 3,
                  },
                }}
              >

                {[
                  {
                    label:
                      "Products",

                    value:
                      heroStats.totalProducts,

                    icon:
                      <LocalCafeIcon />,
                  },

                  {
                    label:
                      "Categories",

                    value:
                      heroStats.totalCategories,

                    icon:
                      <RestaurantMenuIcon />,
                  },

                  {
                    label:
                      "Avg Rating",

                    value:
                      heroStats.avgRating,

                    icon:
                      <StarIcon />,
                  },

                  {
                    label:
                      "In Stock",

                    value:
                      heroStats.inStockProducts,

                    icon:
                      <EmojiFoodBeverageIcon />,
                  },
                ].map(
                  (stat, index) => (
                    <motion.div
                      key={
                        stat.label
                      }
                      initial={{
                        opacity: 0,
                        y: 12,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.5,
                        delay:
                          0.2 +
                          index *
                            0.08,
                      }}
                    >

                      <Box
                        sx={{
                          minHeight: {
                            xs: 72,
                            md: 78,
                          },

                          p: {
                            xs: 1,
                            md: 1.25,
                          },

                          display:
                            "flex",

                          flexDirection:
                            "column",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          borderRadius:
                            "14px",

                          background:
                            softSurface,

                          border:
                            `1px solid ${border}`,

                          backdropFilter:
                            "blur(12px)",
                        }}
                      >

                        <Box
                          sx={{
                            color:
                              accent,

                            display:
                              "flex",

                            mb: 0.25,

                            "& svg": {
                              fontSize: {
                                xs: 18,
                                md: 20,
                              },
                            },
                          }}
                        >
                          {
                            stat.icon
                          }
                        </Box>

                        <Typography
                          sx={{
                            fontSize: {
                              xs: "1.1rem",
                              md: "1.3rem",
                            },

                            fontWeight:
                              700,

                            lineHeight:
                              1.1,

                            color:
                              textPrimary,
                          }}
                        >
                          {
                            stat.value
                          }
                        </Typography>

                        <Typography
                          sx={{
                            fontSize:
                              "0.62rem",

                            textTransform:
                              "uppercase",

                            letterSpacing:
                              "0.08em",

                            color:
                              textSecondary,
                          }}
                        >
                          {
                            stat.label
                          }
                        </Typography>

                      </Box>

                    </motion.div>
                  )
                )}

              </Box>


              {/* SEARCH */}

              <TextField
                fullWidth
                value={
                  searchTerm
                }
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
                placeholder={
                  isMobile
                    ? "Search menu..."
                    : "Search for coffee, drinks, desserts..."
                }
                sx={{
                  maxWidth:
                    "600px",

                  "& .MuiOutlinedInput-root":
                    {
                      minHeight: {
                        xs: 48,
                        md: 52,
                      },

                      borderRadius:
                        "14px",

                      background:
                        isDarkMode
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(255,255,255,0.82)",

                      backdropFilter:
                        "blur(12px)",

                      color:
                        textPrimary,

                      "& fieldset":
                        {
                          borderColor:
                            border,
                        },

                      "&:hover fieldset":
                        {
                          borderColor:
                            accent,
                        },

                      "&.Mui-focused fieldset":
                        {
                          borderColor:
                            accent,
                        },
                    },

                  "& input":
                    {
                      fontSize:
                        "0.92rem",
                    },

                  "& input::placeholder":
                    {
                      color:
                        textSecondary,

                      opacity:
                        0.8,
                    },
                }}
                InputProps={{
                  startAdornment:
                    (
                      <InputAdornment position="start">
                        <SearchIcon
                          sx={{
                            color:
                              accent,
                            fontSize:
                              21,
                          }}
                        />
                      </InputAdornment>
                    ),
                }}
              />

            </motion.div>

          </Box>

        </Box>


        {/* ====================================================
            AWARDS
        ==================================================== */}

        <Box
          sx={{
            maxWidth:
              "1240px",

            mx: "auto",

            mb: {
              xs: 4,
              md: 5,
            },
          }}
        >
          <Suspense
            fallback={
              <Box
                sx={{
                  height: 100,
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                <CircularProgress
                  size={24}
                  sx={{
                    color:
                      accent,
                  }}
                />
              </Box>
            }
          >
            <AwardsStrip />
          </Suspense>
        </Box>


        {/* ====================================================
            CATEGORY NAVIGATION
        ==================================================== */}

        <Box
          sx={{
            maxWidth:
              "1240px",

            mx: "auto",

            mb: 2.5,

            borderRadius:
              "16px",

            background:
              softSurface,

            border:
              `1px solid ${border}`,

            overflow:
              "hidden",
          }}
        >

          <Tabs
            value={
              selectedCategory
            }
            onChange={
              handleCategoryChange
            }
            variant="scrollable"
            scrollButtons={
              false
            }
            sx={{
              minHeight:
                54,

              "& .MuiTabs-indicator":
                {
                  display:
                    "none",
                },

              "& .MuiTabs-flexContainer":
                {
                  gap: {
                    xs: 0,
                    md: 0.5,
                  },
                },

              "& .MuiTab-root":
                {
                  minHeight:
                    54,

                  minWidth: {
                    xs: 110,
                    md: 130,
                  },

                  px: {
                    xs: 2,
                    md: 3,
                  },

                  borderRadius:
                    "10px",

                  color:
                    textSecondary,

                  fontSize:
                    "0.82rem",

                  fontWeight:
                    600,

                  textTransform:
                    "none",

                  transition:
                    "all 0.2s ease",

                  "&:hover":
                    {
                      color:
                        textPrimary,

                      background:
                        isDarkMode
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(179,142,106,0.07)",
                    },

                  "&.Mui-selected":
                    {
                      color:
                        isDarkMode
                          ? "#fff"
                          : accent,

                      background:
                        isDarkMode
                          ? "rgba(255,255,255,0.07)"
                          : "rgba(179,142,106,0.10)",
                    },
                },
            }}
          >

            {categories.map(
              (category) => (
                <Tab
                  key={
                    category.value
                  }
                  value={
                    category.value
                  }
                  label={
                    category.label
                  }
                />
              )
            )}

          </Tabs>

        </Box>


        {/* ====================================================
            SORT BAR
        ==================================================== */}

        <Box
          sx={{
            maxWidth:
              "1240px",

            mx: "auto",

            mb: {
              xs: 3,
              md: 4,
            },

            p: {
              xs: 1.5,
              md: 1.75,
            },

            borderRadius:
              "16px",

            background:
              surface,

            border:
              `1px solid ${border}`,

            boxShadow:
              isDarkMode
                ? "none"
                : "0 5px 20px rgba(70,50,40,0.04)",
          }}
        >

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
            alignItems={{
              xs: "stretch",
              sm: "center",
            }}
            justifyContent="space-between"
          >

            {/* LEFT CONTROLS */}

            <Stack
              direction="row"
              spacing={1}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >

              {/* SORT */}

              <Box
                sx={{
                  position:
                    "relative",

                  width: {
                    xs: "50%",
                    sm: 155,
                  },

                  zIndex:
                    sortAccordionExpanded
                      ? 20
                      : 1,
                }}
              >

                <Accordion
                  expanded={
                    sortAccordionExpanded
                  }
                  onChange={(
                    _event,
                    expanded
                  ) =>
                    setSortAccordionExpanded(
                      expanded
                    )
                  }
                  sx={{
                    boxShadow:
                      "none",

                    background:
                      "transparent",

                    border:
                      `1px solid ${border}`,

                    borderRadius:
                      "10px",

                    "&:before":
                      {
                        display:
                          "none",
                      },

                    "&.Mui-expanded":
                      {
                        margin:
                          0,
                      },
                  }}
                >

                  <AccordionSummary
                    expandIcon={
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize:
                            18,
                        }}
                      />
                    }
                    sx={{
                      minHeight:
                        40,

                      px: 1.5,

                      "&.Mui-expanded":
                        {
                          minHeight:
                            40,
                        },

                      "& .MuiAccordionSummary-content":
                        {
                          margin:
                            "0 !important",
                        },
                    }}
                  >

                    <Typography
                      sx={{
                        fontSize:
                          "0.76rem",

                        fontWeight:
                          600,

                        color:
                          textPrimary,

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Sort:{" "}
                      {
                        sortOptions.find(
                          (item) =>
                            item.value ===
                            sortBy
                        )?.label
                      }
                    </Typography>

                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      p: 0,

                      position:
                        "absolute",

                      top:
                        "100%",

                      left: 0,

                      width:
                        "100%",

                      background:
                        surface,

                      border:
                        `1px solid ${border}`,

                      borderRadius:
                        "0 0 10px 10px",

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.12)",

                      zIndex: 30,
                    }}
                  >

                    {sortOptions.map(
                      (option) => (
                        <ListItemButton
                          key={
                            option.value
                          }
                          selected={
                            sortBy ===
                            option.value
                          }
                          onClick={() => {
                            setSortBy(
                              option.value
                            );

                            setSortAccordionExpanded(
                              false
                            );
                          }}
                          sx={{
                            py: 1,

                            px: 1.5,

                            "&.Mui-selected":
                              {
                                background:
                                  isDarkMode
                                    ? "rgba(255,255,255,0.07)"
                                    : "rgba(179,142,106,0.10)",
                              },
                          }}
                        >

                          <ListItemText
                            primary={
                              option.label
                            }
                            primaryTypographyProps={{
                              fontSize:
                                "0.78rem",
                            }}
                          />

                        </ListItemButton>
                      )
                    )}

                  </AccordionDetails>

                </Accordion>

              </Box>


              {/* ORDER */}

              <Box
                sx={{
                  position:
                    "relative",

                  width: {
                    xs: "50%",
                    sm: 155,
                  },

                  zIndex:
                    orderAccordionExpanded
                      ? 20
                      : 1,
                }}
              >

                <Accordion
                  expanded={
                    orderAccordionExpanded
                  }
                  onChange={(
                    _event,
                    expanded
                  ) =>
                    setOrderAccordionExpanded(
                      expanded
                    )
                  }
                  sx={{
                    boxShadow:
                      "none",

                    background:
                      "transparent",

                    border:
                      `1px solid ${border}`,

                    borderRadius:
                      "10px",

                    "&:before":
                      {
                        display:
                          "none",
                      },

                    "&.Mui-expanded":
                      {
                        margin:
                          0,
                      },
                  }}
                >

                  <AccordionSummary
                    expandIcon={
                      <KeyboardArrowDownIcon
                        sx={{
                          fontSize:
                            18,
                        }}
                      />
                    }
                    sx={{
                      minHeight:
                        40,

                      px: 1.5,

                      "&.Mui-expanded":
                        {
                          minHeight:
                            40,
                        },

                      "& .MuiAccordionSummary-content":
                        {
                          margin:
                            "0 !important",
                        },
                    }}
                  >

                    <Typography
                      sx={{
                        fontSize:
                          "0.76rem",

                        fontWeight:
                          600,

                        color:
                          textPrimary,

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      Order:{" "}
                      {
                        sortOrder ===
                        "desc"
                          ? "Descending"
                          : "Ascending"
                      }
                    </Typography>

                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      p: 0,

                      position:
                        "absolute",

                      top:
                        "100%",

                      left: 0,

                      width:
                        "100%",

                      background:
                        surface,

                      border:
                        `1px solid ${border}`,

                      borderRadius:
                        "0 0 10px 10px",

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.12)",

                      zIndex: 30,
                    }}
                  >

                    {[
                      {
                        value:
                          "desc",

                        label:
                          "Descending",
                      },

                      {
                        value:
                          "asc",

                        label:
                          "Ascending",
                      },
                    ].map(
                      (option) => (
                        <ListItemButton
                          key={
                            option.value
                          }
                          selected={
                            sortOrder ===
                            option.value
                          }
                          onClick={() => {
                            setSortOrder(
                              option.value
                            );

                            setOrderAccordionExpanded(
                              false
                            );
                          }}
                          sx={{
                            py: 1,

                            px: 1.5,
                          }}
                        >

                          <ListItemText
                            primary={
                              option.label
                            }
                            primaryTypographyProps={{
                              fontSize:
                                "0.78rem",
                            }}
                          />

                        </ListItemButton>
                      )
                    )}

                  </AccordionDetails>

                </Accordion>

              </Box>

            </Stack>


            {/* RESULT COUNT */}

            <Chip
              label={`Showing ${
                filteredProducts.length ===
                0
                  ? 0
                  : startIndex + 1
              }-${
                Math.min(
                  startIndex +
                    currentProducts.length,
                  filteredProducts.length
                )
              } of ${
                filteredProducts.length
              } items`}
              sx={{
                alignSelf: {
                  xs: "flex-start",
                  sm: "center",
                },

                height: 34,

                borderRadius:
                  "9px",

                background:
                  isDarkMode
                    ? "rgba(255,255,255,0.05)"
                    : "#f7f4f0",

                color:
                  textSecondary,

                border:
                  `1px solid ${border}`,

                fontSize:
                  "0.72rem",

                fontWeight:
                  500,
              }}
            />

          </Stack>

        </Box>


        {/* ====================================================
            PRODUCTS
        ==================================================== */}

        {loading ? (
          <Box
            sx={{
              maxWidth:
                "1240px",

              mx: "auto",
            }}
          >
            <GridSkeleton />
          </Box>
        ) : currentProducts.length ===
          0 ? (

          <Box
            sx={{
              maxWidth:
                "1240px",

              mx: "auto",

              textAlign:
                "center",

              py: 10,
            }}
          >

            <LocalCafeIcon
              sx={{
                fontSize: 55,
                color:
                  accent,
                mb: 2,
                opacity: 0.7,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight:
                  600,

                color:
                  textPrimary,

                mb: 1,
              }}
            >
              No products found
            </Typography>

            <Typography
              sx={{
                color:
                  textSecondary,
              }}
            >
              Try adjusting your
              search or filter
              criteria.
            </Typography>

          </Box>

        ) : (

          <Box
            sx={{
              maxWidth:
                "1240px",

              mx: "auto",

              display: "grid",

              gridTemplateColumns:
                {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },

              gap: {
                xs: 2,
                sm: 2.25,
                md: 2.5,
              },
            }}
          >

            <AnimatePresence mode="popLayout">

              {currentProducts.map(
                (product, index) => (

                  <motion.div
                    key={
                      product.id
                    }

                    initial={{
                      opacity: 0,
                      y: 20,
                    }}

                    animate={{
                      opacity: 1,
                      y: 0,
                    }}

                    exit={{
                      opacity: 0,
                      y: -10,
                    }}

                    transition={{
                      duration: 0.3,
                      delay:
                        index *
                        0.04,
                    }}

                    style={{
                      height:
                        "100%",
                    }}
                  >

                    <Card
                      sx={{
                        height:
                          "100%",

                        minHeight:
                          380,

                        display:
                          "flex",

                        flexDirection:
                          "column",

                        overflow:
                          "hidden",

                        borderRadius:
                          "18px",

                        background:
                          surface,

                        border:
                          `1px solid ${border}`,

                        boxShadow:
                          isDarkMode
                            ? "none"
                            : "0 6px 24px rgba(67,48,38,0.055)",

                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",

                        "&:hover":
                          {
                            transform:
                              "translateY(-5px)",

                            boxShadow:
                              isDarkMode
                                ? "0 15px 35px rgba(0,0,0,0.25)"
                                : "0 15px 35px rgba(67,48,38,0.12)",
                          },
                      }}
                    >

                      {/* PRODUCT IMAGE */}

                      <Box
                        sx={{
                          position:
                            "relative",

                          width:
                            "100%",

                          height: {
                            xs: 210,
                            sm: 190,
                            md: 195,
                          },

                          overflow:
                            "hidden",

                          background:
                            isDarkMode
                              ? "#29221e"
                              : "#f2ede8",
                        }}
                      >

                        <Box
                          component="img"
                          src={
                            product.image
                          }
                          alt={
                            product.name
                          }

                          onClick={() =>
                            handleExploreProduct(
                              product.id
                            )
                          }

                          sx={{
                            width:
                              "100%",

                            height:
                              "100%",

                            objectFit:
                              "cover",

                            display:
                              "block",

                            cursor:
                              "pointer",

                            transition:
                              "transform 0.45s ease",

                            "&:hover":
                              {
                                transform:
                                  "scale(1.045)",
                              },
                          }}
                        />


                        {/* IMAGE GRADIENT */}

                        <Box
                          sx={{
                            position:
                              "absolute",

                            inset: 0,

                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.03), transparent 55%, rgba(0,0,0,0.12))",

                            pointerEvents:
                              "none",
                          }}
                        />


                        {/* BADGES */}

                        <Box
                          sx={{
                            position:
                              "absolute",

                            top: 10,

                            left: 10,

                            display:
                              "flex",

                            gap: 0.7,

                            zIndex: 2,
                          }}
                        >

                          {product.isNew && (
                            <Chip
                              label="New"
                              size="small"
                              sx={{
                                height: 25,

                                borderRadius:
                                  "7px",

                                background:
                                  accent,

                                color:
                                  "#fff",

                                fontSize:
                                  "0.68rem",

                                fontWeight:
                                  600,
                              }}
                            />
                          )}

                          {!product.inStock && (
                            <Chip
                              label="Out of Stock"
                              size="small"
                              sx={{
                                height: 25,

                                borderRadius:
                                  "7px",

                                background:
                                  "#b44",

                                color:
                                  "#fff",

                                fontSize:
                                  "0.65rem",
                              }}
                            />
                          )}

                        </Box>


                        {/* FAVORITE */}

                        <IconButton
                          onClick={() =>
                            toggleFavorite(
                              product.id
                            )
                          }

                          sx={{
                            position:
                              "absolute",

                            top: 10,

                            right: 10,

                            width: 34,

                            height: 34,

                            zIndex: 3,

                            background:
                              isDarkMode
                                ? "rgba(30,25,22,0.78)"
                                : "rgba(255,255,255,0.92)",

                            backdropFilter:
                              "blur(8px)",

                            border:
                              `1px solid ${border}`,

                            "&:hover":
                              {
                                background:
                                  isDarkMode
                                    ? "rgba(30,25,22,0.95)"
                                    : "#ffffff",

                                transform:
                                  "scale(1.05)",
                              },
                          }}
                        >

                          {favorites.includes(
                            product.id
                          ) ? (
                            <FavoriteIcon
                              sx={{
                                fontSize:
                                  18,

                                color:
                                  "#c95c5c",
                              }}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              sx={{
                                fontSize:
                                  18,

                                color:
                                  textSecondary,
                              }}
                            />
                          )}

                        </IconButton>

                      </Box>


                      {/* PRODUCT CONTENT */}

                      <CardContent
                        sx={{
                          flexGrow: 1,

                          display:
                            "flex",

                          flexDirection:
                            "column",

                          p: 2,

                          "&:last-child":
                            {
                              pb: 2,
                            },
                        }}
                      >

                        {/* TITLE + PRICE */}

                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "flex-start",

                            justifyContent:
                              "space-between",

                            gap: 1,

                            mb: 0.6,
                          }}
                        >

                          <Typography
                            component="h3"
                            onClick={() =>
                              handleExploreProduct(
                                product.id
                              )
                            }

                            sx={{
                              flex: 1,

                              fontSize:
                                "0.96rem",

                              lineHeight:
                                1.3,

                              fontWeight:
                                650,

                              color:
                                textPrimary,

                              cursor:
                                "pointer",

                              overflow:
                                "hidden",

                              textOverflow:
                                "ellipsis",

                              whiteSpace:
                                "nowrap",

                              "&:hover":
                                {
                                  color:
                                    accent,
                                },
                            }}
                          >
                            {
                              product.name
                            }
                          </Typography>


                          <Typography
                            sx={{
                              fontSize:
                                "0.9rem",

                              fontWeight:
                                700,

                              color:
                                accent,

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            $
                            {
                              product.price
                            }
                          </Typography>

                        </Box>


                        {/* RATING */}

                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap: 0.5,

                            mb: 1,
                          }}
                        >

                          <StarIcon
                            sx={{
                              fontSize:
                                15,

                              color:
                                "#d5a84a",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize:
                                "0.72rem",

                              fontWeight:
                                600,

                              color:
                                textPrimary,
                            }}
                          >
                            {
                              product.rating
                            }
                          </Typography>

                          <Typography
                            sx={{
                              fontSize:
                                "0.7rem",

                              color:
                                textSecondary,
                            }}
                          >
                            (
                            {
                              product.reviews
                            }
                            )
                          </Typography>

                        </Box>


                        {/* DESCRIPTION */}

                        <Typography
                          sx={{
                            color:
                              textSecondary,

                            fontSize:
                              "0.75rem",

                            lineHeight:
                              1.5,

                            mb: 1.5,

                            display:
                              "-webkit-box",

                            WebkitLineClamp:
                              2,

                            WebkitBoxOrient:
                              "vertical",

                            overflow:
                              "hidden",

                            minHeight:
                              "2.25rem",
                          }}
                        >
                          {
                            product.description
                          }
                        </Typography>


                        {/* META */}

                        <Box
                          sx={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            justifyContent:
                              "space-between",

                            mb: 1.5,
                          }}
                        >

                          <Box
                            sx={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap: 0.4,
                            }}
                          >

                            <VisibilityIcon
                              sx={{
                                fontSize:
                                  14,

                                color:
                                  textSecondary,
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize:
                                  "0.68rem",

                                color:
                                  textSecondary,
                              }}
                            >
                              {
                                product.views
                              }
                            </Typography>

                          </Box>


                          <Box
                            sx={{
                              display:
                                "flex",

                              alignItems:
                                "center",

                              gap: 0.4,
                            }}
                          >

                            <AccessTimeIcon
                              sx={{
                                fontSize:
                                  14,

                                color:
                                  textSecondary,
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize:
                                  "0.68rem",

                                color:
                                  textSecondary,
                              }}
                            >
                              {
                                product.preparationTime
                              }
                            </Typography>

                          </Box>

                        </Box>


                        {/* CART BUTTON */}

                        <Button
                          fullWidth
                          variant="contained"
                          disabled={
                            !product.inStock
                          }

                          startIcon={
                            <AddShoppingCartIcon
                              sx={{
                                fontSize:
                                  16,
                              }}
                            />
                          }

                          onClick={() =>
                            handleAddToCart(
                              product
                            )
                          }

                          sx={{
                            mt: "auto",

                            height: 38,

                            borderRadius:
                              "10px",

                            textTransform:
                              "none",

                            fontSize:
                              "0.78rem",

                            fontWeight:
                              650,

                            background:
                              isDarkMode
                                ? "#9b7653"
                                : "#7d5a45",

                            boxShadow:
                              "none",

                            "&:hover":
                              {
                                background:
                                  isDarkMode
                                    ? "#b18a65"
                                    : "#694937",

                                boxShadow:
                                  "none",
                              },

                            "&.Mui-disabled":
                              {
                                background:
                                  isDarkMode
                                    ? "rgba(255,255,255,0.08)"
                                    : "#eeeae6",

                                color:
                                  textSecondary,
                              },
                          }}
                        >
                          {
                            product.inStock
                              ? "Add to Cart"
                              : "Out of Stock"
                          }
                        </Button>

                      </CardContent>

                    </Card>

                  </motion.div>

                )
              )}

            </AnimatePresence>

          </Box>

        )}


        {/* ====================================================
            PAGINATION
        ==================================================== */}

        {totalPages > 1 && (
          <Box
            sx={{
              display:
                "flex",

              justifyContent:
                "center",

              mt: {
                xs: 4,
                md: 5,
              },
            }}
          >

            <Pagination
              count={
                totalPages
              }

              page={
                currentPage
              }

              onChange={
                handlePageChange
              }

              size={
                isMobile
                  ? "small"
                  : "medium"
              }

              sx={{
                "& .MuiPaginationItem-root":
                  {
                    borderRadius:
                      "9px",

                    color:
                      textSecondary,

                    border:
                      `1px solid ${border}`,
                  },

                "& .Mui-selected":
                  {
                    background:
                      accent,

                    color:
                      "#fff",

                    borderColor:
                      accent,

                    "&:hover":
                      {
                        background:
                          accent,
                      },
                  },
              }}
            />

          </Box>
        )}

      </Container>

    </Box>
  );
}