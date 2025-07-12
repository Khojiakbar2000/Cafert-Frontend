import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  Box, 
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { LinkedIn as LinkedInIcon, Twitter as TwitterIcon } from '@mui/icons-material';

interface ClientCardProps {
  client: {
    id: number;
    name: string;
    company: string;
    role: string;
    bio: string;
    avatar: string;
    isOnline: boolean;
    visitFrequency: string;
    favoriteDrink: string;
    socialLinks: Array<{ icon: React.ReactNode; url: string }>;
  };
  index: number;
}

const AnimatedClientCard: React.FC<ClientCardProps> = ({ client, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #8B4513, #D2691E, #CD853F)',
            transform: 'scaleX(0)',
            transition: 'transform 0.3s ease'
          },
          '&:hover::before': {
            transform: 'scaleX(1)'
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header with Avatar and Status */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <motion.div
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                src={client.avatar}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 2,
                  border: '3px solid rgba(255, 255, 255, 0.3)'
                }}
              />
            </motion.div>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                {client.name}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {client.role} at {client.company}
              </Typography>
            </Box>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: client.isOnline ? '#4CAF50' : '#9E9E9E',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              />
            </motion.div>
          </Box>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                mb: 2,
                lineHeight: 1.6
              }}
            >
              {client.bio}
            </Typography>
          </motion.div>

          {/* Visit Frequency and Favorite Drink */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Chip
                label={`Visits: ${client.visitFrequency}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(139, 69, 19, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(139, 69, 19, 0.5)'
                }}
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Chip
                label={`Fav: ${client.favoriteDrink}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(210, 105, 30, 0.3)',
                  color: 'white',
                  border: '1px solid rgba(210, 105, 30, 0.5)'
                }}
              />
            </motion.div>
          </Box>

          {/* Social Links */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {client.socialLinks.map((link, linkIndex) => (
              <motion.div
                key={linkIndex}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 5,
                  y: -2
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Tooltip title={`Visit ${client.name}'s profile`}>
                  <IconButton
                    size="small"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white'
                      }
                    }}
                  >
                    {link.icon}
                  </IconButton>
                </Tooltip>
              </motion.div>
            ))}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedClientCard; 