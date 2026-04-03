import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import CodeGridJeskoJetsScrollAnimation from '../../components/CodeGridJeskoJetsScrollAnimation';

/**
 * Jesko Jets page – React component (folder structure, styles, and script logic in component).
 */
export default function JeskoJetsPage() {
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
    <Box component="main" sx={{ width: '100%', minHeight: '100vh' }}>
      <CodeGridJeskoJetsScrollAnimation />
    </Box>
  );
}


