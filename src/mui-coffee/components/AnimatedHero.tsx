import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Button, Container } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useHistory } from 'react-router-dom';

const AnimatedHero: React.FC = () => {
  const history = useHistory();

  const handleExploreMenu = () => {
    history.push('/coffees');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #CD853F 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=800&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          zIndex: 1
        }
      }}
    >
      {/* Floating Coffee Beans */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          zIndex: 2
        }}
      >
        <Box
          sx={{
            width: 60,
            height: 60,
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)'
          }}
        />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          zIndex: 2
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)'
          }}
        />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '3rem', md: '5rem' },
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                background: 'linear-gradient(45deg, #FFF, #F5F5DC)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Cafert
            </Typography>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: 300,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                opacity: 0.9
              }}
            >
              Where Every Sip Tells a Story
            </Typography>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                maxWidth: 600,
                mx: 'auto',
                opacity: 0.8,
                lineHeight: 1.6
              }}
            >
              Experience the perfect blend of tradition and innovation in every cup. 
              From artisanal coffee to delightful pastries, we create moments worth savoring.
            </Typography>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={handleExploreMenu}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
                  }
                }}
              >
                Explore Menu
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outlined"
                size="large"
                startIcon={
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <PlayArrowIcon />
                  </motion.div>
                }
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Watch Story
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            style={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Box
                sx={{
                  width: 2,
                  height: 40,
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderRadius: 1,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 8,
                    height: 8,
                    background: 'white',
                    borderRadius: '50%'
                  }
                }}
              />
            </motion.div>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default AnimatedHero; 