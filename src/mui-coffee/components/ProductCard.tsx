import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string | number;
  name: string;
  description: string;
  price: string;
  image: string;
  onClick?: (id: string | number) => void;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  description,
  price,
  image,
  onClick,
  index = 0
}) => {
  return (
    <Box
      component={motion.div}
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onClick={() => onClick?.(id)}
      sx={{
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        width: '100%',
        maxWidth: '280px',
        WebkitFontSmoothing: 'antialiased',
        boxSizing: 'border-box',
        '&:hover .product-image img': {
          transform: 'translateY(-8px) scale(1.03)'
        }
      }}
    >
      {/* Product Image */}
      <Box
        className="product-image"
        sx={{
          height: '260px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 0
        }}
      >
        <Box
          component="img"
          src={image}
          alt={name}
          onError={(e) => {
            console.error('Image failed to load:', image);
            (e.target as HTMLImageElement).src = '/img/coffee/coffee-placeholder.jpg';
          }}
          sx={{
            maxHeight: '100%',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 30px 35px rgba(0,0,0,0.18))',
            WebkitFilter: 'drop-shadow(0 30px 35px rgba(0,0,0,0.18))',
            transition: 'transform 0.3s ease'
          }}
        />
      </Box>

      {/* Product Title */}
      <Typography
        component="h3"
        className="product-title"
        sx={{
          marginTop: '14px',
          marginBottom: 0,
          fontWeight: 500,
          fontSize: { xs: '1rem', md: '1.125rem' },
          lineHeight: 1.4,
          color: '#2C1810',
          fontFamily: '"NB International Pro", Inter, sans-serif',
          letterSpacing: '-0.46px'
        }}
      >
        {name}
      </Typography>

      {/* Product Description */}
      <Typography
        component="p"
        className="product-desc"
        sx={{
          marginTop: '8px',
          marginBottom: 0,
          color: '#777',
          fontSize: '13px',
          lineHeight: 1.6,
          fontFamily: '"NB International Pro", Inter, sans-serif',
          fontWeight: 400,
          letterSpacing: '-0.46px'
        }}
      >
        {description}
      </Typography>

      {/* Product Price */}
      <Typography
        component="span"
        className="product-price"
        sx={{
          display: 'block',
          marginTop: '8px',
          color: '#8b5e3c',
          fontWeight: 500,
          fontSize: { xs: '0.9375rem', md: '1rem' },
          fontFamily: '"NB International Pro", Inter, sans-serif',
          letterSpacing: '-0.46px'
        }}
      >
        {price}
      </Typography>
    </Box>
  );
};

export default ProductCard;



