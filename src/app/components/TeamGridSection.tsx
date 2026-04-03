import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * stitch.tsx — "Meet the Bakers" / Meet the Soul of the Shop
 * Epilogue + Newsreader, comic-shadow circles, rotated name badges.
 */
const STITCH = {
  outline: '#90715d',
  comicShadow: '4px 4px 0 0 rgba(144, 113, 93, 1)',
  secondary: '#bc004f',
  tertiary: '#795900',
  primary: '#705a4c',
  onSurface: '#1d1b18',
  onSurfaceVariant: '#5b4130',
  tertiaryContainer: '#ffdfa0',
  primaryContainer: '#fbddca',
  secondaryContainer: '#ffd9de',
  surface: '#fef9f3',
  /** selection */
  tertiaryContainerSel: '#ffdfa0',
};

const CIRCLE_WELLS = [
  STITCH.tertiaryContainer,
  STITCH.primaryContainer,
  STITCH.secondaryContainer,
] as const;

const BADGE_STYLES = [
  { bg: STITCH.secondary, color: '#ffffff', rotate: '6deg' },
  { bg: STITCH.tertiary, color: '#ffffff', rotate: '-3deg' },
  { bg: STITCH.primary, color: '#ffffff', rotate: '12deg' },
] as const;

export type TeamMember = {
  first_name: string;
  last_name: string;
  photo_background: string;
  photo_foreground: string;
  link?: string;
  /** Displayed as bold headline under portrait (stitch: "The Croissant Queen") */
  role?: string;
  /** Centered italic quote (stitch: pull-quote under role) */
  bio?: string;
  /** Uppercase sticker; defaults to first name */
  badgeLabel?: string;
};

const DEFAULT_MEMBERS: TeamMember[] = [
  {
    first_name: 'Arthur',
    last_name: 'Vance',
    photo_background: '/team1.jpg',
    photo_foreground: '/team1.jpg',
    role: 'Founder & Head Roaster',
    bio: '"The crack of the roast is the only metronome I trust."',
  },
  {
    first_name: 'Elena',
    last_name: 'Thorne',
    photo_background: '/team2.jpg',
    photo_foreground: '/team2.jpg',
    role: 'Green Coffee Buyer',
    bio: '"From Sidamo to your cup—every bean has a passport."',
  },
  {
    first_name: 'Julian',
    last_name: 'Reed',
    photo_background: '/team3.jpg',
    photo_foreground: '/team3.jpg',
    role: 'Director of Hospitality',
    bio: '"The room should hum before the first sip ever hits."',
  },
  {
    first_name: 'Casey',
    last_name: 'Morgan',
    photo_background: '/team4.jpg',
    photo_foreground: '/team4.jpg',
    role: 'Head Barista',
    bio: '"Balance isn’t a trend—it’s the whole pour."',
  },
];

function TeamCard({
  member,
  index,
  outline: outlineColor,
  comicShadow,
  onSurfaceVariant,
  isLight,
}: {
  member: TeamMember;
  index: number;
  outline: string;
  comicShadow: string;
  onSurfaceVariant: string;
  isLight: boolean;
}) {
  const name = `${member.first_name} ${member.last_name}`;
  const src = member.photo_foreground || member.photo_background;
  const role = member.role ?? 'Team member';
  const bio =
    member.bio ??
    'Dedicated to craft, detail, and the quiet ritual of exceptional coffee.';
  const badge =
    member.badgeLabel ?? member.first_name.toUpperCase();

  const well = CIRCLE_WELLS[index % CIRCLE_WELLS.length]!;
  const badgeStyle = BADGE_STYLES[index % BADGE_STYLES.length]!;

  const imgFilter = isLight
    ? 'contrast(1.25) saturate(1.5) mix-blend-multiply'
    : 'contrast(1.15) saturate(1.2)';

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          mb: 4,
          width: { xs: 'min(16rem, 88vw)', sm: '16rem' },
          height: { xs: 'min(16rem, 88vw)', sm: '16rem' },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: `4px solid ${outlineColor}`,
            overflow: 'hidden',
            boxShadow: comicShadow,
            bgcolor: isLight ? well : 'rgba(255, 223, 160, 0.12)',
            transition: 'transform 0.3s ease',
            '&:hover': { transform: 'scale(1.03)' },
          }}
        >
          <Box
            component="img"
            src={src}
            alt={name}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/coffee/coffee-placeholder.png';
            }}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: imgFilter,
            }}
          />
        </Box>
        <Box
          sx={{
            position: 'absolute',
            bottom: -16,
            right: -16,
            bgcolor: badgeStyle.bg,
            color: badgeStyle.color,
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.25 },
            border: `2px solid ${outlineColor}`,
            fontFamily: '"Epilogue", sans-serif',
            fontWeight: 900,
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            textTransform: 'uppercase',
            transform: `rotate(${badgeStyle.rotate})`,
            lineHeight: 1,
            letterSpacing: '0.02em',
          }}
        >
          {badge}
        </Box>
      </Box>

      <Typography
        component="h3"
        sx={{
          m: 0,
          mb: 1,
          fontFamily: '"Epilogue", sans-serif',
          fontSize: { xs: '1.625rem', md: '1.875rem' },
          fontWeight: 700,
          lineHeight: 1.2,
          color: isLight ? STITCH.onSurface : 'inherit',
          textAlign: 'center',
        }}
      >
        {role}
      </Typography>
      <Typography
        component="p"
        sx={{
          m: 0,
          px: 2,
          fontFamily: '"Newsreader", Georgia, serif',
          fontSize: '1rem',
          lineHeight: 1.6,
          fontStyle: 'italic',
          color: onSurfaceVariant,
          textAlign: 'center',
          maxWidth: '22rem',
        }}
      >
        {bio}
      </Typography>
    </Box>
  );
}

