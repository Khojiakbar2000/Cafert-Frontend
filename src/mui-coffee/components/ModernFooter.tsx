import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  IconButton,
  Link,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon,
  LocalCafe as CafeIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ModernFooterProps {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textSecondary: string;
    border: string;
    surface?: string;
  };
}

const ModernFooter: React.FC<ModernFooterProps> = ({ colors }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Default colors if not provided
  const defaultColors = {
    primary: '#2C1810',
    secondary: '#8B4513',
    accent: '#D2691E',
    background: '#FDF6F0',
    text: '#2C1810',
    textSecondary: '#6B4423',
    border: '#E8D5C4',
    surface: '#F8F4F0'
  };

  const footerColors = colors || defaultColors;

  const socialLinks = [
    { icon: FacebookIcon, href: '#', label: 'Facebook' },
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: TwitterIcon, href: '#', label: 'Twitter' },
    { icon: YouTubeIcon, href: '#', label: 'YouTube' }
  ];

  const navigationLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Contact', href: '#contact' },
    { name: 'Blog', href: '#blog' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: footerColors.background,
        borderTop: `1px solid ${footerColors.border}`,
        padding: { xs: '3rem 0 2rem', md: '4rem 0 2rem' },
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.03,
          backgroundImage: `radial-gradient(circle at 25% 25%, ${footerColors.primary} 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, ${footerColors.primary} 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          backgroundPosition: '0 0, 25px 25px'
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and About Section */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '12px',
                    backgroundColor: footerColors.accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 12px rgba(210, 105, 30, 0.3)'
                  }}
                >
                  <CafeIcon sx={{ color: 'white', fontSize: 28 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: footerColors.text,
                    fontFamily: 'Playfair Display, serif',
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  Cafert
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: footerColors.textSecondary,
                  lineHeight: 1.7,
                  mb: 3,
                  fontSize: { xs: '0.9rem', md: '1rem' }
                }}
              >
                Experience the perfect blend of tradition and innovation in every cup. 
                Join our community of coffee lovers and discover the art of exceptional brewing.
              </Typography>
            </motion.div>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: footerColors.text,
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {navigationLinks.map((link, index) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    sx={{
                      color: footerColors.textSecondary,
                      textDecoration: 'none',
                      fontSize: { xs: '0.9rem', md: '1rem' },
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: footerColors.accent,
                        transform: 'translateX(5px)'
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Box>
            </motion.div>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: footerColors.text,
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: footerColors.textSecondary,
                    fontSize: { xs: '0.85rem', md: '0.9rem' }
                  }}
                >
                  123 Coffee Street, Brewtown, BT 12345
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: footerColors.textSecondary,
                    fontSize: { xs: '0.85rem', md: '0.9rem' }
                  }}
                >
                  Phone: (555) 123-4567
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: footerColors.textSecondary,
                    fontSize: { xs: '0.85rem', md: '0.9rem' }
                  }}
                >
                  Email: info@cafert.com
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          {/* Hours */}
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: footerColors.text,
                  fontWeight: 600,
                  mb: 2,
                  fontFamily: 'Playfair Display, serif',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Opening Hours
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: footerColors.textSecondary,
                      fontSize: { xs: '0.85rem', md: '0.9rem' }
                    }}
                  >
                    Monday - Friday
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: footerColors.text,
                      fontWeight: 500,
                      fontSize: { xs: '0.85rem', md: '0.9rem' }
                    }}
                  >
                    7:00 AM - 8:00 PM
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: footerColors.textSecondary,
                      fontSize: { xs: '0.85rem', md: '0.9rem' }
                    }}
                  >
                    Saturday - Sunday
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: footerColors.text,
                      fontWeight: 500,
                      fontSize: { xs: '0.85rem', md: '0.9rem' }
                    }}
                  >
                    8:00 AM - 9:00 PM
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Social Media and Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${footerColors.border}`,
            marginTop: { xs: 3, md: 4 },
            paddingTop: { xs: 2, md: 3 },
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'center' },
            gap: { xs: 2, md: 0 }
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {socialLinks.map((social, index) => (
                <IconButton
                  key={social.label}
                  href={social.href}
                  sx={{
                    backgroundColor: footerColors.surface || '#F8F4F0',
                    color: footerColors.textSecondary,
                    width: 45,
                    height: 45,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: footerColors.accent,
                      color: 'white',
                      transform: 'translateY(-3px)',
                      boxShadow: `0 6px 20px rgba(210, 105, 30, 0.4)`
                    }
                  }}
                >
                  <social.icon />
                </IconButton>
              ))}
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="body2"
              sx={{
                color: footerColors.textSecondary,
                textAlign: { xs: 'center', md: 'right' },
                fontSize: { xs: '0.8rem', md: '0.9rem' }
              }}
            >
              © {new Date().getFullYear()} Cafert. All rights reserved.
            </Typography>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default ModernFooter; 