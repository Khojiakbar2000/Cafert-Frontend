import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';

import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  NavigateNext as NavigateNextIcon,
  Support as SupportIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon
} from '@mui/icons-material';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';
import VerticalMovingBasket from '../../../mui-coffee/components/VerticalMovingBasket';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    question: "How do I search for menu items?",
    answer: "Use the search bar in the top-right corner of the menu page. You can search by item name or description. The search works in real-time as you type.",
    category: "Navigation"
  },
  {
    question: "How do I filter items by category?",
    answer: "Use the category tabs (All Items, Coffees, Desserts, Drinks, Salads) to filter the menu. Click on any category to see only items from that category.",
    category: "Navigation"
  },
  {
    question: "How do I sort the menu items?",
    answer: "Use the 'Sort By' dropdown to sort by Newest, Price, Views, or Rating. You can also choose ascending or descending order.",
    category: "Navigation"
  },
  {
    question: "How do I add items to my cart?",
    answer: "Click the 'Add to Cart' button on any menu item. The item will be added to your shopping cart and you can view it in the cart section.",
    category: "Shopping"
  },
  {
    question: "How do I mark items as favorites?",
    answer: "Click the heart icon on any menu item to add it to your favorites. The heart will turn red when the item is favorited.",
    category: "Shopping"
  },
  {
    question: "How do I toggle between light and dark mode?",
    answer: "Click the sun/moon icon in the top-right corner of the menu page to switch between light and dark themes.",
    category: "Interface"
  },
  {
    question: "How do I navigate between pages?",
    answer: "Use the pagination controls at the bottom of the menu to navigate between pages. Each page shows 5 items.",
    category: "Navigation"
  },
  {
    question: "How do I find your locations?",
    answer: "Scroll down to the map section at the bottom of the menu page. You'll find an interactive map with all our coffee shop locations.",
    category: "Locations"
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital wallets including Apple Pay and Google Pay.",
    category: "Payment"
  },
  {
    question: "Do you offer delivery?",
    answer: "Yes, we offer delivery through our partner delivery services. Delivery fees and minimum orders may apply.",
    category: "Delivery"
  },
  {
    question: "What are your operating hours?",
    answer: "Our main location is open daily from 7:00 AM to 10:00 PM. Hours may vary by location - check the map section for specific hours.",
    category: "Hours"
  },
  {
    question: "How do I contact customer support?",
    answer: "You can call us at (555) 123-4567, email us at support@coffeeshop.com, or use the contact form on our website.",
    category: "Support"
  }
];

const categories = ['All', 'Navigation', 'Shopping', 'Interface', 'Locations', 'Payment', 'Delivery', 'Hours', 'Support'];