export type TeamGridSectionProps = {
  /** e.g. "Meet the" */
  titleBefore?: string;
  /** Accent word — stitch secondary color + italic */
  titleAccent?: string;
  /** e.g. " of the Shop" */
  titleAfter?: string;
  /** Optional intro; omit or pass "" to match stitch (no lead block) */
  lead?: string;
  members?: TeamMember[];
  colors?: { text: string; background: string };
  isDarkMode?: boolean;
};

export default function TeamGridSection({
  titleBefore = 'Meet the',
  titleAccent = 'Soul',
  titleAfter = ' of the Shop',
  lead = '',
  members = DEFAULT_MEMBERS,
  colors = { text: STITCH.onSurface, background: STITCH.surface },
  isDarkMode = false,
}: TeamGridSectionProps) {
  const isLight = !isDarkMode;
  const onSurface = isLight ? STITCH.onSurface : colors.text;
  const outlineColor = isLight ? STITCH.outline : 'rgba(240, 230, 220, 0.45)';
  const comicShadow = isLight
    ? STITCH.comicShadow
    : '4px 4px 0 0 rgba(200, 180, 160, 0.35)';
  const onSurfaceVariant = isLight
    ? STITCH.onSurfaceVariant
    : 'rgba(255, 255, 255, 0.65)';

  return (
    <Box
      component="section"
      className="team-stitch-section"
      sx={{
        maxWidth: '80rem',
        mx: 'auto',
        px: { xs: 2, md: 3 },
        py: { xs: 6, md: 8 },
        mb: { xs: 6, md: 8 },
        bgcolor: colors.background,
        color: onSurface,
        WebkitFontSmoothing: 'antialiased',
        '& ::selection': {
          bgcolor: STITCH.tertiaryContainerSel,
          color: STITCH.onSurface,
        },
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,100..900;1,100..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap');
      `}</style>

      <Typography
        component="h2"
        sx={{
          m: 0,
          mb: { xs: 6, md: 8 },
          fontFamily: '"Epilogue", sans-serif',
          fontWeight: 900,
          fontSize: { xs: '2.75rem', md: '3.75rem' },
          lineHeight: 1.1,
          textAlign: 'center',
          color: onSurface,
        }}
      >
        {titleBefore}{' '}
        <Box
          component="span"
          sx={{
            color: STITCH.secondary,
            fontStyle: 'italic',
          }}
        >
          {titleAccent}
        </Box>
        {titleAfter}
      </Typography>

      {lead ? (
        <Box
          component="p"
          sx={{
            m: 0,
            mb: 5,
            maxWidth: '36rem',
            mx: 'auto',
            fontFamily: '"Newsreader", Georgia, serif',
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            lineHeight: 1.65,
            color: onSurfaceVariant,
            textAlign: 'center',
          }}
        >
          {lead}
        </Box>
      ) : null}

      {/* 4 team portraits — team1–4.jpg */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: { xs: 4, md: '3rem' },
          alignItems: 'start',
        }}
      >
        {members.map((member, index) => (
          <TeamCard
            key={`${member.first_name}-${member.last_name}-${index}`}
            member={member}
            index={index}
            outline={outlineColor}
            comicShadow={comicShadow}
            onSurfaceVariant={onSurfaceVariant}
            isLight={isLight}
          />
        ))}
      </Box>
    </Box>
  );
}
