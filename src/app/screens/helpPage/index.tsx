import React, { useState, useEffect, useMemo } from 'react';
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
  CardContent,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Autocomplete,
  IconButton,
  Tooltip,
  Grid,
  Stack,
  Avatar,
  Badge,
  Fade,
  Slide,
  Zoom
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
  ContactSupport as ContactSupportIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  TrendingUp as TrendingUpIcon,
  Article as ArticleIcon,
  AccountCircle as AccountIcon,
  Payment as PaymentIcon,
  Build as BuildIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';


interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
  notHelpful: number;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  count: number;
}

const categories: Category[] = [
  {
    id: 'account',
    name: 'Account',
    icon: <AccountIcon />,
    description: 'Account management and settings',
    count: 8
  },
  {
    id: 'payment',
    name: 'Payment',
    icon: <PaymentIcon />,
    description: 'Payment methods and billing',
    count: 6
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: <BuildIcon />,
    description: 'Technical issues and troubleshooting',
    count: 12
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingCartIcon />,
    description: 'Ordering and delivery',
    count: 10
  },
  {
    id: 'general',
    name: 'General',
    icon: <HelpIcon />,
    description: 'General questions and information',
    count: 15
  }
];

const faqData: FAQItem[] = [
  {
    id: '1',
    question: "How do I create an account?",
    answer: "To create an account, click the 'Sign Up' button in the top right corner. You'll need to provide your email address, create a password, and fill in some basic information. Once you verify your email, your account will be activated.",
    category: 'account',
    views: 1250,
    helpful: 89,
    notHelpful: 12,
    tags: ['signup', 'registration', 'account']
  },
  {
    id: '2',
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through our payment partners.",
    category: 'payment',
    views: 980,
    helpful: 76,
    notHelpful: 8,
    tags: ['payment', 'credit card', 'paypal']
  },
  {
    id: '3',
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password. The link will expire in 24 hours for security.",
    category: 'account',
    views: 756,
    helpful: 67,
    notHelpful: 15,
    tags: ['password', 'reset', 'security']
  },
  {
    id: '4',
    question: "Why is my order taking so long?",
    answer: "Order processing times vary based on current demand and your location. During peak hours (7-9 AM and 5-7 PM), orders may take 15-20 minutes. You can track your order status in real-time through your account.",
    category: 'shopping',
    views: 1100,
    helpful: 92,
    notHelpful: 18,
    tags: ['order', 'delivery', 'tracking']
  },
  {
    id: '5',
    question: "How do I change my delivery address?",
    answer: "Go to your account settings and click on 'Addresses'. You can add, edit, or remove delivery addresses. Make sure to save your changes before placing your next order.",
    category: 'account',
    views: 634,
    helpful: 58,
    notHelpful: 7,
    tags: ['address', 'delivery', 'settings']
  },
  {
    id: '6',
    question: "What if I receive the wrong order?",
    answer: "If you receive the wrong order, please contact us immediately at (555) 123-4567 or email support@coffeeshop.com. We'll arrange for a replacement and provide a full refund for the incorrect order.",
    category: 'shopping',
    views: 445,
    helpful: 41,
    notHelpful: 5,
    tags: ['wrong order', 'refund', 'support']
  },
  {
    id: '7',
    question: "How do I cancel my subscription?",
    answer: "To cancel your subscription, go to your account dashboard and click on 'Subscriptions'. Select the subscription you want to cancel and follow the prompts. You can cancel at any time.",
    category: 'account',
    views: 389,
    helpful: 34,
    notHelpful: 6,
    tags: ['subscription', 'cancel', 'billing']
  },
  {
    id: '8',
    question: "What are your operating hours?",
    answer: "Our main location is open daily from 7:00 AM to 10:00 PM. Hours may vary by location - check our locations page for specific hours at each coffee shop.",
    category: 'general',
    views: 892,
    helpful: 78,
    notHelpful: 9,
    tags: ['hours', 'location', 'schedule']
  },
  {
    id: '9',
    question: "How do I report a technical issue?",
    answer: "For technical issues, please email tech-support@coffeeshop.com with details about the problem, including your device type, browser, and steps to reproduce the issue. We'll respond within 24 hours.",
    category: 'technical',
    views: 567,
    helpful: 49,
    notHelpful: 11,
    tags: ['technical', 'bug', 'support']
  },
  {
    id: '10',
    question: "Can I modify my order after placing it?",
    answer: "Orders can be modified within 5 minutes of placement. Go to your order history and click 'Modify Order'. After 5 minutes, please call us at (555) 123-4567 to request changes.",
    category: 'shopping',
    views: 723,
    helpful: 65,
    notHelpful: 13,
    tags: ['modify', 'order', 'changes']
  },
  {
    id: '11',
    question: "How do I earn loyalty points?",
    answer: "Earn 1 point for every $1 spent. Points are automatically added to your account after each order. You can redeem points for discounts and free items. Check your account dashboard for current points balance.",
    category: 'account',
    views: 678,
    helpful: 61,
    notHelpful: 8,
    tags: ['loyalty', 'points', 'rewards']
  },
  {
    id: '12',
    question: "What's your refund policy?",
    answer: "We offer a 100% satisfaction guarantee. If you're not satisfied with your order, contact us within 24 hours for a full refund or replacement. Refunds are processed within 3-5 business days.",
    category: 'payment',
    views: 834,
    helpful: 72,
    notHelpful: 14,
    tags: ['refund', 'policy', 'satisfaction']
  }
];

