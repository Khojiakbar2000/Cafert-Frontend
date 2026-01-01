import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Box, Container, Typography } from '@mui/material';
import { useTheme as useThemeContext } from '../context/ThemeContext';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Showcase: React.FC = () => {
  const isTablet = useMediaQuery({ query: '(max-width: 1024px)' });
  const { colors } = useThemeContext();

  useGSAP(() => {
    if (!isTablet) {
      // Set initial states
      gsap.set('.showcase-video', {
        scale: 1,
        transformOrigin: 'center center'
      });
      
      // Mask starts small (portal closed)
      gsap.set('.masked-video', {
        WebkitMaskSize: '400px',
        maskSize: '400px'
      });
      
      gsap.set('.content', {
        opacity: 0,
        y: 50,
        transformOrigin: 'center center'
      });
      
      gsap.set('.video-overlay', {
        opacity: 0.3
      });
      
      gsap.set('.content-backdrop', {
        opacity: 0,
        backdropFilter: 'blur(0px)'
      });

      // Single timeline - cinematic structure
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: '#showcase',
          start: 'top top',
          end: 'bottom top', // Exactly 1 viewport (100vh)
          scrub: true, // 1:1 scroll mapping, no acceleration
          pin: true,
          anticipatePin: 1,
        }
      });

      // Phase 1: 0-60% - Portal opens (mask-size expands)
      timeline
        .to('.masked-video', {
          WebkitMaskSize: '1200px',
          maskSize: '1200px',
          ease: 'none',
          duration: 0.6
        }, 0)
        .to('.showcase-video', {
          scale: 1.08,
          ease: 'none',
          duration: 0.6
        }, 0)
        .to('.video-overlay', {
          opacity: 0.55,
          ease: 'none',
          duration: 0.6
        }, 0);

      // Phase 2: 60-85% - Content fades/slides in (after portal mostly opened)
      timeline
        .to('.content', {
          opacity: 1,
          y: 0,
          ease: 'none',
          duration: 0.25
        }, 0.6)
        .to('.video-overlay', {
          opacity: 0.65,
          ease: 'none',
          duration: 0.25
        }, 0.6);

      // Phase 3: 85-100% - Subtle blur + overlay polish (final)
      timeline
        .to('.content-backdrop', {
          opacity: 1,
          backdropFilter: 'blur(10px)',
          ease: 'none',
          duration: 0.15
        }, 0.85)
        .to('.video-overlay', {
          opacity: 0.7,
          ease: 'none',
          duration: 0.15
        }, 0.85);
    } else {
      // Mobile: Simple fade-in, no complex animations
      gsap.set('.content', {
        opacity: 0,
        y: 30
      });
      
      gsap.to('.content', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#showcase',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });
    }
  }, [isTablet]);

  return (
    <section 
      id="showcase"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh', // Section height matches pinned area
        overflow: 'hidden',
        backgroundImage: 'url(/coffee.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* White Overlay on Background Image - Same as Happy Coffee Time */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      
      {/* Single Masked Video Layer - Portal Effect */}
      <div className="media" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh', // Pin only first viewport
        zIndex: 1,
        overflow: 'hidden',
      }}>
        {/* Dark Overlay for Readability */}
        <div 
          className="video-overlay"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        
        {/* Masked Video - Logo as Window/Portal (stays centered, mask-size animates) */}
        <div 
          className="masked-video"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            // CSS Mask properties - logo as portal
            WebkitMaskImage: 'url(/img/misc/logo.webp)',
            maskImage: 'url(/img/misc/logo.webp)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            WebkitMaskSize: '400px',
            maskSize: '400px',
            overflow: 'hidden',
          }}
        >
          <video
            className="showcase-video"
            src="/videos/coffee.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transformOrigin: 'center center',
            }}
          />
        </div>
      </div>

      {/* Content with Backdrop Blur */}
      <div className="content-wrapper" style={{
        position: 'relative',
        zIndex: 4,
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Backdrop Blur Behind Content */}
        <div 
          className="content-backdrop"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(0px)',
            WebkitBackdropFilter: 'blur(0px)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
        
        {/* Content */}
        <div className="content" style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          transformOrigin: 'center center',
        }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
                <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontSize: { xs: '3rem', md: '5rem', lg: '6rem' },
                      fontWeight: 700,
                      color: '#fff',
                      textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
                      letterSpacing: '-0.02em',
                  textAlign: 'center',
                }}
              >
                Global Selection
                  </Typography>
            </Box>
          </Container>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
