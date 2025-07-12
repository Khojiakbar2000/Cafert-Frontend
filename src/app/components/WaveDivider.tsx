import React from 'react';

const bean = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="12" cy="12" rx="8" ry="12" fill="#8B4513" />
    <path d="M12 4C14.5 8 14.5 16 12 20" stroke="#DEB887" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const WaveDivider: React.FC<{ flip?: boolean }> = ({ flip }) => (
  <div style={{ position: 'relative', width: '100%', height: 64, background: 'none', overflow: 'hidden' }}>
    <svg
      viewBox="0 0 1440 64"
      width="100%"
      height="64"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}
      preserveAspectRatio="none"
    >
      <path
        d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z"
        fill="#FFF8DC"
        opacity="0.9"
      />
    </svg>
    {/* Coffee beans on the wave */}
    <div style={{ position: 'absolute', top: 12, left: '12%', transform: 'rotate(-10deg)' }}>{bean}</div>
    <div style={{ position: 'absolute', top: 24, left: '38%', transform: 'rotate(8deg)' }}>{bean}</div>
    <div style={{ position: 'absolute', top: 10, left: '62%', transform: 'rotate(-6deg)' }}>{bean}</div>
    <div style={{ position: 'absolute', top: 18, left: '82%', transform: 'rotate(12deg)' }}>{bean}</div>
  </div>
);

export default WaveDivider; 