// Coffees component for listing all coffees
import React, { useState, useEffect, useMemo, useCallback, Suspense, useRef } from "react";
import {
  Container,
  Stack,
  Box,
  Button,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Pagination,
  useTheme,
  useMediaQuery,
  Skeleton,
  CircularProgress
} from "@mui/material";
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCart as AddShoppingCartIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Visibility as VisibilityIcon,
  Whatshot as WhatshotIcon,
  AttachMoney as AttachMoneyIcon,
  LocalCafe as LocalCafeIcon,
  RestaurantMenu as RestaurantMenuIcon,
  EmojiFoodBeverage as EmojiFoodBeverageIcon
} from "@mui/icons-material";
import { useHistory, useLocation } from "react-router-dom";
import { CartItem } from "../../../lib/types/search";
import { useTheme as useCoffeeTheme } from "../../../mui-coffee/context/ThemeContext";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ProductService from "../../services/ProductService";

// Lazy load the AwardsStrip component
import { serverApi } from "../../../lib/config";
const AwardsStrip = React.lazy(() => import('../../../mui-coffee/components/AwardsStrip'));
const ImageRightSection = React.lazy(() => import('../../../mui-coffee/components/ImageRightSection'));

// While products arrive, the counter presents blank order tickets in the same
// shape and grid positions as the finished product cards.
const CardSkeleton = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const paper = isDarkMode ? '#30271f' : '#fff9ee';
  const line = isDarkMode ? 'rgba(225,197,160,.14)' : 'rgba(128,91,54,.14)';
  const placeholder = isDarkMode ? 'rgba(218,190,151,.14)' : 'rgba(157,119,77,.15)';

  return (
    <Card
      aria-hidden="true"
      sx={{
        minHeight: { xs: 510, sm: 540 },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '2px',
        backgroundColor: paper,
        backgroundImage: `radial-gradient(circle at 0 7px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 3.5px, transparent 4px), radial-gradient(circle at 100% 7px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 3.5px, transparent 4px)`,
        backgroundSize: '8px 14px, 8px 14px',
        backgroundRepeat: 'repeat-y, repeat-y',
        border: `1px dashed ${isDarkMode ? '#806747' : '#c6a982'}`,
        boxShadow: isDarkMode ? '3px 5px 0 rgba(0,0,0,.2)' : '3px 5px 0 #e2d2b9, 0 10px 20px rgba(72,49,27,.07)',
        '&::before': {
          content: '""', position: 'absolute', inset: 9, border: `1px dashed ${line}`, pointerEvents: 'none', zIndex: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, pt: 2.25, pb: 1.25, borderBottom: `1px dashed ${line}` }}>
        <Skeleton animation={false} variant="text" width="38%" height={17} sx={{ bgcolor: placeholder }} />
        <Skeleton animation={false} variant="circular" width={20} height={20} sx={{ bgcolor: placeholder }} />
      </Box>
      <Box sx={{ position: 'relative', height: { xs: 252, sm: 270 }, mx: 2, mt: 1.75, overflow: 'hidden', clipPath: 'polygon(2% 1%, 22% 0, 43% 1.5%, 64% 0, 82% 1%, 98% 0, 100% 24%, 98% 50%, 100% 76%, 98% 100%, 77% 98%, 55% 100%, 32% 98%, 1% 100%, 0 74%, 2% 50%, 0 25%)', background: isDarkMode ? '#443629' : '#ecdfcc' }}>
        <Skeleton animation={false} variant="rectangular" sx={{ width: '100%', height: '100%', bgcolor: 'transparent' }} />
        <Box sx={{ position: 'absolute', inset: 12, display: 'grid', placeItems: 'center', border: `1px dashed ${line}`, color: isDarkMode ? '#b79c78' : '#a17d58', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.92rem', letterSpacing: '.02em' }}>
          menu photo
        </Box>
      </Box>
      <CardContent sx={{ px: 2.5, pt: 2, pb: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Skeleton animation={false} variant="text" width="54%" height={30} sx={{ bgcolor: placeholder }} />
          <Skeleton animation={false} variant="text" width="18%" height={25} sx={{ bgcolor: placeholder }} />
        </Box>
        <Skeleton animation={false} variant="text" width="46%" height={20} sx={{ bgcolor: placeholder, mb: 1.5 }} />
        <Skeleton animation={false} variant="rounded" width="35%" height={23} sx={{ bgcolor: placeholder, borderRadius: 0, mb: 2 }} />
        <Box sx={{ mt: 'auto', pt: 1.5, borderTop: `1px dashed ${line}` }}>
          <Skeleton animation={false} variant="rounded" height={42} sx={{ bgcolor: placeholder, borderRadius: 0 }} />
        </Box>
      </CardContent>
    </Card>
  );
};

// `display: contents` lets the loading banner and ticket cards occupy the real
// product grid directly, so loading and loaded layouts share the same tracks.
const GridSkeleton = ({ isDarkMode, count }: { isDarkMode: boolean; count: number }) => (
  <Box role="status" aria-label="Loading the menu" sx={{ display: 'contents' }}>
    <Box sx={{ gridColumn: '1 / -1', minHeight: { xs: 94, sm: 108 }, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, pl: { xs: 2, sm: 3 }, pr: { xs: 1.5, sm: 2.5 }, py: 1.5, overflow: 'hidden', backgroundColor: isDarkMode ? '#3a2e23' : '#eadbc4', border: `1px dashed ${isDarkMode ? '#806747' : '#c6a982'}`, boxShadow: isDarkMode ? '3px 4px 0 rgba(0,0,0,.16)' : '3px 4px 0 #ddc9aa' }}>
      <Box sx={{ minWidth: 0, position: 'relative', zIndex: 1 }}>
        <Typography sx={{ color: isDarkMode ? '#d2b181' : '#8a5c3b', fontSize: '.8rem', fontWeight: 800, letterSpacing: '.1em', mb: .5 }}>
          ORDER RAIL · MENU IN PREPARATION
        </Typography>
        <Typography sx={{ color: isDarkMode ? '#f0e2cf' : '#49392c', fontFamily: 'Georgia, serif', fontSize: { xs: '.98rem', sm: '1.12rem' }, fontStyle: 'italic' }}>
          The barista is setting out today’s menu.
        </Typography>
      </Box>
      <Box component="img" src="/img/coffee/cafert-counter-barista.webp" alt="" sx={{ alignSelf: 'stretch', width: { xs: 72, sm: 90 }, height: { xs: 94, sm: 116 }, flex: '0 0 auto', objectFit: 'contain', objectPosition: 'bottom center', filter: 'drop-shadow(0 5px 4px rgba(58,38,21,.18))', pointerEvents: 'none' }} />
      <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', zIndex: 2, right: 90, top: 8, px: 1.2, py: .6, maxWidth: 180, color: '#503a29', backgroundColor: '#fff9ee', border: '1px solid #d4bd9c', boxShadow: '2px 3px 0 rgba(78,53,29,.12)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.86rem', transform: 'rotate(-2deg)', '&::after': { content: '""', position: 'absolute', right: -5, bottom: 4, width: 8, height: 8, backgroundColor: '#fff9ee', borderRight: '1px solid #d4bd9c', borderBottom: '1px solid #d4bd9c', transform: 'rotate(-45deg)' } }}>
        Just a moment, I’m laying out the menu.
      </Box>
    </Box>
    {Array.from({ length: count }).map((_, index) => (
      <CardSkeleton key={index} isDarkMode={isDarkMode} />
    ))}
  </Box>
);

type CafeLocation = {
  id: string;
  name: string;
  address: string;
  area: string;
  mapQuery: string;
  hours?: string;
  phone?: string;
};

const CAFE_LOCATIONS: CafeLocation[] = [
  { id: 'main', name: 'Main Coffee Shop', address: '123 Coffee Street, Downtown, New York, NY 10001', area: 'Downtown', mapQuery: 'Downtown Manhattan, New York, NY', hours: 'Open daily, 7:00 AM–10:00 PM', phone: '(555) 123-4567' },
  { id: 'midtown', name: 'Midtown Branch', address: '456 Avenue A, Midtown', area: 'Midtown', mapQuery: 'Midtown Manhattan, New York, NY' },
  { id: 'brooklyn', name: 'Brooklyn Branch', address: '789 Coffee Lane, Brooklyn', area: 'Brooklyn', mapQuery: 'Brooklyn, New York, NY' },
  { id: 'queens', name: 'Queens Branch', address: '321 Brew Street, Queens', area: 'Queens', mapQuery: 'Queens, New York, NY' },
];

function CafertLocationGuide({ isDarkMode }: { isDarkMode: boolean }) {
  const [selectedId, setSelectedId] = useState(CAFE_LOCATIONS[0].id);
  const selected = CAFE_LOCATIONS.find((location) => location.id === selectedId) || CAFE_LOCATIONS[0];
  const paper = isDarkMode ? '#33291f' : '#f4ead9';
  const ink = isDarkMode ? '#f0e2cf' : '#443326';
  const muted = isDarkMode ? '#c8b7a1' : '#76634e';
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(selected.mapQuery)}&output=embed`;
  const destination = selected.id === 'main' ? selected.address : `${selected.address}, New York, NY, USA`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;

  return (
    <Box component="section" sx={{ mt: { xs: 5, md: 8 }, color: ink }} aria-labelledby="cafert-location-title">
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ color: isDarkMode ? '#c99a68' : '#9a6846', fontSize: '.72rem', fontWeight: 800, letterSpacing: '.16em', mb: .75 }}>
            THE NEIGHBORHOOD GUIDE
          </Typography>
          <Typography id="cafert-location-title" component="h2" sx={{ m: 0, fontFamily: 'Georgia, serif', fontSize: { xs: '2rem', sm: '2.45rem' }, lineHeight: 1.04, fontWeight: 600, color: ink }}>
            Your Cafert, around the corner.
          </Typography>
        </Box>
        <Typography sx={{ display: { xs: 'none', md: 'block' }, color: muted, fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1rem' }}>
          Choose a stop to unfold its map ticket.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: { xs: 1.25, sm: 2 }, backgroundColor: paper, border: `1px solid ${isDarkMode ? '#68533b' : '#d7c3a5'}`, borderRadius: 0, boxShadow: isDarkMode ? '0 12px 26px rgba(0,0,0,.24)' : '4px 8px 0 #e8dbc7, 0 16px 35px rgba(74,48,24,.11)', position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.45fr) 18px minmax(300px, .78fr)' }, alignItems: 'stretch' }}>
          <Box sx={{ minWidth: 0, p: { xs: .5, sm: 1 }, background: isDarkMode ? '#27231f' : '#e7decf', clipPath: 'polygon(0 1%, 18% 0, 36% 1%, 54% 0, 72% 1%, 100% 0, 99% 22%, 100% 44%, 99% 66%, 100% 100%, 78% 99%, 56% 100%, 34% 99%, 12% 100%, 0 99%)' }}>
            <Box sx={{ height: { xs: 270, sm: 340, md: 410 }, position: 'relative', backgroundColor: '#e6dfd3', overflow: 'hidden', clipPath: 'polygon(1% 0, 20% 1%, 40% 0, 60% 1%, 80% 0, 100% 1%, 99% 22%, 100% 44%, 99% 66%, 100% 99%, 80% 100%, 60% 99%, 40% 100%, 20% 99%, 0 100%, 1% 78%, 0 56%, 1% 34%)' }}>
              <iframe
                key={selected.id}
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Map to ${selected.name}`}
              />
              <Box sx={{ position: 'absolute', top: 12, left: 12, px: 1.25, py: .65, color: '#493522', background: '#fff8ec', border: '1px solid #d1b993', fontFamily: 'Georgia, serif', fontSize: '.84rem', boxShadow: '2px 3px 0 rgba(61,41,21,.16)', pointerEvents: 'none' }}>
                CAFERT · {selected.area.toUpperCase()}
              </Box>
            </Box>
          </Box>

          <Box aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, background: `repeating-linear-gradient(90deg, ${paper} 0 4px, ${isDarkMode ? '#775b3d' : '#d8c3a5'} 4px 5px, ${paper} 5px 9px)`, mx: .25 }} />

          <Box sx={{ position: 'relative', mt: { xs: 2, md: 0 }, minHeight: { xs: 350, md: 410 }, px: { xs: 2, sm: 3 }, pt: { xs: 2.5, md: 3.5 }, pb: { xs: 2.5, md: 3 }, overflow: 'hidden', color: ink, backgroundColor: isDarkMode ? '#e7d7bf' : '#fbf3e6', clipPath: 'polygon(0 2%, 5% 0, 10% 2%, 15% 0, 20% 2%, 25% 0, 30% 2%, 35% 0, 40% 2%, 45% 0, 50% 2%, 55% 0, 60% 2%, 65% 0, 70% 2%, 75% 0, 80% 2%, 85% 0, 90% 2%, 95% 0, 100% 2%, 100% 100%, 0 100%)' }}>
            <Typography sx={{ color: '#986a45', fontSize: '.68rem', fontWeight: 800, letterSpacing: '.15em', mb: 1 }}>FOLD-OUT LOCATION TICKET</Typography>
            <Typography component="h3" sx={{ m: 0, maxWidth: '74%', fontFamily: 'Georgia, serif', fontSize: { xs: '1.7rem', md: '1.85rem' }, lineHeight: 1.05, color: '#443326' }}>
              {selected.name}
            </Typography>
            <Box sx={{ width: 38, height: 2, my: 1.8, backgroundColor: '#b6865c' }} />
            <Typography sx={{ maxWidth: '78%', fontSize: '.98rem', lineHeight: 1.55, color: '#6c5843' }}>{selected.address}</Typography>
            {selected.hours && <Typography sx={{ mt: 1.25, maxWidth: '78%', color: '#6c5843', fontSize: '.91rem' }}>{selected.hours}</Typography>}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2.25, pr: { xs: 0, md: 1 } }}>
              <Button component="a" href={directionsUrl} target="_blank" rel="noopener noreferrer" variant="contained" startIcon={<LocationOnIcon />} sx={{ backgroundColor: '#8d5b3c', color: '#fff8ed', textTransform: 'none', borderRadius: 0, px: 2, '&:hover': { backgroundColor: '#71442d' } }}>
                Get directions
              </Button>
              {selected.phone && <Button component="a" href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`} variant="outlined" startIcon={<PhoneIcon />} sx={{ color: '#70482f', borderColor: '#b99673', textTransform: 'none', borderRadius: 0 }}>
                Call
              </Button>}
            </Box>

            <Box sx={{ position: 'absolute', left: 16, right: 112, bottom: 16, borderTop: '1px dashed rgba(89,62,36,.35)', pt: 1, color: '#876b4e', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.9rem' }}>
              {selected.phone ? 'Open daily · come say hello.' : 'A Cafert stop in the neighborhood.'}
            </Box>
            <Box component="img" src="/img/coffee/cafert-counter-barista.webp" alt="" sx={{ position: 'absolute', right: -8, bottom: -21, width: 128, height: 190, objectFit: 'contain', objectPosition: 'bottom center', filter: 'drop-shadow(0 6px 4px rgba(54,35,18,.18))', pointerEvents: 'none' }} />
            <Box sx={{ position: 'absolute', right: 101, bottom: 78, px: 1, py: .6, color: '#493522', backgroundColor: '#fffaf0', border: '1px solid #d1b993', boxShadow: '2px 2px 0 rgba(61,41,21,.14)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.8rem', transform: 'rotate(-3deg)', '&::after': { content: '""', position: 'absolute', right: -5, bottom: 5, width: 8, height: 8, background: '#fffaf0', borderRight: '1px solid #d1b993', borderBottom: '1px solid #d1b993', transform: 'rotate(-45deg)' } }}>
              Let’s find your stop.
            </Box>
          </Box>
        </Box>

        <Box role="group" aria-label="Choose a Cafert location" sx={{ display: 'flex', gap: 1, overflowX: { xs: 'auto', md: 'visible' }, mt: 2, pt: 1.5, borderTop: `1px dashed ${isDarkMode ? '#766148' : '#cdb997'}`, scrollbarWidth: 'thin' }}>
          {CAFE_LOCATIONS.map((location, index) => (
            <Button
              key={location.id}
              type="button"
              aria-pressed={selected.id === location.id}
              onClick={() => setSelectedId(location.id)}
              sx={{
                flex: { xs: '0 0 auto', md: '1 1 0' }, justifyContent: 'flex-start', textAlign: 'left',
                minHeight: 58, px: 1.5, py: 1, borderRadius: 0,
                color: selected.id === location.id ? '#fff8ed' : ink,
                backgroundColor: selected.id === location.id ? '#8d5b3c' : (isDarkMode ? '#3c3024' : '#efe3d0'),
                border: `1px solid ${selected.id === location.id ? '#8d5b3c' : (isDarkMode ? '#6a5338' : '#d9c4a5')}`,
                '&:hover': { backgroundColor: selected.id === location.id ? '#71442d' : (isDarkMode ? '#493a2b' : '#e7d8c1') },
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography component="span" sx={{ display: 'block', fontSize: '.9rem', fontWeight: 700, lineHeight: 1.2 }}>{location.name}</Typography>
                <Typography component="span" sx={{ display: 'block', mt: .35, fontSize: '.75rem', opacity: .82 }}>{String(index + 1).padStart(2, '0')} · {location.area}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

// Extended coffee data with new fields
interface CoffeeItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "coffees" | "desserts" | "drinks" | "salads" | "dishes" | "other";
  origin: string;
  roast: string;
  rating: number;
  reviews: number;
  views: number;
  isNew: boolean;
  inStock: boolean;
  isFavorite: boolean;
  preparationTime: string;
  calories: number;
  ingredients: string[];
}

interface CoffeesProps {
  onAdd: (item: CartItem) => void;
}

export default function Coffees(props: CoffeesProps) {
  const { onAdd } = props;
  const history = useHistory();
  const location = useLocation();
  const { isDarkMode, colors } = useCoffeeTheme();
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  // Pagination constants
  const ITEMS_PER_PAGE = 5;
  
  // Get category from URL query params
  const searchParams = new URLSearchParams((location as any).search || window.location.search);
  const categoryFromUrl = searchParams.get('category') as "all" | "desserts" | "drinks" | "salads" | "dishes" | "other" | null;
  
  const [coffees, setCoffees] = useState<CoffeeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filteredCoffees, setFilteredCoffees] = useState<CoffeeItem[]>([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productService = new ProductService();
        const products = await productService.getProducts({
          page: 1,
          limit: 50,
          order: "createdAt"
        });

        // Transform backend data to frontend format
        const transformedProducts: CoffeeItem[] = products.map((product: any) => {
          let category = 'other';
          const productCollection = product.productCollection?.toLowerCase();
          
          if (productCollection === 'coffee' || productCollection === 'drink') {
            category = 'drinks';
          } else if (productCollection === 'dessert') {
            category = 'desserts';
          } else if (productCollection === 'salad') {
            category = 'salads';
          } else if (productCollection === 'dish') {
            category = 'dishes';
          }
          
          return {
            id: product._id, // Keep the original MongoDB _id as id
            name: product.productName,
            description: product.productDesc || 'No description available',
            price: product.productPrice,
            image: product.productImages?.[0] ? `${serverApi}${product.productImages[0]}` : 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
            category: category as "coffees" | "desserts" | "drinks" | "salads" | "dishes" | "other",
            origin: 'Local',
            roast: 'Medium',
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            views: (() => {
              const backendViews = product.productViews || 0;
              const storageKey = `product_views_${product._id}`;
              const persistentViews = parseInt(localStorage.getItem(storageKey) || "0", 10);
              return Math.max(backendViews, persistentViews);
            })(),
            isNew: false,
            inStock: product.productLeftCount > 0,
            isFavorite: false,
            preparationTime: '5 min',
            calories: Math.floor(Math.random() * 300) + 50,
            ingredients: ['Fresh ingredients']
          };
        });

        setCoffees(transformedProducts);
        setFilteredCoffees(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to empty array if API fails
        setCoffees([]);
        setFilteredCoffees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "desserts" | "drinks" | "salads" | "dishes" | "other">(
    categoryFromUrl && ['all', 'desserts', 'drinks', 'salads', 'dishes', 'other'].includes(categoryFromUrl) 
      ? categoryFromUrl 
      : 'all'
  );
  
  // Ref for category tabs section to scroll into view
  const categoryTabsRef = useRef<HTMLDivElement>(null);

  // Update category when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams((location as any).search || window.location.search);
    const urlCategory = searchParams.get('category') as "all" | "desserts" | "drinks" | "salads" | "dishes" | "other" | null;
    if (urlCategory && ['all', 'desserts', 'drinks', 'salads', 'dishes', 'other'].includes(urlCategory)) {
      setSelectedCategory(urlCategory);
      // Scroll to category tabs section when category is set from URL
      setTimeout(() => {
        categoryTabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (!urlCategory) {
      // If no category in URL, default to 'all'
      setSelectedCategory('all');
    }
  }, [(location as any).search || window.location.search]);
  const [sortBy, setSortBy] = useState<'new' | 'price' | 'views' | 'rating'>('new');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [sortAccordionExpanded, setSortAccordionExpanded] = useState(false);
  const [orderAccordionExpanded, setOrderAccordionExpanded] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightResults, setHighlightResults] = useState(false);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  
  // Ref for auto-scrolling to search results
  const productsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let filtered = coffees.filter((coffee) => {
      if (!searchText.trim()) {
        // If no search term, only filter by category
        return selectedCategory === 'all' || coffee.category === selectedCategory;
      }
      
      const searchLower = searchText.toLowerCase().trim();
      const nameMatch = coffee.name.toLowerCase().includes(searchLower);
      const descMatch = coffee.description.toLowerCase().includes(searchLower);
      const matchesSearch = nameMatch || descMatch;
      const matchesCategory = selectedCategory === 'all' || coffee.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'new':
          comparison = (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'views':
          comparison = a.views - b.views;
          break;
        case 'rating':
          comparison = b.rating - a.rating;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredCoffees(filtered);
    
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [coffees, searchText, selectedCategory, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredCoffees.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredCoffees.slice(startIndex, endIndex);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchText(value);
    
    // Reset search submitted flag when text changes
    if (searchSubmitted) {
      setSearchSubmitted(false);
    }
    
    // Reset highlight when search is cleared
    if (!value.trim()) {
      setHighlightResults(false);
    }
  };

  // Function to handle auto-scroll to search results
  const scrollToSearchResults = () => {
    if (searchText.trim() && filteredCoffees.length > 0) {
      // Mark search as submitted
      setSearchSubmitted(true);
      
      // Trigger highlight effect
      setHighlightResults(true);
      
      setTimeout(() => {
        if (productsGridRef.current) {
          const navbarHeight = 120; // Account for fixed navbar
          const elementPosition = productsGridRef.current.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
        
        // Remove highlight after scroll completes
        setTimeout(() => {
          setHighlightResults(false);
        }, 2000);
      }, 100); // Small delay to ensure DOM is updated
    }
  };

  // Handle Enter key press in search field
  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      scrollToSearchResults();
    }
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: "all" | "desserts" | "drinks" | "salads" | "dishes" | "other") => {
    setSelectedCategory(newValue);
    // Update URL with the selected category
    const newSearchParams = new URLSearchParams((location as any).search || window.location.search);
    if (newValue === 'all') {
      newSearchParams.delete('category');
    } else {
      newSearchParams.set('category', newValue);
    }
    const newSearch = newSearchParams.toString();
    (history as any).replace({
      pathname: (location as any).pathname,
      search: newSearch ? `?${newSearch}` : '',
    });
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: any) => {
    setSortOrder(event.target.value);
  };

  const toggleFavorite = (coffeeId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(coffeeId)) {
      newFavorites.delete(coffeeId);
    } else {
      newFavorites.add(coffeeId);
    }
    setFavorites(newFavorites);
    
    setCoffees(prev => prev.map(coffee => 
      coffee.id === coffeeId 
        ? { ...coffee, isFavorite: !coffee.isFavorite }
        : coffee
    ));
  };

  const handleAddToCart = (coffee: CoffeeItem) => {
    const cartItem: CartItem = {
      _id: coffee.id,
      name: coffee.name,
      price: coffee.price,
      quantity: 1,
      image: coffee.image,
    };
    onAdd(cartItem);
  };

  const handleCoffeeClick = (coffeeId: string) => {
    history.push(`/products/${coffeeId}`);
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'coffees', label: 'Coffees' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'salads', label: 'Salads' },
    { value: 'dishes', label: 'Dishes' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100vh',
      position: 'relative',
      isolation: 'isolate',
      overflow: 'hidden',
      backgroundColor: isDarkMode ? '#27221b' : '#f5eee2',
      backgroundImage: isDarkMode
        ? 'radial-gradient(ellipse at 12% 8%, rgba(168,124,79,.15), transparent 32%), radial-gradient(ellipse at 88% 54%, rgba(108,123,83,.12), transparent 30%), repeating-linear-gradient(0deg, rgba(239,218,188,.018) 0 1px, transparent 1px 5px)'
        : 'radial-gradient(ellipse at 12% 8%, rgba(202,151,103,.18), transparent 32%), radial-gradient(ellipse at 88% 54%, rgba(124,143,96,.13), transparent 30%), repeating-linear-gradient(0deg, rgba(104,76,47,.025) 0 1px, transparent 1px 5px)',
    }}>
      {/* Cafert's wrapping-paper backdrop: a printed neighborhood route and real coffee-plant cutouts sit behind the whole page. */}
      <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <Box component="svg" viewBox="0 0 1440 1800" preserveAspectRatio="none" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: isDarkMode ? .22 : .34 }}>
          <path d="M-80 175 C180 90 180 270 430 225 S730 115 870 215 S1150 330 1510 165" fill="none" stroke={isDarkMode ? '#b58a5b' : '#b6895b'} strokeWidth="2" strokeDasharray="3 11" />
          <path d="M1460 540 C1240 430 1190 650 1000 610 S760 475 620 590 S350 745 -50 605" fill="none" stroke={isDarkMode ? '#95a07a' : '#8c9970'} strokeWidth="2" strokeDasharray="2 12" />
          <path d="M-70 1130 C180 1010 310 1240 520 1165 S870 995 1040 1135 S1320 1300 1500 1160" fill="none" stroke={isDarkMode ? '#b58a5b' : '#b6895b'} strokeWidth="2" strokeDasharray="3 11" />
          <g fill={isDarkMode ? '#c9a477' : '#ae8053'}>
            <circle cx="430" cy="225" r="7"/><circle cx="870" cy="215" r="7"/><circle cx="1000" cy="610" r="7"/><circle cx="620" cy="590" r="7"/><circle cx="520" cy="1165" r="7"/><circle cx="1040" cy="1135" r="7"/>
          </g>
          <g fill="none" stroke={isDarkMode ? '#c6a67c' : '#9a7956'} strokeWidth="1.5" opacity=".55">
            <path d="M70 350h150m-126 16h112M1170 825h190m-164 16h144M180 1480h180m-150 16h120" />
            <circle cx="120" cy="353" r="30"/><circle cx="1280" cy="830" r="30"/><circle cx="270" cy="1485" r="30"/>
          </g>
        </Box>
        <Box component="img" src="/img/coffee/coffee-branch-cutout.webp" alt="" sx={{ position: 'absolute', top: { xs: 90, md: 120 }, right: { xs: -120, md: -80 }, width: { xs: 230, md: 360 }, height: 'auto', opacity: isDarkMode ? .72 : .9, transform: 'rotate(-8deg)', filter: 'drop-shadow(0 14px 11px rgba(54,35,18,.16))' }} />
        <Box component="img" src="/img/coffee/coffee-branch-cutout.webp" alt="" sx={{ position: 'absolute', top: { xs: 1120, md: 1450 }, left: { xs: -145, md: -115 }, width: { xs: 260, md: 410 }, height: 'auto', opacity: isDarkMode ? .52 : .72, transform: 'scaleX(-1) rotate(-14deg)', filter: 'drop-shadow(0 14px 11px rgba(54,35,18,.13))' }} />
      </Box>
      {/* Content in Container */}
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          overflowX: "hidden",
          paddingTop: { xs: "2rem", sm: "3rem", md: "4rem" },
          paddingBottom: { xs: "3.5rem", sm: "4.5rem", md: "6rem" },
          paddingLeft: { xs: "1.25rem", sm: "2rem", md: "2.5rem" },
          paddingRight: { xs: "1.25rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        <Stack spacing={6}>
          {/* Enhanced Search and Controls */}
          <Paper sx={{ 
            position: 'relative',
            backgroundColor: isDarkMode ? '#34291f' : '#f0e3cf',
            backgroundImage: `radial-gradient(circle at 0 8px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 4px, transparent 4.5px), radial-gradient(circle at 100% 8px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 4px, transparent 4.5px)`,
            backgroundSize: '10px 16px, 10px 16px',
            backgroundRepeat: 'repeat-y, repeat-y',
            border: `1px dashed ${isDarkMode ? '#806747' : '#b9956e'}`,
            borderRadius: '3px',
            p: { xs: 2, sm: 2.5 },
            boxShadow: isDarkMode 
              ? '4px 6px 0 rgba(0,0,0,.16), 0 14px 28px rgba(0,0,0,.16)'
              : '4px 6px 0 #ddc9aa, 0 14px 28px rgba(72,49,27,.08)',
            overflow: 'hidden',
          }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap', 
              gap: { xs: 1.5, md: 2 },
              position: 'relative',
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: .65, flex: 1, minWidth: { xs: '100%', sm: 280 } }}>
                <Typography sx={{ color: isDarkMode ? '#d2b181' : '#8a5c3b', fontSize: '.84rem', fontWeight: 800, letterSpacing: '.1em' }}>
                  CAFERT COUNTER · ORDER SLIP
                </Typography>
                {/* Enhanced Search Bar */}
                <TextField
                  id="coffee-search"
                  name="coffee-search"
                  label="Search the menu"
                  placeholder="Type a coffee, drink, or dessert"
                  value={searchText}
                  onChange={handleSearch}
                  onKeyPress={handleSearchKeyPress}
                  size="medium"
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: isDarkMode ? '#2b241d' : '#fffaf2',
                      borderRadius: '2px',
                      fontSize: '1.1rem',
                      '& fieldset': {
                        borderColor: isDarkMode ? '#806747' : '#c6a982',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#c49b61' : '#8B4513',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? '#c49b61' : '#8B4513',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: isDarkMode ? '#fffaf2' : '#49392c',
                      padding: '14px 16px',
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start" sx={{ ml: 1 }}>
                        <SearchIcon sx={{ 
                          color: isDarkMode ? '#c49b61' : '#8B4513',
                          fontSize: '1.5rem'
                        }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchText.trim() && (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={scrollToSearchResults}
                          sx={{
                            color: isDarkMode ? '#c49b61' : '#8B4513',
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.1)' : 'rgba(139, 69, 19, 0.1)',
                            '&:hover': {
                              backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.2)',
                            }
                          }}
                          title="Click to scroll to results"
                        >
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box component="img" src="/img/coffee/cafert-menu-barista-cutout.webp" alt="" aria-hidden="true" sx={{ display: { xs: 'none', md: 'block' }, width: 72, height: 104, objectFit: 'contain', objectPosition: 'bottom center', filter: 'drop-shadow(0 5px 4px rgba(58,38,21,.18))', pointerEvents: 'none', flex: '0 0 auto' }} />
              
            </Box>
          </Paper>

          {/* Awards & Certifications Section */}
          <Suspense fallback={<CircularProgress />}>
            <AwardsStrip />
          </Suspense>

          {/* Enhanced Category Tabs */}
          <Box ref={categoryTabsRef}>
          <Paper sx={{ 
            backgroundColor: isDarkMode ? '#2b241d' : '#fffaf2',
            border: `1px solid ${isDarkMode ? '#49392c' : '#d7c3a5'}`,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Tabs
              value={selectedCategory}
              onChange={handleCategoryChange}
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{
                backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                '& .MuiTab-root': {
                  color: isDarkMode ? '#c8b7a1' : '#76634e',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  padding: '20px 24px',
                  minHeight: '64px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: isDarkMode ? '#c49b61' : '#8B4513',
                    backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                  },
                  '&.Mui-selected': {
                    color: isDarkMode ? '#c49b61' : '#8B4513',
                    fontWeight: 700,
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: isDarkMode ? '#c49b61' : '#8B4513',
                  height: '4px',
                  borderRadius: '2px 2px 0 0',
                },
              }}
            >
              <Tab label={t('common.all')} value="all" />
              <Tab label={t('navigation.desserts')} value="desserts" />
              <Tab label={t('navigation.drinks')} value="drinks" />
              <Tab label={t('navigation.salads')} value="salads" />
            </Tabs>
          </Paper>
          </Box>

          {/* Enhanced Sort Controls */}
          <Paper sx={{ 
            backgroundColor: isDarkMode ? '#2b241d' : '#fffaf2',
            border: `1px solid ${isDarkMode ? '#49392c' : '#d7c3a5'}`,
            borderRadius: '16px',
            p: 3,
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(0,0,0,0.2)'
              : '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              flexWrap: 'wrap', 
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'nowrap', position: 'relative', zIndex: 10 }}>
                <Box sx={{ position: 'relative', height: 48, flexShrink: 0, width: 180 }}>
                  <Accordion 
                    expanded={sortAccordionExpanded} 
                    onChange={(e, isExpanded) => setSortAccordionExpanded(isExpanded)}
                    sx={{ 
                      width: '100%',
                      boxShadow: sortAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      border: `1px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`,
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                      position: 'relative',
                      zIndex: sortAccordionExpanded ? 1000 : 1,
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        minHeight: '48px !important',
                      },
                    }}
                  >
                  <AccordionSummary sx={{ 
                    minHeight: 48, 
                    '&.Mui-expanded': { minHeight: 48 },
                  color: isDarkMode ? '#fffaf2' : '#49392c',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {t('common.sortBy')}: {
                          sortBy === 'new' ? t('common.newest') :
                          sortBy === 'price' ? t('common.price') :
                          sortBy === 'views' ? t('common.views') :
                          t('common.rating')
                        }
                </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ 
                    p: 0,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                    border: `1px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1001,
                    mt: 0,
                  }}>
                    <ListItemButton
                      selected={sortBy === 'new'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'new' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                    sx={{
                      color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                      },
                    }}
                  >
                      <ListItemIcon>
                        <WhatshotIcon sx={{ color: isDarkMode ? '#c49b61' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.newest')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'price'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'price' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <AttachMoneyIcon sx={{ color: isDarkMode ? '#c49b61' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.price')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'views'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'views' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <VisibilityIcon sx={{ color: isDarkMode ? '#c49b61' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.views')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortBy === 'rating'}
                      onClick={() => {
                        handleSortChange({ target: { value: 'rating' } } as any);
                        setSortAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemIcon>
                        <StarIcon sx={{ color: isDarkMode ? '#c49b61' : '#8B4513' }} />
                      </ListItemIcon>
                      <ListItemText primary={t('common.rating')} />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>
                      </Box>

                <Box sx={{ position: 'relative', height: 48, flexShrink: 0, width: 150 }}>
                  <Accordion 
                    expanded={orderAccordionExpanded} 
                    onChange={(e, isExpanded) => setOrderAccordionExpanded(isExpanded)}
                    sx={{
                      width: '100%',
                      boxShadow: orderAccordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                      border: `1px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`,
                      borderRadius: '12px',
                      backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                      position: 'relative',
                      zIndex: orderAccordionExpanded ? 1000 : 1,
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                        minHeight: '48px !important',
                      },
                    }}
                  >
                  <AccordionSummary sx={{ 
                    minHeight: 48,
                    maxHeight: 48,
                    '&.Mui-expanded': { 
                      minHeight: 48,
                      maxHeight: 48,
                    },
                      color: isDarkMode ? '#fffaf2' : '#49392c',
                  }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {t('common.order')}: {sortOrder === 'desc' ? t('common.descending') : t('common.ascending')}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ 
                    p: 0,
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                    border: `1px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`,
                    borderTop: 'none',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1001,
                    mt: 0,
                    display: orderAccordionExpanded ? 'block' : 'none',
                  }}>
                    <ListItemButton
                      selected={sortOrder === 'desc'}
                      onClick={() => {
                        handleSortOrderChange({ target: { value: 'desc' } } as any);
                        setOrderAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                        },
                      }}
                    >
                      <ListItemText primary={t('common.descending')} />
                    </ListItemButton>
                    <ListItemButton
                      selected={sortOrder === 'asc'}
                      onClick={() => {
                        handleSortOrderChange({ target: { value: 'asc' } } as any);
                        setOrderAccordionExpanded(false);
                      }}
                      sx={{
                        color: isDarkMode ? '#fffaf2' : '#49392c',
                        '&.Mui-selected': {
                          backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.2)' : 'rgba(139, 69, 19, 0.1)',
                          '&:hover': {
                            backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.15)',
                          },
                      },
                    }}
                  >
                      <ListItemText primary={t('common.ascending')} />
                    </ListItemButton>
                  </AccordionDetails>
                </Accordion>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ 
                color: isDarkMode ? '#c8b7a1' : '#76634e',
                fontWeight: 500,
                fontSize: '1rem',
                backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                px: 2,
                py: 1,
                borderRadius: '8px',
                border: `1px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`
              }}>
                {t('common.showing')} {startIndex + 1}-{Math.min(endIndex, filteredCoffees.length)} {t('common.of')} {filteredCoffees.length} {t('common.items')}
              </Typography>
            </Box>
          </Paper>

          {/* Search Results Indicator */}
          {searchText.trim() && searchSubmitted && filteredCoffees.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: highlightResults ? 1 : 0.7, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper sx={{ 
                p: 2, 
                mb: 3,
                backgroundColor: isDarkMode ? 'rgba(196, 155, 97, 0.1)' : 'rgba(139, 69, 19, 0.05)',
                border: `1px solid ${isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.2)'}`,
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#c49b61' : '#8B4513',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}>
                  🔍 Found {filteredCoffees.length} result{filteredCoffees.length !== 1 ? 's' : ''} for "{searchText}"
                </Typography>
              </Paper>
            </motion.div>
          )}

          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 210, sm: 230 },
              mb: { xs: 2, md: 3 },
              px: { xs: 2.5, sm: 4, md: 6 },
              py: { xs: 3, sm: 4 },
              display: 'flex',
              alignItems: 'center',
              overflow: 'hidden',
              background: isDarkMode ? '#30271f' : '#f3eadb',
              borderTop: `1px solid ${isDarkMode ? '#594936' : '#dfceb5'}`,
              borderBottom: `1px solid ${isDarkMode ? '#594936' : '#dfceb5'}`,
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, maxWidth: { xs: '70%', sm: '62%' } }}>
              <Typography sx={{ color: isDarkMode ? '#d5ae7d' : '#9a643e', fontSize: '.72rem', fontWeight: 800, letterSpacing: '.16em', mb: 1 }}>
                FRESH FROM THE COUNTER
              </Typography>
              <Typography component="h2" sx={{ color: isDarkMode ? '#f7eddd' : '#3d2d20', fontFamily: 'Georgia, serif', fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }, fontWeight: 700, lineHeight: 1.03, maxWidth: 540 }}>
                Find your little<br />pick-me-up.
              </Typography>
              <Typography sx={{ color: isDarkMode ? '#d6c8b6' : '#725e4b', mt: 1.2, fontSize: { xs: '.9rem', sm: '1rem' }, maxWidth: 430 }}>
                A good cup, a sweet bite, or both. Pick what feels right today.
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', right: { xs: '-20px', sm: '5%', md: '11%' }, bottom: '-20px', width: { xs: 170, sm: 230, md: 270 }, height: { xs: 190, sm: 245, md: 285 }, display: 'grid', placeItems: 'end center', pointerEvents: 'none' }}>
              <Box sx={{ position: 'absolute', width: '78%', height: '70%', right: '4%', bottom: '5%', background: isDarkMode ? 'rgba(179,142,106,.22)' : 'rgba(179,142,106,.28)', clipPath: 'polygon(50% 0, 60% 7%, 76% 3%, 81% 15%, 97% 20%, 91% 37%, 100% 52%, 88% 64%, 92% 81%, 74% 84%, 67% 100%, 50% 91%, 34% 100%, 25% 85%, 7% 82%, 12% 64%, 0 51%, 10% 36%, 4% 20%, 21% 15%, 26% 2%, 41% 8%)' }} />
              <Box component="img" src="/img/coffee/cafert-menu-barista-cutout.webp" alt="" sx={{ position: 'relative', zIndex: 1, height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom center', filter: 'drop-shadow(0 8px 7px rgba(54,35,18,.22))' }} />
              <Box sx={{ position: 'absolute', zIndex: 2, right: { xs: 112, sm: 180 }, top: { xs: 22, sm: 15 }, px: 1.4, py: .8, color: '#4b3524', background: '#fffaf0', border: '1px solid #d9c5a7', boxShadow: '2px 3px 0 rgba(97,65,36,.13)', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: { xs: '.72rem', sm: '.86rem' }, whiteSpace: 'nowrap', transform: 'rotate(-3deg)', '&::after': { content: '""', position: 'absolute', right: -7, bottom: 3, width: 12, height: 12, background: '#fffaf0', borderRight: '1px solid #d9c5a7', borderBottom: '1px solid #d9c5a7', transform: 'rotate(-45deg)' } }}>
                What looks good?
              </Box>
            </Box>
          </Box>

          {/* Enhanced Items Grid */}
          <Box 
            ref={productsGridRef}
            sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
              gap: 4,
              position: 'relative',
              borderRadius: '16px',
              padding: '16px',
              transition: 'all 0.5s ease',
              backgroundColor: highlightResults 
                ? (isDarkMode ? 'rgba(196, 155, 97, 0.1)' : 'rgba(139, 69, 19, 0.05)')
                : 'transparent',
              border: highlightResults 
                ? `2px solid ${isDarkMode ? 'rgba(196, 155, 97, 0.3)' : 'rgba(139, 69, 19, 0.2)'}`
                : '2px solid transparent',
              boxShadow: highlightResults 
                ? (isDarkMode 
                  ? '0 0 20px rgba(196, 155, 97, 0.2), inset 0 0 20px rgba(196, 155, 97, 0.1)'
                  : '0 0 20px rgba(139, 69, 19, 0.15), inset 0 0 20px rgba(139, 69, 19, 0.05)')
                : 'none',
              '& > .cafert-product-card:nth-of-type(even) .cafert-product-photo': { transform: 'rotate(1.6deg)' },
              '& > .cafert-product-card:nth-of-type(odd) .cafert-product-photo': { transform: 'rotate(-1.4deg)' },
            }}>
            {loading ? (
              <GridSkeleton isDarkMode={isDarkMode} count={ITEMS_PER_PAGE} />
            ) : (
              currentItems.map((item, itemIndex) => (
              <Card 
                key={item.id}
                className="cafert-menu-ticket cafert-product-card"
                sx={{ 
                  height: '100%',
                  minHeight: { xs: 510, sm: 540 },
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: isDarkMode ? '#28221b' : '#f7f0e4',
                  border: isDarkMode ? '1px solid #67543d' : '1px solid #d6c3a7',
                  borderRadius: '2px',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: isDarkMode ? '0 8px 22px rgba(0,0,0,.24)' : '3px 5px 0 #e5d6c0, 0 12px 24px rgba(80,55,30,.12)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '10px', left: '10px', right: '10px', bottom: '10px',
                    border: isDarkMode ? '1px dashed rgba(229,203,166,.28)' : '1px dashed rgba(112,79,45,.27)',
                    pointerEvents: 'none', zIndex: 3,
                  },
                  '&:hover': {
                    transform: 'translateY(-5px) rotate(-0.5deg)',
                    boxShadow: isDarkMode ? '0 16px 30px rgba(0,0,0,.32)' : '4px 10px 0 #e7dccb, 0 22px 36px rgba(80,55,30,.18)',
                  },
                }}
                onClick={() => handleCoffeeClick(item.id)}
              >
                {/* A clipped, lifted product photo sits over its paper order chit. */}
                <Box className="cafert-product-photo" sx={{ position: 'relative', overflow: 'visible', mx: 2, mt: 2, pt: 0.5, backgroundColor: 'transparent', transformOrigin: '50% 50%', transition: 'transform .28s ease', '&::before': { content: '""', position: 'absolute', inset: '4px -3px -4px 4px', background: isDarkMode ? '#594936' : '#fff9ee', clipPath: 'polygon(2% 1%, 18% 0, 35% 2%, 53% 0, 72% 1%, 98% 2%, 100% 21%, 97% 40%, 100% 59%, 98% 78%, 99% 97%, 79% 100%, 59% 98%, 39% 100%, 19% 98%, 1% 100%, 0 79%, 2% 58%, 0 38%, 2% 18%)', transform: 'rotate(1deg)', boxShadow: '0 6px 12px rgba(66,43,22,.16)' }, '&:hover': { transform: 'translateY(-3px) rotate(0deg)' } }}>
                  <CardMedia
                    component="img"
                    className="cafert-product-image-cutout"
                    image={item.image}
                    alt={item.name}
                    sx={{ 
                      height: { xs: '275px', sm: '290px', lg: '305px' },
                      objectFit: 'cover',
                      position: 'relative',
                      zIndex: 1,
                      clipPath: 'polygon(3% 1%, 19% 2%, 36% 0, 54% 2%, 72% 0, 98% 2%, 97% 19%, 100% 35%, 98% 51%, 100% 67%, 97% 84%, 99% 97%, 81% 98%, 64% 100%, 46% 97%, 29% 100%, 12% 98%, 1% 99%, 2% 82%, 0 65%, 2% 48%, 0 31%, 3% 16%)',
                      filter: 'drop-shadow(0 8px 5px rgba(59,38,18,.25)) saturate(.96) contrast(1.03)',
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(180deg, transparent 65%, rgba(45,30,17,0.18) 100%)',
                    pointerEvents: 'none'
                  }} />

                  <Box
                    className="cafert-card-barista"
                    component="img"
                    src="/img/coffee/cafert-menu-barista-cutout.webp"
                    alt=""
                    sx={{
                      position: 'absolute', right: -9, bottom: -8, width: { xs: 130, sm: 142 }, height: { xs: 124, sm: 138 },
                      objectFit: 'contain', objectPosition: 'bottom right', zIndex: 2,
                      opacity: 0, transform: 'translateY(13px) rotate(3deg)',
                      transition: 'opacity .22s ease, transform .28s cubic-bezier(.2,.7,.2,1)',
                      filter: 'drop-shadow(0 5px 3px rgba(48,31,16,.28))',
                      '.cafert-menu-ticket:hover &, .cafert-menu-ticket:focus-within &': { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
                      '@media (hover: none)': { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
                      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                    }}
                  />
                  <Box
                    className="cafert-card-greeting"
                    sx={{
                      position: 'absolute', right: { xs: 86, sm: 100 }, bottom: 18, zIndex: 3,
                      px: 1.25, py: .75, background: isDarkMode ? '#f1e5d2' : '#fffaf0',
                      color: '#4b3524', border: '1px solid #d9c5a7',
                      fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.82rem',
                      whiteSpace: 'nowrap', boxShadow: '1px 2px 0 rgba(70,46,22,.16)',
                      opacity: 0, transform: 'translateY(5px)',
                      transition: 'opacity .2s ease, transform .2s ease',
                      '.cafert-menu-ticket:hover &, .cafert-menu-ticket:focus-within &': { opacity: 1, transform: 'translateY(0)' },
                      '@media (hover: none)': { opacity: 1, transform: 'translateY(0)' },
                      '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
                      '&::after': { content: '""', position: 'absolute', right: -5, bottom: 5, width: 8, height: 8, background: isDarkMode ? '#f1e5d2' : '#fffaf0', borderRight: '1px solid #d9c5a7', borderBottom: '1px solid #d9c5a7', transform: 'rotate(-45deg)' },
                    }}
                  >
                    What’ll it be?
                  </Box>

                  <Box sx={{ position: 'absolute', left: 14, top: 15, zIndex: 4, px: 1.2, py: .65, color: '#453325', background: '#f8edda', border: '1px solid rgba(89,62,36,.36)', boxShadow: '2px 3px 0 rgba(50,31,15,.16)', fontFamily: 'Georgia, serif', fontSize: '.82rem', letterSpacing: '.04em', transform: 'rotate(-3deg)' }}>
                    COUNTER No. {String(startIndex + itemIndex + 1).padStart(2, '0')}
                  </Box>
                  
                  {/* New Badge with glassmorphism */}
                  {item.isNew && (
                    <Chip
                      label="NEW"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: isDarkMode 
                          ? 'rgba(196, 155, 97, 0.9)'
                          : 'rgba(139, 69, 19, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: isDarkMode ? '#2b241d' : '#fffaf2',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        border: isDarkMode 
                          ? '1px solid rgba(196, 155, 97, 0.3)'
                          : '1px solid rgba(139, 69, 19, 0.3)',
                        boxShadow: isDarkMode 
                          ? '0 4px 12px rgba(196, 155, 97, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                          : '0 4px 12px rgba(139, 69, 19, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                        zIndex: 2,
                      }}
                    />
                  )}
                  
                  {/* Favorite Button with enhanced glassmorphism */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(15px)',
                      WebkitBackdropFilter: 'blur(15px)',
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      border: isDarkMode 
                        ? '1px solid rgba(255, 255, 255, 0.2)' 
                        : '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: isDarkMode 
                        ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                      zIndex: 4,
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 255, 255, 0.25)' 
                          : 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.1)',
                        boxShadow: isDarkMode 
                          ? '0 6px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                          : '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {item.isFavorite ? (
                      <FavoriteIcon sx={{ color: '#e91e63', fontSize: '1.3rem' }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: '1.3rem' }} />
                    )}
                  </IconButton>
                  
                  {/* Out of Stock Badge with glassmorphism */}
                  {!item.inStock && (
                    <Chip
                      label="Out of Stock"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(244, 67, 54, 0.9)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        color: '#fffaf2',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        borderRadius: '16px',
                        border: '1px solid rgba(244, 67, 54, 0.3)',
                        boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  p: { xs: 2.5, sm: 3 },
                  position: 'relative',
                  zIndex: 2,
                  mt: '-12px',
                  backgroundColor: isDarkMode ? '#28221b' : '#fffaf0',
                  clipPath: 'polygon(0 3%, 5% 0, 10% 3%, 15% 1%, 20% 3%, 25% 0, 30% 3%, 35% 1%, 40% 3%, 45% 0, 50% 3%, 55% 1%, 60% 3%, 65% 0, 70% 3%, 75% 1%, 80% 3%, 85% 0, 90% 3%, 95% 1%, 100% 3%, 100% 100%, 0 100%)',
                  color: isDarkMode ? '#f2e7d5' : '#34271c',
                }}>
                  {/* Title and Price in same row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      component="h2" 
                      sx={{ 
                        color: isDarkMode ? '#fffaf2' : '#2b241d',
                        fontWeight: 600,
                        flex: 1,
                        fontFamily: 'Georgia, serif',
                        fontSize: '1.2rem',
                        letterSpacing: '-.015em',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.name}
                    </Typography>
                  <Typography 
                      variant="subtitle1" 
                    sx={{ 
                        color: isDarkMode ? '#c49b61' : '#8B4513',
                        fontWeight: 700,
                        ml: 1,
                        fontSize: '1rem'
                      }}
                    >
                      ${item.price}
                  </Typography>
                  </Box>

                  {item.description && item.description !== 'No description available' && (
                    <Typography sx={{ color: isDarkMode ? '#d2c2ad' : '#6d5946', fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '.97rem', lineHeight: 1.48, mb: 1.75, minHeight: '2.9em' }}>
                      {item.description}
                    </Typography>
                  )}
                  
                  {/* Rating and reviews - with spacing */}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Rating 
                      value={item.rating} 
                      precision={0.1} 
                      size="small" 
                      readOnly 
                      sx={{
                        fontSize: '0.875rem',
                        '& .MuiRating-iconFilled': {
                          color: isDarkMode ? '#c49b61' : '#c49b61',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ 
                      color: isDarkMode ? '#c8b7a1' : '#76634e',
                      ml: 0.5,
                      fontSize: '0.75rem'
                    }}>
                      ({item.reviews})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, ml: 'auto' }}>
                      <VisibilityIcon fontSize="small" sx={{ color: isDarkMode ? '#c49b61' : '#8B4513', fontSize: '0.75rem' }} />
                      <Typography variant="caption" sx={{ 
                        color: isDarkMode ? '#c8b7a1' : '#76634e',
                        fontSize: '0.75rem'
                      }}>
                        {item.views}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Category chip - with spacing */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    <Chip 
                      label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        backgroundColor: isDarkMode 
                          ? 'rgba(196, 155, 97, 0.1)'
                          : 'rgba(139, 69, 19, 0.1)',
                        borderColor: isDarkMode ? '#c49b61' : '#8B4513',
                        color: isDarkMode ? '#c49b61' : '#8B4513',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 22,
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                  
                  {/* Add to cart button - compact with margin-top */}
                  <Button
                    variant="contained"
                    startIcon={<AddShoppingCartIcon sx={{ fontSize: '0.875rem' }} />}
                    fullWidth
                    disabled={!item.inStock}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    sx={{
                      backgroundColor: isDarkMode 
                        ? 'rgba(196, 155, 97, 0.9)'
                        : 'rgba(139, 69, 19, 0.9)',
                      color: isDarkMode ? '#2b241d' : '#fffaf2',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      height: 42,
                      borderRadius: '3px',
                      textTransform: 'none',
                      mt: 1,
                      py: 0,
                      boxShadow: 'none',
                      letterSpacing: '.035em',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(196, 155, 97, 1)'
                          : 'rgba(139, 69, 19, 1)',
                      },
                      '&:disabled': {
                        backgroundColor: 'rgba(204, 204, 204, 0.5)',
                      },
                    }}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </CardContent>
              </Card>
            ))
            )}
          </Box>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <Paper sx={{ 
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: isDarkMode ? '#34291f' : '#f0e3cf',
              backgroundImage: `radial-gradient(circle at 0 8px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 4px, transparent 4.5px), radial-gradient(circle at 100% 8px, ${isDarkMode ? '#27221b' : '#f5eee2'} 0 4px, transparent 4.5px), repeating-linear-gradient(0deg, transparent 0 32px, ${isDarkMode ? 'rgba(210,177,129,.05)' : 'rgba(138,92,59,.055)'} 32px 33px)`,
              backgroundSize: '10px 16px, 10px 16px, auto',
              backgroundRepeat: 'repeat-y, repeat-y, repeat',
              border: `1px dashed ${isDarkMode ? '#806747' : '#b9956e'}`,
              borderRadius: '3px',
              p: { xs: 2, sm: 2.5 },
              boxShadow: isDarkMode 
                ? '4px 6px 0 rgba(0,0,0,.16), 0 12px 24px rgba(0,0,0,.12)'
                : '4px 6px 0 #ddc9aa, 0 12px 24px rgba(72,49,27,.07)'
            }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: { xs: 2, sm: 3 } }}>
                <Typography aria-live="polite" sx={{
                  px: 1.5,
                  py: .7,
                  color: isDarkMode ? '#e4c590' : '#8d5b3c',
                  border: `3px double ${isDarkMode ? '#a88558' : '#b6895b'}`,
                  fontFamily: 'Georgia, serif',
                  fontWeight: 700,
                  fontSize: '1rem',
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  transform: 'rotate(-1.5deg)',
                  boxShadow: '2px 3px 0 rgba(72,49,27,.1)',
                }}>
                  Page {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
                </Typography>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  showFirstButton
                  showLastButton
                  sx={{
                    '& .MuiPagination-ul': {
                      gap: .35,
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                    },
                    '& .MuiPaginationItem-root': {
                      color: isDarkMode ? '#f0e2cf' : '#5c4533',
                      backgroundColor: isDarkMode ? '#3b3026' : '#fff9ee',
                      border: `1px dashed ${isDarkMode ? '#806747' : '#c6a982'}`,
                      borderRadius: '2px',
                      margin: 0,
                      fontWeight: 600,
                      fontSize: '1rem',
                      minWidth: 44,
                      height: 44,
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#49392c' : '#eadbc4',
                        borderColor: isDarkMode ? '#c49b61' : '#8B4513',
                      },
                      '&.Mui-selected': {
                        backgroundColor: isDarkMode ? '#b58a5b' : '#8d5b3c',
                        color: '#fffaf2',
                        border: `3px double ${isDarkMode ? '#e4c590' : '#c99569'}`,
                        fontWeight: 700,
                        transform: 'rotate(-3deg)',
                        boxShadow: '2px 3px 0 rgba(72,49,27,.18)',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#b58a5b' : '#8d5b3c',
                        },
                      },
                      transition: 'background-color .18s ease, border-color .18s ease',
                    },
                  }}
                />
              </Box>
            </Paper>
          )}

          {/* Image Right Section */}
          <Suspense fallback={<Box sx={{ py: 4 }} />}>
            <ImageRightSection featuredProducts={coffees.slice(0, 3)} />
          </Suspense>

          {/* Enhanced No Results */}
          {filteredCoffees.length === 0 && (
            <Paper sx={{ 
              backgroundColor: isDarkMode ? '#2b241d' : '#fffaf2',
              border: `1px solid ${isDarkMode ? '#49392c' : '#d7c3a5'}`,
              borderRadius: '20px',
              p: 6,
              textAlign: 'center',
              boxShadow: isDarkMode 
                ? '0 4px 20px rgba(0,0,0,0.2)'
                : '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 3 
              }}>
                <Box sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? '#3b3026' : '#f4eadb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px solid ${isDarkMode ? '#584638' : '#d7c3a5'}`,
                  mb: 2
                }}>
                  <SearchIcon sx={{ 
                    fontSize: '2rem',
                    color: isDarkMode ? '#c49b61' : '#8B4513'
                  }} />
                </Box>
                <Typography variant="h5" sx={{ 
                  color: isDarkMode ? '#fffaf2' : '#49392c',
                  fontWeight: 600,
                  fontSize: '1.5rem'
                }}>
                  No items found
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: isDarkMode ? '#c8b7a1' : '#76634e',
                  maxWidth: '400px',
                  lineHeight: 1.6
                }}>
                  Try adjusting your search terms or filters to find what you're looking for
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSearchText("");
                    setSelectedCategory("all");
                  }}
                  sx={{
                    backgroundColor: isDarkMode ? '#c49b61' : '#8B4513',
                    color: isDarkMode ? '#2b241d' : '#fffaf2',
                    fontWeight: 600,
                    fontSize: '1rem',
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#d1af77' : '#A0522D',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </Paper>
          )}

          <CafertLocationGuide isDarkMode={isDarkMode} />
        </Stack>
      </Container>
    </Box>
  );
}
