import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  Chip,
  Avatar,
  Fade,
  Zoom,
  Backdrop
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Member, MemberInput, LoginInput } from '../../../lib/types/member';
import { MemberType } from '../../../lib/enums/member.enum';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../lib/sweetAlert';
import { Messages } from '../../../lib/config';
import MemberService from '../../services/MemberService';
import { useGlobals } from '../../hooks/useGlobals';
import { useTranslation } from 'react-i18next';

interface ElegantSignupButtonProps {
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  fullWidth?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  children?: React.ReactNode;
  sx?: any;
  onClick?: () => void;
}

const ElegantSignupButton: React.FC<ElegantSignupButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  color = 'primary',
  fullWidth = false,
  disabled = false,
  startIcon,
  endIcon,
  children = 'Sign Up',
  sx,
  onClick
}) => {
  const { authMember, setAuthMember } = useGlobals();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');

  const [signupData, setSignupData] = useState<MemberInput>({
    memberNick: '',
    memberPhone: '',
    memberPassword: '',
    memberAddress: '',
    memberDesc: '',
    memberImage: '',
    memberType: MemberType.USER,
  });

  const [loginData, setLoginData] = useState<LoginInput>({
    memberNick: '',
    memberPassword: '',
  });

  const handleOpen = () => {
    setOpen(true);
    setError('');
    setIsSignup(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setSignupData({
      memberNick: '',
      memberPhone: '',
      memberPassword: '',
      memberAddress: '',
      memberDesc: '',
      memberImage: '',
      memberType: MemberType.USER,
    });
    setLoginData({
      memberNick: '',
      memberPassword: '',
    });
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!signupData.memberNick || !signupData.memberPhone || !signupData.memberPassword) {
        throw new Error('Please fill in all required fields');
      }

      if (signupData.memberPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      const member = new MemberService();
      const result = await member.signup(signupData);
      setAuthMember(result);
      
      await sweetTopSmallSuccessAlert('Signup successful!', 700);
      handleClose();
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : Messages.error1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!loginData.memberNick || !loginData.memberPassword) {
        throw new Error('Please fill in all required fields');
      }

      const member = new MemberService();
      const result = await member.login(loginData);
      setAuthMember(result);
      
      await sweetTopSmallSuccessAlert('Login successful!', 700);
      handleClose();
    } catch (err) {
      console.log(err);
      setError(err instanceof Error ? err.message : Messages.error1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof MemberInput | keyof LoginInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSignup) {
      setSignupData({
        ...signupData,
        [field]: e.target.value
      });
    } else {
      setLoginData({
        ...loginData,
        [field]: e.target.value
      });
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
  };

  const getButtonSx = () => ({
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
    borderRadius: '12px',
    py: size === 'large' ? 2 : size === 'small' ? 1 : 1.5,
    px: size === 'large' ? 4 : size === 'small' ? 2 : 3,
    fontSize: size === 'large' ? '1.125rem' : size === 'small' ? '0.875rem' : '1rem',
    fontWeight: 700,
    textTransform: 'none',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
    border: 'none',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(45deg, #5a6fd8 0%, #6a4190 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      background: '#ccc',
      transform: 'none',
      boxShadow: 'none',
    },
    ...sx
  });

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={variant}
          size={size}
          color={color}
          fullWidth={fullWidth}
          disabled={disabled}
          startIcon={startIcon || <PersonAddIcon />}
          endIcon={endIcon}
          onClick={onClick || handleOpen}
          sx={getButtonSx()}
        >
          {children}
        </Button>
      </motion.div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          }
        }}
        TransitionComponent={Zoom}
        transitionDuration={300}
      >
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: 'rgba(255, 255, 255, 0.2)',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                mr: 2
              }}
            >
              {isSignup ? <PersonAddIcon /> : <LoginIcon />}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                {isSignup ? 'Create Account' : 'Welcome Back'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {isSignup ? 'Join our community today' : 'Sign in to your account'}
              </Typography>
            </Box>
          </Box>
          
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#ffffff',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity="error" 
                  icon={<ErrorIcon />}
                  sx={{ 
                    mb: 3,
                    background: 'linear-gradient(45deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.05))',
                    border: '2px solid rgba(231, 76, 60, 0.3)',
                    borderRadius: '12px',
                    '& .MuiAlert-icon': {
                      color: '#E74C3C',
                    }
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            key={isSignup ? 'signup' : 'login'}
            initial={{ opacity: 0, x: isSignup ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignup ? 50 : -50 }}
            transition={{ duration: 0.3 }}
          >
            {isSignup ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={signupData.memberNick}
                  onChange={handleInputChange('memberNick')}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  value={signupData.memberPhone}
                  onChange={handleInputChange('memberPhone')}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#667eea' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={signupData.memberPassword}
                  onChange={handleInputChange('memberPassword')}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: '#667eea' }} />,
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#667eea' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Address (Optional)"
                  value={signupData.memberAddress}
                  onChange={handleInputChange('memberAddress')}
                  multiline
                  rows={2}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  value={loginData.memberNick}
                  onChange={handleInputChange('memberNick')}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#667eea' }} />
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.memberPassword}
                  onChange={handleInputChange('memberPassword')}
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: '#667eea' }} />,
                    endAdornment: (
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#667eea' }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': {
                        borderColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 2,
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                        borderWidth: 2,
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#7F8C8D',
                      fontWeight: 500,
                    },
                    '& .MuiInputBase-input': {
                      color: '#2C3E50',
                      fontWeight: 500,
                    }
                  }}
                />
              </Box>
            )}
          </motion.div>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#7F8C8D', mb: 2 }}>
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </Typography>
            <Button
              variant="text"
              onClick={toggleMode}
              sx={{
                color: '#667eea',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                }
              }}
            >
              {isSignup ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 4, pt: 0 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              borderWidth: 2,
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 600,
              '&:hover': {
                borderColor: '#5a6fd8',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={isSignup ? handleSignup : handleLogin}
            variant="contained"
            fullWidth
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : (isSignup ? <PersonAddIcon /> : <LoginIcon />)}
            sx={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: '#ffffff',
              borderRadius: '12px',
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)',
              },
              '&:disabled': {
                background: '#ccc',
                transform: 'none',
                boxShadow: 'none',
              }
            }}
          >
            {isLoading ? 'Processing...' : (isSignup ? 'Create Account' : 'Sign In')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ElegantSignupButton; 