import React, { useState } from 'react';
import { Box, Typography, Slider, Paper } from '@mui/material';
import VerticalMovingBasket from './VerticalMovingBasket';

const VerticalBasketDemo: React.FC = () => {
  const [itemCount, setItemCount] = useState(3);

  return (
    <Box sx={{ 
      p: 4, 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Demo Controls */}
      <Paper sx={{ p: 3, mb: 4, maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#8B4513' }}>
          Vertical Moving Basket Demo
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

        <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
          Look at the left side of the screen to see the vertically moving basket!
        </Typography>
      </Paper>

      {/* Instructions */}
      <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mb: 4 }}>
        <Typography variant="h6" gutterBottom>Features:</Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          <Typography component="li">Single basket positioned on the left side</Typography>
          <Typography component="li">Smooth vertical floating animation (8-second cycle)</Typography>
          <Typography component="li">Bounce animation on hover</Typography>
          <Typography component="li">Pulsing badge showing item count</Typography>
          <Typography component="li">Clickable basket (check console for click events)</Typography>
          <Typography component="li">Coffee-themed brown color scheme</Typography>
        </Box>
      </Paper>

      {/* Vertical Moving Basket Component */}
      <VerticalMovingBasket itemCount={itemCount} />
    </Box>
  );
};

export default VerticalBasketDemo; 