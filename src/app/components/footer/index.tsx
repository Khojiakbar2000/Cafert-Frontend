// @ts-nocheck
import React from 'react';
import {
  Box,
  Container,
  Typography,
  IconButton,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
  Chip
} from '@mui/material';

import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  LinkedIn as LinkedInIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  ArrowUpward as ArrowUpIcon,
  LocalCafe as CoffeeIcon,
  Favorite as HeartIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useGlobals } from '../../hooks/useGlobals';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { authMember } = useGlobals();
  const theme = useTheme();
  const { t } = useTranslation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t('footer.quickLinks'),
      links: [
        { label: t('navigation.home'), path: '/' },
        { label: t('navigation.products'), path: '/products' },
        { label: t('navigation.drinks'), path: '/coffees' },
        { label: t('navigation.about'), path: '/help' },
        ...(authMember ? [{ label: t('navigation.orders'), path: '/orders' }] : []),
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { label: t('footer.dineIn'), path: '/services/dine-in' },
        { label: t('footer.takeaway'), path: '/services/takeaway' },
        { label: t('footer.delivery'), path: '/services/delivery' },
        { label: t('footer.catering'), path: '/services/catering' },
        { label: t('footer.events'), path: '/services/events' },
      ]
    },
    {
      title: t('footer.aboutUs'),
      links: [
        { label: t('footer.ourStory'), path: '/about/story' },
        { label: t('footer.team'), path: '/about/team' },
        { label: t('footer.careers'), path: '/about/careers' },
        { label: t('footer.press'), path: '/about/press' },
        { label: t('footer.blog'), path: '/blog' },
      ]
    }
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: 'https://facebook.com', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com', label: 'Instagram' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com', label: 'YouTube' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  const contactInfo = [
    { icon: <LocationIcon />, label: 'Location', value: 'Downtown, New York', action: () => window.open('https://maps.google.com') },
    { icon: <PhoneIcon />, label: 'Phone', value: '+971 4 554 7777', action: () => window.open('tel:+97145547777') },
    { icon: <EmailIcon />, label: 'Email', value: 'info@coffeeshop.com', action: () => window.open('mailto:info@coffeeshop.com') },
    { icon: <TimeIcon />, label: 'Hours', value: '24/7 Service', action: null },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #8B4513, #A0522D, #CD853F, #D2691E, #8B4513)',
          backgroundSize: '200% 100%',
          animation: 'gradientShift 3s ease-in-out infinite',
        },
        '@keyframes gradientShift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 6,
          flexWrap: 'wrap'
        }}>
          {/* Company Info */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 35%' }, minWidth: { lg: '350px' } }}>
            <Box sx={{ mb: 5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <CoffeeIcon sx={{ fontSize: 48, color: '#8B4513', mr: 3 }} />
                <Typography
                  variant="h3"
                  sx={{
                    color: '#fff',
                    fontWeight: 800,
                    fontStyle: 'italic',
                    letterSpacing: '-0.03em',
                    fontSize: { xs: '2.5rem', md: '3rem' }
                  }}
                >
                  Cafert
                </Typography>
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  lineHeight: 1.8, 
                  color: '#d0d0d0',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  fontWeight: 400
                }}
              >
                {t('footer.aboutText')}
              </Typography>
              
              {/* Social Media */}
              <Box sx={{ mb: 5 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    color: '#fff', 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  {t('footer.social')}
                </Typography>
                <Stack direction="row" spacing={2}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: 'rgba(139, 69, 19, 0.15)',
                        color: '#8B4513',
                        width: 56,
                        height: 56,
                        '&:hover': {
                          backgroundColor: '#8B4513',
                          color: '#fff',
                          transform: 'translateY(-4px) scale(1.1)',
                          boxShadow: '0 8px 25px rgba(139, 69, 19, 0.4)',
                        },
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '& svg': {
                          fontSize: 28,
                        }
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>

              {/* Newsletter Signup */}
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    mb: 3, 
                    color: '#fff', 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '1.75rem' }
                  }}
                >
                  {t('footer.stayUpdated')}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 3, 
                    color: '#d0d0d0',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: 400
                  }}
                >
                  {t('footer.newsletterText')}
                </Typography>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#8B4513',
                    borderWidth: 2,
                    color: '#8B4513',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#A0522D',
                      backgroundColor: 'rgba(139, 69, 19, 0.15)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(139, 69, 19, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('footer.subscribe')}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 30%' }, minWidth: { lg: '300px' } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              flexWrap: 'wrap'
            }}>
              {footerSections.map((section, index) => (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: { md: '200px' } }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      mb: 4, 
                      color: '#fff', 
                      fontWeight: 700,
                      fontSize: { xs: '1.4rem', md: '1.6rem' }
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={2}>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.path}
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#d0d0d0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: { xs: '1rem', md: '1.1rem' },
                            fontWeight: 500,
                            '&:hover': {
                              color: '#8B4513',
                              transform: 'translateX(8px)',
                              fontWeight: 600,
                            }
                          }}
                        >
                          {link.label}
                        </Typography>
                      </Link>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Contact Information */}
          <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 35%' }, minWidth: { lg: '350px' } }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                color: '#fff', 
                fontWeight: 700,
                fontSize: { xs: '1.5rem', md: '1.75rem' }
              }}
            >
              Contact Information
            </Typography>
            <Stack spacing={3}>
              {contactInfo.map((contact, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: contact.action ? 'pointer' : 'default',
                    p: 2,
                    borderRadius: 2,
                    '&:hover': contact.action ? {
                      transform: 'translateX(8px)',
                      backgroundColor: 'rgba(139, 69, 19, 0.1)',
                      transition: 'all 0.3s ease',
                    } : {},
                  }}
                  onClick={contact.action || undefined}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(139, 69, 19, 0.2)',
                      borderRadius: '50%',
                      p: 2,
                      mr: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 56,
                      minHeight: 56,
                    }}
                  >
                    {React.cloneElement(contact.icon, { 
                      sx: { fontSize: 28, color: '#8B4513' } 
                    })}
                  </Box>
                  <Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#8B4513', 
                        fontWeight: 700,
                        fontSize: { xs: '1.1rem', md: '1.2rem' },
                        mb: 0.5
                      }}
                    >
                      {contact.label}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: '#d0d0d0',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: 400
                      }}
                    >
                      {contact.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Opening Hours */}
            <Box sx={{ mt: 5 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mb: 3, 
                  color: '#fff', 
                  fontWeight: 700,
                  fontSize: { xs: '1.4rem', md: '1.6rem' }
                }}
              >
                Opening Hours
              </Typography>
              <Stack spacing={2}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(139, 69, 19, 0.1)',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#d0d0d0',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 500
                    }}
                  >
                    Monday - Friday
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#8B4513', 
                      fontWeight: 700,
                      fontSize: { xs: '1rem', md: '1.1rem' }
                    }}
                  >
                    7:00 AM - 10:00 PM
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(139, 69, 19, 0.1)',
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#d0d0d0',
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      fontWeight: 500
                    }}
                  >
                    Saturday - Sunday
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#8B4513', 
                      fontWeight: 700,
                      fontSize: { xs: '1rem', md: '1.1rem' }
                    }}
                  >
                    8:00 AM - 11:00 PM
                  </Typography>
                </Box>
                <Chip
                  label="24/7 Online Ordering"
                  size="large"
                  sx={{
                    backgroundColor: 'rgba(139, 69, 19, 0.25)',
                    color: '#8B4513',
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: 48,
                    alignSelf: 'flex-start',
                    '& .MuiChip-label': {
                      fontSize: '1rem',
                      fontWeight: 700,
                    }
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Bottom Section */}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.15)', borderWidth: 2 }} />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          gap: 3
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#d0d0d0', 
              textAlign: { xs: 'center', md: 'left' },
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 500
            }}
          >
            © {currentYear} Cafert. All rights reserved. Made with{' '}
            <HeartIcon sx={{ fontSize: 20, color: '#8B4513', verticalAlign: 'middle' }} />
            {' '}for coffee lovers.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#d0d0d0', 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#8B4513',
                    fontWeight: 600,
                  } 
                }}
              >
                Privacy Policy
              </Typography>
            </Link>
            <Link to="/terms" style={{ textDecoration: 'none' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#d0d0d0', 
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 500,
                  '&:hover': { 
                    color: '#8B4513',
                    fontWeight: 600,
                  } 
                }}
              >
                Terms of Service
              </Typography>
            </Link>
            <IconButton
              onClick={scrollToTop}
              sx={{
                backgroundColor: 'rgba(139, 69, 19, 0.2)',
                color: '#8B4513',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: '#8B4513',
                  color: '#fff',
                  transform: 'translateY(-4px) scale(1.1)',
                  boxShadow: '0 8px 25px rgba(139, 69, 19, 0.4)',
                },
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '& svg': {
                  fontSize: 28,
                }
              }}
            >
              <ArrowUpIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

