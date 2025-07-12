import React, { useRef, useEffect } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ParallaxHeroProps {
  isDarkMode: boolean;
  colors: any;
  t: (key: string) => string;
  scrollToSection: (ref: any) => void;
  menuRef: any;
  bookingRef: any;
  setSignupOpen?: (isOpen: boolean) => void;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({
  isDarkMode,
  colors,
  t,
  scrollToSection,
  menuRef,
  bookingRef,
  setSignupOpen
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const [textRef, textInView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const [videoRef, videoInView] = useInView({
    threshold: 0.5,
    triggerOnce: true
  });

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "150%"]);
  
  // Smooth spring animations
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const springY3 = useSpring(y3, { stiffness: 100, damping: 30 });

  // Floating animation for particles
  const floatingAnimation = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background: `linear-gradient(135deg, 
          ${isDarkMode ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)'} 0%, 
          ${isDarkMode ? 'rgba(44, 44, 44, 0.8)' : 'rgba(245, 245, 245, 0.8)'} 100%
        )`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated Background Particles */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            style={{
              position: 'absolute',
              width: Math.random() * 8 + 4,
              height: Math.random() * 8 + 4,
              background: isDarkMode ? 'rgba(255, 165, 0, 0.3)' : 'rgba(139, 69, 19, 0.2)',
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              zIndex: 1
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
          />
        ))}
      </Box>

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 50% 50%, 
            transparent 0%, 
            ${isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'} 100%
          )`,
          zIndex: 2
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
          
          {/* Text Content with Parallax */}
          <motion.div
            ref={textRef}
            style={{ y: springY1 }}
            initial={{ opacity: 0, x: -100 }}
            animate={textInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box sx={{ flex: '1', maxWidth: '600px' }}>
              {/* Animated Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: isDarkMode ? '#FFA500' : colors.accent,
                    textShadow: isDarkMode 
                      ? '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5)'
                      : '2px 2px 4px rgba(0,0,0,0.5)',
                    fontWeight: 600,
                    animation: isDarkMode ? 'glowPulse 3s ease-in-out infinite' : 'none',
                    '@keyframes glowPulse': {
                      '0%, 100%': {
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(255, 165, 0, 0.8), 0 0 40px rgba(255, 165, 0, 0.5)',
                      },
                      '50%': {
                        textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(255, 165, 0, 1), 0 0 60px rgba(255, 165, 0, 0.7)',
                      },
                    }
                  }}
                >
                  {t('hero.title')}
                </Typography>
              </motion.div>

              {/* Animated Main Title */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
                    lineHeight: 1.1,
                    color: isDarkMode ? '#FFFFFF' : colors.cream,
                    textShadow: isDarkMode 
                      ? '3px 3px 6px rgba(0,0,0,0.9), 0 0 25px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 255, 255, 0.4)'
                      : '3px 3px 6px rgba(0,0,0,0.7)',
                    fontWeight: 700,
                    animation: isDarkMode ? 'titleGlow 4s ease-in-out infinite' : 'none',
                    '@keyframes titleGlow': {
                      '0%, 100%': {
                        textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 25px rgba(255, 255, 255, 0.8), 0 0 50px rgba(255, 255, 255, 0.4)',
                      },
                      '50%': {
                        textShadow: '3px 3px 6px rgba(0,0,0,0.9), 0 0 35px rgba(255, 255, 255, 1), 0 0 70px rgba(255, 255, 255, 0.6)',
                      },
                    }
                  }}
                >
                  {t('hero.subtitle')}
                </Typography>
              </motion.div>

              {/* Animated Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1.25rem',
                    mb: 4,
                    color: isDarkMode ? '#F5F5F5' : colors.cream,
                    textShadow: isDarkMode 
                      ? '1px 1px 2px rgba(0,0,0,0.8), 0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3)'
                      : '1px 1px 2px rgba(0,0,0,0.5)',
                    opacity: 0.95,
                    animation: isDarkMode ? 'textGlow 5s ease-in-out infinite' : 'none',
                    '@keyframes textGlow': {
                      '0%, 100%': {
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 15px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.3)',
                      },
                      '50%': {
                        textShadow: '1px 1px 2px rgba(0,0,0,0.8), 0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)',
                      },
                    }
                  }}
                >
                  {t('hero.description')}
                </Typography>
              </motion.div>

              {/* Animated Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={textInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 4 }}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => scrollToSection(menuRef)}
                      sx={{
                        backgroundColor: colors.accent,
                        color: colors.background,
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                        '&:hover': {
                          backgroundColor: colors.accentDark,
                          boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('hero.cta')}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => scrollToSection(bookingRef)}
                      variant="outlined"
                      sx={{
                        borderColor: isDarkMode ? '#FFFFFF' : colors.cream,
                        color: isDarkMode ? '#FFFFFF' : colors.cream,
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '1rem',
                        borderWidth: '2px',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#FFFFFF' : colors.cream,
                          color: isDarkMode ? '#000000' : colors.background,
                          borderColor: isDarkMode ? '#FFFFFF' : colors.cream,
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {t('hero.reservation')}
                    </Button>
                  </motion.div>

                  {setSignupOpen && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => setSignupOpen(true)}
                        sx={{
                          backgroundColor: '#3776CC',
                          color: '#FFFFFF',
                          padding: '12px 24px',
                          borderRadius: '25px',
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          boxShadow: '0 8px 25px rgba(55, 118, 204, 0.3)',
                          '&:hover': {
                            backgroundColor: '#2d5aa0',
                            boxShadow: '0 12px 35px rgba(55, 118, 204, 0.4)',
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Join Our Community
                      </Button>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            </Box>
          </motion.div>

          {/* Video Container with Parallax */}
          <motion.div
            ref={videoRef}
            style={{ y: springY2 }}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={videoInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <Box sx={{ flex: '1', display: { xs: 'none', lg: 'block' } }}>
              <motion.div
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Box sx={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(139, 69, 19, 0.2), rgba(210, 105, 30, 0.2))',
                    zIndex: 1
                  }
                }}>
                  {/* Video Frame Border */}
                  <Box sx={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    border: '3px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    zIndex: 3,
                    pointerEvents: 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: '-2px',
                      left: '-2px',
                      right: '-2px',
                      bottom: '-2px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      zIndex: -1
                    }
                  }} />

                  {/* Video Corner Decorations */}
                  {[
                    { top: '15px', left: '15px', border: 'borderTop borderLeft', radius: '5px 0 0 0' },
                    { top: '15px', right: '15px', border: 'borderTop borderRight', radius: '0 5px 0 0' },
                    { bottom: '15px', left: '15px', border: 'borderBottom borderLeft', radius: '0 0 0 5px' },
                    { bottom: '15px', right: '15px', border: 'borderBottom borderRight', radius: '0 0 5px 0' }
                  ].map((corner, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: 'absolute',
                        top: corner.top,
                        left: corner.left,
                        right: corner.right,
                        bottom: corner.bottom,
                        width: '30px',
                        height: '30px',
                        borderTop: corner.border.includes('borderTop') ? '3px solid rgba(255, 255, 255, 0.15)' : 'none',
                        borderLeft: corner.border.includes('borderLeft') ? '3px solid rgba(255, 255, 255, 0.15)' : 'none',
                        borderRight: corner.border.includes('borderRight') ? '3px solid rgba(255, 255, 255, 0.15)' : 'none',
                        borderBottom: corner.border.includes('borderBottom') ? '3px solid rgba(255, 255, 255, 0.15)' : 'none',
                        borderRadius: corner.radius,
                        zIndex: 4,
                        pointerEvents: 'none'
                      }}
                    />
                  ))}

                  {/* Coffee Shop Video */}
                  <Box
                    component="video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=500&fit=crop"
                    sx={{
                      width: '100%',
                      height: '500px',
                      objectFit: 'cover',
                      borderRadius: '20px',
                      transition: 'transform 0.3s ease',
                      zIndex: 2
                    }}
                  >
                    <source src="/videos/coffee-shop-ambience.mp4" type="video/mp4" />
                    <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 4
        }}
        animate={{
          y: [0, 10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Box sx={{
          width: '30px',
          height: '50px',
          border: '2px solid rgba(255,255,255,0.6)',
          borderRadius: '15px',
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '10px'
        }}>
          <Box sx={{
            width: '4px',
            height: '8px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            borderRadius: '2px',
            animation: 'scroll 2s infinite',
            '@keyframes scroll': {
              '0%': {
                transform: 'translateY(0)',
                opacity: 1,
              },
              '100%': {
                transform: 'translateY(20px)',
                opacity: 0,
              },
            }
          }} />
        </Box>
      </motion.div>
    </Box>
  );
};

export default ParallaxHero; 