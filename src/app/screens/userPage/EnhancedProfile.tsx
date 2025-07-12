import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useGlobals } from '../../hooks/useGlobals';
import { MemberUpdateInput } from '../../../lib/types/member';
import { T } from '../../../lib/types/common';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../lib/sweetAlert';
import { Messages, serverApi } from '../../../lib/config';
import MemberService from '../../services/MemberService';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const EnhancedProfile: React.FC = () => {
  const { authMember, setAuthMember } = useGlobals();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [memberImage, setMemberImage] = useState<string>(
    authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"
  );
  const [memberUpdateInput, setMemberUpdateInput] = useState<MemberUpdateInput>({
    memberNick: authMember?.memberNick || '',
    memberPhone: authMember?.memberPhone || '',
    memberAddress: authMember?.memberAddress || '',
    memberDesc: authMember?.memberDesc || '',
    memberImage: authMember?.memberImage || '',
  });

  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    surface: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#2c2c2c',
    textSecondary: isDarkMode ? '#b0b0b0' : '#666666',
    accent: isDarkMode ? '#ffd700' : '#b38e6a',
    accentDark: isDarkMode ? '#ffed4e' : '#8b6b4a',
    cream: isDarkMode ? '#2c2c2c' : '#f8f8ff',
    shadow: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    border: isDarkMode ? '#404040' : '#e0e0e0'
  };

  const handleInputChange = (field: keyof MemberUpdateInput) => (e: T) => {
    setMemberUpdateInput({
      ...memberUpdateInput,
      [field]: e.target.value
    });
  };

  const handleImageUpload = (e: T) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    const validateImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    
    if (!validateImageTypes.includes(fileType)) {
      sweetErrorHandling("Please select a valid image file (JPG, JPEG, PNG, or WebP)").then();
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      sweetErrorHandling("Image size should be less than 5MB").then();
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    memberUpdateInput.memberImage = file;
    setMemberUpdateInput({ ...memberUpdateInput });
    setMemberImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (!authMember) throw new Error(Messages.error2);
      
      if (!memberUpdateInput.memberNick || !memberUpdateInput.memberPhone) {
        throw new Error("Username and phone are required");
      }

      const member = new MemberService();
      const result = await member.updateMember(memberUpdateInput);
      setAuthMember(result);
      
      setIsEditing(false);
      await sweetTopSmallSuccessAlert("Profile updated successfully!", 700);
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    setMemberUpdateInput({
      memberNick: authMember?.memberNick || '',
      memberPhone: authMember?.memberPhone || '',
      memberAddress: authMember?.memberAddress || '',
      memberDesc: authMember?.memberDesc || '',
      memberImage: authMember?.memberImage || '',
    });
    setMemberImage(
      authMember?.memberImage ? `${serverApi}${authMember.memberImage}` : "/icons/default-user.svg"
    );
    setIsEditing(false);
    setUploadProgress(0);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ 
      backgroundColor: colors.background,
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              color: colors.text,
              fontWeight: 700,
              mb: 4,
              textAlign: 'center'
            }}
          >
            {t('profile.title', 'My Profile')}
          </Typography>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Profile Photo Section */}
          <Box sx={{ flex: { xs: '1', md: '0 0 400px' } }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Paper 
                elevation={isDarkMode ? 8 : 2}
                sx={{ 
                  p: 4,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '20px',
                  textAlign: 'center'
                }}
              >
                <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                  <Avatar
                    src={memberImage}
                    sx={{
                      width: 150,
                      height: 150,
                      border: `4px solid ${colors.accent}`,
                      boxShadow: `0 8px 25px ${colors.shadow}`
                    }}
                  />
                  
                  {isEditing && (
                    <IconButton
                      onClick={triggerFileUpload}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: colors.accent,
                        color: colors.background,
                        '&:hover': {
                          backgroundColor: colors.accentDark,
                        }
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </Box>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Box sx={{ mb: 2 }}>
                    <CircularProgress 
                      variant="determinate" 
                      value={uploadProgress} 
                      size={40}
                      sx={{ color: colors.accent }}
                    />
                    <Typography variant="caption" sx={{ color: colors.textSecondary, ml: 1 }}>
                      Uploading... {uploadProgress}%
                    </Typography>
                  </Box>
                )}

                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: colors.text,
                    fontWeight: 600,
                    mb: 1
                  }}
                >
                  {authMember?.memberNick}
                </Typography>
                
                <Chip 
                  label={authMember?.memberType} 
                  sx={{ 
                    backgroundColor: colors.accent,
                    color: colors.background,
                    fontWeight: 600
                  }}
                />

                <Box sx={{ mt: 3 }}>
                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                        sx={{
                          backgroundColor: colors.accent,
                          color: colors.background,
                          '&:hover': {
                            backgroundColor: colors.accentDark,
                          }
                        }}
                      >
                        {isLoading ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancel}
                        startIcon={<CancelIcon />}
                        sx={{
                          borderColor: colors.accent,
                          color: colors.accent,
                          '&:hover': {
                            borderColor: colors.accentDark,
                            backgroundColor: 'rgba(179, 142, 106, 0.1)',
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => setIsEditing(true)}
                      startIcon={<EditIcon />}
                      sx={{
                        backgroundColor: colors.accent,
                        color: colors.background,
                        '&:hover': {
                          backgroundColor: colors.accentDark,
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              </Paper>
            </motion.div>
          </Box>

          {/* Profile Details Section */}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Paper 
                elevation={isDarkMode ? 8 : 2}
                sx={{ 
                  p: 4,
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '20px'
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: colors.text,
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  {t('profile.details', 'Profile Details')}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                    <TextField
                      fullWidth
                      label="Username"
                      value={memberUpdateInput.memberNick}
                      onChange={handleInputChange('memberNick')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1, color: colors.textSecondary }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.border,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                        },
                        '& .MuiInputBase-input': {
                          color: colors.text,
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={memberUpdateInput.memberPhone}
                      onChange={handleInputChange('memberPhone')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: colors.textSecondary }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: colors.border,
                          },
                          '&:hover fieldset': {
                            borderColor: colors.accent,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: colors.accent,
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: colors.textSecondary,
                        },
                        '& .MuiInputBase-input': {
                          color: colors.text,
                        }
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Address"
                    value={memberUpdateInput.memberAddress}
                    onChange={handleInputChange('memberAddress')}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: colors.textSecondary }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: colors.border,
                        },
                        '&:hover fieldset': {
                          borderColor: colors.accent,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: colors.textSecondary,
                      },
                      '& .MuiInputBase-input': {
                        color: colors.text,
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Description"
                    value={memberUpdateInput.memberDesc}
                    onChange={handleInputChange('memberDesc')}
                    disabled={!isEditing}
                    multiline
                    rows={4}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: colors.textSecondary, mt: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: colors.border,
                        },
                        '&:hover fieldset': {
                          borderColor: colors.accent,
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: colors.accent,
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: colors.textSecondary,
                      },
                      '& .MuiInputBase-input': {
                        color: colors.text,
                      }
                    }}
                  />
                </Box>

                {isEditing && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 3,
                      backgroundColor: 'rgba(179, 142, 106, 0.1)',
                      border: `1px solid ${colors.accent}`,
                      color: colors.text
                    }}
                  >
                    Click the camera icon on your profile photo to upload a new image. 
                    Supported formats: JPG, JPEG, PNG, WebP (max 5MB)
                  </Alert>
                )}
              </Paper>
            </motion.div>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default EnhancedProfile; 