import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import HeroSection from '../components/HeroSection';

const HeroDemo: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Demo Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h2" sx={{ mb: 4, textAlign: 'center', color: '#2C3E50' }}>
          Welcome to Our Coffee Shop
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, mb: 6 }}>
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 2, color: '#E67E22' }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#7F8C8D' }}>
              Founded with a passion for exceptional coffee, we've been crafting the perfect brew 
              for coffee enthusiasts since 2010. Every cup tells a story of dedication, quality, 
              and the perfect blend of tradition and innovation.
            </Typography>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 4, flex: 1 }}>
            <Typography variant="h4" sx={{ mb: 2, color: '#E67E22' }}>
              Our Promise
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#7F8C8D' }}>
              We source only the finest beans from sustainable farms around the world, 
              roast them to perfection, and serve them with care. Every visit is an 
              opportunity to experience coffee at its best.
            </Typography>
          </Paper>
        </Box>
        
        <Paper elevation={3} sx={{ p: 6, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <Typography variant="h3" sx={{ mb: 3, color: '#FFFFFF', fontWeight: 700 }}>
            Ready to Experience the Perfect Coffee Moment?
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 4 }}>
            Visit us today and discover why our coffee is more than just a drink - it's an experience.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default HeroDemo; 