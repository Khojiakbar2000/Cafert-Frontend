import React, { useState } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel, Slider, Paper } from '@mui/material';
import AnimatedShoppingBasket from './AnimatedShoppingBasket';

const AnimatedBasketDemo: React.FC = () => {
  const [itemCount, setItemCount] = useState(3);
  const [showFloating, setShowFloating] = useState(true);
  const [showMoving, setShowMoving] = useState(true);

  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Demo Controls */}
      <Paper sx={{ p: 3, mb: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#8B4513' }}>
          Animated Shopping Basket Demo
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>Item Count: {itemCount}</Typography>
          <Slider
            value={itemCount}
            onChange={(_: Event, value: number | number[]) => setItemCount(value as number)}
            min={0}
            max={10}
            marks
            valueLabelDisplay="auto"
            sx={{ color: '#8B4513' }}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showFloating}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowFloating(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B4513' } }}
              />
            }
            label="Show Floating Basket"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={showMoving}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShowMoving(e.target.checked)}
                sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#8B4513' } }}
              />
            }
            label="Show Moving Baskets"
          />
        </Box>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ 
              backgroundColor: '#8B4513',
              '&:hover': { backgroundColor: '#654321' }
            }}
          >
            Reset Animation
          </Button>
        </Box>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>Features:</Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li">Floating basket in top-right corner with smooth animations</Typography>
          <Typography component="li">Moving baskets that change positions every 8 seconds</Typography>
          <Typography component="li">Hover effects with bounce and pulse animations</Typography>
          <Typography component="li">Badge showing item count with pulsing effect</Typography>
          <Typography component="li">Clickable baskets (check console for click events)</Typography>
        </Box>
      </Paper>

      {/* Animated Shopping Basket Component */}
      <AnimatedShoppingBasket
        itemCount={itemCount}
        showFloating={showFloating}
        showMoving={showMoving}
      />
    </Box>
  );
};

export default AnimatedBasketDemo; 