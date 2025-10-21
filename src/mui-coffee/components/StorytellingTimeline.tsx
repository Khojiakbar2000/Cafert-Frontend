import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
}

interface StorytellingTimelineProps {
  title?: string;
  subtitle?: string;
  items: TimelineItem[];
  className?: string;
}

const StorytellingTimeline: React.FC<StorytellingTimelineProps> = ({
  title,
  subtitle,
  items,
  className
}) => {
  const { t } = useTranslation();
  const { isDarkMode, colors } = useThemeContext();
  
  // Use provided props or fallback to translations
  const displayTitle = title || t('about.journeyTitle');
  const displaySubtitle = subtitle || t('about.journeySubtitle');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  const dotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box 
      className={className}
      sx={{
        padding: '8rem 0',
        backgroundColor: isDarkMode 
          ? 'rgba(26, 26, 26, 0.8)' 
          : 'rgba(248, 244, 240, 0.8)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode 
            ? 'radial-gradient(circle at 30% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 69, 19, 0.1) 0%, transparent 50%)'
            : 'radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.05) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '200px',
          height: '200px',
          background: isDarkMode 
            ? 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(139, 69, 19, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          animation: 'float 6s ease-in-out infinite'
        }
      }}
    >
      {/* Coffee bean decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '60px',
        height: '60px',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(139, 69, 19, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 8s ease-in-out infinite reverse'
      }} />
      
      <Box sx={{
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: '40px',
        height: '40px',
        background: isDarkMode 
          ? 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(139, 69, 19, 0.06) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        animation: 'float 7s ease-in-out infinite'
      }} />

      <Container maxWidth="lg">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{
              color: colors.accent,
              fontWeight: 600,
              letterSpacing: 3,
              mb: 2,
              display: 'block',
              fontSize: '0.9rem',
              textTransform: 'uppercase'
            }}>
              {t('about.story')}
            </Typography>
            <Typography variant="h2" sx={{
              color: colors.text,
              fontWeight: 700,
              mb: 3,
              fontFamily: 'Playfair Display, serif',
              fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
              lineHeight: 1.1
            }}>
              {displayTitle}
            </Typography>
            <Typography variant="h5" sx={{
              color: colors.textSecondary,
              fontWeight: 400,
              fontFamily: 'Poppins, sans-serif',
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}>
              {displaySubtitle}
            </Typography>
          </Box>
        </motion.div>

        {/* Timeline Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Box sx={{ position: 'relative' }}>
            {/* Timeline Line - Desktop Only */}
            {!isMobile && (
              <motion.div
                variants={lineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 0,
                  bottom: 0,
                  width: '4px',
                  background: isDarkMode 
                    ? 'linear-gradient(180deg, rgba(255, 215, 0, 0.3) 0%, rgba(139, 69, 19, 0.3) 100%)'
                    : 'linear-gradient(180deg, rgba(139, 69, 19, 0.3) 0%, rgba(255, 215, 0, 0.3) 100%)',
                  transform: 'translateX(-50%)',
                  borderRadius: '2px',
                  zIndex: 1
                }}
              />
            )}

            {/* Timeline Items */}
            {items.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 6,
                  flexDirection: isMobile ? 'column' : (index % 2 === 0 ? 'row' : 'row-reverse'),
                  position: 'relative'
                }}>
                  {/* Timeline Item Content */}
                  <Box sx={{
                    flex: 1,
                    maxWidth: isMobile ? '100%' : '45%',
                    position: 'relative',
                    ...(isMobile ? {} : (index % 2 === 0 ? { mr: 'auto' } : { ml: 'auto' }))
                  }}>
                    <Card sx={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(26, 26, 26, 0.7)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: isDarkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '24px',
                      boxShadow: isDarkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                        : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentDark || colors.accent})`,
                        zIndex: 1
                      },
                      '&:hover': {
                        boxShadow: isDarkMode 
                          ? '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                          : '0 16px 48px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                        transform: 'translateY(-8px)',
                      }
                    }}>
                      {/* Image if provided */}
                      {item.image && (
                        <Box sx={{
                          position: 'relative',
                          height: 200,
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: isDarkMode 
                              ? 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.4) 100%)'
                              : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.2) 100%)',
                            zIndex: 1
                          }
                        }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.4s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                        </Box>
                      )}

                      <CardContent sx={{ p: 4 }}>
                        {/* Year Badge */}
                        <Chip
                          label={item.year}
                          sx={{
                            backgroundColor: isDarkMode 
                              ? 'rgba(255, 215, 0, 0.9)' 
                              : 'rgba(139, 69, 19, 0.9)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            color: isDarkMode ? '#1a1a1a' : '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            borderRadius: '16px',
                            border: isDarkMode 
                              ? '1px solid rgba(255, 215, 0, 0.3)' 
                              : '1px solid rgba(139, 69, 19, 0.3)',
                            boxShadow: isDarkMode 
                              ? '0 4px 12px rgba(255, 215, 0, 0.3)' 
                              : '0 4px 12px rgba(139, 69, 19, 0.3)',
                            mb: 2
                          }}
                        />

                        {/* Title */}
                        <Typography variant="h5" sx={{
                          color: colors.text,
                          fontWeight: 700,
                          mb: 2,
                          fontFamily: 'Playfair Display, serif',
                          fontSize: '1.5rem'
                        }}>
                          {item.title}
                        </Typography>

                        {/* Description */}
                        <Typography variant="body1" sx={{
                          color: colors.textSecondary,
                          lineHeight: 1.6,
                          fontSize: '1rem'
                        }}>
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>

                  {/* Timeline Dot - Desktop Only */}
                  {!isMobile && (
                    <motion.div
                      variants={dotVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        width: '20px',
                        height: '20px',
                        background: colors.accent,
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 20px ${colors.accent}40`,
                        zIndex: 2
                      }}
                    >
                      <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '40px',
                        height: '40px',
                        background: isDarkMode 
                          ? 'rgba(255, 215, 0, 0.1)' 
                          : 'rgba(139, 69, 19, 0.1)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: isDarkMode 
                          ? '1px solid rgba(255, 215, 0, 0.3)' 
                          : '1px solid rgba(139, 69, 19, 0.3)'
                      }} />
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default StorytellingTimeline; 