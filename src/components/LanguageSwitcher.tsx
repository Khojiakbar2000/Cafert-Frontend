import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Tooltip,
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSwitcher: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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

  return (
    <Box>
      <Tooltip title={t('common.language')}>
        <IconButton
          color="inherit"
          onClick={handleClick}
          aria-controls="language-menu"
          aria-haspopup="true"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{
          zIndex: 9999,
        }}
        PaperProps={{
          style: {
            minWidth: 150,
            zIndex: 9999,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={i18n.language === language.code}
          >
            <ListItemIcon>
              <Typography variant="h6" style={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">
                {language.name}
              </Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher; 