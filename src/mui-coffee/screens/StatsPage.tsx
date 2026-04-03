import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Box, Typography, IconButton, Link as MuiLink } from '@mui/material';
import {
  Payments,
  ShoppingCart,
  Person,
  Receipt,
  Search,
  Settings,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
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
  RadialLinearScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTheme as useThemeContext } from '../context/ThemeContext';
import { STITCH_PULP_THEME } from '../../components/stitchUi';

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

const P = STITCH_PULP_THEME;
const AVATAR_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDP2lro-i9JmMzwqSHVGKWKWkorzic79BYfqy8yz1Ke9B3ur2pQvu1iHsRB_QPNT5neDbQX42PoNMgqCSCnDdStswq3uWJGrRmoEv7kS1IV5Fv73o-3P8CqIHpDO3YDPrYEkqJu1ca51urAzv4hV8CcjXo6WqftoONeHuJjufDPiLWqhQnKBxvFtVgfXmn1uBPkytRZdNMTuPjG229GEFij3bIkkHdVLsqGaF2qANYi9aQ12oubzo399tJcWYJWHEYiRZ4XncKKsX_C';

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
    { month: 'Dec', sales: 38700, orders: 1380, customers: 920, avgOrder: 28.0 },
  ],
  categoryData: [
    { name: 'Espresso', pct: 43 },
    { name: 'Cappuccino', pct: 25 },
    { name: 'Lattes', pct: 18 },
    { name: 'Cold Brew', pct: 12 },
  ],
};

const comicBorder = `3px solid ${P.ink}`;
const comicShadow = `4px 4px 0px 0px ${P.ink}`;

const halftoneSx = {
  backgroundImage: `radial-gradient(circle, ${P.ink} 0.5px, transparent 0.5px)`,
  backgroundSize: '6px 6px',
};

/** Edge padding only — no max-width cap so the dashboard uses the full viewport */
const pageGutterSx = {
  width: '100%',
  maxWidth: '100%',
  mx: 'auto',
  px: { xs: 2, sm: 2.5, md: 3, lg: 3.5, xl: 4 },
  boxSizing: 'border-box' as const,
};

