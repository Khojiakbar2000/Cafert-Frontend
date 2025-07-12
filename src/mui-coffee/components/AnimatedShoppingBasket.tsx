import React, { useEffect, useState } from 'react';
import { Box, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled, keyframes } from '@mui/material/styles';

// Keyframe animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
  }
  50% {
    transform: translateY(-10px) rotate(-3deg);
  }
  75% {
    transform: translateY(-15px) rotate(2deg);
  }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  60% {
    transform: translateY(-15px);
  }
`;

const swing = keyframes`
  0%, 100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(3deg);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components
const FloatingBasket = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 1000,
  cursor: 'pointer',
  animation: `${float} 6s ease-in-out infinite`,
  transition: 'all 0.3s ease',
  '&:hover': {
    animation: `${bounce} 1s ease-in-out infinite`,
    transform: 'scale(1.2)',
  }
}));

const BasketIcon = styled(ShoppingCartIcon)(({ theme }) => ({
  fontSize: '3rem',
  color: '#8B4513',
  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
  animation: `${swing} 2s ease-in-out infinite`,
  '&:hover': {
    animation: `${pulse} 0.6s ease-in-out infinite`,
  }
}));

const BasketBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#d32f2f',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    animation: `${pulse} 2s ease-in-out infinite`,
  }
}));

const MovingBasket = styled(Box)(({ theme }) => ({
  position: 'fixed',
  zIndex: 999,
  cursor: 'pointer',
  animation: `${float} 8s ease-in-out infinite`,
  transition: 'all 0.5s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(10deg)',
  }
}));

interface AnimatedShoppingBasketProps {
  itemCount?: number;
  showFloating?: boolean;
  showMoving?: boolean;
}

const AnimatedShoppingBasket: React.FC<AnimatedShoppingBasketProps> = ({
  itemCount = 3,
  showFloating = true,
  showMoving = true
}) => {
  const [positions, setPositions] = useState([
    { x: 20, y: 20 },
    { x: 80, y: 60 },
    { x: 40, y: 80 }
  ]);

  // Update positions randomly
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(pos => ({
        x: Math.random() * 80 + 10, // 10% to 90% of screen width
        y: Math.random() * 80 + 10  // 10% to 90% of screen height
      })));
    }, 8000); // Change positions every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating basket in top-right corner */}
      {showFloating && (
        <FloatingBasket
          sx={{
            top: '20px',
            right: '20px',
          }}
          onClick={() => console.log('Floating basket clicked!')}
        >
          <BasketBadge badgeContent={itemCount} color="error">
            <BasketIcon />
          </BasketBadge>
        </FloatingBasket>
      )}

      {/* Moving baskets around the screen */}
      {showMoving && positions.map((pos, index) => (
        <MovingBasket
          key={index}
          sx={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            animationDelay: `${index * 2}s`,
          }}
          onClick={() => console.log(`Moving basket ${index + 1} clicked!`)}
        >
          <BasketBadge badgeContent={Math.floor(Math.random() * 5) + 1} color="error">
            <ShoppingCartIcon 
              sx={{ 
                fontSize: '2rem', 
                color: '#8B4513',
                filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
                opacity: 0.7
              }} 
            />
          </BasketBadge>
        </MovingBasket>
      ))}
    </>
  );
};

export default AnimatedShoppingBasket; 