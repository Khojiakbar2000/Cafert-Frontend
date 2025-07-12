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
  Cake as CakeIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Dessert {
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
}

const desserts: Dessert[] = [
  {
    id: 1,
    name: "Tiramisu",
    nameKo: "티라미수",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    descriptionKo: "커피에 적신 레이디핑거와 마스카포네 크림이 들어간 클래식 이탈리안 디저트",
    price: 8.99,
    image: "/coffee-placeholder.jpg",
    category: "Italian",
    rating: 4.8,
    isPopular: true
  },
  {
    id: 2,
    name: "Chocolate Lava Cake",
    nameKo: "초콜릿 라바 케이크",
    description: "Warm chocolate cake with molten chocolate center, served with vanilla ice cream",
    descriptionKo: "녹은 초콜릿 중심이 있는 따뜻한 초콜릿 케이크, 바닐라 아이스크림과 함께 제공",
    price: 9.99,
    image: "/coffee-placeholder.jpg",
    category: "Chocolate",
    rating: 4.7,
    isNew: true
  },
  {
    id: 3,
    name: "New York Cheesecake",
    nameKo: "뉴욕 치즈케이크",
    description: "Creamy cheesecake with graham cracker crust and berry compote",
    descriptionKo: "그레이엄 크래커 크러스트와 베리 컴포트가 있는 크리미한 치즈케이크",
    price: 7.99,
    image: "/coffee-placeholder.jpg",
    category: "Cheesecake",
    rating: 4.6
  },
  {
    id: 4,
    name: "Apple Crumble",
    nameKo: "애플 크럼블",
    description: "Warm apple crumble with cinnamon and oat topping, served with custard",
    descriptionKo: "시나몬과 오트 토핑이 있는 따뜻한 애플 크럼블, 커스타드와 함께 제공",
    price: 6.99,
    image: "/coffee-placeholder.jpg",
    category: "Fruit",
    rating: 4.5
  },
  {
    id: 5,
    name: "Crème Brûlée",
    nameKo: "크렘 브륄레",
    description: "Classic French custard with caramelized sugar crust",
    descriptionKo: "캐러멜화된 설탕 크러스트가 있는 클래식 프렌치 커스타드",
    price: 8.49,
    image: "/coffee-placeholder.jpg",
    category: "French",
    rating: 4.7
  },
  {
    id: 6,
    name: "Red Velvet Cupcake",
    nameKo: "레드 벨벳 컵케이크",
    description: "Moist red velvet cupcake with cream cheese frosting",
    descriptionKo: "크림 치즈 프로스팅이 있는 촉촉한 레드 벨벳 컵케이크",
    price: 4.99,
    image: "/coffee-placeholder.jpg",
    category: "Cupcake",
    rating: 4.4
  },
  {
    id: 7,
    name: "Panna Cotta",
    nameKo: "판나 코타",
    description: "Silky Italian dessert with vanilla bean and berry sauce",
    descriptionKo: "바닐라 빈과 베리 소스가 있는 실키한 이탈리안 디저트",
    price: 7.49,
    image: "/coffee-placeholder.jpg",
    category: "Italian",
    rating: 4.6
  },
  {
    id: 8,
    name: "Chocolate Mousse",
    nameKo: "초콜릿 무스",
    description: "Light and airy chocolate mousse with chocolate shavings",
    descriptionKo: "초콜릿 셰이빙이 있는 가볍고 에어리한 초콜릿 무스",
    price: 6.99,
    image: "/coffee-placeholder.jpg",
    category: "Chocolate",
    rating: 4.5
  }
];

const DessertsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredDesserts, setFilteredDesserts] = useState<Dessert[]>(desserts);

  const categories = ['All', 'Italian', 'Chocolate', 'Cheesecake', 'Fruit', 'French', 'Cupcake'];

  useEffect(() => {
    let filtered = desserts;
    
    if (searchTerm) {
      filtered = filtered.filter(dessert => 
        dessert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dessert.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(dessert => dessert.category === selectedCategory);
    }
    
    setFilteredDesserts(filtered);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (dessert: Dessert) => {
    // Add to cart functionality
    console.log('Added to cart:', dessert.name);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#8B4513' }}>
        <Toolbar>
          <CakeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('desserts.title')}
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
            {t('desserts.title')}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            color: '#666', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>
            {t('desserts.subtitle')}
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('desserts.searchPlaceholder')}
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

        {/* Desserts Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredDesserts.map((dessert) => (
            <Box key={dessert.id}>
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
                    image={dessert.image}
                    alt={dessert.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 8, 
                    display: 'flex', 
                    gap: 1 
                  }}>
                    {dessert.isNew && (
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
                    {dessert.isPopular && (
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
                  </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" component="h2" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    color: '#8B4513'
                  }}>
                    {t('language') === 'ko' ? dessert.nameKo : dessert.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {t('language') === 'ko' ? dessert.descriptionKo : dessert.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={dessert.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                      ({dessert.rating})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ 
                      color: '#8B4513',
                      fontWeight: 'bold'
                    }}>
                      ${dessert.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddToCart(dessert)}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': {
                          backgroundColor: '#A0522D',
                        },
                      }}
                    >
                      {t('desserts.addToCart')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {filteredDesserts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('desserts.noResults')}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default DessertsPage; 