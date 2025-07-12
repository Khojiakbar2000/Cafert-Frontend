import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Icon
} from '@mui/material';
import { motion, easeOut, backOut } from 'framer-motion';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  EmojiEvents as TrophyIcon,
  Spa as PlantIcon,
  LocalCafe as CoffeeIcon,
  Star as StarIcon,
  Park as ParkIcon,
  Favorite as HeartIcon,
  Coffee as CoffeeBeanIcon,
  Restaurant as RestaurantIcon,
  Verified as VerifiedIcon,
  WorkspacePremium as PremiumIcon
} from '@mui/icons-material';

interface Award {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  year?: string;
}

const AwardsStrip: React.FC = () => {
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#2c2c2c',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    accent: isDarkMode ? '#ffd700' : '#b38e6a',
    accentDark: isDarkMode ? '#ffed4e' : '#8b6b4a',
    shadow: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    border: isDarkMode ? '#404040' : '#e0e0e0'
  };

  const awards: Award[] = [
    {
      id: '1',
      icon: <TrophyIcon sx={{ fontSize: '2.5rem', color: colors.accent }} />,
      title: t('awards.bestCafe.title', 'Best Café 2024'),
      subtitle: t('awards.bestCafe.subtitle', 'Local Excellence Award'),
      year: '2024'
    },
    {
      id: '2',
      icon: <PlantIcon sx={{ fontSize: '2.5rem', color: colors.accent }} />,
      title: t('awards.organic.title', '100% Organic Beans'),
      subtitle: t('awards.organic.subtitle', 'Certified Organic'),
      year: '2024'
    },
    {
      id: '3',
      icon: <CoffeeIcon sx={{ fontSize: '2.5rem', color: colors.accent }} />,
      title: t('awards.barista.title', 'Barista Champion Finalist'),
      subtitle: t('awards.barista.subtitle', 'Regional Competition'),
      year: '2023'
    },
    {
      id: '4',
      icon: <StarIcon sx={{ fontSize: '2.5rem', color: colors.accent }} />,
      title: t('awards.quality.title', 'Quality Excellence'),
      subtitle: t('awards.quality.subtitle', 'Customer Satisfaction'),
      year: '2024'
    },
    {
      id: '5',
      icon: <ParkIcon sx={{ fontSize: '2.5rem', color: colors.accent }} />,
      title: t('awards.sustainable.title', 'Sustainable Business'),
      subtitle: t('awards.sustainable.subtitle', 'Green Certification'),
      year: '2023'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.7,
        ease: easeOut
      }
    }
  };

  const iconVariants = {
    hidden: { rotate: -180, scale: 0, y: 20 },
    visible: {
      rotate: 0,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: backOut,
        delay: 0.2
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easeOut,
        delay: 0.4
      }
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: backOut,
        delay: 0.6
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.surface,
        py: { xs: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          opacity: 0.3
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${colors.accent}, transparent)`,
          opacity: 0.3
        }
      }}
    >
      {/* Floating Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          left: '5%',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}15, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, -20, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          bottom: '30%',
          right: '8%',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}20, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, 15, 0],
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />

      {/* Additional Floating Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}10, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.1, 0.4, 0.1],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}12, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, 12, 0],
          x: [0, -8, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Floating Coffee Icons */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          opacity: 0.3,
          zIndex: 1
        }}
        animate={{
          y: [0, -25, 0],
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <CoffeeIcon sx={{ fontSize: '2rem', color: colors.accent }} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          opacity: 0.2,
          zIndex: 1
        }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      >
        <PlantIcon sx={{ fontSize: '1.5rem', color: colors.accent }} />
      </motion.div>

      {/* Additional Floating Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          left: '15%',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}10, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, -15, 0],
          x: [0, 10, 0],
          opacity: [0.1, 0.4, 0.1],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          right: '20%',
          width: '25px',
          height: '25px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${colors.accent}12, transparent)`,
          zIndex: 1
        }}
        animate={{
          y: [0, 12, 0],
          x: [0, -8, 0],
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />

      {/* Floating Coffee Icons */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          right: '5%',
          opacity: 0.3,
          zIndex: 1
        }}
        animate={{
          y: [0, -25, 0],
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <CoffeeIcon sx={{ fontSize: '2rem', color: colors.accent }} />
      </motion.div>
      <motion.div
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          opacity: 0.2,
          zIndex: 1
        }}
        animate={{
          y: [0, 20, 0],
          rotate: [0, -360],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5
        }}
      >
        <PlantIcon sx={{ fontSize: '1.5rem', color: colors.accent }} />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          {/* Section Header */}
          <motion.div
            variants={itemVariants}
            style={{ textAlign: 'center', marginBottom: isMobile ? '2rem' : '3rem' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: colors.accent,
                  fontWeight: 700,
                  fontSize: '1.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '2.5px',
                  mb: 2,
                  position: 'relative'
                }}
              >
                {t('awards.sectionTitle', 'Awards & Certifications')}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: backOut, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: colors.text,
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
                  mb: 3,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90px',
                    height: '4px',
                    background: colors.accent,
                    borderRadius: '2px'
                  }
                }}
              >
                {t('awards.mainTitle', 'Our Achievements')}
              </Typography>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: colors.textSecondary,
                  fontSize: '2rem',
                  maxWidth: '700px',
                  margin: '0 auto',
                  lineHeight: 1.6
                }}
              >
                {t('awards.description', 'Recognized for our commitment to quality, sustainability, and exceptional coffee experience.')}
              </Typography>
            </motion.div>
          </motion.div>

          {/* Awards Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)'
              },
              gap: { xs: 2, md: 3 },
              alignItems: 'stretch'
            }}
          >
            {awards.map((award, index) => (
              <motion.div
                key={award.id}
                variants={itemVariants}
                whileHover={{
                  y: -12,
                  scale: 1.08,
                  rotateY: 5,
                  transition: { 
                    duration: 0.4, 
                    ease: easeOut,
                    type: "spring",
                    stiffness: 300
                  }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { duration: 0.1 }
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    backgroundColor: colors.background,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '16px',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    transformStyle: 'preserve-3d',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentDark})`,
                      transform: 'scaleX(0)',
                      transition: 'transform 0.3s ease',
                      zIndex: 1
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '100px',
                      height: '100px',
                      background: `radial-gradient(circle, ${colors.accent}10, transparent)`,
                      borderRadius: '50%',
                      transform: 'translate(-50%, -50%) scale(0)',
                      transition: 'transform 0.6s ease',
                      zIndex: 0
                    },
                    '&:hover': {
                      boxShadow: `0 15px 35px ${colors.shadow}`,
                      borderColor: colors.accent,
                      '&::before': {
                        transform: 'scaleX(1)'
                      },
                      '&::after': {
                        transform: 'translate(-50%, -50%) scale(1)'
                      }
                    }
                  }}
                >
                  {/* Award Icon with Enhanced Animation */}
                  <motion.div
                    variants={iconVariants}
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                      transition: { 
                        duration: 0.6,
                        ease: easeOut
                      }
                    }}
                    style={{
                      fontSize: '4.5rem',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100px',
                      position: 'relative'
                    }}
                  >
                    <motion.div
                      animate={{
                        y: [0, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      {award.icon}
                    </motion.div>
                  </motion.div>

                  {/* Award Content with Staggered Animations */}
                  <motion.div
                    variants={textVariants}
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.3 + index * 0.1,
                        duration: 0.6,
                        ease: easeOut
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: colors.text,
                          fontWeight: 700,
                          fontSize: { xs: '2rem', md: '2.5rem' },
                          mb: 2,
                          lineHeight: 1.3,
                          position: 'relative'
                        }}
                      >
                        {award.title}
                      </Typography>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        delay: 0.4 + index * 0.1,
                        duration: 0.5,
                        ease: easeOut
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.textSecondary,
                          fontSize: '1.5rem',
                          mb: 1.5,
                          lineHeight: 1.4
                        }}
                      >
                        {award.subtitle}
                      </Typography>
                    </motion.div>
                    
                    {award.year && (
                      <motion.div
                        variants={badgeVariants}
                        whileHover={{
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: colors.accent,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1.5px',
                            backgroundColor: `${colors.accent}15`,
                            px: 2,
                            py: 1,
                            borderRadius: '14px',
                            display: 'inline-block',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: '-100%',
                              width: '100%',
                              height: '100%',
                              background: `linear-gradient(90deg, transparent, ${colors.accent}30, transparent)`,
                              transition: 'left 0.5s ease',
                            },
                            '&:hover::before': {
                              left: '100%'
                            }
                          }}
                        >
                          {award.year}
                        </Typography>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Floating Particles */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '10%',
                      right: '10%',
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: colors.accent,
                      opacity: 0.6
                    }}
                    animate={{
                      y: [0, -10, 0],
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3
                    }}
                  />
                  <motion.div
                    style={{
                      position: 'absolute',
                      bottom: '15%',
                      left: '15%',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: colors.accent,
                      opacity: 0.4
                    }}
                    animate={{
                      y: [0, 8, 0],
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  />
                </Paper>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AwardsStrip; 