const StatsPage: React.FC = () => {
  const { isDarkMode } = useThemeContext();
  const ink = isDarkMode ? P.cream : P.ink;
  const cream = isDarkMode ? '#1a1614' : P.cream;
  const surfaceVar = isDarkMode ? '#2a2620' : P.surfaceVariant;
  const orange = P.orange;
  const panelBg = isDarkMode ? '#242019' : '#ffffff';

  const [animatedValues, setAnimatedValues] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
  });

  const animationInitializedRef = useRef(false);
  const totals = useMemo(() => {
    const data = mockData.salesData;
    return {
      totalSales: data.reduce((s, d) => s + d.sales, 0),
      totalOrders: data.reduce((s, d) => s + d.orders, 0),
      totalCustomers: data.reduce((s, d) => s + d.customers, 0),
      avgOrderValue: data.reduce((s, d) => s + d.avgOrder, 0) / data.length,
    };
  }, []);

  useEffect(() => {
    if (animationInitializedRef.current) return;
    animationInitializedRef.current = true;
    const steps = 60;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const p = step / steps;
      setAnimatedValues({
        totalSales: Math.floor(totals.totalSales * p),
        totalOrders: Math.floor(totals.totalOrders * p),
        totalCustomers: Math.floor(totals.totalCustomers * p),
        avgOrderValue: parseFloat((totals.avgOrderValue * p).toFixed(2)),
      });
      if (step >= steps) clearInterval(id);
    }, 33);
    return () => clearInterval(id);
  }, [totals]);

  const lineChartData = useMemo(
    () => ({
      labels: mockData.salesData.map((d) => d.month),
      datasets: [
        {
          label: 'Sales ($)',
          data: mockData.salesData.map((d) => d.sales),
          borderColor: orange,
          backgroundColor: `${orange}22`,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: orange,
          pointBorderColor: P.ink,
          pointBorderWidth: 2,
          pointRadius: 5,
        },
      ],
    }),
    [orange]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode ? P.ink : '#fff',
          titleColor: isDarkMode ? cream : P.ink,
          bodyColor: isDarkMode ? cream : P.ink,
          borderColor: orange,
          borderWidth: 2,
        },
      },
      scales: {
        x: {
          grid: { color: `${P.ink}22` },
          ticks: { color: ink, font: { family: P.grotesk, size: 11, weight: 700 } },
        },
        y: {
          grid: { color: `${P.ink}22` },
          ticks: { color: ink, font: { family: P.grotesk, size: 11 } },
        },
      },
    }),
    [cream, ink, isDarkMode, orange]
  );

  const navLinkSx = (active: boolean) => ({
    fontFamily: P.grotesk,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: '0.875rem',
    letterSpacing: '0.08em',
    color: ink,
    textDecoration: 'none',
    opacity: active ? 1 : 0.55,
    borderBottom: active ? `2px solid ${orange}` : '2px solid transparent',
    pb: 0.25,
    '&:hover': { opacity: 1 },
  });

  const barFill = (i: number) => {
    if (i === 0) return orange;
    if (i === 1) return `${P.ink}CC`;
    if (i === 2) return `${P.ink}66`;
    return `${P.ink}33`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: cream,
        color: ink,
        fontFamily: P.grotesk,
        pb: 4,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%',
          py: 2,
          bgcolor: cream,
          borderBottom: `4px solid ${P.ink}`,
        }}
      >
        <Box
          sx={{
            ...pageGutterSx,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 4 }, flexWrap: 'wrap' }}>
            <Typography
              component={Link}
              to="/"
              sx={{
                fontFamily: P.grotesk,
                fontWeight: 900,
                fontSize: '1.35rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.03em',
                color: ink,
                textDecoration: 'none',
              }}
            >
              The Pulp Alchemist
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
              <MuiLink component={Link} to="/products" sx={navLinkSx(false)}>
                Inventory
              </MuiLink>
              <MuiLink component={Link} to="/stats" sx={navLinkSx(true)}>
                Analytics
              </MuiLink>
              <MuiLink component={Link} to="/help" sx={navLinkSx(false)}>
                Staff
              </MuiLink>
              <MuiLink component={Link} to="/orders" sx={navLinkSx(false)}>
                Sales
              </MuiLink>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton
              size="small"
              sx={{ border: `2px solid ${P.ink}`, bgcolor: panelBg, borderRadius: 0, color: ink }}
              aria-label="Search"
            >
              <Search fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ border: `2px solid ${P.ink}`, bgcolor: panelBg, borderRadius: 0, color: ink }}
            >
              <Settings fontSize="small" />
            </IconButton>
            <Box
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${P.ink}`,
                bgcolor: P.ink,
                overflow: 'hidden',
              }}
            >
              <Box component="img" src={AVATAR_SRC} alt="" sx={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)' }} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          ...pageGutterSx,
          py: { xs: 4, md: 5 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box
            component="span"
            sx={{
              alignSelf: 'flex-start',
              bgcolor: orange,
              color: '#fff',
              px: 1.5,
              py: 0.25,
              fontSize: '0.7rem',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
            }}
          >
            Operations Dashboard
          </Box>
          <Typography
            variant="h2"
            sx={{
              m: 0,
              fontFamily: P.grotesk,
              fontWeight: 900,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.35rem' },
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}
          >
            Coffee Analytics
          </Typography>
          <Box sx={{ width: 96, height: 6, bgcolor: P.ink, mt: 0.5 }} />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, minmax(0, 1fr))' },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {[
            {
              label: 'Revenue',
              value: `$${animatedValues.totalSales.toLocaleString()}`,
              foot: (
                <>
                  <Box component="span" sx={{ color: '#059669', fontWeight: 700 }}>↑ 12.4%</Box>
                  <Box component="span" sx={{ opacity: 0.4, textTransform: 'uppercase' }}>vs last month</Box>
                </>
              ),
              icon: <Payments sx={{ fontSize: 16, opacity: 0.5 }} />,
              accent: true,
            },
            {
              label: 'Orders',
              value: animatedValues.totalOrders.toLocaleString(),
              foot: (
                <>
                  <Box component="span" sx={{ color: '#059669', fontWeight: 700 }}>↑ 10.2%</Box>
                  <Box component="span" sx={{ opacity: 0.4, textTransform: 'uppercase' }}>from baseline</Box>
                </>
              ),
              icon: <ShoppingCart sx={{ fontSize: 16, opacity: 0.5 }} />,
              accent: false,
            },
            {
              label: 'Customers',
              value: animatedValues.totalCustomers.toLocaleString(),
              foot: (
                <>
                  <Box component="span" sx={{ color: P.error, fontWeight: 700 }}>↓ 3.4%</Box>
                  <Box component="span" sx={{ opacity: 0.4, textTransform: 'uppercase' }}>retention dip</Box>
                </>
              ),
              icon: <Person sx={{ fontSize: 16, opacity: 0.5 }} />,
              accent: false,
            },
            {
              label: 'Avg Ticket',
              value: `$${animatedValues.avgOrderValue.toFixed(2)}`,
              foot: (
                <>
                  <Box component="span" sx={{ color: '#059669', fontWeight: 700 }}>↑ 4.1%</Box>
                  <Box component="span" sx={{ opacity: 0.4, textTransform: 'uppercase' }}>lifecycle growth</Box>
                </>
              ),
              icon: <Receipt sx={{ fontSize: 16, opacity: 0.5 }} />,
              accent: false,
            },
          ].map((k) => (
            <Box
              key={k.label}
              sx={{
                bgcolor: panelBg,
                border: comicBorder,
                boxShadow: comicShadow,
                p: { xs: 2.5, md: 3 },
                minHeight: { md: 148 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.5, mb: 1.25 }}>
                <span>{k.label}</span>
                {k.icon}
              </Box>
              <Typography sx={{ fontSize: { xs: '2.15rem', sm: '2.5rem', md: '2.65rem' }, fontWeight: 900, color: k.accent ? orange : ink, lineHeight: 1.05 }}>
                {k.value}
              </Typography>
              <Box sx={{ mt: 2, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                {k.foot}
              </Box>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(12, 1fr)' }, gap: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              gridColumn: { lg: 'span 8' },
              bgcolor: panelBg,
              border: comicBorder,
              boxShadow: comicShadow,
              p: { xs: 2.5, md: 3.5 },
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, ...halftoneSx, opacity: 0.1, pointerEvents: 'none' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' }, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Revenue Trends
              </Typography>
              <Box sx={{ display: 'flex', gap: 3, fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: orange }} /> Actual
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, border: `1px solid ${P.ink}`, bgcolor: isDarkMode ? '#333' : '#f5f5f5' }} /> Forecast
                </Box>
              </Box>
            </Box>
            <Box sx={{ height: { xs: 280, md: 340 }, minHeight: 260, borderLeft: `2px solid ${P.ink}33`, borderBottom: `2px solid ${P.ink}33`, position: 'relative' }}>
              <Line data={lineChartData} options={chartOptions} />
            </Box>
          </Box>

          <Box
            sx={{
              gridColumn: { lg: 'span 4' },
              bgcolor: surfaceVar,
              border: comicBorder,
              boxShadow: comicShadow,
              p: { xs: 2.5, md: 3.5 },
            }}
          >
            <Typography sx={{ fontSize: { xs: '1.1rem', md: '1.35rem' }, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', mb: 3 }}>
              Product Mix
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              {mockData.categoryData.map((c, i) => (
                <Box key={c.name}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase', mb: 0.5 }}>
                    <span>{c.name}</span>
                    <span>{c.pct}%</span>
                  </Box>
                  <Box sx={{ width: '100%', height: 18, bgcolor: panelBg, border: `2px solid ${P.ink}`, overflow: 'hidden' }}>
                    <Box sx={{ height: '100%', width: `${c.pct}%`, bgcolor: barFill(i), transition: 'width 0.6s ease' }} />
                  </Box>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3, pt: 3, borderTop: `2px solid ${P.ink}1a` }}>
              <Typography sx={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6, lineHeight: 1.4 }}>
                Most profitable item this week: Double Shot Espresso (+15.2% Margin)
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StatsPage;
