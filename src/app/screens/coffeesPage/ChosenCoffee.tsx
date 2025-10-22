// @ts-nocheck
// ChosenCoffee component for individual coffee details
import React, { useState, useEffect } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  Typography,
  Chip,
  Rating,
  TextField,
  Card,
  CardContent,
  Divider,
  IconButton,
  Badge,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useTheme } from "../../../mui-coffee/context/ThemeContext";

// Mock coffee data (same as in Coffees.tsx)
const coffeeData = [
  {
    id: "1",
    name: "Espresso",
    description: "Strong and pure coffee shot",
    longDescription: "A concentrated form of coffee served in small, strong shots. Espresso is made by forcing hot water through finely-ground coffee beans. It's the foundation for many coffee drinks and is known for its rich, bold flavor and creamy texture.",
    price: 3.50,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
    category: "Espresso",
    origin: "Italy",
    roast: "Dark",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isFavorite: false,
    caffeine: "High",
    acidity: "Medium",
    body: "Full",
    flavor: ["Bold", "Rich", "Bitter"],
    ingredients: ["Arabica Coffee Beans", "Water"],
    preparation: "Espresso Machine",
    servingSize: "30ml",
  },
  {
    id: "2",
    name: "Cappuccino",
    description: "Perfect blend of espresso, steamed milk, and foam",
    longDescription: "A classic Italian coffee drink that combines equal parts espresso, steamed milk, and milk foam. The name comes from the Capuchin friars, whose brown robes resembled the color of the drink. It's known for its balanced flavor and creamy texture.",
    price: 4.50,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
    category: "Milk Coffee",
    origin: "Italy",
    roast: "Medium",
    rating: 4.8,
    reviews: 256,
    inStock: true,
    isFavorite: true,
    caffeine: "Medium",
    acidity: "Low",
    body: "Medium",
    flavor: ["Creamy", "Smooth", "Balanced"],
    ingredients: ["Espresso", "Steamed Milk", "Milk Foam"],
    preparation: "Espresso Machine + Milk Steamer",
    servingSize: "150ml",
  },
  {
    id: "3",
    name: "Latte",
    description: "Smooth espresso with steamed milk",
    longDescription: "A coffee drink made with espresso and steamed milk. The name 'latte' comes from the Italian caffè latte, meaning 'milk coffee'. It has a higher ratio of milk to coffee compared to a cappuccino, resulting in a milder, creamier taste.",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=300&fit=crop",
    category: "Milk Coffee",
    origin: "Italy",
    roast: "Medium",
    rating: 4.3,
    reviews: 189,
    inStock: true,
    isFavorite: false,
    caffeine: "Medium",
    acidity: "Low",
    body: "Light",
    flavor: ["Smooth", "Creamy", "Mild"],
    ingredients: ["Espresso", "Steamed Milk"],
    preparation: "Espresso Machine + Milk Steamer",
    servingSize: "240ml",
  },
  {
    id: "4",
    name: "Americano",
    description: "Espresso with hot water",
    longDescription: "A coffee drink prepared by diluting an espresso with hot water, giving it a similar strength to, but different flavor from, traditionally brewed coffee. The name 'Americano' comes from American soldiers in Italy during World War II who found espresso too strong.",
    price: 3.00,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    category: "Black Coffee",
    origin: "USA",
    roast: "Medium",
    rating: 4.2,
    reviews: 95,
    inStock: true,
    isFavorite: false,
    caffeine: "Medium",
    acidity: "Medium",
    body: "Medium",
    flavor: ["Bold", "Clean", "Smooth"],
    ingredients: ["Espresso", "Hot Water"],
    preparation: "Espresso Machine",
    servingSize: "180ml",
  },
  {
    id: "5",
    name: "Mocha",
    description: "Espresso with chocolate and steamed milk",
    longDescription: "A chocolate-flavored variant of a latte. The name comes from the city of Mocha, Yemen, which was a major coffee trading center. It combines the rich flavors of coffee and chocolate, creating a sweet and indulgent drink.",
    price: 5.00,
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop",
    category: "Milk Coffee",
    origin: "Italy",
    roast: "Medium",
    rating: 4.6,
    reviews: 167,
    inStock: true,
    isFavorite: true,
    caffeine: "Medium",
    acidity: "Low",
    body: "Full",
    flavor: ["Chocolate", "Sweet", "Rich"],
    ingredients: ["Espresso", "Chocolate Syrup", "Steamed Milk"],
    preparation: "Espresso Machine + Milk Steamer",
    servingSize: "240ml",
  },
  {
    id: "6",
    name: "Macchiato",
    description: "Espresso with a small amount of steamed milk",
    longDescription: "An espresso coffee drink with a small amount of milk, usually foamed. In Italian, 'macchiato' means 'stained' or 'spotted', referring to the way the milk 'stains' the espresso. It's stronger than a latte but milder than a straight espresso.",
    price: 3.75,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop",
    category: "Espresso",
    origin: "Italy",
    roast: "Dark",
    rating: 4.4,
    reviews: 78,
    inStock: false,
    isFavorite: false,
    caffeine: "High",
    acidity: "Medium",
    body: "Medium",
    flavor: ["Strong", "Bold", "Smooth"],
    ingredients: ["Espresso", "Small Amount of Steamed Milk"],
    preparation: "Espresso Machine + Milk Steamer",
    servingSize: "60ml",
  },
];

