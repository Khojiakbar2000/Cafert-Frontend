import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Stack,
  Avatar,
  Badge,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  QuestionAnswer as QuestionAnswerIcon,
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
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';
import SEO from '../../../components/SEO';

/** Pulp Alchemist Help Center — same palette / brutalist language as `stitch.tsx` HTML (no import). */
const INK = '#1A0F0D';
const SURFACE = '#fcf6e8';
const SURFACE_BRIGHT = '#fcf6e8';
const SURFACE_LOW = '#f6f0e1';
const SURFACE_VARIANT = '#e3ddcb';
const PRIMARY = '#a83100';
const ON_PRIMARY = '#ffefeb';
const PRIMARY_CONTAINER = '#ff784d';
const TERTIARY_CONTAINER = '#fecc00';
const SECONDARY_CONTAINER = '#f2dbd7';
const ON_SURFACE = '#312f26';
const ON_SURFACE_VARIANT = '#5f5b51';
const GROTESK = '"Space Grotesk", system-ui, sans-serif';

/**
 * Fixed px cap (not rem) so width stays predictable with global CSS / zoom.
 * ~125rem at 16px — wide editorial shell, still capped at full viewport on smaller screens.
 */
const HELP_MAIN_MAX = 'min(100%, 2000px)';

const halftoneSx = {
  backgroundImage: `radial-gradient(circle, ${INK} 1px, transparent 1px)`,
  backgroundSize: '8px 8px',
};

const hardShadow = `8px 8px 0 0 ${INK}`;
const hardShadowSm = `4px 4px 0 0 ${INK}`;

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
    count: 8,
  },
  {
    id: 'payment',
    name: 'Payment',
    icon: <PaymentIcon />,
    description: 'Payment methods and billing',
    count: 6,
  },
  {
    id: 'technical',
    name: 'Technical',
    icon: <BuildIcon />,
    description: 'Technical issues and troubleshooting',
    count: 12,
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: <ShoppingCartIcon />,
    description: 'Ordering and delivery',
    count: 10,
  },
  {
    id: 'general',
    name: 'General',
    icon: <HelpIcon />,
    description: 'General questions and information',
    count: 15,
  },
];

const faqData: FAQItem[] = [
  {
    id: '1',
    question: "How do I create an account?",
    answer:
      "To create an account, click the 'Sign Up' button in the top right corner. You'll need to provide your email address, create a password, and fill in some basic information. Once you verify your email, your account will be activated.",
    category: 'account',
    views: 1250,
    helpful: 89,
    notHelpful: 12,
    tags: ['signup', 'registration', 'account'],
  },
  {
    id: '2',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely through our payment partners.',
    category: 'payment',
    views: 980,
    helpful: 76,
    notHelpful: 8,
    tags: ['payment', 'credit card', 'paypal'],
  },
  {
    id: '3',
    question: 'How do I reset my password?',
    answer:
      "Click on 'Forgot Password' on the login page. Enter your email address and we'll send you a link to reset your password. The link will expire in 24 hours for security.",
    category: 'account',
    views: 756,
    helpful: 67,
    notHelpful: 15,
    tags: ['password', 'reset', 'security'],
  },
  {
    id: '4',
    question: 'Why is my order taking so long?',
    answer:
      'Order processing times vary based on current demand and your location. During peak hours (7-9 AM and 5-7 PM), orders may take 15-20 minutes. You can track your order status in real-time through your account.',
    category: 'shopping',
    views: 1100,
    helpful: 92,
    notHelpful: 18,
    tags: ['order', 'delivery', 'tracking'],
  },
  {
    id: '5',
    question: 'How do I change my delivery address?',
    answer:
      "Go to your account settings and click on 'Addresses'. You can add, edit, or remove delivery addresses. Make sure to save your changes before placing your next order.",
    category: 'account',
    views: 634,
    helpful: 58,
    notHelpful: 7,
    tags: ['address', 'delivery', 'settings'],
  },
  {
    id: '6',
    question: 'What if I receive the wrong order?',
    answer:
      "If you receive the wrong order, please contact us immediately at (555) 123-4567 or email support@coffeeshop.com. We'll arrange for a replacement and provide a full refund for the incorrect order.",
    category: 'shopping',
    views: 445,
    helpful: 41,
    notHelpful: 5,
    tags: ['wrong order', 'refund', 'support'],
  },
  {
    id: '7',
    question: 'How do I cancel my subscription?',
    answer:
      "To cancel your subscription, go to your account dashboard and click on 'Subscriptions'. Select the subscription you want to cancel and follow the prompts. You can cancel at any time.",
    category: 'account',
    views: 389,
    helpful: 34,
    notHelpful: 6,
    tags: ['subscription', 'cancel', 'billing'],
  },
  {
    id: '8',
    question: 'What are your operating hours?',
    answer:
      'Our main location is open daily from 7:00 AM to 10:00 PM. Hours may vary by location - check our locations page for specific hours at each coffee shop.',
    category: 'general',
    views: 892,
    helpful: 78,
    notHelpful: 9,
    tags: ['hours', 'location', 'schedule'],
  },
  {
    id: '9',
    question: 'How do I report a technical issue?',
    answer:
      "For technical issues, please email tech-support@coffeeshop.com with details about the problem, including your device type, browser, and steps to reproduce the issue. We'll respond within 24 hours.",
    category: 'technical',
    views: 567,
    helpful: 49,
    notHelpful: 11,
    tags: ['technical', 'bug', 'support'],
  },
  {
    id: '10',
    question: 'Can I modify my order after placing it?',
    answer:
      "Orders can be modified within 5 minutes of placement. Go to your order history and click 'Modify Order'. After 5 minutes, please call us at (555) 123-4567 to request changes.",
    category: 'shopping',
    views: 723,
    helpful: 65,
    notHelpful: 13,
    tags: ['modify', 'order', 'changes'],
  },
  {
    id: '11',
    question: 'How do I earn loyalty points?',
    answer:
      'Earn 1 point for every $1 spent. Points are automatically added to your account after each order. You can redeem points for discounts and free items. Check your account dashboard for current points balance.',
    category: 'account',
    views: 678,
    helpful: 61,
    notHelpful: 8,
    tags: ['loyalty', 'points', 'rewards'],
  },
  {
    id: '12',
    question: "What's your refund policy?",
    answer:
      "We offer a 100% satisfaction guarantee. If you're not satisfied with your order, contact us within 24 hours for a full refund or replacement. Refunds are processed within 3-5 business days.",
    category: 'payment',
    views: 834,
    helpful: 72,
    notHelpful: 14,
    tags: ['refund', 'policy', 'satisfaction'],
  },
];