const suggestedArticles = [
  {
    id: '1',
    title: 'Complete Guide to Our Menu',
    description: 'Learn about our coffee varieties, food options, and seasonal specials',
    category: 'general',
    readTime: '5 min read',
    views: 2340
  },
  {
    id: '2',
    title: 'How to Use Our Mobile App',
    description: 'Step-by-step guide to ordering, tracking, and managing your account',
    category: 'technical',
    readTime: '8 min read',
    views: 1890
  },
  {
    id: '3',
    title: 'Loyalty Program Benefits',
    description: 'Maximize your rewards and learn about exclusive member perks',
    category: 'account',
    readTime: '4 min read',
    views: 1560
  },
  {
    id: '4',
    title: 'Delivery and Pickup Options',
    description: 'Everything you need to know about our delivery and pickup services',
    category: 'shopping',
    readTime: '6 min read',
    views: 2100
  }
];

export default function HelpPage() {
  const { isDarkMode, colors } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false);
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'helpful' | 'notHelpful' | null>>({});

  // Filter FAQ based on category and search
  const filteredFAQ = useMemo(() => {
    let filtered = faqData;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [selectedCategory, searchQuery]);

  // Get top 5 most viewed questions
  const topQuestions = useMemo(() => {
    return [...faqData]
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, []);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    const allTags = faqData.flatMap(item => item.tags);
    const uniqueTags = Array.from(new Set(allTags));
    const questions = faqData.map(item => item.question);
    
    return [...uniqueTags, ...questions].filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [searchQuery]);

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? panel : false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  const handleHelpfulFeedback = (faqId: string, feedback: 'helpful' | 'notHelpful') => {
    setHelpfulFeedback(prev => ({
      ...prev,
      [faqId]: feedback
    }));
    // Here you would typically send this feedback to your backend
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.icon || <HelpIcon />;
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'General';
  };

  return (
    <Box sx={{ 
      backgroundColor: isDarkMode ? colors.background : '#f8f9fa', 
      minHeight: '100vh',
      pt: 12, // Add more top padding to account for fixed navbar
      pb: 4
    }}>
      
      
      <Container maxWidth="xl">
        {/* Hero Header */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: 6,
          background: `linear-gradient(135deg, ${isDarkMode ? colors.surface : '#ffffff'} 0%, ${isDarkMode ? colors.background : '#f8f9fa'} 100%)`,
          borderRadius: 4,
          p: 6,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
            <Box sx={{
              background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
              borderRadius: '50%',
              p: 3,
              mr: 3,
              boxShadow: `0 8px 24px ${colors.accent}40`
            }}>
              <HelpIcon sx={{ fontSize: 64, color: '#ffffff' }} />
            </Box>
            <Box>
              <Typography variant="h2" sx={{ 
                color: colors.text, 
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                mb: 1
              }}>
                Help Center
              </Typography>
              <Typography variant="h5" sx={{ 
                color: colors.textSecondary,
                fontWeight: 400
              }}>
                Find answers to your questions quickly and easily
              </Typography>
            </Box>
          </Box>

          {/* Search Bar */}
          <Box sx={{ maxWidth: 600, mx: 'auto' }}>
            <Autocomplete
              freeSolo
              options={searchSuggestions}
              value={searchQuery}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  setSearchQuery(newValue);
                }
              }}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Search for questions, topics, or keywords..."
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: colors.accent }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setSearchQuery('')}
                          size="small"
                        >
                          <CloseIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: isDarkMode ? colors.surface : '#ffffff',
                      borderRadius: 3,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.accent,
                        borderWidth: 2,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.accentDark,
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: colors.accent,
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      fontSize: '1.1rem',
                      padding: '16px 20px',
                    }
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SearchIcon sx={{ color: colors.accent, fontSize: 20 }} />
                    <Typography>{option}</Typography>
                  </Box>
                </Box>
              )}
            />
          </Box>
        </Box>

        {/* Main Content - Two Column Layout */}
        <Grid container spacing={4}>
          {/* Left Sidebar - Categories */}
          <Grid item xs={12} md={3}>
            <Paper sx={{
              p: 3,
              background: isDarkMode ? colors.surface : '#ffffff',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`,
              height: 'fit-content',
              position: 'sticky',
              top: 24
            }}>
              <Typography variant="h5" sx={{ 
                color: colors.text, 
                fontWeight: 700,
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <FilterListIcon sx={{ color: colors.accent }} />
                Categories
              </Typography>

              <Stack spacing={2}>
                <Button
                  fullWidth
                  variant={selectedCategory === 'all' ? 'contained' : 'text'}
                  onClick={() => handleCategoryChange('all')}
                  startIcon={<HelpIcon />}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    py: 2,
                    px: 3,
                    borderRadius: 2,
                    backgroundColor: selectedCategory === 'all' ? colors.accent : 'transparent',
                    color: selectedCategory === 'all' ? '#ffffff' : colors.text,
                    '&:hover': {
                      backgroundColor: selectedCategory === 'all' ? colors.accentDark : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      All Questions
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                      {faqData.length} questions
                    </Typography>
                  </Box>
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category.id}
                    fullWidth
                    variant={selectedCategory === category.id ? 'contained' : 'text'}
                    onClick={() => handleCategoryChange(category.id)}
                    startIcon={category.icon}
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      py: 2,
                      px: 3,
                      borderRadius: 2,
                      backgroundColor: selectedCategory === category.id ? colors.accent : 'transparent',
                      color: selectedCategory === category.id ? '#ffffff' : colors.text,
                      '&:hover': {
                        backgroundColor: selectedCategory === category.id ? colors.accentDark : (isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                      }
                    }}
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {category.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                        {category.count} questions
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Side - FAQ Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: colors.text, 
                fontWeight: 700,
                mb: 2
              }}>
                {selectedCategory === 'all' ? 'All Questions' : getCategoryName(selectedCategory)}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: colors.textSecondary,
                mb: 3
              }}>
                {filteredFAQ.length} questions found
                {searchQuery && ` for "${searchQuery}"`}
              </Typography>
            </Box>

            {/* Top Questions Section */}
            {selectedCategory === 'all' && !searchQuery && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ 
                  color: colors.text, 
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <TrendingUpIcon sx={{ color: colors.accent }} />
                  Most Popular Questions
                </Typography>
                
                <Grid container spacing={2}>
                  {topQuestions.map((faq, index) => (
                    <Grid item xs={12} sm={6} key={faq.id}>
                      <Card sx={{
                        p: 3,
                        background: isDarkMode ? colors.surface : '#ffffff',
                        borderRadius: 2,
                        border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        }
                      }}
                      onClick={() => {
                        setExpandedAccordion(`panel${faqData.findIndex(item => item.id === faq.id)}`);
                        document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' });
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Badge badgeContent={index + 1} color="primary">
                            <Avatar sx={{ 
                              bgcolor: colors.accent,
                              width: 32,
                              height: 32,
                              fontSize: '0.9rem'
                            }}>
                              <StarIcon />
                            </Avatar>
                          </Badge>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" sx={{ 
                              fontWeight: 600,
                              color: colors.text,
                              mb: 1,
                              lineHeight: 1.4
                            }}>
                              {faq.question}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={getCategoryName(faq.category)}
                                size="small"
                                sx={{
                                  backgroundColor: colors.accent,
                                  color: '#ffffff',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {faq.views} views
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* FAQ Accordion */}
            <Box sx={{ mb: 6 }}>
              {filteredFAQ.length > 0 ? (
                filteredFAQ.map((faq, index) => (
                  <Accordion
                    key={faq.id}
                    id={`faq-${faq.id}`}
                    expanded={expandedAccordion === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`)}
                    sx={{
                      mb: 2,
                      background: isDarkMode ? colors.surface : '#ffffff',
                      borderRadius: 3,
                      border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`,
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
                      expandIcon={<ExpandMoreIcon sx={{ color: colors.accent, fontSize: 32 }} />}
                      sx={{
                        p: 3,
                        transition: 'all 0.3s ease',
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                        },
                        '&:hover': {
                          backgroundColor: `${colors.accent}10`,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                        <Box sx={{
                          p: 1,
                          borderRadius: 1,
                          backgroundColor: `${colors.accent}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {getCategoryIcon(faq.category)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ 
                            color: colors.text, 
                            fontWeight: 600,
                            lineHeight: 1.4,
                            mb: 1
                          }}>
                            {faq.question}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <Chip
                              label={getCategoryName(faq.category)}
                              size="small"
                              sx={{
                                backgroundColor: colors.accent,
                                color: '#ffffff',
                                fontSize: '0.75rem'
                              }}
                            />
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {faq.views} views
                            </Typography>
                            <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                              {faq.helpful} found helpful
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 4, pt: 0 }}>
                      <Typography variant="body1" sx={{ 
                        color: colors.textSecondary, 
                        lineHeight: 1.8,
                        fontSize: '1.1rem',
                        mb: 3
                      }}>
                        {faq.answer}
                      </Typography>
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                        {faq.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: colors.accent,
                              color: colors.accent,
                              fontSize: '0.75rem'
                            }}
                          />
                        ))}
                      </Box>

                      {/* Helpful Feedback */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        pt: 2,
                        borderTop: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`
                      }}>
                        <Typography variant="body2" sx={{ color: colors.textSecondary }}>
                          Was this helpful?
                        </Typography>
                        <Button
                          size="small"
                          variant={helpfulFeedback[faq.id] === 'helpful' ? 'contained' : 'outlined'}
                          startIcon={<ThumbUpIcon />}
                          onClick={() => handleHelpfulFeedback(faq.id, 'helpful')}
                          sx={{
                            minWidth: 'auto',
                            px: 2,
                            backgroundColor: helpfulFeedback[faq.id] === 'helpful' ? colors.accent : 'transparent',
                            borderColor: colors.accent,
                            color: helpfulFeedback[faq.id] === 'helpful' ? '#ffffff' : colors.accent,
                            '&:hover': {
                              backgroundColor: helpfulFeedback[faq.id] === 'helpful' ? colors.accentDark : `${colors.accent}10`,
                            }
                          }}
                        >
                          Yes ({faq.helpful})
                        </Button>
                        <Button
                          size="small"
                          variant={helpfulFeedback[faq.id] === 'notHelpful' ? 'contained' : 'outlined'}
                          startIcon={<ThumbDownIcon />}
                          onClick={() => handleHelpfulFeedback(faq.id, 'notHelpful')}
                          sx={{
                            minWidth: 'auto',
                            px: 2,
                            backgroundColor: helpfulFeedback[faq.id] === 'notHelpful' ? '#f44336' : 'transparent',
                            borderColor: '#f44336',
                            color: helpfulFeedback[faq.id] === 'notHelpful' ? '#ffffff' : '#f44336',
                            '&:hover': {
                              backgroundColor: helpfulFeedback[faq.id] === 'notHelpful' ? '#d32f2f' : '#f4433610',
                            }
                          }}
                        >
                          No ({faq.notHelpful})
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  background: isDarkMode ? colors.surface : '#ffffff',
                  borderRadius: 3,
                  border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`
                }}>
                  <SearchIcon sx={{ fontSize: 64, color: colors.textSecondary, mb: 2 }} />
                  <Typography variant="h5" sx={{ color: colors.text, mb: 2 }}>
                    No questions found
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.textSecondary, mb: 3 }}>
                    Try adjusting your search terms or browse all categories
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    sx={{
                      borderColor: colors.accent,
                      color: colors.accent,
                      '&:hover': {
                        borderColor: colors.accentDark,
                        backgroundColor: `${colors.accent}10`,
                      }
                    }}
                  >
                    Clear Search
                  </Button>
                </Box>
              )}
            </Box>

            {/* Suggested Articles */}
            {selectedCategory === 'all' && !searchQuery && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ 
                  color: colors.text, 
                  fontWeight: 700,
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <ArticleIcon sx={{ color: colors.accent }} />
                  Suggested Articles
                </Typography>
                
                <Grid container spacing={3}>
                  {suggestedArticles.map((article) => (
                    <Grid item xs={12} sm={6} key={article.id}>
                      <Card sx={{
                        p: 3,
                        background: isDarkMode ? colors.surface : '#ffffff',
                        borderRadius: 3,
                        border: `1px solid ${isDarkMode ? colors.border : '#e0e0e0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        height: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                        }
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                          <Box sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: `${colors.accent}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <ArticleIcon sx={{ color: colors.accent, fontSize: 24 }} />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600,
                              color: colors.text,
                              mb: 1,
                              lineHeight: 1.4
                            }}>
                              {article.title}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: colors.textSecondary,
                              mb: 2,
                              lineHeight: 1.5
                            }}>
                              {article.description}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Chip
                                label={getCategoryName(article.category)}
                                size="small"
                                sx={{
                                  backgroundColor: colors.accent,
                                  color: '#ffffff',
                                  fontSize: '0.75rem'
                                }}
                              />
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {article.readTime}
                              </Typography>
                              <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                                {article.views} views
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Support CTA */}
            <Box sx={{ 
              textAlign: 'center',
              background: `linear-gradient(135deg, ${colors.accent}10, ${colors.accent}05)`,
              borderRadius: 4,
              p: 6,
              border: `2px solid ${colors.accent}20`
            }}>
              <ContactSupportIcon sx={{ 
                fontSize: 64, 
                color: colors.accent, 
                mb: 3 
              }} />
              <Typography variant="h4" sx={{ 
                color: colors.text, 
                fontWeight: 700,
                mb: 2
              }}>
                Still need help?
              </Typography>
              <Typography variant="body1" sx={{ 
                color: colors.textSecondary,
                mb: 4,
                fontSize: '1.1rem'
              }}>
                Our support team is here to help you with any questions or issues
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<PhoneIcon />}
                  onClick={() => window.open('tel:555-123-4567')}
                  sx={{
                    background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentDark})`,
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${colors.accentDark}, ${colors.accent})`,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Call Us
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<EmailIcon />}
                  onClick={() => window.open('mailto:support@coffeeshop.com')}
                  sx={{
                    borderColor: colors.accent,
                    color: colors.accent,
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: colors.accentDark,
                      backgroundColor: `${colors.accent}10`,
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Email Support
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 