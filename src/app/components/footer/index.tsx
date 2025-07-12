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
  Link as MuiLink,
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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    { icon: <LocationIcon />, label: 'Location', value: 'Downtown, Dubai', action: () => window.open('https://maps.google.com') },
    { icon: <PhoneIcon />, label: 'Phone', value: '+971 4 554 7777', action: () => window.open('tel:+97145547777') },
    { icon: <EmailIcon />, label: 'Email', value: 'info@coffeeshop.com', action: () => window.open('mailto:info@coffeeshop.com') },
    { icon: <TimeIcon />, label: 'Hours', value: '24/7 Service', action: null },
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #8B4513, #A0522D, #CD853F, #D2691E)',
        }
      }}
    >
      {/* Main Footer Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          flexWrap: 'wrap'
        }}>
          {/* Company Info */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: { md: '300px' } }}>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CoffeeIcon sx={{ fontSize: 40, color: '#8B4513', mr: 2 }} />
                <Typography
                  variant="h4"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Cafert
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#b0b0b0' }}>
                {t('footer.aboutText')}
              </Typography>
              
              {/* Social Media */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                  {t('footer.social')}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {socialLinks.map((social, index) => (
                    <IconButton
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        backgroundColor: 'rgba(139, 69, 19, 0.1)',
                        color: '#8B4513',
                        '&:hover': {
                          backgroundColor: '#8B4513',
                          color: '#fff',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Stack>
              </Box>

              {/* Newsletter Signup */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                  {t('footer.stayUpdated')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0' }}>
                  {t('footer.newsletterText')}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderColor: '#8B4513',
                    color: '#8B4513',
                    '&:hover': {
                      borderColor: '#A0522D',
                      backgroundColor: 'rgba(139, 69, 19, 0.1)',
                    }
                  }}
                >
                  {t('footer.subscribe')}
                </Button>
              </Box>
            </Box>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: { md: '300px' } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 3,
              flexWrap: 'wrap'
            }}>
              {footerSections.map((section, index) => (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 30%' }, minWidth: { sm: '200px' } }}>
                  <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
                    {section.title}
                  </Typography>
                  <Stack spacing={1}>
                    {section.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        to={link.path}
                        style={{ textDecoration: 'none' }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#b0b0b0',
                            cursor: 'pointer',
                            transition: 'color 0.3s ease',
                            '&:hover': {
                              color: '#8B4513',
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
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: { md: '300px' } }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#fff', fontWeight: 600 }}>
              Contact Information
            </Typography>
            <Stack spacing={2}>
              {contactInfo.map((contact, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: contact.action ? 'pointer' : 'default',
                    '&:hover': contact.action ? {
                      transform: 'translateX(5px)',
                      transition: 'transform 0.3s ease',
                    } : {},
                  }}
                  onClick={contact.action || undefined}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(139, 69, 19, 0.1)',
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(contact.icon, { 
                      sx: { fontSize: 20, color: '#8B4513' } 
                    })}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#8B4513', fontWeight: 600 }}>
                      {contact.label}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
                      {contact.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            {/* Opening Hours */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: '#fff', fontWeight: 600 }}>
                Opening Hours
              </Typography>
              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Monday - Friday</Typography>
                  <Typography variant="body2" sx={{ color: '#8B4513', fontWeight: 600 }}>7:00 AM - 10:00 PM</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Saturday - Sunday</Typography>
                  <Typography variant="body2" sx={{ color: '#8B4513', fontWeight: 600 }}>8:00 AM - 11:00 PM</Typography>
                </Box>
                <Chip
                  label="24/7 Online Ordering"
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(139, 69, 19, 0.2)',
                    color: '#8B4513',
                    fontWeight: 600,
                    alignSelf: 'flex-start',
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Bottom Section */}
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
      
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'center', md: 'center' },
          gap: 2
        }}>
          <Typography variant="body2" sx={{ color: '#b0b0b0', textAlign: { xs: 'center', md: 'left' } }}>
            © {currentYear} Cafert. All rights reserved. Made with{' '}
            <HeartIcon sx={{ fontSize: 16, color: '#8B4513', verticalAlign: 'middle' }} />
            {' '}for coffee lovers.
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', '&:hover': { color: '#8B4513' } }}>
                Privacy Policy
              </Typography>
            </Link>
            <Link to="/terms" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: '#b0b0b0', '&:hover': { color: '#8B4513' } }}>
                Terms of Service
              </Typography>
            </Link>
            <IconButton
              onClick={scrollToTop}
              sx={{
                backgroundColor: 'rgba(139, 69, 19, 0.1)',
                color: '#8B4513',
                '&:hover': {
                  backgroundColor: '#8B4513',
                  color: '#fff',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
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

