import React from 'react';
import { Box, Typography } from '@mui/material';

const ImageTest: React.FC = () => {
  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Image & Video Test Component</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Image Tests Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, color: '#1976d2' }}>Image Tests</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6">Test 1: Coffee Placeholder</Typography>
              <Box
                component="img"
                src="/img/coffee/coffee-placeholder.jpg"
                alt="Test Coffee"
                onLoad={() => console.log('✅ Coffee placeholder loaded')}
                onError={() => console.log('❌ Coffee placeholder failed')}
                sx={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid #ccc' }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6">Test 2: External Placeholder</Typography>
              <Box
                component="img"
                src="https://via.placeholder.com/200x150/8B4513/FFFFFF?text=Test"
                alt="External Test"
                onLoad={() => console.log('✅ External placeholder loaded')}
                onError={() => console.log('❌ External placeholder failed')}
                sx={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid #ccc' }}
              />
            </Box>
            
            <Box>
              <Typography variant="h6">Test 3: Coffee Hero</Typography>
              <Box
                component="img"
                src="/img/coffee/coffee-hero.jpg"
                alt="Test Hero"
                onLoad={() => console.log('✅ Coffee hero loaded')}
                onError={() => console.log('❌ Coffee hero failed')}
                sx={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid #ccc' }}
              />
            </Box>
          </Box>
        </Box>

        {/* Video Tests Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 2, color: '#d32f2f' }}>Video Tests</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="h6">Test 1: Sample Video (MP4)</Typography>
              <Box
                component="video"
                controls
                onLoadStart={() => console.log('✅ Sample video loading started')}
                onCanPlay={() => console.log('✅ Sample video can play')}
                onError={() => console.log('❌ Sample video failed')}
                sx={{ width: '300px', height: '200px', border: '2px solid #ccc' }}
              >
                <source src="/sample-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6">Test 2: External Sample Video</Typography>
              <Box
                component="video"
                controls
                onLoadStart={() => console.log('✅ External video loading started')}
                onCanPlay={() => console.log('✅ External video can play')}
                onError={() => console.log('❌ External video failed')}
                sx={{ width: '300px', height: '200px', border: '2px solid #ccc' }}
              >
                <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </Box>
            
            <Box>
              <Typography variant="h6">Test 3: Coffee Video</Typography>
              <Box
                component="video"
                controls
                onLoadStart={() => console.log('✅ Coffee video loading started')}
                onCanPlay={() => console.log('✅ Coffee video can play')}
                onError={() => console.log('❌ Coffee video failed')}
                sx={{ width: '300px', height: '200px', border: '2px solid #ccc' }}
              >
                <source src="/coffee-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </Box>

            <Box>
              <Typography variant="h6">Test 4: Autoplay Video (Muted)</Typography>
              <Box
                component="video"
                autoPlay
                muted
                loop
                onLoadStart={() => console.log('✅ Autoplay video loading started')}
                onCanPlay={() => console.log('✅ Autoplay video can play')}
                onError={() => console.log('❌ Autoplay video failed')}
                sx={{ width: '300px', height: '200px', border: '2px solid #ccc' }}
              >
                <source src="/coffee-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ImageTest; 