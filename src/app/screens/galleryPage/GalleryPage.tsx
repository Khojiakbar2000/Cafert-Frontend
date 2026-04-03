import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import CodeGridNakedCityFilmsScrollAnimation from '../../components/CodeGridNakedCityFilmsScrollAnimation';

/**
 * Gallery page (Products in UI). Full-page wrapper – the scroll animation component gets the whole page.
 */
export default function GalleryPage() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflowY;
    const prevBody = body.style.overflowY;
    html.style.overflowY = 'auto';
    body.style.overflowY = 'auto';
    return () => {
      html.style.overflowY = prevHtml;
      body.style.overflowY = prevBody;
    };
  }, []);

  return (
    <Box
      component="main"
      sx={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <CodeGridNakedCityFilmsScrollAnimation />
    </Box>
  );
}


