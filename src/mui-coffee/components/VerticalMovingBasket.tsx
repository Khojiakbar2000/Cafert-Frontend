import React from 'react';
import { Box, Typography } from '@mui/material';

interface VerticalMovingBasketProps {
  itemCount: number;
}

const VerticalMovingBasket: React.FC<VerticalMovingBasketProps> = ({ itemCount }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'primary.main',
        color: 'white',
        padding: 2,
        borderRadius: 2,
        boxShadow: 3,
        zIndex: 1000,
        minWidth: 200,
        maxHeight: 400,
        overflow: 'auto'
      }}
    >
      <Typography variant="h6" gutterBottom>
        Shopping Basket
      </Typography>
      <Typography variant="body2">
        Items: {itemCount}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        This is a demo vertical basket component.
      </Typography>
    </Box>
  );
};

export default VerticalMovingBasket;