export default function HelpPage() {
  const { isDarkMode, toggleTheme } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);

  // Add smooth scrolling behavior to the page
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    // Smooth scroll to FAQ section when category changes
    setTimeout(() => {
      const faqSection = document.getElementById('faq-section');
      if (faqSection) {
        faqSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100); // Small delay to ensure state update
  };

  const filteredFAQ = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const quickActions = [
    {
      title: "Browse Menu",
      description: "Explore our coffee, desserts, drinks, and salads",
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      action: () => {
        // Smooth scroll to top before navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => window.location.href = '/coffees', 300);
      },
      color: '#8B4513'
    },
    {
      title: "Find Locations",
      description: "View our coffee shop locations and hours",
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      action: () => {
        // Smooth scroll to top before navigation
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => window.location.href = '/coffees#map', 300);
      },
      color: '#A0522D'
    },
    {
      title: "Contact Support",
      description: "Get help from our customer service team",
      icon: <PhoneIcon sx={{ fontSize: 40 }} />,
      action: () => {
        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        } else {
          window.open('tel:555-123-4567');
        }
      },
      color: '#CD853F'
    },
    {
      title: "Toggle Theme",
      description: "Switch between light and dark mode",
      icon: isDarkMode ? <LightModeIcon sx={{ fontSize: 40 }} /> : <DarkModeIcon sx={{ fontSize: 40 }} />,
      action: toggleTheme,
      color: '#D2691E'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <Box sx={{ 
      backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa', 
      minHeight: '100vh',
      py: 6,
      scrollBehavior: 'smooth'
    }}>
      <VerticalMovingBasket itemCount={0} />
      
      <Container maxWidth="xl">
        {/* Hero Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 8,
          background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
          borderRadius: 4,
          p: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Box sx={{
              background: `linear-gradient(135deg, #8B4513, #A0522D)`,
              borderRadius: '50%',
              p: 3,
              mr: 3,
              boxShadow: '0 8px 24px rgba(139, 69, 19, 0.3)'
            }}>
              <HelpIcon sx={{ fontSize: 64, color: '#ffffff' }} />
            </Box>
            <Box>
              <Typography variant="h2" sx={{ 
                color: isDarkMode ? '#ffffff' : '#333333', 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 1
              }}>
                Help Center
              </Typography>
              <Typography variant="h5" sx={{ 
                color: isDarkMode ? '#b0b0b0' : '#666666',
                fontWeight: 400
              }}>
                Everything you need to know about our coffee shop
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h3" sx={{ 
            color: isDarkMode ? '#ffffff' : '#333333', 
            mb: 4, 
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Quick Actions
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 4 
          }}>
            {quickActions.map((action, index) => (
              <Box key={index}>
                <Card
                  sx={{
                    height: '100%',
                    background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
                    border: `2px solid ${action.color}`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 16px 40px rgba(139, 69, 19, 0.3)`,
                      borderColor: action.color,
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ 
                      color: action.color, 
                      mb: 3,
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                      {action.icon}
                    </Box>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: isDarkMode ? '#ffffff' : '#333333'
                    }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      opacity: 0.8,
                      color: isDarkMode ? '#b0b0b0' : '#666666',
                      lineHeight: 1.6
                    }}>
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Category Filter */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ 
            color: isDarkMode ? '#ffffff' : '#333333', 
            mb: 3,
            fontWeight: 700,
            textAlign: 'center'
          }}>
            Browse by Category
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap', 
            justifyContent: 'center' 
          }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryChange(category)}
                variant={selectedCategory === category ? 'filled' : 'outlined'}
                sx={{
                  fontSize: '1.1rem',
                  padding: '12px 16px',
                  height: 'auto',
                  backgroundColor: selectedCategory === category 
                    ? '#8B4513' 
                    : 'transparent',
                  color: selectedCategory === category 
                    ? '#ffffff' 
                    : '#8B4513',
                  borderColor: '#8B4513',
                  borderWidth: '2px',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#A0522D',
                    color: '#ffffff',
                    transform: 'scale(1.05)',
                  },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* FAQ Section */}
        <Box id="faq-section" sx={{ mb: 8 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
            borderRadius: 3,
            p: 4,
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <QuestionAnswerIcon sx={{ fontSize: 48, color: '#8B4513', mr: 2 }} />
              <Typography variant="h3" sx={{ 
                color: isDarkMode ? '#ffffff' : '#333333', 
                fontWeight: 700 
              }}>
                Frequently Asked Questions
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              color: isDarkMode ? '#b0b0b0' : '#666666',
              fontWeight: 400
            }}>
              {filteredFAQ.length} questions found
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {filteredFAQ.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expandedAccordion === `panel${index}`}
                onChange={handleAccordionChange(`panel${index}`)}
                sx={{
                  mb: 2,
                  background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
                  borderRadius: 3,
                  border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:before': {
                    display: 'none',
                  },
                  '&.Mui-expanded': {
                    margin: '16px 0',
                  },
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#8B4513', fontSize: 32 }} />}
                  sx={{
                    p: 3,
                    transition: 'all 0.3s ease',
                    '& .MuiAccordionSummary-content': {
                      margin: 0,
                    },
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'rgba(139, 69, 19, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                    },
                  }}
                >
                  <Typography variant="h5" sx={{ 
                    color: isDarkMode ? '#ffffff' : '#333333', 
                    fontWeight: 600,
                    lineHeight: 1.4
                  }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 4, pt: 0 }}>
                  <Typography variant="body1" sx={{ 
                    color: isDarkMode ? '#b0b0b0' : '#666666', 
                    lineHeight: 1.8,
                    fontSize: '1.1rem',
                    mb: 3
                  }}>
                    {faq.answer}
                  </Typography>
                  <Chip
                    label={faq.category}
                    size="medium"
                    sx={{
                      backgroundColor: '#8B4513',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      padding: '8px 16px',
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        {/* Contact Information */}
        <Box id="contact-section" sx={{ mb: 6 }}>
          <Box sx={{ 
            textAlign: 'center', 
            mb: 6,
            background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
            borderRadius: 3,
            p: 4,
            border: `1px solid ${isDarkMode ? '#333333' : '#e0e0e0'}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <ContactSupportIcon sx={{ fontSize: 48, color: '#8B4513', mr: 2 }} />
              <Typography variant="h3" sx={{ 
                color: isDarkMode ? '#ffffff' : '#333333', 
                fontWeight: 700 
              }}>
                Still Need Help?
              </Typography>
            </Box>
            <Typography variant="h6" sx={{ 
              color: isDarkMode ? '#b0b0b0' : '#666666',
              fontWeight: 400
            }}>
              Our support team is here to help you
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 4,
            mb: 6 
          }}>
            <Box>
              <Card sx={{
                background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
                border: '2px solid #8B4513',
                borderRadius: 3,
                p: 4,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(139, 69, 19, 0.2)',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                    borderRadius: '50%',
                    p: 2,
                    mr: 3
                  }}>
                    <PhoneIcon sx={{ fontSize: 32, color: '#ffffff' }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: isDarkMode ? '#ffffff' : '#333333', 
                    fontWeight: 700 
                  }}>
                    Call Us
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ 
                  color: isDarkMode ? '#b0b0b0' : '#666666', 
                  mb: 2,
                  fontWeight: 600
                }}>
                  (555) 123-4567
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#b0b0b0' : '#666666',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  Available 7 days a week, 7:00 AM - 10:00 PM
                </Typography>
              </Card>
            </Box>
            
            <Box>
              <Card sx={{
                background: `linear-gradient(135deg, ${isDarkMode ? '#2a2a2a' : '#ffffff'} 0%, ${isDarkMode ? '#1a1a1a' : '#f8f9fa'} 100%)`,
                border: '2px solid #8B4513',
                borderRadius: 3,
                p: 4,
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(139, 69, 19, 0.2)',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{
                    background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                    borderRadius: '50%',
                    p: 2,
                    mr: 3
                  }}>
                    <EmailIcon sx={{ fontSize: 32, color: '#ffffff' }} />
                  </Box>
                  <Typography variant="h4" sx={{ 
                    color: isDarkMode ? '#ffffff' : '#333333', 
                    fontWeight: 700 
                  }}>
                    Email Support
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ 
                  color: isDarkMode ? '#b0b0b0' : '#666666', 
                  mb: 2,
                  fontWeight: 600
                }}>
                  support@coffeeshop.com
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#b0b0b0' : '#666666',
                  fontSize: '1.1rem',
                  lineHeight: 1.6
                }}>
                  We'll respond within 24 hours
                </Typography>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<NavigateNextIcon />}
              onClick={() => {
                // Smooth scroll to top before navigation
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => window.location.href = '/coffees', 300);
              }}
              sx={{
                background: 'linear-gradient(135deg, #8B4513, #A0522D)',
                fontSize: '1.2rem',
                padding: '16px 32px',
                borderRadius: 3,
                fontWeight: 700,
                boxShadow: '0 8px 24px rgba(139, 69, 19, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #A0522D, #CD853F)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(139, 69, 19, 0.4)',
                },
              }}
            >
              Back to Menu
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
