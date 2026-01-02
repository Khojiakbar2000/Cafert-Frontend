import React, { useState } from 'react';
import { 
  Box, 
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
  const [accordionExpanded, setAccordionExpanded] = useState(false);

  const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
    setAccordionExpanded(isExpanded);
  };

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    setAccordionExpanded(false);
  };

  const languages = [
    { code: 'en', name: t('common.english'), flag: '🇺🇸' },
    { code: 'ko', name: t('common.korean'), flag: '🇰🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const colors = {
    background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    text: isDarkMode ? '#ffffff' : '#333333',
  };

  return (
    <Box sx={{ position: 'relative', height: 40, flexShrink: 0, width: 150 }}>
      <Accordion 
        expanded={accordionExpanded} 
        onChange={handleAccordionChange}
        sx={{ 
          width: '100%',
          boxShadow: accordionExpanded ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          position: 'relative',
          zIndex: accordionExpanded ? 1000 : 1,
          backgroundColor: colors.background,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: 0,
            minHeight: '40px !important',
          },
        }}
      >
        <AccordionSummary sx={{ 
          minHeight: 40, 
          maxHeight: 40,
          '&.Mui-expanded': { 
            minHeight: 40,
            maxHeight: 40,
          } 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <LanguageIcon sx={{ fontSize: '18px', color: isDarkMode ? '#ffd700' : '#8B4513' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: colors.text }}>
              {currentLanguage.flag} {currentLanguage.name}
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ 
          p: 0,
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          border: `1px solid ${colors.border}`,
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1001,
          mt: 0,
          display: accordionExpanded ? 'block' : 'none',
        }}>
          {languages.map((language) => (
            <ListItemButton
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={i18n.language === language.code}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                color: colors.text,
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
                    color: colors.text,
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
  );
};

export default LanguageToggle; 