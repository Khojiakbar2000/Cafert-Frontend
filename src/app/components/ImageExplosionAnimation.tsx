import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';

interface ImageExplosionAnimationProps {
  images?: string[];
  footerRef?: React.RefObject<HTMLElement>;
}

/**
 * Image Explosion Animation Component
 * Based on codegrid-image-explosion-scroll-animation
 * Exact implementation from the original folder
 */
const ImageExplosionAnimation: React.FC<ImageExplosionAnimationProps> = ({
  images,
  footerRef: externalFooterRef
}) => {
  const explosionContainerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement | null>(null);
  const [explosionTriggered, setExplosionTriggered] = useState(false);
  const particlesRef = useRef<any[]>([]);

  const config = {
    gravity: 0.25,
    friction: 0.99,
    imageSize: 150,
    horizontalForce: 20,
    verticalForce: 15,
    rotationSpeed: 10,
    resetDelay: 500,
  };

  const imageParticleCount = 15;
  // Use images from codegrid folder - exact path as in original
  const defaultImages = Array.from(
    { length: imageParticleCount },
    (_, i) => `/codegrid-image-explosion-scroll-animation-nextjs/public/assets/img${i + 1}.jpg`
  );

  const imagePaths = images || defaultImages;

  class Particle {
    element: HTMLImageElement | null;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;

    constructor(element: HTMLImageElement) {
      this.element = element;
      this.x = 0;
      this.y = 0;
      this.vx = (Math.random() - 0.5) * config.horizontalForce;
      this.vy = -config.verticalForce - Math.random() * 10;
      this.rotation = 0;
      this.rotationSpeed = (Math.random() - 0.5) * config.rotationSpeed;
    }

    update() {
      this.vy += config.gravity;
      this.vx *= config.friction;
      this.vy *= config.friction;
      this.rotationSpeed *= config.friction;

      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.element) {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
      }
    }
  }

  const createParticles = () => {
    if (!explosionContainerRef.current) return;

    explosionContainerRef.current.innerHTML = '';
    particlesRef.current = [];

    imagePaths.forEach((path) => {
      const particle = document.createElement('img');
      particle.src = path;
      particle.classList.add('explosion-particle-img');
      particle.style.width = `${config.imageSize}px`;
      explosionContainerRef.current?.appendChild(particle);
    });

    const particleElements = explosionContainerRef.current.querySelectorAll(
      '.explosion-particle-img'
    ) as NodeListOf<HTMLImageElement>;
    particlesRef.current = Array.from(particleElements).map(
      (element) => new Particle(element)
    );
  };

  const explode = () => {
    if (explosionTriggered) return;
    setExplosionTriggered(true);

    createParticles();

    let animationId: number;
    let finished = false;

    const animate = () => {
      if (finished) return;

      particlesRef.current.forEach((particle) => particle.update());

      if (
        explosionContainerRef.current &&
        particlesRef.current.every(
          (particle) =>
            particle.y > explosionContainerRef.current!.offsetHeight / 2
        )
      ) {
        cancelAnimationFrame(animationId);
        finished = true;
        setTimeout(() => {
          setExplosionTriggered(false);
        }, config.resetDelay);
        return;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
  };

  const checkFooterPosition = () => {
    const footer = externalFooterRef?.current || footerRef.current;
    if (!footer) return;

    const footerRect = footer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Exact same trigger condition as original
    if (
      !explosionTriggered &&
      footerRect.top <= viewportHeight - footerRect.height * 0.5
    ) {
      explode();
    }
  };

  useEffect(() => {
    // Preload images
    imagePaths.forEach((path) => {
      const img = new Image();
      img.src = path;
    });

    // Find footer - use external ref if provided, otherwise query
    footerRef.current = externalFooterRef?.current || 
      (document.querySelector('footer') as HTMLElement);

    createParticles();

    let checkTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(checkFooterPosition, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    setTimeout(checkFooterPosition, 500);

    const handleResize = () => {
      setExplosionTriggered(false);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      clearTimeout(checkTimeout);
    };
  }, [externalFooterRef, imagePaths]);

  return (
    <Box
      ref={explosionContainerRef}
      className="explosion-container"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default ImageExplosionAnimation;



