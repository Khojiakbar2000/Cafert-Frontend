import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  Button,
  TextField,
  InputAdornment,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  LocalOffer as LocalOfferIcon,
  LocalCafe as CoffeeIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Drink {
  id: number;
  name: string;
  nameKo: string;
  description: string;
  descriptionKo: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  isPopular?: boolean;
  isHot?: boolean;
  isCold?: boolean;
}

const drinks: Drink[] = [
  {
    id: 1,
    name: "Espresso",
    nameKo: "에스프레소",
    description: "Strong Italian coffee brewed by forcing hot water through finely ground coffee beans",
    descriptionKo: "고운 분쇄된 커피 원두에 뜨거운 물을 강제로 통과시켜 추출한 강한 이탈리안 커피",
    price: 3.99,
    image: "/img/coffee/coffee-espresso.jpg",
    category: "Coffee",
    rating: 4.8,
    isPopular: true,
    isHot: true
  },
  {
    id: 2,
    name: "Cappuccino",
    nameKo: "카푸치노",
    description: "Equal parts espresso, steamed milk, and milk foam",
    descriptionKo: "에스프레소, 스팀 밀크, 밀크 폼이 1:1:1 비율로 구성",
    price: 4.99,
    image: "/img/coffee/coffee-cappuccino.jpg",
    category: "Coffee",
    rating: 4.7,
    isHot: true
  },
  {
    id: 3,
    name: "Latte",
    nameKo: "라떼",
    description: "Espresso with steamed milk and a small amount of milk foam",
    descriptionKo: "에스프레소에 스팀 밀크와 소량의 밀크 폼을 추가",
    price: 5.49,
    image: "/img/coffee/coffee-latte.jpg",
    category: "Coffee",
    rating: 4.6,
    isPopular: true,
    isHot: true
  },
  {
    id: 4,
    name: "Iced Americano",
    nameKo: "아이스 아메리카노",
    description: "Espresso with cold water and ice cubes",
    descriptionKo: "에스프레소에 차가운 물과 얼음을 추가",
    price: 4.49,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Coffee",
    rating: 4.5,
    isCold: true
  },
  {
    id: 5,
    name: "Mocha",
    nameKo: "모카",
    description: "Espresso with chocolate syrup and steamed milk",
    descriptionKo: "에스프레소에 초콜릿 시럽과 스팀 밀크를 추가",
    price: 5.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Coffee",
    rating: 4.7,
    isNew: true,
    isHot: true
  },
  {
    id: 6,
    name: "Green Tea Latte",
    nameKo: "녹차 라떼",
    description: "Matcha green tea with steamed milk and honey",
    descriptionKo: "말차 녹차에 스팀 밀크와 꿀을 추가",
    price: 5.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Tea",
    rating: 4.6,
    isHot: true
  },
  {
    id: 7,
    name: "Chai Latte",
    nameKo: "차이 라떼",
    description: "Spiced black tea with steamed milk and honey",
    descriptionKo: "향신료가 들어간 홍차에 스팀 밀크와 꿀을 추가",
    price: 5.49,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Tea",
    rating: 4.5,
    isHot: true
  },
  {
    id: 8,
    name: "Iced Caramel Macchiato",
    nameKo: "아이스 카라멜 마키아토",
    description: "Espresso with vanilla-flavored syrup, steamed milk, and caramel drizzle",
    descriptionKo: "에스프레소에 바닐라 시럽, 스팀 밀크, 카라멜 드리즐을 추가",
    price: 6.49,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Coffee",
    rating: 4.8,
    isPopular: true,
    isCold: true
  },
  {
    id: 9,
    name: "Hot Chocolate",
    nameKo: "핫 초콜릿",
    description: "Rich chocolate drink with steamed milk and whipped cream",
    descriptionKo: "스팀 밀크와 휘핑 크림이 들어간 진한 초콜릿 음료",
    price: 4.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Hot Chocolate",
    rating: 4.4,
    isHot: true
  },
  {
    id: 10,
    name: "Smoothie - Berry Blast",
    nameKo: "스무디 - 베리 블라스트",
    description: "Mixed berries with yogurt and honey",
    descriptionKo: "믹스 베리에 요거트와 꿀을 추가",
    price: 6.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Smoothie",
    rating: 4.6,
    isNew: true,
    isCold: true
  }
];

const DrinksPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredDrinks, setFilteredDrinks] = useState<Drink[]>(drinks);

  const categories = ['All', 'Coffee', 'Tea', 'Hot Chocolate', 'Smoothie'];

  useEffect(() => {
    let filtered = drinks;
    
    if (searchTerm) {
      filtered = filtered.filter(drink => 
        drink.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drink.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(drink => drink.category === selectedCategory);
    }
    
    setFilteredDrinks(filtered);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (drink: Drink) => {
    // Add to cart functionality
    console.log('Added to cart:', drink.name);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#8B4513' }}>
        <Toolbar>
          <CoffeeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('drinks.title')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Search and Filter Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            color: '#8B4513', 
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 3
          }}>
            {t('drinks.title')}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            color: '#666', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>
            {t('drinks.subtitle')}
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('drinks.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8B4513' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#8B4513',
                  },
                  '&:hover fieldset': {
                    borderColor: '#A0522D',
                  },
                },
              }}
            />
          </Box>

          {/* Category Filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => setSelectedCategory(category)}
                color={selectedCategory === category ? 'primary' : 'default'}
                sx={{
                  backgroundColor: selectedCategory === category ? '#8B4513' : '#fff',
                  color: selectedCategory === category ? '#fff' : '#8B4513',
                  border: '1px solid #8B4513',
                  '&:hover': {
                    backgroundColor: selectedCategory === category ? '#A0522D' : '#f5f5f5',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Drinks Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredDrinks.map((drink) => (
            <Box key={drink.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={drink.image}
                    alt={drink.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 8, 
                    display: 'flex', 
                    gap: 1 
                  }}>
                    {drink.isNew && (
                      <Chip
                        label="NEW"
                        size="small"
                        sx={{ 
                          backgroundColor: '#4CAF50', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    {drink.isPopular && (
                      <Chip
                        icon={<LocalOfferIcon />}
                        label="POPULAR"
                        size="small"
                        sx={{ 
                          backgroundColor: '#FF9800', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    {drink.isHot && (
                      <Chip
                        label="HOT"
                        size="small"
                        sx={{ 
                          backgroundColor: '#f44336', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    {drink.isCold && (
                      <Chip
                        label="COLD"
                        size="small"
                        sx={{ 
                          backgroundColor: '#2196F3', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#8B4513'
                  }}>
                    {t('language') === 'ko' ? drink.nameKo : drink.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {t('language') === 'ko' ? drink.descriptionKo : drink.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={drink.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                      ({drink.rating})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ 
                      color: '#8B4513',
                      fontWeight: 'bold'
                    }}>
                      ${drink.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddToCart(drink)}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': {
                          backgroundColor: '#A0522D',
                        },
                      }}
                    >
                      {t('drinks.addToCart')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {filteredDrinks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('drinks.noResults')}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DrinksPage; 