const suggestedArticles = [
  {
    id: '1',
    title: 'Complete Guide to Our Menu',
    description: 'Learn about our coffee varieties, food options, and seasonal specials',
    category: 'general',
    readTime: '5 min read',
    views: 2340,
  },
  {
    id: '2',
    title: 'How to Use Our Mobile App',
    description: 'Step-by-step guide to ordering, tracking, and managing your account',
    category: 'technical',
    readTime: '8 min read',
    views: 1890,
  },
  {
    id: '3',
    title: 'Loyalty Program Benefits',
    description: 'Maximize your rewards and learn about exclusive member perks',
    category: 'account',
    readTime: '4 min read',
    views: 1560,
  },
  {
    id: '4',
    title: 'Delivery and Pickup Options',
    description: 'Everything you need to know about our delivery and pickup services',
    category: 'shopping',
    readTime: '6 min read',
    views: 2100,
  },
];

const CATEGORY_BADGE_STYLES = [
  { bg: TERTIARY_CONTAINER, color: INK },
  { bg: SECONDARY_CONTAINER, color: INK },
  { bg: PRIMARY_CONTAINER, color: INK },
  { bg: ON_SURFACE, color: ON_PRIMARY },
  { bg: SURFACE_VARIANT, color: INK },
];

export default function HelpPage() {
  const { isDarkMode } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMdUp = useMediaQuery(muiTheme.breakpoints.up('md'));

  const c = useMemo(
    () =>
      isDarkMode
        ? {
            bg: INK,
            text: SURFACE,
            ink: SURFACE,
            muted: 'rgba(252,246,232,0.72)',
            panel: '#2a2620',
            panelLow: '#252019',
            bright: '#1e1816',
          }
        : {
            bg: SURFACE,
            text: ON_SURFACE,
            ink: INK,
            muted: ON_SURFACE_VARIANT,
            panel: SURFACE_LOW,
            panelLow: SURFACE_LOW,
            bright: SURFACE_BRIGHT,
          },
    [isDarkMode]
  );

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  /** True after user focuses / clicks the help search field until click outside the search dock. */
  const [searchSurfaceActive, setSearchSurfaceActive] = useState(false);
  const searchDockRef = useRef<HTMLDivElement | null>(null);
  const [expandedAccordion, setExpandedAccordion] = useState<string | false>(false); // faq id
  const [helpfulFeedback, setHelpfulFeedback] = useState<Record<string, 'helpful' | 'notHelpful' | null>>({});

  useEffect(() => {
    const closeIfOutside = (e: MouseEvent | TouchEvent) => {
      const el = searchDockRef.current;
      const t = e.target;
      if (!el || !(t instanceof Node) || !el.contains(t)) {
        setSearchSurfaceActive(false);
      }
    };
    document.addEventListener('mousedown', closeIfOutside);
    document.addEventListener('touchstart', closeIfOutside);
    return () => {
      document.removeEventListener('mousedown', closeIfOutside);
      document.removeEventListener('touchstart', closeIfOutside);
    };
  }, []);

  const filteredFAQ = useMemo(() => {
    let filtered = faqData;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return filtered;
  }, [selectedCategory, searchQuery]);

  const topQuestions = useMemo(() => [...faqData].sort((a, b) => b.views - a.views).slice(0, 5), []);

  /** Suggested categories + FAQs when the search field is focused but empty. */
  const helpSearchBrowseGroups = useMemo(() => {
    return categories
      .map((category) => {
        const faqs = faqData.filter((f) => f.category === category.id);
        const tagSet = new Set<string>();
        faqs.forEach((f) => f.tags.forEach((t) => tagSet.add(t)));
        return {
          category,
          tags: Array.from(tagSet).sort((a, b) => a.localeCompare(b)),
          faqs,
        };
      })
      .filter((g) => g.faqs.length > 0);
  }, []);

  /** Group tag/question matches by help category when the user has typed a query. */
  const searchMatchGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [] as { category: Category; tags: string[]; faqs: FAQItem[] }[];

    const buckets = new Map<
      string,
      { tags: Set<string>; faqs: FAQItem[]; faqIds: Set<string> }
    >();
    for (const cat of categories) {
      buckets.set(cat.id, { tags: new Set(), faqs: [], faqIds: new Set() });
    }

    for (const faq of faqData) {
      const matchQuestion = faq.question.toLowerCase().includes(q);
      const matchingTags = faq.tags.filter((t) => t.toLowerCase().includes(q));
      if (!matchQuestion && matchingTags.length === 0) continue;
      const bucket = buckets.get(faq.category);
      if (!bucket) continue;
      if (!bucket.faqIds.has(faq.id)) {
        bucket.faqIds.add(faq.id);
        bucket.faqs.push(faq);
      }
      matchingTags.forEach((t) => bucket.tags.add(t));
    }

    return categories
      .map((category) => {
        const b = buckets.get(category.id)!;
        if (b.faqs.length === 0 && b.tags.size === 0) return null;
        return {
          category,
          tags: Array.from(b.tags).sort((a, b) => a.localeCompare(b)),
          faqs: b.faqs,
        };
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
  }, [searchQuery]);

  const hasSearchQuery = Boolean(searchQuery.trim());
  const visibleSearchAccordionGroups = hasSearchQuery
    ? searchMatchGroups
    : searchSurfaceActive
      ? helpSearchBrowseGroups
      : [];
  const searchAccordionMode: 'browse' | 'match' = hasSearchQuery ? 'match' : 'browse';

  const handleAccordionChange = (faqId: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedAccordion(isExpanded ? faqId : false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery('');
    setSearchSurfaceActive(false);
  };

  const handleHelpfulFeedback = (faqId: string, feedback: 'helpful' | 'notHelpful') => {
    setHelpfulFeedback((prev) => ({ ...prev, [faqId]: feedback }));
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || 'General';
  };

  return (
    <>
      <SEO
        title="Help Center | THE PULP ALCHEMIST"
        description="Find answers to frequently asked questions about Cafert. Get help with orders, payments, account management, and more."
        image="/img/misc/logo.webp"
        url="/help"
        keywords="help, support, FAQ, questions, customer service, coffee shop help"
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: c.bg,
          color: c.text,
          fontFamily: GROTESK,
          overflowX: 'hidden',
        }}
      >
        <Box
          component="main"
          sx={{
            pt: { xs: 12, md: 13 },
            pb: { xs: 6, md: 8 },
            px: { xs: 2, sm: 2.5, md: 3, lg: 4, xl: 5 },
            width: '100%',
            maxWidth: HELP_MAIN_MAX,
            mx: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {/* Hero */}
          <Box sx={{ mb: { xs: 5, md: 8 }, textAlign: 'center', position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: { xs: -40, md: -48 },
                left: { xs: -16, md: -32 },
                width: 192,
                height: 192,
                ...halftoneSx,
                opacity: isDarkMode ? 0.15 : 0.08,
                color: PRIMARY,
                pointerEvents: 'none',
              }}
            />
            <Typography
              component="h1"
              sx={{
                position: 'relative',
                fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                fontSize: { xs: '3rem', sm: '4.5rem', md: '6rem' },
                lineHeight: 0.95,
                mb: 3,
                transform: 'rotate(-1deg)',
                display: 'inline-block',
                textShadow: `6px 6px 0 ${PRIMARY}`,
              }}
            >
              Help Center
            </Typography>
            <Typography
              sx={{
                maxWidth: 'min(100%, 48rem)',
                mx: 'auto',
                fontSize: { xs: '1.1rem', md: '1.35rem' },
                fontWeight: 700,
                px: 2,
                py: 2,
                borderLeft: `8px solid ${PRIMARY}`,
                bgcolor: isDarkMode ? 'rgba(254,204,0,0.12)' : 'rgba(254,204,0,0.2)',
                textAlign: 'left',
              }}
            >
              Technical support, logistical data, and account configuration. Direct from the production floor to your
              lab.
            </Typography>
          </Box>

          {/* Search + suggested category accordions (opens on focus / click in search area) */}
          <Box
            ref={searchDockRef}
            sx={{ mb: { xs: 5, md: 8 }, width: '100%', maxWidth: '100%', mx: 'auto' }}
          >
            <Box sx={{ position: 'relative', width: '100%', transform: 'rotate(1deg)' }}>
              <TextField
                fullWidth
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchSurfaceActive(true)}
                placeholder="SEARCH SYSTEM DOCUMENTATION..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: PRIMARY }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery ? (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ color: c.ink }} aria-label="Clear search">
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                  sx: {
                    bgcolor: c.bright,
                    borderRadius: 0,
                    pl: 1,
                    fontWeight: 900,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    border: `6px solid ${c.ink}`,
                    boxShadow: hardShadowSm,
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                    pr: { xs: '100px', sm: '110px' },
                  },
                }}
                inputProps={{ 'aria-label': 'Search help documentation' }}
                sx={{
                  '& .MuiInputBase-input': { py: 2.5, px: 1, fontFamily: GROTESK },
                }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  setSearchSurfaceActive(true);
                  document.getElementById('help-search-matches')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                sx={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  bgcolor: PRIMARY,
                  color: ON_PRIMARY,
                  border: `4px solid ${c.ink}`,
                  borderRadius: 0,
                  fontWeight: 900,
                  px: 2,
                  py: 1,
                  '&:active': { transform: 'translateY(calc(-50% + 4px)) translateX(4px)', boxShadow: hardShadowSm },
                  boxShadow: hardShadowSm,
                }}
              >
                GO
              </Button>
            </Box>

            {visibleSearchAccordionGroups.length > 0 && (
              <Box id="help-search-matches" sx={{ mt: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    letterSpacing: '0.12em',
                    mb: 2,
                    color: c.muted,
                  }}
                >
                  {searchAccordionMode === 'match' ? 'Matches by category' : 'Suggested topics'}
                </Typography>
                {visibleSearchAccordionGroups.map(({ category, tags, faqs }) => (
                  <Accordion
                    key={`${category.id}-${searchAccordionMode}`}
                    defaultExpanded={searchAccordionMode === 'match'}
                    disableGutters
                    sx={{
                      mb: 2,
                      bgcolor: c.bright,
                      color: c.text,
                      border: `6px solid ${c.ink}`,
                      borderRadius: 0,
                      boxShadow: 'none',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY }} />}
                      sx={{
                        py: 1.5,
                        px: 2,
                        '& .MuiAccordionSummary-content': { my: 1, alignItems: 'center', gap: 1.5 },
                      }}
                    >
                      <Box sx={{ color: PRIMARY, display: 'flex', '& svg': { fontSize: 32 } }}>{category.icon}</Box>
                      <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', flex: 1, fontSize: '1rem' }}>
                        {category.name}
                      </Typography>
                      <Chip
                        label={searchAccordionMode === 'match' ? tags.length + faqs.length : faqs.length}
                        size="small"
                        sx={{
                          borderRadius: 0,
                          border: `2px solid ${c.ink}`,
                          fontWeight: 900,
                          bgcolor: TERTIARY_CONTAINER,
                          color: INK,
                        }}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, px: 2, pb: 2.5, borderTop: `4px solid ${c.ink}`, bgcolor: c.panel }}>
                      {tags.length > 0 && (
                        <Box sx={{ mb: faqs.length ? 2.5 : 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.14em',
                              color: c.muted,
                              mb: 1,
                            }}
                          >
                            Keywords
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                onClick={() => setSearchQuery(tag)}
                                sx={{
                                  borderRadius: 0,
                                  border: `2px solid ${PRIMARY}`,
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  bgcolor: 'transparent',
                                  color: PRIMARY,
                                  '&:hover': { bgcolor: 'rgba(168, 49, 0, 0.12)' },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                      {faqs.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography
                            sx={{
                              fontWeight: 900,
                              fontSize: '0.7rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.14em',
                              color: c.muted,
                              mb: 0.5,
                            }}
                          >
                            Questions
                          </Typography>
                          {faqs.map((faq) => (
                            <Button
                              key={faq.id}
                              fullWidth
                              onClick={() => {
                                setSelectedCategory('all');
                                setExpandedAccordion(faq.id);
                                setTimeout(() => {
                                  document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }, 100);
                              }}
                              sx={{
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                textTransform: 'none',
                                fontWeight: 800,
                                py: 1.5,
                                px: 2,
                                borderRadius: 0,
                                border: `4px solid ${c.ink}`,
                                bgcolor: c.bg,
                                color: c.text,
                                fontFamily: GROTESK,
                                boxShadow: hardShadowSm,
                                '&:hover': { bgcolor: 'rgba(255,120,77,0.12)', borderColor: PRIMARY },
                              }}
                            >
                              <QuestionAnswerIcon sx={{ color: PRIMARY, mr: 1.5, flexShrink: 0 }} />
                              <Box component="span" sx={{ lineHeight: 1.35 }}>
                                {faq.question}
                              </Box>
                            </Button>
                          ))}
                        </Box>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 4, lg: 6 },
              alignItems: { lg: 'flex-start' },
              minWidth: 0,
            }}
          >
            {/* Sidebar — desktop */}
            {isMdUp && (
              <Box
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  flexShrink: 0,
                  width: 288,
                }}
              >
                <Box
                  sx={{
                    borderRight: `8px solid ${c.ink}`,
                    transform: 'rotate(-1deg)',
                    bgcolor: c.bg,
                    boxShadow: `8px 0 0 0 ${c.ink}`,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.1rem', color: c.text }}>
                      Alchemist Assistant
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', color: c.muted }}>
                      Direct line to the lab
                    </Typography>
                  </Box>
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      startIcon={<FilterListIcon />}
                      onClick={() => handleCategoryChange('all')}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        py: 1.5,
                        border: `4px solid ${c.ink}`,
                        borderRadius: 0,
                        bgcolor: selectedCategory === 'all' ? PRIMARY : 'transparent',
                        color: selectedCategory === 'all' ? ON_PRIMARY : c.text,
                        boxShadow: selectedCategory === 'all' ? hardShadowSm : 'none',
                        '&:hover': { bgcolor: selectedCategory === 'all' ? PRIMARY : 'rgba(255,120,77,0.15)' },
                      }}
                    >
                      All ({faqData.length})
                    </Button>
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        fullWidth
                        startIcon={cat.icon}
                        onClick={() => handleCategoryChange(cat.id)}
                        sx={{
                          justifyContent: 'flex-start',
                          textTransform: 'uppercase',
                          fontWeight: 800,
                          py: 1.5,
                          border: 'none',
                          borderRadius: 0,
                          bgcolor: selectedCategory === cat.id ? PRIMARY : 'transparent',
                          color: selectedCategory === cat.id ? ON_PRIMARY : c.text,
                          borderLeft: selectedCategory === cat.id ? `4px solid ${c.ink}` : '4px solid transparent',
                          '&:hover': { bgcolor: 'rgba(255,120,77,0.15)', transform: 'translateX(4px)' },
                        }}
                      >
                        {cat.name}
                      </Button>
                    ))}
                  </Stack>
                  <Button
                    fullWidth
                    sx={{
                      mt: 3,
                      bgcolor: PRIMARY,
                      color: ON_PRIMARY,
                      fontWeight: 900,
                      py: 2,
                      border: `6px solid ${c.ink}`,
                      borderRadius: 0,
                      boxShadow: hardShadowSm,
                      textTransform: 'uppercase',
                      letterSpacing: '0.2em',
                      '&:active': { transform: 'translate(4px, 4px)', boxShadow: 'none' },
                    }}
                    onClick={() => window.open('mailto:support@coffeeshop.com')}
                  >
                    Send a flare
                  </Button>
                </Box>
              </Box>
            )}

            {/* Mobile category chips */}
            {!isMdUp && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
                <Chip
                  label={`All · ${faqData.length}`}
                  onClick={() => handleCategoryChange('all')}
                  sx={{
                    borderRadius: 0,
                    border: `3px solid ${c.ink}`,
                    fontWeight: 800,
                    bgcolor: selectedCategory === 'all' ? PRIMARY : c.panel,
                    color: selectedCategory === 'all' ? ON_PRIMARY : c.text,
                  }}
                />
                {categories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    onClick={() => handleCategoryChange(cat.id)}
                    sx={{
                      borderRadius: 0,
                      border: `3px solid ${c.ink}`,
                      fontWeight: 800,
                      bgcolor: selectedCategory === cat.id ? PRIMARY : c.panel,
                      color: selectedCategory === cat.id ? ON_PRIMARY : c.text,
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Main column */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 6, md: 8 },
              }}
            >
              <Typography sx={{ fontWeight: 800, color: c.muted }}>
                {filteredFAQ.length} questions found
                {searchQuery ? ` for "${searchQuery}"` : ''}
                {selectedCategory !== 'all' ? ` · ${getCategoryName(selectedCategory)}` : ''}
              </Typography>

              {/* Help categories — same category data as cards */}
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                    fontWeight: 900,
                    fontStyle: 'italic',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.03em',
                    mb: 4,
                    transform: 'rotate(-1deg)',
                    textDecoration: 'underline',
                    textDecorationColor: PRIMARY,
                    textDecorationThickness: 8,
                    textUnderlineOffset: 6,
                  }}
                >
                  Help categories
                </Typography>
                <Grid container spacing={3}>
                  {categories.map((cat, i) => {
                    const badge = CATEGORY_BADGE_STYLES[i % CATEGORY_BADGE_STYLES.length];
                    return (
                      <Grid item xs={12} sm={6} key={cat.id}>
                        <Card
                          onClick={() => handleCategoryChange(cat.id)}
                          sx={{
                            p: 4,
                            bgcolor: c.panelLow,
                            border: `6px solid ${c.ink}`,
                            boxShadow: hardShadow,
                            borderRadius: 0,
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            transform: i % 2 === 0 ? 'rotate(0deg)' : 'rotate(0deg)',
                            '&:hover': { transform: i % 2 === 0 ? 'rotate(-1deg)' : 'rotate(1deg)' },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Box sx={{ color: PRIMARY, display: 'flex', '& svg': { fontSize: 48 } }}>{cat.icon}</Box>
                            <Chip
                              label={cat.name.toUpperCase().slice(0, 8)}
                              sx={{
                                bgcolor: badge.bg,
                                color: badge.color,
                    fontWeight: 900,
                                border: `2px solid ${c.ink}`,
                                borderRadius: 0,
                                fontSize: '0.65rem',
                              }}
                            />
                          </Box>
                          <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '1.35rem', mb: 1 }}>
                            {cat.name}
                          </Typography>
                          <Typography sx={{ fontWeight: 600, color: c.muted, lineHeight: 1.5 }}>{cat.description}</Typography>
                          <Typography sx={{ mt: 2, fontSize: '0.75rem', fontWeight: 800, opacity: 0.7 }}>
                            {cat.count} topics
                          </Typography>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              </Box>

              {/* Popular questions */}
              {selectedCategory === 'all' && !searchQuery && (
                <Box>
                  <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon sx={{ color: PRIMARY }} /> Most popular
                  </Typography>
                  <Grid container spacing={2}>
                    {topQuestions.map((faq, index) => (
                      <Grid item xs={12} sm={6} key={faq.id}>
                        <Card
                          onClick={() => {
                            setExpandedAccordion(faq.id);
                            document.getElementById(`faq-${faq.id}`)?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          sx={{
                            p: 3,
                            bgcolor: c.bright,
                            border: `4px solid ${c.ink}`,
                            boxShadow: hardShadowSm,
                            borderRadius: 0,
                            cursor: 'pointer',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Badge badgeContent={index + 1} sx={{ '& .MuiBadge-badge': { bgcolor: PRIMARY, color: ON_PRIMARY, fontWeight: 900 } }}>
                              <Avatar sx={{ bgcolor: TERTIARY_CONTAINER, color: INK, width: 36, height: 36 }}>
                                <StarIcon sx={{ fontSize: 20 }} />
                              </Avatar>
                            </Badge>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontWeight: 800, mb: 1, lineHeight: 1.35 }}>{faq.question}</Typography>
                              <Chip
                                label={getCategoryName(faq.category)}
                                size="small"
                                sx={{ borderRadius: 0, border: `2px solid ${c.ink}`, fontWeight: 800, mr: 1 }}
                              />
                              <Typography component="span" variant="caption" sx={{ color: c.muted }}>
                                {faq.views} views
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* FAQ — POW block (cream panel on ink frame — matches stitch HTML) */}
              <Box sx={{ position: 'relative', bgcolor: INK, p: '4px' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    right: -8,
                    top: -32,
                    bgcolor: TERTIARY_CONTAINER,
                    color: INK,
                    p: 2,
                    border: `6px solid ${INK}`,
                    transform: 'rotate(6deg)',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    zIndex: 2,
                  }}
                >
                  POW! FAQ
                </Box>
                <Box
                  sx={{
                    bgcolor: SURFACE_BRIGHT,
                    color: ON_SURFACE,
                    p: { xs: 3, md: 5 },
                    border: `4px dashed ${INK}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: '1.75rem', md: '2.25rem' },
                      fontWeight: 900,
                      fontStyle: 'italic',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.03em',
                      mb: 4,
                      color: INK,
                    }}
                  >
                    System clearance FAQ
                  </Typography>

                  {filteredFAQ.length > 0 ? (
                    filteredFAQ.map((faq) => (
                      <Accordion
                        key={faq.id}
                        id={`faq-${faq.id}`}
                        expanded={expandedAccordion === faq.id}
                        onChange={handleAccordionChange(faq.id)}
                        sx={{
                          mb: 2,
                          bgcolor: SURFACE_BRIGHT,
                          border: `6px solid ${INK}`,
                          borderRadius: 0,
                          boxShadow: 'none',
                          color: ON_SURFACE,
                          '&:before': { display: 'none' },
                        }}
                      >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY }} />}
                          sx={{
                            py: 2,
                            px: 2,
                            '& .MuiAccordionSummary-content': {
                              my: 1,
                              minWidth: 0,
                              alignItems: 'center',
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              fontSize: '1rem',
                              pr: 2,
                              color: INK,
                              flex: 1,
                              minWidth: 0,
                              wordBreak: 'break-word',
                            }}
                          >
                            {faq.question}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0, px: 2, pb: 3 }}>
                          <Box sx={{ borderTop: `4px solid ${INK}`, pt: 2, bgcolor: SURFACE, p: 2, mb: 2 }}>
                            <Typography sx={{ fontWeight: 600, lineHeight: 1.7, color: ON_SURFACE }}>{faq.answer}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {faq.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  borderRadius: 0,
                                  border: `2px solid ${PRIMARY}`,
                                  color: PRIMARY,
                                  fontWeight: 700,
                                  bgcolor: 'transparent',
                                }}
                              />
                            ))}
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', borderTop: `2px solid ${INK}`, pt: 2 }}>
                            <Typography variant="body2" sx={{ color: ON_SURFACE_VARIANT, fontWeight: 700 }}>
                              Was this helpful?
                            </Typography>
                            <Button
                              size="small"
                              startIcon={<ThumbUpIcon />}
                              onClick={() => handleHelpfulFeedback(faq.id, 'helpful')}
                              sx={{
                                borderRadius: 0,
                                border: `3px solid ${INK}`,
                                fontWeight: 800,
                                bgcolor: helpfulFeedback[faq.id] === 'helpful' ? PRIMARY : 'transparent',
                                color: helpfulFeedback[faq.id] === 'helpful' ? ON_PRIMARY : INK,
                              }}
                            >
                              Yes ({faq.helpful})
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ThumbDownIcon />}
                              onClick={() => handleHelpfulFeedback(faq.id, 'notHelpful')}
                              sx={{
                                borderRadius: 0,
                                border: `3px solid ${INK}`,
                                fontWeight: 800,
                                bgcolor: helpfulFeedback[faq.id] === 'notHelpful' ? '#b31b25' : 'transparent',
                                color: helpfulFeedback[faq.id] === 'notHelpful' ? '#fff' : INK,
                              }}
                            >
                              No ({faq.notHelpful})
                            </Button>
                          </Box>
                        </AccordionDetails>
                      </Accordion>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 6, border: `4px solid ${INK}` }}>
                      <SearchIcon sx={{ fontSize: 56, color: ON_SURFACE_VARIANT, mb: 2 }} />
                      <Typography sx={{ fontWeight: 900, mb: 2, color: INK }}>No questions found</Typography>
                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        sx={{ borderRadius: 0, border: `4px solid ${INK}`, fontWeight: 900, boxShadow: hardShadowSm, color: INK }}
                      >
                        Clear search
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Suggested articles */}
              {selectedCategory === 'all' && !searchQuery && (
                <Box>
                  <Typography sx={{ fontWeight: 900, textTransform: 'uppercase', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ArticleIcon sx={{ color: PRIMARY }} /> Suggested articles
                  </Typography>
                  <Grid container spacing={3}>
                    {suggestedArticles.map((article, i) => (
                      <Grid item xs={12} sm={6} key={article.id}>
                        <Card
                          sx={{
                            p: 3,
                            height: '100%',
                            bgcolor: c.panelLow,
                            border: `6px solid ${c.ink}`,
                            boxShadow: hardShadow,
                            borderRadius: 0,
                            '&:hover': { transform: i % 2 ? 'rotate(0.5deg)' : 'rotate(-0.5deg)' },
                            transition: 'transform 0.2s',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <QuestionAnswerIcon sx={{ color: PRIMARY, fontSize: 40 }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontWeight: 900, mb: 1, lineHeight: 1.3 }}>{article.title}</Typography>
                              <Typography sx={{ color: c.muted, fontWeight: 600, mb: 2, lineHeight: 1.5 }}>
                                {article.description}
                              </Typography>
                              <Chip
                                label={getCategoryName(article.category)}
                                size="small"
                                sx={{ borderRadius: 0, border: `2px solid ${c.ink}`, fontWeight: 800, mr: 1 }}
                              />
                              <Typography component="span" variant="caption" sx={{ color: c.muted }}>
                                {article.readTime} · {article.views} views
                              </Typography>
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Contact */}
              <Grid container spacing={4} sx={{ pt: 4, borderTop: `8px solid ${c.ink}` }}>
                <Grid item xs={12} md={6}>
                  <Typography sx={{ fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', mb: 2 }}>
                    Still searching?
                  </Typography>
                  <Typography sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: PRIMARY, mb: 3 }}>
                    Establish a direct link with our support division.
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ gap: 2 }}>
                    <Button
                      startIcon={<EmailIcon />}
                      onClick={() => window.open('mailto:support@coffeeshop.com')}
                      sx={{
                        bgcolor: PRIMARY,
                        color: ON_PRIMARY,
                        border: `6px solid ${c.ink}`,
                        borderRadius: 0,
                        boxShadow: hardShadow,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        py: 2,
                        px: 3,
                        '&:active': { transform: 'translate(4px, 4px)', boxShadow: hardShadowSm },
                      }}
                    >
                      Send a message
                    </Button>
                    <Button
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open('tel:555-123-4567')}
                      sx={{
                        bgcolor: c.ink,
                        color: SURFACE_BRIGHT,
                        border: `6px solid ${c.ink}`,
                        borderRadius: 0,
                        boxShadow: hardShadow,
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        py: 2,
                        px: 3,
                        '&:active': { transform: 'translate(4px, 4px)', boxShadow: hardShadowSm },
                      }}
                    >
                      Call support
                    </Button>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      height: 256,
                      border: `8px solid ${c.ink}`,
                      overflow: 'hidden',
                      transform: 'rotate(1deg)',
                      boxShadow: hardShadow,
                      position: 'relative',
                    }}
                  >
                    <Box
                      component="img"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzGJ1q3XwozOdYI1rRDQqiaughUXKiBSLKmTKg_d4_cv8yUyxIhIpj85LjqOcCn6rJ7vMXE25o-aUetdAazlZ3QDvvXsX6BskoNO-w4gc_RE7gE-FUui1uQ2LeVs8KMFqbTT4FZkEn5dJ7JmANcCMhs8cHFZ3VrWKKqmPX6ycULfaJtD11MQHBJxVfcPmE2wFUQ8oym4D0qMJKD_1k7MOOEn9_drUyQjW7Hqcgr1p05vUWmjhpxwW-dOzfpt47oLCQ9ufjb9nY39zr"
                      alt="Contact support"
                      sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.15) grayscale(1)' }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: `${PRIMARY}33`,
                        mixBlendMode: 'multiply',
                        ...halftoneSx,
                        opacity: 0.35,
                        pointerEvents: 'none',
                      }}
                    />
                    <Typography
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        bgcolor: TERTIARY_CONTAINER,
                        color: INK,
                        px: 2,
                        py: 1,
                        border: `4px solid ${INK}`,
                        fontWeight: 900,
                        fontStyle: 'italic',
                      }}
                    >
                      HQ: 144 BATCH ST.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
