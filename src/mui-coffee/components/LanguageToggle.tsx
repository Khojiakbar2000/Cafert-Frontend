import React, { useState } from 'react';
import { 
  Box, 
  IconButton,
  Tooltip,
  Popover,
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton, 
  Typography 
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  isDarkMode: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ isDarkMode }) => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setAccordionExpanded(true);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAccordionExpanded(false);
  };

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setAccordionExpanded(isExpanded);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  const languages = [
    { code: 'en', name: t('common.english'), flag: '🇺🇸' },
    { code: 'ko', name: t('common.korean'), flag: '🇰🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title={`${t('common.language')}: ${currentLanguage.name}`}>
        <IconButton
          onClick={handleClick}
          sx={{
            position: 'relative',
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            color: isDarkMode ? '#ffd700' : '#2c2c2c',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)',
            border: `2px solid ${isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            transition: 'all 0.3s ease',
            animation: isDarkMode ? 'languageGlow 2s ease-in-out infinite alternate' : 'languageGlowLight 2s ease-in-out infinite alternate',
            '@keyframes languageGlow': {
              '0%': {
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.3)',
              },
              '100%': {
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.6)',
              },
            },
            '@keyframes languageGlowLight': {
              '0%': {
                boxShadow: '0 0 10px rgba(139, 69, 19, 0.3)',
              },
              '100%': {
                boxShadow: '0 0 20px rgba(139, 69, 19, 0.6)',
              },
            },
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              transform: 'scale(1.1)',
              boxShadow: isDarkMode 
                ? '0 0 25px rgba(255, 215, 0, 0.8)' 
                : '0 0 25px rgba(139, 69, 19, 0.8)',
            },
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <LanguageIcon sx={{ fontSize: '24px' }} />
            <Typography 
              variant="caption" 
              sx={{ 
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                fontSize: '10px',
                fontWeight: 'bold',
                color: isDarkMode ? '#ffd700' : '#8B4513',
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${isDarkMode ? '#ffd700' : '#8B4513'}`,
              }}
            >
              {currentLanguage.code.toUpperCase()}
            </Typography>
          </Box>
        </IconButton>
      </Tooltip>
      
      <Popover
        id="language-accordion"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          zIndex: 9999,
        }}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#333333' : '#ffffff',
            border: `1px solid ${isDarkMode ? '#404040' : '#e0e0e0'}`,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0,0,0,0.4)' 
              : '0 8px 32px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            mt: 1,
          },
        }}
      >
        <Box sx={{ minWidth: 220, p: 1 }}>
          <Accordion 
            expanded={accordionExpanded} 
            onChange={handleAccordionChange}
            sx={{
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              boxShadow: 'none',
              border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: 2,
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
              }
              aria-controls="language-accordion-content"
              id="language-accordion-header"
              sx={{
                minHeight: 56,
                color: isDarkMode ? '#ffffff' : '#333333',
                '&.Mui-expanded': {
                  minHeight: 56,
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0',
                  },
                },
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                <LanguageIcon sx={{ color: isDarkMode ? '#ffd700' : '#8B4513' }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('common.language')}
                </Typography>
                <Box 
                  sx={{ 
                    ml: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                    {currentLanguage.flag}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {currentLanguage.name}
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 1, pb: 1 }}>
              {languages.map((language) => (
                <ListItemButton
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  selected={i18n.language === language.code}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    color: isDarkMode ? '#ffffff' : '#333333',
                    backgroundColor: i18n.language === language.code 
                      ? (isDarkMode ? 'rgba(255, 215, 0, 0.2)' : 'rgba(139, 69, 19, 0.1)')
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 215, 0, 0.1)' 
                        : 'rgba(139, 69, 19, 0.05)',
                    },
                    '&.Mui-selected': {
                      backgroundColor: isDarkMode 
                        ? 'rgba(255, 215, 0, 0.2)' 
                        : 'rgba(139, 69, 19, 0.1)',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(255, 215, 0, 0.25)' 
                          : 'rgba(139, 69, 19, 0.15)',
                      },
                    },
                  }}
                >
                  <ListItemIcon>
                    <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                      {language.flag}
                    </Typography>
                  </ListItemIcon>
                  <ListItemText>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: i18n.language === language.code ? 600 : 400,
                        color: isDarkMode ? '#ffffff' : '#333333',
                      }}
                    >
                      {language.name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Popover>
    </>
  );
};

export default LanguageToggle; 