import React, { useState, useCallback } from 'react';
import { Box, Typography, Button } from '@mui/material';

const DEFAULT_VIDEO_PATH = '/videos/coffee.mp4';
const FALLBACK_VIDEO_URL = 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4';
const DEFAULT_POSTER = '/img/coffee/Just.png';

interface VideoSectionProps {
  videoSrc?: string;
  poster?: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoSrc, poster }) => {
  const pub = process.env.PUBLIC_URL || '';
  const primarySrc = videoSrc || (pub ? `${pub}${DEFAULT_VIDEO_PATH}` : DEFAULT_VIDEO_PATH);
  const [src, setSrc] = useState(primarySrc);
  const posterUrl = poster || (pub ? `${pub}${DEFAULT_POSTER}` : DEFAULT_POSTER);

  const handleError = useCallback(() => {
    setSrc(FALLBACK_VIDEO_URL);
  }, []);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: '150vh',
        minHeight: '150vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      <video
        src={src}
        poster={posterUrl}
        playsInline
        muted
        loop
        autoPlay
        onError={handleError}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Content overlay - on top of video, left-aligned */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          zIndex: 1,
          pointerEvents: 'none',
          '& > div': { pointerEvents: 'auto' },
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          py: 6,
        }}
      >
        <Box
          sx={{
            maxWidth: { xs: '100%', md: '520px' },
            textAlign: 'left',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: '2.25rem', sm: '2.75rem', md: '3.25rem', lg: '3.75rem' },
              fontWeight: 500,
              letterSpacing: '0.02em',
              lineHeight: 1.15,
              color: '#fff',
              fontFamily: 'var(--heading-family, "Poppins", serif)',
              mb: 2.5,
            }}
          >
            Start your day with intention.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.65,
              color: 'rgba(255, 255, 255, 0.72)',
              fontFamily: 'var(--bs-body-font-family)',
              mb: 4,
              maxWidth: '440px',
            }}
          >
            Explore thoughtfully selected brew tools and freshly roasted beans crafted for moments worth savoring.
          </Typography>
          <Button
            component="a"
            href="/products"
            sx={{
              borderRadius: '999px',
              padding: '12px 28px',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              background: 'transparent',
              color: '#fff',
              fontSize: '14px',
              letterSpacing: '0.06em',
              fontWeight: 500,
              textTransform: 'none',
              fontFamily: 'var(--bs-body-font-family)',
              transition: 'all 0.25s ease',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a1a1a',
                borderColor: 'rgba(255, 255, 255, 0.95)',
              },
            }}
          >
            Shop Collection
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoSection;
