import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Fade, Switch, Tooltip } from '@mui/material';
import { Close as CloseIcon, PowerSettingsNew as PowerIcon } from '@mui/icons-material';
import { useTheme as useThemeContext } from '../context/ThemeContext';

interface WeatherData {
  temperature: number;
  weatherCode: number;
}

interface CoffeeMoodWidgetProps {
  latitude?: number;
  longitude?: number;
}

const CoffeeMoodWidget: React.FC<CoffeeMoodWidgetProps> = ({ 
  latitude = 40.7128, // Default to New York (can be made dynamic)
  longitude = -74.0060 
}) => {
  const { isDarkMode, colors } = useThemeContext();
  
  // Load widget visibility preference from localStorage
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem('coffeeWidgetVisible');
    return saved !== null ? saved === 'true' : true;
  });
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem('coffeeWidgetEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Weather code to emoji mapping
  const getWeatherEmoji = (code: number): string => {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return '☀️'; // Clear sky
    if (code <= 3) return '⛅'; // Partly cloudy
    if (code <= 49) return '🌫️'; // Fog
    if (code <= 59) return '🌧️'; // Drizzle
    if (code <= 69) return '🌧️'; // Rain
    if (code <= 79) return '🌨️'; // Snow
    if (code <= 84) return '🌧️'; // Rain showers
    if (code <= 86) return '🌨️'; // Snow showers
    if (code <= 99) return '⛈️'; // Thunderstorm
    return '☁️'; // Default cloudy
  };

  // Get coffee suggestion based on temperature
  const getCoffeeMood = (temp: number): string => {
    if (temp >= 25) {
      return 'Iced coffee mood';
    } else {
      return 'Cappuccino mood';
    }
  };

  // Listen for localStorage changes (when toggled from theme panel)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'coffeeWidgetEnabled') {
        const newValue = e.newValue === 'true';
        setIsEnabled(newValue);
        if (newValue) {
          setIsVisible(true);
        }
      }
      if (e.key === 'coffeeWidgetVisible') {
        const newValue = e.newValue === 'true';
        setIsVisible(newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events (for same-tab updates)
    const handleCustomStorageChange = () => {
      const saved = localStorage.getItem('coffeeWidgetEnabled');
      const newValue = saved === 'true';
      setIsEnabled(newValue);
      if (newValue) {
        setIsVisible(true);
      }
    };

    // Custom event for same-tab updates
    window.addEventListener('coffeeWidgetToggle', handleCustomStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('coffeeWidgetToggle', handleCustomStorageChange);
    };
  }, []);

  // Fetch weather data from Open-Meteo API
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        // Open-Meteo API endpoint
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        
        if (data.current) {
          setWeather({
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code
          });
        } else {
          throw new Error('No weather data available');
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to fetch weather');
        // Set fallback data
        setWeather({
          temperature: 20, // Default temperature
          weatherCode: 0 // Clear sky
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsEnabled(newValue);
    localStorage.setItem('coffeeWidgetEnabled', String(newValue));
    if (newValue) {
      setIsVisible(true);
      localStorage.setItem('coffeeWidgetVisible', 'true');
    }
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('coffeeWidgetToggle'));
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('coffeeWidgetVisible', 'false');
  };

  const handleTurnOn = () => {
    setIsEnabled(true);
    setIsVisible(true);
    localStorage.setItem('coffeeWidgetEnabled', 'true');
    localStorage.setItem('coffeeWidgetVisible', 'true');
  };

  // Show a small toggle button when widget is disabled
  if (!isEnabled) {
    return (
      <Fade in={!isEnabled} timeout={300}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Turn on Coffee Mood Widget">
            <IconButton
              onClick={handleTurnOn}
              sx={{
                // Glassmorphism effect
                backgroundColor: isDarkMode 
                  ? 'rgba(26, 26, 26, 0.7)' 
                  : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: isDarkMode ? '#ffffff' : '#8b4513',
                width: 48,
                height: 48,
                boxShadow: isDarkMode 
                  ? '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(139, 69, 19, 0.2)',
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(139, 69, 19, 0.12)',
                  transform: 'scale(1.1)',
                  boxShadow: isDarkMode 
                    ? '0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                    : '0 6px 20px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                },
              }}
              aria-label="Turn on widget"
            >
              <PowerIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>
    );
  }

  if (!isVisible) {
    return null;
  }

  const weatherEmoji = weather ? getWeatherEmoji(weather.weatherCode) : '☀️';
  const coffeeMood = weather ? getCoffeeMood(weather.temperature) : 'Coffee mood';
  const temperature = weather ? Math.round(weather.temperature) : null;

  return (
    <Fade in={isVisible && isEnabled} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          maxWidth: 320,
          minWidth: 280,
        }}
      >
        <Card
          sx={{
            borderRadius: '16px',
            // Glassmorphism effect
            backgroundColor: isDarkMode 
              ? 'rgba(26, 26, 26, 0.7)' 
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)', // For Safari support
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.3)',
            color: isDarkMode ? '#ffffff' : '#2c3e50',
            position: 'relative',
            overflow: 'visible',
            // Glassmorphism shadow
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: isDarkMode 
                ? '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' 
                : '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
              transform: 'translateY(-2px)',
            },
          }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'absolute', top: 8, right: 8, gap: 1 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5, 
              backgroundColor: isDarkMode 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'rgba(139, 69, 19, 0.08)', 
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '20px', 
              px: 1, 
              py: 0.5,
              border: isDarkMode 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(139, 69, 19, 0.2)',
            }}>
              <Switch
                checked={isEnabled}
                onChange={handleToggle}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#8b4513',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#8b4513',
                  },
                }}
              />
            </Box>
            <IconButton
              onClick={handleClose}
              sx={{
                color: isDarkMode ? '#ffffff' : '#666',
                backgroundColor: isDarkMode 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(0, 0, 0, 0.05)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: isDarkMode 
                  ? '1px solid rgba(255, 255, 255, 0.1)' 
                  : '1px solid rgba(0, 0, 0, 0.1)',
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: isDarkMode 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.1)',
                },
              }}
              size="small"
              aria-label="Close widget"
            >
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          <CardContent sx={{ p: 2.5, pr: 4, pt: 3.5 }}>
            {loading ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                }}
              >
                Loading weather...
              </Typography>
            ) : error && !weather ? (
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                }}
              >
                {error}
              </Typography>
            ) : (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: isDarkMode ? '#ffffff' : '#2c3e50',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{weatherEmoji}</span>
                  <span>
                    {temperature !== null ? `${temperature}°C` : 'Today'} = <span style={{ color: '#8b4513' }}>{coffeeMood}</span>
                  </span>
                </Typography>
                {temperature !== null && (
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.75rem',
                      color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : '#666',
                      display: 'block',
                      mt: 0.5,
                    }}
                  >
                    Perfect time for a {temperature >= 25 ? 'refreshing' : 'warm'} drink!
                  </Typography>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default CoffeeMoodWidget;

