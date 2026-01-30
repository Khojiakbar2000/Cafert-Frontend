import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Avatar, Container } from '@mui/material';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';

interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating: number;
}

interface HorizontalTestimonialsProps {
  testimonials: Testimonial[];
  className?: string;
  enableSnap?: boolean;
}

const HorizontalTestimonials: React.FC<HorizontalTestimonialsProps> = ({
  testimonials,
  className,
  enableSnap = false,
}) => {
  const { isDarkMode, colors } = useCoffeeTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  
  const [translateX, setTranslateX] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(480);
  const [cardGap, setCardGap] = useState(32);
  const [isInView, setIsInView] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isDraggingRef = useRef(false);
  const lastDragTimeRef = useRef(0);
  const [velocity, setVelocity] = useState(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Measure dimensions on mount and resize
  const measureDimensions = useCallback(() => {
    if (!cardsRef.current || !containerRef.current) return;

    const cards = cardsRef.current;
    const container = containerRef.current;
    
    // Measure card width (first card)
    const firstCard = cards.querySelector('[data-testimonial-card]') as HTMLElement;
    if (firstCard) {
      const computedWidth = firstCard.offsetWidth;
      setCardWidth(computedWidth);
      
      // Get computed gap from CSS (using getComputedStyle)
      const cardsStyle = window.getComputedStyle(cards);
      const gap = parseInt(cardsStyle.gap) || 32;
      setCardGap(gap);
      
      // Calculate total content width
      const totalWidth = testimonials.length * computedWidth + (testimonials.length - 1) * gap;
      setContentWidth(totalWidth);
    }
    
    setViewportWidth(container.offsetWidth);
  }, [testimonials.length]);

  useEffect(() => {
    measureDimensions();
    
    const handleResize = () => {
      measureDimensions();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [measureDimensions]);

  // Intersection Observer to only calculate when in view
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
        });
      },
      { threshold: 0 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll-driven horizontal movement (pauses when user is dragging)
  useEffect(() => {
    if (!isInView || !sectionRef.current) return;
    if (contentWidth <= viewportWidth || contentWidth === 0) {
      setTranslateX(0);
      return;
    }

    let rafId: number;
    let sectionStartY = 0;
    const DRAG_COOLDOWN = 300; // ms to wait after drag ends before resuming scroll

    const updateTransform = () => {
      // Don't update if user is dragging or recently dragged
      if (isDraggingRef.current) {
        rafId = requestAnimationFrame(updateTransform);
        return;
      }
      
      const timeSinceDrag = Date.now() - lastDragTimeRef.current;
      if (timeSinceDrag < DRAG_COOLDOWN) {
        rafId = requestAnimationFrame(updateTransform);
        return;
      }

      if (!sectionRef.current || !containerRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      
      // Track when section enters viewport
      if (sectionStartY === 0 && rect.top <= 0) {
        sectionStartY = currentScrollY;
      }
      
      // Reset if section is above viewport
      if (rect.bottom < 0) {
        sectionStartY = 0;
        setTranslateX(0);
        rafId = requestAnimationFrame(updateTransform);
        return;
      }

      // Calculate progress based on scroll distance
      const scrollDistance = 1000;
      const scrollDelta = currentScrollY - sectionStartY;
      const progress = Math.max(0, Math.min(1, scrollDelta / scrollDistance));
      
      // Map progress to translateX
      const maxTranslate = Math.max(0, contentWidth - viewportWidth);
      const newTranslateX = progress * maxTranslate;
      
      setTranslateX(newTranslateX);
      rafId = requestAnimationFrame(updateTransform);
    };

    rafId = requestAnimationFrame(updateTransform);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isInView, contentWidth, viewportWidth]);

  // Manual drag handlers (completely disables scroll when active)
  useEffect(() => {
    if (!isDragging) {
      isDraggingRef.current = false;
      return;
    }

    isDraggingRef.current = true;

    const handleMouseMove = (e: MouseEvent) => {
      if (!cardsRef.current) return;
      const deltaX = e.pageX - startX;
      const walk = deltaX * 2;
      const maxTranslate = Math.max(0, contentWidth - viewportWidth);
      // Flip the sign: dragging right should decrease translateX (content moves right)
      // Dragging left should increase translateX (content moves left)
      const newTranslateX = Math.max(0, Math.min(maxTranslate, scrollLeft - walk));
      setTranslateX(newTranslateX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      lastDragTimeRef.current = Date.now();
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startX, scrollLeft, contentWidth, viewportWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!cardsRef.current) return;
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(translateX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Handled by document-level listener in useEffect
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    // Don't stop dragging on mouse leave - let user drag outside
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cardsRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX);
    setScrollLeft(translateX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !cardsRef.current) return;
    e.preventDefault();
    isDraggingRef.current = true;
    const deltaX = e.touches[0].pageX - startX;
    const walk = deltaX * 2;
    const maxTranslate = Math.max(0, contentWidth - viewportWidth);
    // Flip the sign: dragging right should decrease translateX (content moves right)
    // Dragging left should increase translateX (content moves left)
    const newTranslateX = Math.max(0, Math.min(maxTranslate, scrollLeft - walk));
    setTranslateX(newTranslateX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    isDraggingRef.current = false;
    lastDragTimeRef.current = Date.now();
  };


  // Calculate opacity based on distance from center
  const getCardOpacity = useCallback((index: number) => {
    if (contentWidth <= viewportWidth) return 1;
    
    const cardCenter = index * (cardWidth + cardGap) + cardWidth / 2;
    const viewportCenter = viewportWidth / 2;
    const cardPosition = cardCenter - translateX;
    const distanceFromCenter = Math.abs(cardPosition - viewportCenter);
    const maxDistance = viewportWidth / 2 + cardWidth / 2;
    
    const opacity = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
    return opacity;
  }, [translateX, cardWidth, cardGap, viewportWidth, contentWidth]);

  return (
    <Box
      ref={sectionRef}
      component="section"
      className={className}
      sx={{
        position: 'relative',
        height: '100vh',
        backgroundColor: colors.background,
        paddingTop: { xs: '2rem', md: '3rem' },
      }}
    >
      <Box
        ref={containerRef}
        sx={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: colors.background,
        }}
      >
        <Container maxWidth="xl" sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
                fontWeight: 600,
                color: colors.text,
                mb: 2,
                fontFamily: '"Cinzel", serif',
              }}
            >
              What Our Customers Say
            </Typography>
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: colors.textSecondary,
                fontFamily: '"EB Garamond", serif',
                fontStyle: 'italic',
              }}
            >
              Real experiences from coffee lovers
            </Typography>
          </Box>

          <Box
            ref={cardsRef}
            sx={{
              display: 'flex',
              gap: { xs: 2, md: 4 },
              willChange: 'transform',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
            style={{
              transform: `translate3d(${-translateX}px, 0, 0)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {testimonials.map((testimonial, index) => {
              const opacity = getCardOpacity(index);
              
              return (
                <Box
                  key={testimonial.id}
                  data-testimonial-card
                  sx={{
                    flexShrink: 0,
                    width: { xs: '280px', sm: '360px', md: '480px', lg: '520px' },
                    padding: { xs: 3, md: 5 },
                    backgroundColor: isDarkMode 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '16px',
                    border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
                    opacity,
                    transition: 'opacity 0.3s ease',
                    backdropFilter: opacity < 0.5 ? 'blur(4px)' : 'none',
                    WebkitBackdropFilter: opacity < 0.5 ? 'blur(4px)' : 'none',
                  }}
                >
                  {/* Rating Dots */}
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 0.5,
                      mb: 3,
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: i < testimonial.rating 
                            ? (isDarkMode ? '#ffd700' : '#ff8c00')
                            : (isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'),
                        }}
                      />
                    ))}
                  </Box>

                  {/* Quote Text */}
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: { xs: '1.25rem', md: '1.75rem', lg: '2rem' },
                      fontWeight: 400,
                      lineHeight: 1.5,
                      color: colors.text,
                      mb: 4,
                      fontFamily: '"EB Garamond", serif',
                      fontStyle: 'italic',
                      minHeight: { xs: '120px', md: '160px' },
                    }}
                  >
                    "{testimonial.quote}"
                  </Typography>

                  {/* Author Info */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Avatar
                      src={testimonial.avatar}
                      sx={{
                        width: { xs: 48, md: 56 },
                        height: { xs: 48, md: 56 },
                        border: `2px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                      }}
                    >
                      {testimonial.author.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '1rem', md: '1.125rem' },
                          fontWeight: 600,
                          color: colors.text,
                          fontFamily: '"EB Garamond", serif',
                        }}
                      >
                        {testimonial.author}
                      </Typography>
                      {testimonial.role && (
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: '0.875rem', md: '0.9375rem' },
                            color: colors.textSecondary,
                            fontFamily: '"EB Garamond", serif',
                          }}
                        >
                          {testimonial.role}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HorizontalTestimonials;


