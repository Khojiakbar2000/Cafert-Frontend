import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';

interface CoffeeScrollCanvasProps {
  frameCount?: number;
}

interface TextBeat {
  start: number;
  end: number;
  title: string;
  subtitle: string;
  align: 'left' | 'center' | 'right';
}

const FRAME_COUNT = 240;
const BEATS: TextBeat[] = [
  {
    start: 0,
    end: 0.2,
    title: 'CRAFTED TO PERFECTION',
    subtitle: 'Every bean. Every frame.',
    align: 'center',
  },
  {
    start: 0.25,
    end: 0.45,
    title: 'ORIGIN & ROAST',
    subtitle: 'Sourced globally, roasted with precision',
    align: 'left',
  },
  {
    start: 0.5,
    end: 0.7,
    title: 'AROMA & TEXTURE',
    subtitle: 'Visualized flavor in motion',
    align: 'right',
  },
  {
    start: 0.75,
    end: 0.95,
    title: 'DISCOVER THE BREW',
    subtitle: 'Scroll. Sip. Experience.',
    align: 'center',
  },
];

const CoffeeScrollCanvas: React.FC<CoffeeScrollCanvasProps> = ({ frameCount = FRAME_COUNT }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  // Preload all images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises: Promise<HTMLImageElement>[] = [];
      
      for (let i = 1; i <= frameCount; i++) {
        const frameNumber = String(i).padStart(3, '0');
        const img = new Image();
        const promise = new Promise<HTMLImageElement>((resolve, reject) => {
          img.onload = () => {
            setImagesLoaded((prev) => {
              const newCount = prev + 1;
              setLoadProgress(newCount / frameCount);
              return newCount;
            });
            resolve(img);
          };
          img.onerror = reject;
          img.src = `/hero-section-jpg/ezgif-frame-${frameNumber}.jpg`;
        });
        imagePromises.push(promise);
      }

      try {
        const loadedImages = await Promise.all(imagePromises);
        setImages(loadedImages);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading images:', error);
        setIsLoading(false);
      }
    };

    loadImages();
  }, [frameCount]);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth scroll progress with spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Text animation helpers
  const getTextOpacity = useCallback((beat: TextBeat, progress: number) => {
    const { start, end } = beat;
    if (progress < start) return 0;
    if (progress > end) return 0;
    if (progress < start + 0.1) {
      return (progress - start) / 0.1;
    }
    if (progress > end - 0.1) {
      return (end - progress) / 0.1;
    }
    return 1;
  }, []);

  const getTextY = useCallback((beat: TextBeat, progress: number) => {
    const { start, end } = beat;
    if (progress < start) return 20;
    if (progress > end) return -20;
    if (progress < start + 0.1) {
      const t = (progress - start) / 0.1;
      return 20 * (1 - t);
    }
    if (progress > end - 0.1) {
      const t = (progress - (end - 0.1)) / 0.1;
      return -20 * t;
    }
    return 0;
  }, []);

  // Draw frame on canvas
  const drawFrame = useCallback(
    (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas || !images[index]) return;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Fill with exact background color for seamless blend
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const img = images[index];
      const { width, height } = canvas;

      // Calculate scaling to contain image (maintain aspect ratio)
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let drawX = 0;
      let drawY = 0;

      if (imgAspect > canvasAspect) {
        // Image is wider - fit to width
        drawHeight = width / imgAspect;
        drawY = (height - drawHeight) / 2;
      } else {
        // Image is taller - fit to height
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
      }

      // Draw image
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    },
    [images]
  );

  // Update canvas on frame change
  useEffect(() => {
    if (images.length === 0) return;

    let lastIndex = -1;

    const updateFrame = () => {
      const currentIndex = Math.min(
        Math.floor(smoothProgress.get() * frameCount),
        frameCount - 1
      );
      if (currentIndex !== lastIndex && currentIndex >= 0 && currentIndex < images.length) {
        drawFrame(currentIndex);
        lastIndex = currentIndex;
      }
      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    updateFrame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [images, drawFrame, frameCount, smoothProgress]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const currentIndex = Math.min(
        Math.floor(smoothProgress.get() * frameCount),
        frameCount - 1
      );
      if (currentIndex >= 0 && currentIndex < images.length) {
        drawFrame(currentIndex);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [drawFrame, frameCount, smoothProgress, images.length]);

  // Scroll indicator opacity
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.1],
    [1, 0]
  );

  // Create text transforms for all beats at the top level (must be individual, not in map)
  const beat0Opacity = useTransform(scrollYProgress, (progress) =>
    getTextOpacity(BEATS[0], progress)
  );
  const beat0Y = useTransform(scrollYProgress, (progress) =>
    getTextY(BEATS[0], progress)
  );

  const beat1Opacity = useTransform(scrollYProgress, (progress) =>
    getTextOpacity(BEATS[1], progress)
  );
  const beat1Y = useTransform(scrollYProgress, (progress) =>
    getTextY(BEATS[1], progress)
  );

  const beat2Opacity = useTransform(scrollYProgress, (progress) =>
    getTextOpacity(BEATS[2], progress)
  );
  const beat2Y = useTransform(scrollYProgress, (progress) =>
    getTextY(BEATS[2], progress)
  );

  const beat3Opacity = useTransform(scrollYProgress, (progress) =>
    getTextOpacity(BEATS[3], progress)
  );
  const beat3Y = useTransform(scrollYProgress, (progress) =>
    getTextY(BEATS[3], progress)
  );

  // Combine beats with their transforms
  const beatTransforms = [
    { beat: BEATS[0], opacity: beat0Opacity, y: beat0Y },
    { beat: BEATS[1], opacity: beat1Opacity, y: beat1Y },
    { beat: BEATS[2], opacity: beat2Opacity, y: beat2Y },
    { beat: BEATS[3], opacity: beat3Opacity, y: beat3Y },
  ];

  if (isLoading) {
    return (
      <div 
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: '#050505' }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-6"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderTopColor: 'rgba(255, 255, 255, 0.9)',
            }}
          />
          <div 
            className="w-64 h-1 rounded-full overflow-hidden mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <motion.div
              className="h-full"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                width: `${loadProgress * 100}%` 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${loadProgress * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p 
            className="text-sm"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            Loading {Math.round(loadProgress * 100)}%
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="relative" 
      style={{ height: '400vh', backgroundColor: '#050505' }}
    >
      {/* Sticky Canvas Container */}
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: '#050505' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ display: 'block', backgroundColor: '#050505' }}
        />

        {/* Text Overlays */}
        {beatTransforms.map(({ beat, opacity, y }, index) => {
          const alignClasses = {
            left: 'left-8 md:left-16',
            center: 'left-1/2 -translate-x-1/2',
            right: 'right-8 md:right-16',
          };

          return (
            <motion.div
              key={index}
              className={`absolute top-1/2 -translate-y-1/2 ${alignClasses[beat.align]} max-w-4xl px-4 md:px-8`}
              style={{
                opacity,
                y,
              }}
            >
              <motion.h2
                className="font-bold mb-4 md:mb-6"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 8rem)',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  letterSpacing: '-0.02em',
                  lineHeight: '1.1',
                  fontWeight: 700,
                }}
              >
                {beat.title}
              </motion.h2>
              <motion.p
                className="text-lg md:text-xl lg:text-2xl"
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  letterSpacing: '-0.01em',
                  lineHeight: '1.5',
                }}
              >
                {beat.subtitle}
              </motion.p>
            </motion.div>
          );
        })}

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <p
            className="text-sm mb-2"
            style={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Scroll to Explore
          </p>
          <div 
            className="w-px h-8 animate-pulse"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default CoffeeScrollCanvas;