interface ChosenCoffeeProps {
  onAdd: (item: CartItem) => void;
}

export default function ChosenCoffee(props: ChosenCoffeeProps) {
  const { onAdd } = props;
  const { coffeeId } = useParams<{ coffeeId: string }>();
  const history = useHistory();
  const { colors } = useTheme();
  
  const [coffee, setCoffee] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const foundCoffee = coffeeData.find(c => c.id === coffeeId);
    if (foundCoffee) {
      setCoffee(foundCoffee);
      setIsFavorite(foundCoffee.isFavorite);
    }
  }, [coffeeId]);

  if (!coffee) {
    return (
      <Container>
        <Typography>Coffee not found</Typography>
      </Container>
    );
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      _id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      image: coffee.image,
      quantity: quantity,
    };
    onAdd(cartItem);
  };

  return (
    <Container maxWidth="lg" className="product-detail-container">
      <Stack spacing={4}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => history.goBack()}
          className="btn-outlined"
          style={{ alignSelf: 'flex-start' }}
        >
          Back to Coffees
        </Button>

        {/* Main Content */}
        <Box className="product-detail-content">
          {/* Image Section */}
          <Box className="product-detail-image">
            <img
              src={coffee.image}
              alt={coffee.name}
              className="product-detail-image img"
            />
            <IconButton
              className="coffee-card-favorite"
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <FavoriteIcon style={{ color: '#e91e63' }} />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            {!coffee.inStock && (
              <Chip
                label="Out of Stock"
                color="error"
                className="coffee-card-badge out-of-stock"
                style={{ position: 'absolute', top: 16, left: 16 }}
              />
            )}
          </Box>

          {/* Details Section */}
          <Box className="product-detail-info">
            <Stack spacing={3}>
              {/* Header */}
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1"
                  className="product-detail-title"
                >
                  {coffee.name}
                </Typography>
                <Typography 
                  variant="h6"
                  className="product-detail-description"
                >
                  {coffee.description}
                </Typography>
                <Box className="flex-container" style={{ alignItems: 'center', marginBottom: '16px' }}>
                  <Rating value={coffee.rating} precision={0.1} readOnly />
                  <Typography variant="body2" style={{ marginLeft: '8px', color: 'var(--text-secondary)' }}>
                    {coffee.rating} ({coffee.reviews} reviews)
                  </Typography>
                </Box>
                <Box className="flex-container" style={{ gap: '8px', flexWrap: 'wrap' }}>
                  <Chip 
                    label={coffee.category} 
                    variant="outlined"
                    className="chip"
                  />
                  <Chip 
                    label={coffee.origin} 
                    variant="outlined"
                    className="chip"
                  />
                  <Chip 
                    label={coffee.roast} 
                    variant="outlined"
                    className="chip"
                  />
                </Box>
              </Box>

              {/* Price and Quantity */}
              <Box>
                <Typography 
                  variant="h4" 
                  className="product-detail-price"
                >
                  ${coffee.price}
                </Typography>
                
                <Box className="product-detail-actions">
                  <Typography variant="body1" style={{ color: 'var(--text-primary)' }}>
                    Quantity:
                  </Typography>
                  <Box className="quantity-selector">
                    <IconButton
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      size="small"
                      className="quantity-button"
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography className="quantity-display">
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                      size="small"
                      className="quantity-button"
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AddShoppingCartIcon />}
                  fullWidth
                  disabled={!coffee.inStock}
                  onClick={handleAddToCart}
                  className="btn-primary"
                  style={{ padding: '12px 0' }}
                >
                  {coffee.inStock ? `Add ${quantity} to Cart - $${(coffee.price * quantity).toFixed(2)}` : 'Out of Stock'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>

        {/* Detailed Information */}
        <Box>
          <Typography 
            variant="h5" 
            sx={{ 
              color: colors.text,
              fontWeight: 600,
              mb: 3
            }}
          >
            About This Coffee
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: colors.textSecondary,
              lineHeight: 1.7,
              mb: 4
            }}
          >
            {coffee.longDescription}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ flex: '1', minWidth: 300 }}>
              <Card sx={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                    Coffee Profile
                  </Typography>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Caffeine Level:
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 500 }}>
                        {coffee.caffeine}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Acidity:
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 500 }}>
                        {coffee.acidity}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Body:
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 500 }}>
                        {coffee.body}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                        Serving Size:
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, fontWeight: 500 }}>
                        {coffee.servingSize}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ flex: '1', minWidth: 300 }}>
              <Card sx={{ backgroundColor: colors.background, border: `1px solid ${colors.border}` }}>
                <CardContent>
                  <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                    Flavor Notes
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                    {coffee.flavor.map((flavor: string) => (
                      <Chip 
                        key={flavor}
                        label={flavor} 
                        size="small"
                        sx={{ 
                          backgroundColor: colors.primary,
                          color: 'white',
                          '&:hover': {
                            backgroundColor: colors.accentDark,
                          },
                        }}
                      />
                    ))}
                  </Box>
                  
                  <Typography variant="h6" sx={{ color: colors.text, mb: 2 }}>
                    Preparation Method
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                    {coffee.preparation}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Container>
  );
} 