import React, { useState } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTheme as useCoffeeTheme } from '../context/ThemeContext';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface MenuNote {
  name: string;
  description: string;
  price: number;
}

interface ImageRightSectionProps {
  imageSrc?: string;
  className?: string;
  copyVariant?: 1 | 2 | 3;
  featuredProducts?: MenuNote[];
}

const copyVariants = [
  {
    headline: 'Crafted with intention',
    body: 'Each detail thoughtfully considered, every element purposefully placed.'
  },
  {
    headline: 'Where quality meets care',
    body: 'Thoughtful selection, meticulous preparation, exceptional results.'
  },
  {
    headline: 'Designed to elevate',
    body: 'A commitment to excellence reflected in every choice we make.'
  }
];

const ImageRightSection: React.FC<ImageRightSectionProps> = ({
  imageSrc = '/img/coffee/craft-cappuccino-cutout.webp',
  className,
  copyVariant = 1,
  featuredProducts = [],
}) => {
  const { isDarkMode } = useCoffeeTheme();
  const copy = copyVariants[copyVariant - 1] || copyVariants[0];
  const [isOpen, setIsOpen] = useState(false);
  const [textRef, isInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const reduceMotion = useReducedMotion();
  const menuId = 'cafert-cup-menu-notes';
  const paper = isDarkMode ? '#e8d5b8' : '#fbf2e2';
  const ink = '#493522';
  const notes = featuredProducts
    .filter((product) => product.name && product.description && product.description !== 'No description available')
    .slice(0, 3);

  const toggleSleeve = () => setIsOpen((open) => !open);

  return (
    <Box
      component="section"
      className={className}
      sx={{
        backgroundColor: isDarkMode ? '#211d18' : '#faf7f0',
        borderTop: `1px solid ${isDarkMode ? '#42372a' : '#e9dfd1'}`,
        borderBottom: `1px solid ${isDarkMode ? '#42372a' : '#e9dfd1'}`,
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '.78fr 1.22fr' },
            gap: { xs: 4, md: 7 },
            alignItems: 'center',
          }}
        >
          <Box
            ref={textRef}
            sx={{
              order: { xs: 1, md: 1 },
              maxWidth: 390,
              mx: { xs: 'auto', md: 0 },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            <Typography sx={{ mb: 1.5, color: isDarkMode ? '#c59a6a' : '#9e7046', fontSize: '.75rem', fontWeight: 800, letterSpacing: '.16em' }}>
              A SMALL CAFÉ RITUAL
            </Typography>
            <Typography
              component={motion.h2}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.2, 0.75, 0.25, 1] }}
              sx={{
                m: 0,
                color: isDarkMode ? '#f1e6d6' : '#34271c',
                fontFamily: 'Georgia, serif',
                fontWeight: 500,
                fontSize: { xs: '2.35rem', sm: '2.8rem', md: '3.25rem' },
                lineHeight: 1.02,
                letterSpacing: '-.035em',
              }}
            >
              {copy.headline}
            </Typography>
            <Typography sx={{ mt: 2, color: isDarkMode ? '#d0c3b2' : '#66594a', fontSize: { xs: '1rem', md: '1.08rem' }, lineHeight: 1.65, maxWidth: 350, mx: { xs: 'auto', md: 0 } }}>
              {copy.body}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 1.25, color: isDarkMode ? '#c59a6a' : '#9e7046' }}>
              <Box sx={{ width: 38, height: 1, backgroundColor: 'currentColor' }} />
              <Typography sx={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1rem' }}>A good thing, made with care.</Typography>
            </Box>
          </Box>

          <Box component="figure" sx={{ m: 0, order: { xs: 2, md: 2 }, width: '100%', maxWidth: 750, mx: 'auto' }}>
            <Box
              sx={{
                position: 'relative',
                minHeight: { xs: 330, sm: 410, md: 470 },
                overflow: 'hidden',
                isolation: 'isolate',
                backgroundColor: isDarkMode ? '#362c20' : '#eee3d0',
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(92,64,36,.035) 0, rgba(92,64,36,.035) 1px, transparent 1px, transparent 5px)',
                clipPath: 'polygon(1% 1%, 18% 0, 34% 1%, 53% 0, 72% 1%, 99% 0, 100% 19%, 99% 39%, 100% 61%, 99% 81%, 100% 99%, 81% 100%, 62% 99%, 41% 100%, 20% 99%, 0 100%, 1% 79%, 0 59%, 1% 39%, 0 20%)',
                '&::before': {
                  content: '""', position: 'absolute', zIndex: -1,
                  left: '8%', right: '8%', top: '10%', bottom: '8%',
                  background: isDarkMode ? '#4a3b2a' : '#f7eedf',
                  clipPath: 'polygon(0 3%, 18% 0, 36% 2%, 55% 0, 75% 2%, 100% 0, 98% 100%, 77% 98%, 58% 100%, 39% 98%, 20% 100%, 0 98%)',
                  transform: 'rotate(-1deg)',
                },
              }}
            >
              <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 68% 23%, rgba(255,255,255,.48), transparent 44%)', pointerEvents: 'none' }} />

              <Box
                sx={{
                  position: 'absolute', bottom: { xs: '-3%', md: '-4%' }, left: { xs: '-7%', sm: '-2%' },
                  width: { xs: '84%', sm: '76%' }, aspectRatio: '3 / 2', zIndex: 2,
                  filter: 'drop-shadow(0 16px 10px rgba(51,34,18,.23))',
                }}
              >
                <Box component="img" src={imageSrc} alt="A cappuccino in a handmade ceramic cup with biscotti" sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
                {/* A paper order tab tucked under the saucer unfolds into menu notes. */}
                <Box
                  component="button"
                  type="button"
                  aria-label={isOpen ? 'Fold the menu tab back' : 'Lift the menu tab to reveal Cafert menu notes'}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={toggleSleeve}
                  sx={{
                    appearance: 'none', border: 0, cursor: 'pointer', padding: 0,
                    position: 'absolute', left: '10%', top: '72%', width: '42%', height: '17%',
                    zIndex: 4, transformOrigin: '50% 0%',
                    transform: isOpen ? 'perspective(600px) rotateX(-128deg) translateY(-4px)' : 'perspective(600px) rotateX(0deg)',
                    transition: reduceMotion ? 'none' : 'transform .58s cubic-bezier(.2,.72,.2,1)',
                    backfaceVisibility: 'hidden',
                    color: ink,
                    backgroundColor: paper,
                    backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 12px, rgba(94,62,34,.045) 12px 13px)',
                    clipPath: 'polygon(3% 0, 97% 0, 100% 96%, 78% 100%, 53% 97%, 27% 100%, 0 96%)',
                    boxShadow: '0 8px 8px rgba(48,31,15,.18)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px',
                    fontFamily: 'Georgia, serif',
                    '&:focus-visible': { outline: '3px solid #a66d43', outlineOffset: 2 },
                    '&::before': { content: '""', position: 'absolute', top: 5, left: 6, right: 6, bottom: 5, border: '1px dashed rgba(78,53,30,.35)', pointerEvents: 'none' },
                  }}
                >
                  <Box component="span" sx={{ fontSize: { xs: '.58rem', sm: '.69rem' }, fontWeight: 800, letterSpacing: '.12em', position: 'relative' }}>CAFERT · HOUSE NOTES</Box>
                  <Box component="span" sx={{ fontSize: { xs: '.78rem', sm: '.94rem' }, fontStyle: 'italic', position: 'relative' }}>{isOpen ? 'Tuck it back' : 'Lift to unfold'}</Box>
                </Box>
              </Box>

              <Box component="img" src="/img/coffee/cafert-counter-barista.webp" alt="" sx={{ position: 'absolute', zIndex: 3, width: { xs: '37%', sm: '31%' }, height: { xs: '78%', sm: '88%' }, right: { xs: '-1%', sm: '2%' }, bottom: '-2%', objectFit: 'contain', objectPosition: 'bottom right', filter: 'drop-shadow(0 9px 6px rgba(54,35,18,.2))', pointerEvents: 'none' }} />

              <Box sx={{ position: 'absolute', right: { xs: 12, sm: 24 }, top: { xs: 16, sm: 24 }, zIndex: 4, transform: 'rotate(4deg)', px: 1.5, py: .7, background: '#b57850', color: '#fff8ec', border: '2px solid #f7ead7', boxShadow: '2px 4px 0 rgba(66,43,22,.18)', fontFamily: 'Georgia, serif', fontWeight: 700, letterSpacing: '.1em', fontSize: '.76rem' }}>
                MADE WITH CARE
              </Box>
            </Box>

            <Box id={menuId} aria-live="polite" sx={{ overflow: 'hidden' }}>
              <motion.div
                initial={false}
                aria-hidden={!isOpen}
                animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -8 }}
                transition={{ duration: reduceMotion ? 0 : .42, ease: [0.2, .75, .25, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <Box sx={{ mt: -1, position: 'relative', px: { xs: 2.5, sm: 4 }, pt: 2.5, pb: 2, color: ink, background: paper, clipPath: 'polygon(0 3%, 5% 0, 10% 3%, 15% 0, 20% 2%, 25% 0, 30% 3%, 35% 0, 40% 2%, 45% 0, 50% 3%, 55% 0, 60% 2%, 65% 0, 70% 3%, 75% 0, 80% 2%, 85% 0, 90% 3%, 95% 0, 100% 2%, 100% 100%, 0 100%)', boxShadow: '0 8px 20px rgba(51,34,18,.12)' }}>
                  <Typography sx={{ mb: 1.25, fontFamily: 'Georgia, serif', fontSize: '1.22rem', fontWeight: 700 }}>A few things on the menu</Typography>
                  {notes.length ? notes.map((product, index) => (
                    <Box key={`${product.name}-${index}`} sx={{ display: 'grid', gridTemplateColumns: '1fr auto', columnGap: 2, py: 1.15, borderTop: '1px dashed rgba(78,53,30,.3)' }}>
                      <Box>
                        <Typography sx={{ fontFamily: 'Georgia, serif', fontWeight: 700, color: ink }}>{product.name}</Typography>
                        <Typography sx={{ mt: .25, fontSize: '.88rem', lineHeight: 1.45, color: '#745e48' }}>{product.description}</Typography>
                      </Box>
                      <Typography sx={{ alignSelf: 'start', fontWeight: 800, color: '#8c5836' }}>${product.price}</Typography>
                    </Box>
                  )) : (
                    <Typography sx={{ py: 1.5, borderTop: '1px dashed rgba(78,53,30,.3)', color: '#745e48' }}>The menu notes will appear as soon as the menu is ready.</Typography>
                  )}
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ImageRightSection;
