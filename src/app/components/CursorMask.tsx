import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

/**
 * Global Cursor Mask / Reveal Effect Component
 * Creates a spotlight/reveal effect that follows the cursor across the entire website
 */
const CursorMask: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop (screen width > 960px)
    const isDesktop = window.innerWidth > 960;
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    // Add event listeners to document
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth <= 960) {
        setIsHovering(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 960) {
    return null;
  }

  return (
    <>
      {/* Cursor Mask Reveal Layer - covers entire viewport */}
      <Box
        ref={containerRef}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 9998,
          WebkitMaskImage: isHovering
            ? `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 65%)`
            : 'none',
          maskImage: isHovering
            ? `radial-gradient(circle 400px at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 65%)`
            : 'none',
          WebkitMaskComposite: 'source-over',
          maskComposite: 'add',
          transition: 'opacity 0.3s ease',
          opacity: isHovering ? 1 : 0,
          background: 'rgba(0, 0, 0, 0.4)',
          mixBlendMode: 'multiply',
        }}
      />

      {/* Custom Cursor Ring */}
      {isHovering && (
        <Box
          sx={{
            position: 'fixed',
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`,
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'opacity 0.2s ease',
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.15)',
            display: { xs: 'none', md: 'block' }
          }}
        />
      )}
    </>
  );
};

export default CursorMask;



