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
  Restaurant as RestaurantIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface Salad {
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

const salads: Salad[] = [
  {
    id: 1,
    name: "Mediterranean Garden Salad",
    nameKo: "지중해 정원 샐러드",
    description: "Fresh mixed greens with cherry tomatoes, cucumber, olives, and feta cheese",
    descriptionKo: "체리 토마토, 오이, 올리브, 페타 치즈가 들어간 신선한 믹스 그린",
    price: 12.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Garden",
    rating: 4.5,
    isPopular: true
  },
  {
    id: 2,
    name: "Caesar Salad",
    nameKo: "시저 샐러드",
    description: "Classic Caesar with romaine lettuce, parmesan cheese, and croutons",
    descriptionKo: "로메인 상추, 파마산 치즈, 크루통이 들어간 클래식 시저",
    price: 11.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Classic",
    rating: 4.3
  },
  {
    id: 3,
    name: "Asian Fusion Salad",
    nameKo: "아시안 퓨전 샐러드",
    description: "Mixed greens with mandarin oranges, almonds, and ginger dressing",
    descriptionKo: "만다린 오렌지, 아몬드, 생강 드레싱이 들어간 믹스 그린",
    price: 13.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Fusion",
    rating: 4.7,
    isNew: true
  },
  {
    id: 4,
    name: "Quinoa Power Bowl",
    nameKo: "퀴노아 파워 보울",
    description: "Quinoa with roasted vegetables, avocado, and lemon vinaigrette",
    descriptionKo: "구운 채소, 아보카도, 레몬 비네그레트가 들어간 퀴노아",
    price: 14.99,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Healthy",
    rating: 4.6
  },
  {
    id: 5,
    name: "Greek Salad",
    nameKo: "그릭 샐러드",
    description: "Traditional Greek salad with tomatoes, cucumber, red onion, and olives",
    descriptionKo: "토마토, 오이, 빨간 양파, 올리브가 들어간 전통 그릭 샐러드",
    price: 12.49,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Mediterranean",
    rating: 4.4
  },
  {
    id: 6,
    name: "Spinach & Strawberry",
    nameKo: "시금치 & 딸기 샐러드",
    description: "Fresh spinach with strawberries, goat cheese, and balsamic glaze",
    descriptionKo: "딸기, 염소 치즈, 발사믹 글레이즈가 들어간 신선한 시금치",
    price: 13.49,
    image: "/img/coffee/coffee-placeholder.jpg",
    category: "Fruit",
    rating: 4.8,
    isPopular: true
  }
];

const SaladsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredSalads, setFilteredSalads] = useState<Salad[]>(salads);

  const categories = ['All', 'Garden', 'Classic', 'Fusion', 'Healthy', 'Mediterranean', 'Fruit'];

  useEffect(() => {
    let filtered = salads;
    
    if (searchTerm) {
      filtered = filtered.filter(salad => 
        salad.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        salad.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(salad => salad.category === selectedCategory);
    }
    
    setFilteredSalads(filtered);
  }, [searchTerm, selectedCategory]);

  const handleAddToCart = (salad: Salad) => {
    // Add to cart functionality
    console.log('Added to cart:', salad.name);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#8B4513' }}>
        <Toolbar>
          <RestaurantIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('salads.title')}
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
            {t('salads.title')}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            color: '#666', 
            mb: 4,
            maxWidth: 600,
            mx: 'auto'
          }}>
            {t('salads.subtitle')}
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('salads.searchPlaceholder')}
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

        {/* Salads Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {filteredSalads.map((salad) => (
            <Box key={salad.id}>
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
                    image={salad.image}
                    alt={salad.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    left: 8, 
                    display: 'flex', 
                    gap: 1 
                  }}>
                    {salad.isNew && (
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
                    {salad.isPopular && (
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
                    {t('language') === 'ko' ? salad.nameKo : salad.name}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {t('language') === 'ko' ? salad.descriptionKo : salad.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={salad.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                      ({salad.rating})
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ 
                      color: '#8B4513',
                      fontWeight: 'bold'
                    }}>
                      ${salad.price}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddToCart(salad)}
                      sx={{
                        backgroundColor: '#8B4513',
                        '&:hover': {
                          backgroundColor: '#A0522D',
                        },
                      }}
                    >
                      {t('salads.addToCart')}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {filteredSalads.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              {t('salads.noResults')}
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SaladsPage; 