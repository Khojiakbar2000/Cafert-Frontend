import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { LocalCafe } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '50vh',
  gap: theme.spacing(2),
  background: 'linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  boxShadow: '0 4px 20px rgba(139, 69, 19, 0.1)',
}));

const CoffeeIcon = styled(LocalCafe)(({ theme }) => ({
  fontSize: '3rem',
  color: '#8B4513',
  animation: 'coffeeSteam 2s ease-in-out infinite',
  '@keyframes coffeeSteam': {
    '0%, 100%': {
      transform: 'translateY(0) scale(1)',
      opacity: 0.8,
    },
    '50%': {
      transform: 'translateY(-10px) scale(1.1)',
      opacity: 1,
    },
  },
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: '#8B4513',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
}));

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Brewing your experience...", 
  size = 60 
}) => {
  return (
    <Fade in={true} timeout={500}>
      <LoadingContainer>
        <CoffeeIcon />
        <StyledCircularProgress size={size} thickness={4} />
        <Typography 
          variant="h6" 
          color="#8B4513" 
          sx={{ 
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: 300,
            animation: 'fadeInOut 2s ease-in-out infinite'
          }}
        >
          {message}
        </Typography>
        <style>
          {`
            @keyframes fadeInOut {
              0%, 100% { opacity: 0.7; }
              50% { opacity: 1; }
            }
          `}
        </style>
      </LoadingContainer>
    </Fade>
  );
};

export default LoadingSpinner; 