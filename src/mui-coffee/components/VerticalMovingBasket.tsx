import React from 'react';
import { Box, IconButton, Badge } from '@mui/material';

interface VerticalMovingBasketProps {
  itemCount?: number;
}

const VerticalMovingBasket: React.FC<VerticalMovingBasketProps> = ({
  itemCount = 3
}) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        animation: 'float 3s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': {
            transform: 'translateY(-50%) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-50%) translateX(-10px)',
          },
        },
        '&:hover': {
          animation: 'bounce 0.6s ease-in-out',
          '@keyframes bounce': {
            '0%, 20%, 50%, 80%, 100%': {
              transform: 'translateY(-50%) translateX(0px)',
            },
            '40%': {
              transform: 'translateY(-50%) translateX(-15px)',
            },
            '60%': {
              transform: 'translateY(-50%) translateX(-5px)',
            },
          },
        },
      }}
    >
      <IconButton
        sx={{
          backgroundColor: '#3776CC',
          color: '#f8f8ff',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(55, 118, 204, 0.4)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#2d5aa0',
            boxShadow: '0 6px 20px rgba(55, 118, 204, 0.6)',
            transform: 'scale(1.1)',
          },
        }}
      >
        <Badge 
          badgeContent={itemCount} 
          color="secondary"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#d7b586',
              color: '#000',
              fontWeight: 'bold',
              fontSize: '12px',
              minWidth: '20px',
              height: '20px',
              borderRadius: '10px',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  boxShadow: '0 0 0 0 rgba(215, 181, 134, 0.7)',
                },
                '70%': {
                  boxShadow: '0 0 0 10px rgba(215, 181, 134, 0)',
                },
                '100%': {
                  boxShadow: '0 0 0 0 rgba(215, 181, 134, 0)',
                },
              },
            },
          }}
        >
          <img 
            src="/icons/shopping-cart.svg" 
            alt="Shopping Cart"
            style={{
              width: '24px',
              height: '24px',
              filter: 'brightness(0) invert(1)',
            }}
          />
        </Badge>
      </IconButton>
    </Box>
  );
};

export default VerticalMovingBasket; 