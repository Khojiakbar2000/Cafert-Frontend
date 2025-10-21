import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import LanguageSwitcher from './LanguageSwitcher';

const LanguageExample: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box style={{ padding: 24 }}>
      <Typography variant="h4" gutterBottom>
        {t('home.welcome')}
      </Typography>
      
      <Typography variant="body1" style={{ marginBottom: 24 }}>
        {t('home.subtitle')}
      </Typography>

      {/* Language Switcher Example */}
      <Paper style={{ padding: 16, marginBottom: 24 }}>
        <Typography variant="h6" gutterBottom>
          {t('common.language')} Switcher Example
        </Typography>
        <LanguageSwitcher />
      </Paper>

      {/* Navigation Example */}
      <Grid container spacing={3} style={{ marginBottom: 24 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('navigation.drinks')}
              </Typography>
              <Typography variant="body2">
                {t('drinks.subtitle')}
              </Typography>
              <Button variant="contained" style={{ marginTop: 16 }}>
                {t('common.viewDetails')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('navigation.desserts')}
              </Typography>
              <Typography variant="body2">
                {t('desserts.subtitle')}
              </Typography>
              <Button variant="contained" style={{ marginTop: 16 }}>
                {t('common.viewDetails')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('navigation.salads')}
              </Typography>
              <Typography variant="body2">
                {t('salads.subtitle')}
              </Typography>
              <Button variant="contained" style={{ marginTop: 16 }}>
                {t('common.viewDetails')}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Example */}
      <Paper style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          {t('footer.about')}
        </Typography>
        <Typography variant="body2" style={{ marginBottom: 16 }}>
          {t('footer.contact')}: {t('footer.email')}
        </Typography>
        <Typography variant="body2">
          {t('footer.followUs')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default LanguageExample; 