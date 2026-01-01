import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Popover,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Tooltip,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const LanguageSwitcher: React.FC = () => {
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
    <Box>
      <Tooltip title={t('common.language')}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls="language-accordion"
          aria-haspopup="true"
        >
          <LanguageIcon />
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
      >
        <Box sx={{ minWidth: 200, p: 1 }}>
          <Accordion 
            expanded={accordionExpanded} 
            onChange={handleAccordionChange}
            sx={{
              boxShadow: 'none',
              '&:before': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: 0,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="language-accordion-content"
              id="language-accordion-header"
              sx={{
                minHeight: 48,
                '&.Mui-expanded': {
                  minHeight: 48,
                },
                '& .MuiAccordionSummary-content': {
                  margin: '12px 0',
                  '&.Mui-expanded': {
                    margin: '12px 0',
                  },
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon />
                <Typography variant="body2">
                  {t('common.language')}: {currentLanguage.name}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0, pb: 1 }}>
              {languages.map((language) => (
                <ListItemButton
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  selected={i18n.language === language.code}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.selected',
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
                    <Typography variant="body2">
                      {language.name}
                    </Typography>
                  </ListItemText>
                </ListItemButton>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Popover>
    </Box>
  );
};

export default LanguageSwitcher; 