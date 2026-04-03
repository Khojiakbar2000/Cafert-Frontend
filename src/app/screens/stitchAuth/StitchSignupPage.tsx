import React, { useState, useEffect } from 'react';
import { Box, Button, Link as MuiLink, Typography, InputBase } from '@mui/material';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import StitchAuthShell, { StitchAuthFloatingCoffeeSticker } from './StitchAuthShell';
import { STITCH_AUTH } from './stitchAuthTokens';
import { useGlobals } from '../../hooks/useGlobals';
import MemberService from '../../services/MemberService';
import { sweetErrorHandling } from '../../../lib/sweetAlert';
import { Messages } from '../../../lib/config';
import type { MemberInput } from '../../../lib/types/member';
import SEO from '../../../components/SEO';

const headline = '"Space Grotesk", system-ui, sans-serif';
const body = '"Work Sans", system-ui, sans-serif';

export default function StitchSignupPage() {
  const history = useHistory();
  const { setAuthMember, authMember } = useGlobals();
  const [memberNick, setMemberNick] = useState('');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberPassword, setMemberPassword] = useState('');

  useEffect(() => {
    document.title = 'Cafert - Sign Up';
  }, []);

  useEffect(() => {
    if (authMember) {
      history.push('/');
    }
  }, [authMember, history]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!memberNick.trim() || !memberPhone.trim() || !memberPassword) {
        throw new Error(Messages.error3);
      }
      const signupInput: MemberInput = {
        memberNick: memberNick.trim(),
        memberPhone: memberPhone.trim(),
        memberPassword,
      };
      const member = new MemberService();
      const result = await member.signup(signupInput);
      setAuthMember(result);
      history.push('/');
    } catch (err) {
      sweetErrorHandling(err).then();
    }
  };

  return (
    <>
      <SEO title="Cafert - Sign Up" description="Join Cafert — create your lab." url="/signup" />
      <StitchAuthShell>
        <Box sx={{ maxWidth: 448, width: '100%', position: 'relative', px: { xs: 0, sm: 1 } }}>
          <Box
            sx={{
              position: 'absolute',
              inset: -16,
              bgcolor: STITCH_AUTH.primaryContainer,
              border: `6px solid ${STITCH_AUTH.ink}`,
              transform: 'rotate(-2deg)',
              opacity: 0.1,
              pointerEvents: 'none',
            }}
          />
          <Box
            sx={{
              position: 'relative',
              bgcolor: STITCH_AUTH.surfaceLowest,
              border: `6px solid ${STITCH_AUTH.ink}`,
              boxShadow: `12px 12px 0px 0px ${STITCH_AUTH.ink}`,
              p: { xs: 3, md: 6 },
            }}
          >
            <Box component="header" sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Box sx={{ height: 16, width: 48, bgcolor: STITCH_AUTH.primary }} />
                <Typography
                  sx={{
                    fontFamily: headline,
                    fontWeight: 700,
                    color: STITCH_AUTH.primary,
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    fontSize: '0.875rem',
                  }}
                >
                  Registration Protocol
                </Typography>
              </Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: headline,
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: STITCH_AUTH.onSurface,
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  mb: 2,
                  lineHeight: 1.05,
                }}
              >
                Join the <Box component="span" sx={{ color: STITCH_AUTH.primary }}>Lab</Box>
              </Typography>
              <Typography sx={{ fontFamily: body, color: STITCH_AUTH.onSurfaceVariant, fontWeight: 500, fontSize: '1rem' }}>
                Initialize your credentials for the kinetic roastery.
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSignup} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Box>
                <Box component="label" sx={{ fontFamily: headline, fontWeight: 700, color: STITCH_AUTH.onSurface, textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PersonOutlineIcon sx={{ fontSize: 18 }} />
                  Alchemist ID
                </Box>
                <InputBase
                  fullWidth
                  placeholder="your handle"
                  value={memberNick}
                  onChange={(e) => setMemberNick(e.target.value)}
                  autoComplete="username"
                  sx={{
                    bgcolor: STITCH_AUTH.surfaceContainerLow,
                    border: `3px solid ${STITCH_AUTH.ink}`,
                    p: 2,
                    fontWeight: 700,
                    fontFamily: body,
                    color: STITCH_AUTH.onSurface,
                    '&.Mui-focused': { border: `6px solid ${STITCH_AUTH.ink}` },
                    transition: 'border-width 0.15s',
                  }}
                />
              </Box>
              <Box>
                <Box component="label" sx={{ fontFamily: headline, fontWeight: 700, color: STITCH_AUTH.onSurface, textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <PhoneOutlinedIcon sx={{ fontSize: 18 }} />
                  Comm line
                </Box>
                <InputBase
                  fullWidth
                  placeholder="+998 …"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  autoComplete="tel"
                  sx={{
                    bgcolor: STITCH_AUTH.surfaceContainerLow,
                    border: `3px solid ${STITCH_AUTH.ink}`,
                    p: 2,
                    fontWeight: 700,
                    fontFamily: body,
                    color: STITCH_AUTH.onSurface,
                    '&.Mui-focused': { border: `6px solid ${STITCH_AUTH.ink}` },
                    transition: 'border-width 0.15s',
                  }}
                />
              </Box>
              <Box>
                <Box component="label" sx={{ fontFamily: headline, fontWeight: 700, color: STITCH_AUTH.onSurface, textTransform: 'uppercase', letterSpacing: '0.02em', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LockOutlinedIcon sx={{ fontSize: 18 }} />
                  Secret Key
                </Box>
                <InputBase
                  fullWidth
                  type="password"
                  placeholder="••••••••"
                  value={memberPassword}
                  onChange={(e) => setMemberPassword(e.target.value)}
                  autoComplete="new-password"
                  sx={{
                    bgcolor: STITCH_AUTH.surfaceContainerLow,
                    border: `3px solid ${STITCH_AUTH.ink}`,
                    p: 2,
                    fontWeight: 700,
                    fontFamily: body,
                    color: STITCH_AUTH.onSurface,
                    '&.Mui-focused': { border: `6px solid ${STITCH_AUTH.ink}` },
                    transition: 'border-width 0.15s',
                  }}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                sx={{
                  py: 3,
                  bgcolor: STITCH_AUTH.primary,
                  color: STITCH_AUTH.surfaceBright,
                  border: `6px solid ${STITCH_AUTH.ink}`,
                  borderRadius: 0,
                  boxShadow: `8px 8px 0px 0px ${STITCH_AUTH.ink}`,
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': { bgcolor: STITCH_AUTH.primary, '& .hover-signup-sheen': { transform: 'translateY(0)' } },
                  '&:active': { transform: 'translate(8px, 8px)', boxShadow: 'none' },
                }}
              >
                <Box
                  className="hover-signup-sheen"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: STITCH_AUTH.ink,
                    opacity: 0.1,
                    transform: 'translateY(100%)',
                    transition: 'transform 0.3s',
                  }}
                />
                <Box
                  component="span"
                  sx={{
                    position: 'relative',
                    zIndex: 1,
                    fontFamily: headline,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                  }}
                >
                  Open Account
                  <BoltOutlinedIcon sx={{ fontSize: 28 }} />
                </Box>
              </Button>
            </Box>

            <Box component="footer" sx={{ mt: 6, pt: 4, borderTop: `4px dashed ${STITCH_AUTH.onSurface}` }}>
              <Typography sx={{ textAlign: 'center', fontFamily: body, fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', color: STITCH_AUTH.onSurfaceVariant }}>
                Already brewing?{' '}
                <MuiLink component={RouterLink} to="/login" sx={{ color: STITCH_AUTH.primary, ml: 1, textUnderlineOffset: 4 }}>
                  Initiate Access
                </MuiLink>
              </Typography>
            </Box>
          </Box>

          <StitchAuthFloatingCoffeeSticker />
        </Box>
      </StitchAuthShell>
    </>
  );
}
