import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  BarChart,
  ShowChart,
  People,
  AttachMoney,
  ShoppingCart,
  LocalCafe,
  Refresh,
  Download,
  Settings,
  TrendingFlat,
  Star,
  Analytics,
  Dashboard
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { useTheme as useThemeContext } from '../context/ThemeContext';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Mock data for sophisticated analytics
const mockData = {
  salesData: [
    { month: 'Jan', sales: 12500, orders: 450, customers: 320, avgOrder: 27.8 },
    { month: 'Feb', sales: 15800, orders: 580, customers: 410, avgOrder: 27.2 },
    { month: 'Mar', sales: 14200, orders: 520, customers: 380, avgOrder: 27.3 },
    { month: 'Apr', sales: 18900, orders: 680, customers: 490, avgOrder: 27.8 },
    { month: 'May', sales: 22400, orders: 820, customers: 580, avgOrder: 27.3 },
    { month: 'Jun', sales: 26800, orders: 950, customers: 680, avgOrder: 28.2 },
    { month: 'Jul', sales: 31200, orders: 1120, customers: 780, avgOrder: 27.9 },
    { month: 'Aug', sales: 28900, orders: 1050, customers: 720, avgOrder: 27.5 },
    { month: 'Sep', sales: 25600, orders: 920, customers: 650, avgOrder: 27.8 },
    { month: 'Oct', sales: 29800, orders: 1080, customers: 750, avgOrder: 27.6 },
    { month: 'Nov', sales: 33400, orders: 1200, customers: 820, avgOrder: 27.8 },
    { month: 'Dec', sales: 38700, orders: 1380, customers: 920, avgOrder: 28.0 }
  ],
  categoryData: [
    { name: 'Espresso', sales: 35, growth: 12.5, color: '#8B4513' },
    { name: 'Cappuccino', sales: 28, growth: 8.2, color: '#D2691E' },
    { name: 'Latte', sales: 22, growth: 15.7, color: '#CD853F' },
    { name: 'Americano', sales: 15, growth: 5.3, color: '#A0522D' }
  ],
  topProducts: [
    { name: 'Classic Espresso', sales: 2840, growth: 18.5, rating: 4.8, orders: 156 },
    { name: 'Vanilla Latte', sales: 2650, growth: 12.3, rating: 4.6, orders: 142 },
    { name: 'Caramel Macchiato', sales: 2480, growth: 22.1, rating: 4.7, orders: 138 },
    { name: 'Cappuccino', sales: 2320, growth: 8.9, rating: 4.5, orders: 128 },
    { name: 'Mocha', sales: 2180, growth: 15.2, rating: 4.4, orders: 115 }
  ],
  customerSegments: [
    { segment: 'Regulars', count: 420, percentage: 35, avgSpend: 45.2 },
    { segment: 'Occasional', count: 380, percentage: 32, avgSpend: 28.7 },
    { segment: 'New', count: 280, percentage: 23, avgSpend: 18.9 },
    { segment: 'VIP', count: 120, percentage: 10, avgSpend: 78.3 }
  ],
  hourlyData: [
    { hour: '6AM', orders: 12, sales: 340 },
    { hour: '7AM', orders: 28, sales: 780 },
    { hour: '8AM', orders: 45, sales: 1250 },
    { hour: '9AM', orders: 38, sales: 1080 },
    { hour: '10AM', orders: 32, sales: 920 },
    { hour: '11AM', orders: 35, sales: 980 },
    { hour: '12PM', orders: 52, sales: 1450 },
    { hour: '1PM', orders: 48, sales: 1320 },
    { hour: '2PM', orders: 42, sales: 1180 },
    { hour: '3PM', orders: 38, sales: 1080 },
    { hour: '4PM', orders: 45, sales: 1250 },
    { hour: '5PM', orders: 58, sales: 1620 },
    { hour: '6PM', orders: 52, sales: 1450 },
    { hour: '7PM', orders: 38, sales: 1080 },
    { hour: '8PM', orders: 25, sales: 720 },
    { hour: '9PM', orders: 15, sales: 420 }
  ]
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const StatsPage: React.FC = () => {
  const theme = useTheme();
  const { isDarkMode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('12months');
  const [showRealTime, setShowRealTime] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0
  });

  // Calculate totals
  const totals = useMemo(() => {
    const data = mockData.salesData;
    return {
      totalSales: data.reduce((sum, item) => sum + item.sales, 0),
      totalOrders: data.reduce((sum, item) => sum + item.orders, 0),
      totalCustomers: data.reduce((sum, item) => sum + item.customers, 0),
      avgOrderValue: data.reduce((sum, item) => sum + item.avgOrder, 0) / data.length
    };
  }, []);

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setAnimatedValues({
        totalSales: Math.floor(totals.totalSales * progress),
        totalOrders: Math.floor(totals.totalOrders * progress),
        totalCustomers: Math.floor(totals.totalCustomers * progress),
        avgOrderValue: parseFloat((totals.avgOrderValue * progress).toFixed(1))
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [totals]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    // Refresh functionality
  };

  // Chart configurations
  const lineChartData = {
    labels: mockData.salesData.map(item => item.month),
    datasets: [
      {
        label: 'Sales ($)',
        data: mockData.salesData.map(item => item.sales),
        borderColor: isDarkMode ? '#FFD700' : '#8B4513',
        backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.1)' : 'rgba(139, 69, 19, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? '#FFD700' : '#8B4513',
        pointBorderColor: isDarkMode ? '#000' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: 'Orders',
        data: mockData.salesData.map(item => item.orders),
        borderColor: isDarkMode ? '#00CED1' : '#4682B4',
        backgroundColor: isDarkMode ? 'rgba(0, 206, 209, 0.1)' : 'rgba(70, 130, 180, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: isDarkMode ? '#00CED1' : '#4682B4',
        pointBorderColor: isDarkMode ? '#000' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const barChartData = {
    labels: mockData.hourlyData.map(item => item.hour),
    datasets: [
      {
        label: 'Orders',
        data: mockData.hourlyData.map(item => item.orders),
        backgroundColor: isDarkMode 
          ? 'rgba(255, 215, 0, 0.8)' 
          : 'rgba(139, 69, 19, 0.8)',
        borderColor: isDarkMode ? '#FFD700' : '#8B4513',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const doughnutData = {
    labels: mockData.categoryData.map(item => item.name),
    datasets: [
      {
        data: mockData.categoryData.map(item => item.sales),
        backgroundColor: mockData.categoryData.map(item => item.color),
        borderColor: isDarkMode ? '#333' : '#fff',
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverBorderColor: isDarkMode ? '#FFD700' : '#8B4513'
      }
    ]
  };

  const radarData = {
    labels: ['Sales Growth', 'Customer Satisfaction', 'Order Efficiency', 'Product Quality', 'Service Speed', 'Cost Management'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [85, 92, 78, 95, 88, 82],
        backgroundColor: isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.2)',
        borderColor: isDarkMode ? '#FFD700' : '#8B4513',
        borderWidth: 3,
        pointBackgroundColor: isDarkMode ? '#FFD700' : '#8B4513',
        pointBorderColor: isDarkMode ? '#000' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkMode ? '#fff' : '#333',
          font: {
            size: 16,
            weight: 'bold' as const
          },
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? '#fff' : '#333',
        bodyColor: isDarkMode ? '#fff' : '#333',
        borderColor: isDarkMode ? '#FFD700' : '#8B4513',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 16,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 14
        },
        padding: 12
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
          font: {
            size: 14
          }
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#333',
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: isDarkMode
        ? 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '80px', // Add top padding for navbar
      transition: 'background 0.3s',
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Analytics sx={{ fontSize: 32, color: isDarkMode ? '#FFD700' : '#8B4513' }} />
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 'bold',
              color: isDarkMode ? '#fff' : '#333',
              textShadow: isDarkMode ? '0 0 10px rgba(255, 215, 0, 0.3)' : 'none'
            }}>
              Coffee Analytics Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh} sx={{ color: isDarkMode ? '#FFD700' : '#8B4513' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Export Data">
              <IconButton sx={{ color: isDarkMode ? '#FFD700' : '#8B4513' }}>
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton sx={{ color: isDarkMode ? '#FFD700' : '#8B4513' }}>
                <Settings />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: isDarkMode ? '#fff' : '#333' }}>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              sx={{ 
                color: isDarkMode ? '#fff' : '#333',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              <MenuItem value="7days">Last 7 Days</MenuItem>
              <MenuItem value="30days">Last 30 Days</MenuItem>
              <MenuItem value="3months">Last 3 Months</MenuItem>
              <MenuItem value="6months">Last 6 Months</MenuItem>
              <MenuItem value="12months">Last 12 Months</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={showRealTime}
                onChange={(e) => setShowRealTime(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: isDarkMode ? '#FFD700' : '#8B4513'
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: isDarkMode ? '#FFD700' : '#8B4513'
                  }
                }}
              />
            }
            label="Real-time Updates"
            sx={{ color: isDarkMode ? '#fff' : '#333' }}
          />
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 4,
            transition: 'all 0.3s ease',
            minHeight: 200,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isDarkMode 
                ? '0 15px 40px rgba(255, 215, 0, 0.3)' 
                : '0 15px 40px rgba(139, 69, 19, 0.3)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#333', mb: 2, fontWeight: 'bold' }}>
                    Total Sales
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFD700' : '#8B4513',
                    mb: 2
                  }}>
                    ${animatedValues.totalSales.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ color: '#4CAF50', fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      +12.5% vs last period
                    </Typography>
                  </Box>
                </Box>
                <AttachMoney sx={{ 
                  fontSize: 72, 
                  color: isDarkMode ? '#FFD700' : '#8B4513',
                  opacity: 0.7
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 4,
            transition: 'all 0.3s ease',
            minHeight: 200,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isDarkMode 
                ? '0 15px 40px rgba(255, 215, 0, 0.3)' 
                : '0 15px 40px rgba(139, 69, 19, 0.3)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#333', mb: 2, fontWeight: 'bold' }}>
                    Total Orders
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFD700' : '#8B4513',
                    mb: 2
                  }}>
                    {animatedValues.totalOrders.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ color: '#4CAF50', fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      +8.3% vs last period
                    </Typography>
                  </Box>
                </Box>
                <ShoppingCart sx={{ 
                  fontSize: 72, 
                  color: isDarkMode ? '#FFD700' : '#8B4513',
                  opacity: 0.7
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 4,
            transition: 'all 0.3s ease',
            minHeight: 200,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isDarkMode 
                ? '0 15px 40px rgba(255, 215, 0, 0.3)' 
                : '0 15px 40px rgba(139, 69, 19, 0.3)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#333', mb: 2, fontWeight: 'bold' }}>
                    Customers
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFD700' : '#8B4513',
                    mb: 2
                  }}>
                    {animatedValues.totalCustomers.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingUp sx={{ color: '#4CAF50', fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                      +15.2% vs last period
                    </Typography>
                  </Box>
                </Box>
                <People sx={{ 
                  fontSize: 72, 
                  color: isDarkMode ? '#FFD700' : '#8B4513',
                  opacity: 0.7
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{
            background: isDarkMode 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            borderRadius: 4,
            transition: 'all 0.3s ease',
            minHeight: 200,
            '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: isDarkMode 
                ? '0 15px 40px rgba(255, 215, 0, 0.3)' 
                : '0 15px 40px rgba(139, 69, 19, 0.3)'
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#333', mb: 2, fontWeight: 'bold' }}>
                    Avg Order
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: isDarkMode ? '#FFD700' : '#8B4513',
                    mb: 2
                  }}>
                    ${animatedValues.avgOrderValue}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <TrendingFlat sx={{ color: '#FF9800', fontSize: 24, mr: 1 }} />
                    <Typography variant="h6" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                      +2.1% vs last period
                    </Typography>
                  </Box>
                </Box>
                <LocalCafe sx={{ 
                  fontSize: 72, 
                  color: isDarkMode ? '#FFD700' : '#8B4513',
                  opacity: 0.7
                }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{
        background: isDarkMode 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            borderBottom: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
            '& .MuiTab-root': {
              color: isDarkMode ? '#fff' : '#333',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              padding: '16px 24px',
              '&.Mui-selected': {
                color: isDarkMode ? '#FFD700' : '#8B4513'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: isDarkMode ? '#FFD700' : '#8B4513',
              height: 4
            }
          }}
        >
          <Tab label="Overview" icon={<Dashboard />} iconPosition="start" />
          <Tab label="Sales Analytics" icon={<ShowChart />} iconPosition="start" />
          <Tab label="Customer Insights" icon={<People />} iconPosition="start" />
          <Tab label="Product Performance" icon={<BarChart />} iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Card sx={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 4,
                height: 500
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                    Sales & Orders Trend
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Line data={lineChartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} lg={4}>
              <Card sx={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 4,
                height: 500
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                    Category Distribution
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Doughnut data={doughnutData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 4
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Radar data={radarData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Card sx={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 4,
                height: 500
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                    Hourly Order Distribution
                  </Typography>
                  <Box sx={{ height: 400 }}>
                    <Bar data={barChartData} options={chartOptions} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card sx={{
                background: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                borderRadius: 4
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h4" sx={{ mb: 3, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                    Customer Segments
                  </Typography>
                  <List>
                    {mockData.customerSegments.map((segment, index) => (
                      <React.Fragment key={segment.segment}>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ 
                              bgcolor: isDarkMode ? '#FFD700' : '#8B4513',
                              color: isDarkMode ? '#000' : '#fff',
                              width: 60,
                              height: 60,
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}>
                              {segment.percentage}%
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="h6" sx={{ 
                                color: isDarkMode ? '#fff' : '#333',
                                fontWeight: 'bold',
                                mb: 1
                              }}>
                                {segment.segment}
                              </Typography>
                            }
                            secondary={
                              <Typography variant="h6" sx={{ 
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                                fontWeight: 'bold'
                              }}>
                                {segment.count} customers • Avg: ${segment.avgSpend}
                              </Typography>
                            }
                          />
                          <LinearProgress
                            variant="determinate"
                            value={segment.percentage}
                            sx={{
                              width: 150,
                              height: 12,
                              borderRadius: 6,
                              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: isDarkMode ? '#FFD700' : '#8B4513',
                                borderRadius: 6
                              }
                            }}
                          />
                        </ListItem>
                        {index < mockData.customerSegments.length - 1 && <Divider sx={{ my: 2 }} />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={4}>
            {mockData.topProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product.name}>
                <Card sx={{
                  background: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  minHeight: 300,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: isDarkMode 
                      ? '0 15px 40px rgba(255, 215, 0, 0.3)' 
                      : '0 15px 40px rgba(139, 69, 19, 0.3)'
                  }
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                      <Typography variant="h5" sx={{ color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                        {product.name}
                      </Typography>
                      <Chip
                        label={`#${index + 1}`}
                        size="medium"
                        sx={{
                          backgroundColor: isDarkMode ? '#FFD700' : '#8B4513',
                          color: isDarkMode ? '#000' : '#fff',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          padding: '8px 16px'
                        }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            color: i < Math.floor(product.rating) ? '#FFD700' : 'rgba(0, 0, 0, 0.2)',
                            fontSize: 24
                          }}
                        />
                      ))}
                      <Typography variant="h6" sx={{ ml: 2, color: isDarkMode ? '#fff' : '#333', fontWeight: 'bold' }}>
                        {product.rating}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" sx={{ 
                      fontWeight: 'bold',
                      color: isDarkMode ? '#FFD700' : '#8B4513',
                      mb: 3
                    }}>
                      ${product.sales.toLocaleString()}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h6" sx={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)', fontWeight: 'bold' }}>
                        {product.orders} orders
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ color: '#4CAF50', fontSize: 24, mr: 1 }} />
                        <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                          +{product.growth}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default StatsPage; 