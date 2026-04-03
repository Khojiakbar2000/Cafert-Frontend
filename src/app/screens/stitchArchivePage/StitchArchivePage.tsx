import React from 'react';
import { useTheme } from '../../../mui-coffee/context/ThemeContext';
import { StitchMainNoNav } from '../../../components/stitchUi';
import SEO from '../../../components/SEO';

const StitchArchivePage: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <>
      <SEO title="Kinetic Archive | Pulp Alchemist" description="Fan-favorite pours from your live menu." />
      <StitchMainNoNav
        isDarkMode={isDarkMode}
        comicProps={{
          continuedTitle: 'OPEN THE',
          continuedSubtitle: 'FULL MENU →',
          continuedHref: '/products',
        }}
      />
    </>
  );
};

export default StitchArchivePage;
