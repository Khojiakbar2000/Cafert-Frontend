import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useScroll, useTransform, motion } from 'framer-motion';

interface CinematicHeroProps {
  /**
   * Base path for the image sequence frames
   * Frames should be named sequentially: frame-001.jpg, frame-002.jpg, etc.
   */
  imagePath?: string;
  /**
   * Total number of frames in the sequence
   */
  frameCount?: number;
  /**
   * Hero headline text
   */
  headline?: string;
  /**
   * Hero subheadline text
   */
  subheadline?: string;
  /**
   * CTA button text
   */
  ctaText?: string;
  /**
   * CTA button click handler
   */
  onCtaClick?: () => void;
}

/**
 * Cinematic Hero Section with Scroll-Linked Image Sequence Animation
 * 
 * As the user scrolls, the image sequence scrubs forward/backward,
 * creating a "time-freeze" effect where ice cubes and liquid splashes
 * appear to lift and suspend around a centered beverage cup.
 */
const CinematicHero: React.FC<CinematicHeroProps> = ({
  imagePath = '/coffee-jpg/ezgif-frame-',
  frameCount = 240,
  headline = 'Experience the Perfect Moment',
  subheadline = 'Where every sip tells a story',
  ctaText = 'Explore Our Menu',
  onCtaClick,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null); // Outer section for scroll tracking
  const heroRef = useRef<HTMLDivElement>(null); // Inner sticky hero container
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationFrameRef = useRef<number>();

  // Get scroll progress (0 to 1) for the outer section
  // Scroll lock: Tracks scroll through the entire pinned section (400vh)
  // The hero stays pinned until scrollYProgress reaches 1
  // Only then can the user scroll to the next section (scroll lock releases)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // Use scroll progress directly (smooth enough for cinematic motion)
  const smoothProgress = scrollYProgress;

  // Map scroll progress (0 → 1) directly to frame index (0 → frameCount-1)
  // Scroll lock behavior:
  // - Progress 0 → Frame 0 (first frame, scroll lock active)
  // - Progress 0.5 → Frame 120 (middle frame, still locked)
  // - Progress 1 → Frame 239 (final frame, scroll lock releases)
  // The animation must complete fully before the next section becomes visible
  const frameIndex = useTransform(smoothProgress, (progress) => {
    // Clamp progress between 0 and 1
    const clampedProgress = Math.max(0, Math.min(1, progress));
    // Map to frame index (0 to frameCount-1)
    // Final frame only shows when progress = 1, ensuring animation completes
    return Math.floor(clampedProgress * (frameCount - 1));
  });

  // Storytelling Text Overlays - Apple-style beats with scroll-linked animations
  
  // Beat A — 0–20% scroll: "Artisan Crafted"
  // Opacity: 0 → 1 → 1 → 0 (fade in, hold, fade out)
  const beatAOpacity = useTransform(smoothProgress, [0, 0.1, 0.2, 0.25], [0, 1, 1, 0]);
  // Y: 20px → 0px (slight ease-in, calm, intentional)
  const beatAY = useTransform(smoothProgress, [0, 0.2], [20, 0]);
  
  // Beat B — 25–45% scroll: "Nothing Accidental"
  // Opacity: 0 → 1 → 1 → 0
  const beatBOpacity = useTransform(smoothProgress, [0.25, 0.35, 0.45, 0.5], [0, 1, 1, 0]);
  // Y: 30px → 0px (slight parallax slower than scroll, text feels "locked")
  const beatBY = useTransform(smoothProgress, [0.25, 0.45], [30, 0]);
  
  // Beat C — 50–70% scroll: "When Energy Meets Control"
  // Opacity: 0 → 1 → 1 → 0
  const beatCOpacity = useTransform(smoothProgress, [0.5, 0.6, 0.7, 0.75], [0, 1, 1, 0]);
  // Y: 40px → 0px (stronger spring damping)
  const beatCY = useTransform(smoothProgress, [0.5, 0.7], [40, 0]);
  // Scale: 0.98 → 1 (slight scale-in)
  const beatCScale = useTransform(smoothProgress, [0.5, 0.7], [0.98, 1]);
  
  // Beat D — 75–95% scroll: "Cafert"
  // Opacity: 0 → 1 → 1 → 0
  const beatDOpacity = useTransform(smoothProgress, [0.75, 0.85, 0.95, 1], [0, 1, 1, 0]);
  // Y: 20px → 0px (everything feels resolved, premium, calm again)
  const beatDY = useTransform(smoothProgress, [0.75, 0.95], [20, 0]);

  /**
   * Preload all image frames before playback
   */
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];

      for (let i = 1; i <= frameCount; i++) {
        const frameNumber = i.toString().padStart(3, '0');
        const imageUrl = `${imagePath}${frameNumber}.jpg`;

        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.warn(`Failed to load frame ${frameNumber}`);
            // Create a placeholder image if frame fails to load
            const placeholder = new Image();
            placeholder.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMzMzMyIvPjwvc3ZnPg==';
            resolve(placeholder);
          };
          img.src = imageUrl;
        });

        imagePromises.push(promise);
      }

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setImagesLoaded(true);
        console.log(`Successfully loaded ${loadedImages.length} frames`);
      } catch (error) {
        console.error('Error loading image sequence:', error);
      }
    };

    loadImages();
  }, [imagePath, frameCount]);

  /**
   * Set body background to black to prevent white screen
   */
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.background = '#000';
    return () => {
      // Reset on unmount if needed
      document.body.style.background = '';
    };
  }, []);

  /**
   * Draw the FIRST frame immediately after preload
   * The canvas must draw frame 0 immediately after preload; otherwise the pinned hero appears white.
   */
  useEffect(() => {
    if (!imagesLoaded || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const hero = heroRef.current;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }

    // Draw frame 0 immediately
    const firstImage = images[0];
    if (firstImage && firstImage.complete) {
      // Calculate aspect ratio and scaling
      const imageAspect = firstImage.width / firstImage.height;
      const canvasAspect = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > canvasAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Clear and draw first frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(firstImage, offsetX, offsetY, drawWidth, drawHeight);
    }
  }, [imagesLoaded, images]);

  /**
   * Draw current frame to canvas using requestAnimationFrame for performance
   */
  const drawFrame = useCallback(
    (frameIdx: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !imagesLoaded || images.length === 0) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clamp frame index to valid range
      const clampedFrame = Math.max(0, Math.min(frameIdx, images.length - 1));
      const image = images[clampedFrame];

      if (!image || !image.complete) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate aspect ratio and scaling to maintain image proportions
      const imageAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;

      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      if (imageAspect > canvasAspect) {
        // Image is wider - fit to height
        drawHeight = canvas.height;
        drawWidth = drawHeight * imageAspect;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        // Image is taller - fit to width
        drawWidth = canvas.width;
        drawHeight = drawWidth / imageAspect;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      // Draw the frame
      ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
    },
    [images, imagesLoaded]
  );

  /**
   * Subscribe to frame index changes and update canvas
   */
  useEffect(() => {
    if (!imagesLoaded) return;

    const unsubscribe = frameIndex.on('change', (latest) => {
      const frameIdx = Math.round(latest);
      setCurrentFrame(frameIdx);

      // Use requestAnimationFrame for smooth rendering
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        drawFrame(frameIdx);
      });
    });

    return () => {
      unsubscribe();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frameIndex, imagesLoaded, drawFrame]);

  /**
   * Set canvas size on mount and resize
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateCanvasSize = () => {
      const hero = heroRef.current;
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Redraw current frame after resize
      if (imagesLoaded) {
        drawFrame(currentFrame);
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, [imagesLoaded, currentFrame, drawFrame]);

  return (
    <Box
      ref={sectionRef}
      component="section"
      className="scroll-space"
      sx={{
        height: '400vh', // Scroll timeline only - no visual content here
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Pin layer - sticky container that stays visible */}
      <Box
        ref={heroRef}
        className="pin-layer"
        sx={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          background: '#000', // Force black background to prevent white screen
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Canvas for rendering image sequence */}
        <Box
          component="canvas"
          ref={canvasRef}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        />

        {/* Loading overlay */}
        {!imagesLoaded && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1b1b1b',
              zIndex: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: '#fff' }}>
              Loading cinematic experience...
            </Typography>
          </Box>
        )}

        {/* Storytelling Text Overlays - Apple-style beats */}
        <Container
          maxWidth="lg"
          className="overlay-text"
          sx={{
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            px: { xs: 3, md: 4 },
            pointerEvents: 'none',
          }}
        >
        {/* Beat A — 0–20% scroll: Artisan Crafted */}
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
          }}
          style={{
            opacity: beatAOpacity,
            y: beatAY,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
              fontWeight: 700,
              color: '#ffffff',
              mb: 2,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Artisan Crafted
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 400,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            The perfect balance of earth and energy.
          </Typography>
        </Box>

        {/* Beat B — 25–45% scroll: Nothing Accidental */}
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
          }}
          style={{
            opacity: beatBOpacity,
            y: beatBY,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
              fontWeight: 700,
              color: '#ffffff',
              mb: 2,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Nothing Accidental
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 400,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            Every layer. Every degree. Every second.
          </Typography>
        </Box>

        {/* Beat C — 50–70% scroll: When Energy Meets Control */}
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
          }}
          style={{
            opacity: beatCOpacity,
            y: beatCY,
            scale: beatCScale,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
              fontWeight: 700,
              color: '#ffffff',
              mb: 2,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            When Energy Meets Control
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 400,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            Frozen at the exact moment it comes alive.
          </Typography>
        </Box>

        {/* Beat D — 75–95% scroll: Cafert */}
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
          }}
          style={{
            opacity: beatDOpacity,
            y: beatDY,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem', lg: '7rem' },
              fontWeight: 700,
              color: '#ffffff',
              mb: 2,
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            Cafert
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 400,
              mb: 4,
              textShadow: '0 2px 15px rgba(0, 0, 0, 0.5)',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
              letterSpacing: '0.01em',
            }}
          >
            Crafted to move you.
          </Typography>
          {/* Optional CTA - only visible in Beat D */}
          <motion.div
            style={{
              opacity: beatDOpacity,
              pointerEvents: 'auto',
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onCtaClick}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '50px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                textTransform: 'none',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.4)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Explore the Collection
            </Button>
          </motion.div>
        </Box>
        </Container>

        {/* Scroll indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            display: { xs: 'none', md: 'block' },
          }}
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Scroll to explore
            </Typography>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

export default CinematicHero;
