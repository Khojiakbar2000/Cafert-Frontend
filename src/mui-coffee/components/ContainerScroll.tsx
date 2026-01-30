import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { Box } from '@mui/material';
import { useTheme as useThemeContext } from '../context/ThemeContext';

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}

export const ContainerScroll: React.FC<ContainerScrollProps> = ({
  titleComponent,
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode } = useThemeContext();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.7, 0.9] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      style={{
        height: isMobile ? '60rem' : '80rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: isMobile ? '0.5rem' : '5rem',
      }}
    >
      <div
        style={{
          paddingTop: isMobile ? '2.5rem' : '10rem',
          paddingBottom: isMobile ? '2.5rem' : '10rem',
          width: '100%',
          position: 'relative',
          perspective: '1000px',
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale} isDarkMode={isDarkMode}>
          {children}
        </Card>
      </div>
    </div>
  );
};

interface HeaderProps {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ translate, titleComponent }) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
        {titleComponent}
      </div>
    </motion.div>
  );
};

interface CardProps {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
  isDarkMode: boolean;
}

const Card: React.FC<CardProps> = ({
  rotate,
  scale,
  children,
  isDarkMode,
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        maxWidth: '80rem',
        margin: '-3rem auto 0',
        height: '30rem',
        width: '100%',
        border: '4px solid',
        borderColor: isDarkMode ? '#6C6C6C' : '#CCCCCC',
        padding: '0.5rem',
        backgroundColor: isDarkMode ? '#222222' : '#F5F5F5',
        borderRadius: '30px',
        boxShadow:
          '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
      }}
    >
      <div
        style={{
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#f3f4f6',
          padding: '1rem',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
