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
  useMediaQuery,
  Fade,
  Zoom,
  Slide,
  Backdrop,
  Modal
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
  CloudUpload as CloudUploadIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useGlobals } from '../../hooks/useGlobals';
import { MemberUpdateInput } from '../../../lib/types/member';
import { T } from '../../../lib/types/common';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../../lib/sweetAlert';
import { Messages, serverApi } from '../../../lib/config';
import MemberService from '../../services/MemberService';
import { useTheme as useCoffeeTheme } from '../../../mui-coffee/context/ThemeContext';
import { useTranslation } from 'react-i18next';

const ElegantProfile: React.FC = () => {
  const { authMember, setAuthMember } = useGlobals();
  const { isDarkMode } = useCoffeeTheme();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  // Motion values for interactive animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
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

    if (file.size > 5 * 1024 * 1024) {
      sweetErrorHandling("Image size should be less than 5MB").then();
      return;
    }

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
    setShowUploadModal(false);
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
    setShowUploadModal(true);
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 6
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                color: '#ffffff',
                fontWeight: 700,
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {t('profile.title', 'My Profile')}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 400
              }}
            >
              {t('profile.subtitle', 'Manage your personal information and preferences')}
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Profile Photo Section */}
          <Box sx={{ flex: { xs: 1, md: 1 } }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card
                elevation={24}
                sx={{ 
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease-in-out',
                  },
                  '&:hover::before': {
                    transform: 'translateX(100%)',
                  }
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  style={{ rotateX, rotateY }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Avatar
                      src={memberImage}
                      sx={{
                        width: 180,
                        height: 180,
                        border: '4px solid #ffffff',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: -4,
                          left: -4,
                          right: -4,
                          bottom: -4,
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          borderRadius: '50%',
                          zIndex: -1,
                        }
                      }}
                    />
                    
                    {isEditing && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <IconButton
                          onClick={triggerFileUpload}
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: '#667eea',
                            color: '#ffffff',
                            width: 48,
                            height: 48,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            '&:hover': {
                              backgroundColor: '#5a6fd8',
                              transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <PhotoCameraIcon />
                        </IconButton>
                      </motion.div>
                    )}
                  </Box>
                </motion.div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={uploadProgress} 
                        size={60}
                        thickness={4}
                        sx={{ 
                          color: '#667eea',
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#666', mt: 1, fontWeight: 500 }}>
                        Uploading... {uploadProgress}%
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      color: '#2C3E50',
                      fontWeight: 700,
                      mb: 1
                    }}
                  >
                    {authMember?.memberNick}
                  </Typography>
                  
                  <Chip 
                    icon={<VerifiedIcon />}
                    label={authMember?.memberType} 
                    sx={{ 
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: '#ffffff',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      px: 2,
                      py: 1
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Box sx={{ mt: 4 }}>
                    {isEditing ? (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="contained"
                          onClick={handleSave}
                          disabled={isLoading}
                          startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                          sx={{
                            background: 'linear-gradient(45deg, #667eea, #764ba2)',
                            color: '#ffffff',
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px',
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
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={handleCancel}
                          startIcon={<CancelIcon />}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            borderWidth: 2,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 600,
                            borderRadius: '12px',
                            '&:hover': {
                              borderColor: '#5a6fd8',
                              backgroundColor: 'rgba(102, 126, 234, 0.1)',
                              transform: 'translateY(-2px)',
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
                          background: 'linear-gradient(45deg, #667eea, #764ba2)',
                          color: '#ffffff',
                          py: 1.5,
                          px: 4,
                          fontSize: '1rem',
                          fontWeight: 600,
                          borderRadius: '12px',
                          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)',
                          }
                        }}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </Box>
                </motion.div>
              </Card>
            </motion.div>
          </Box>

          {/* Profile Details Section */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card
                elevation={24}
                sx={{ 
                  p: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '24px',
                  height: 'fit-content'
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#2C3E50',
                      fontWeight: 700,
                      mb: 4,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {t('profile.details', 'Profile Details')}
                  </Typography>
                </motion.div>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
                      <TextField
                        fullWidth
                        label="Username"
                        value={memberUpdateInput.memberNick}
                        onChange={handleInputChange('memberNick')}
                        disabled={!isEditing}
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
                        value={memberUpdateInput.memberPhone}
                        onChange={handleInputChange('memberPhone')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <PhoneIcon sx={{ mr: 1, color: '#667eea' }} />
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <TextField
                      fullWidth
                      label="Address"
                      value={memberUpdateInput.memberAddress}
                      onChange={handleInputChange('memberAddress')}
                      disabled={!isEditing}
                      InputProps={{
                        startAdornment: <LocationIcon sx={{ mr: 1, color: '#667eea' }} />
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
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <TextField
                      fullWidth
                      label="Description"
                      value={memberUpdateInput.memberDesc}
                      onChange={handleInputChange('memberDesc')}
                      disabled={!isEditing}
                      multiline
                      rows={4}
                      InputProps={{
                        startAdornment: <DescriptionIcon sx={{ mr: 1, color: '#667eea', mt: 1 }} />
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
                  </motion.div>
                </Box>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Alert 
                      severity="info" 
                      icon={<CloudUploadIcon />}
                      sx={{ 
                        mt: 4,
                        background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                        border: '2px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '12px',
                        color: '#2C3E50',
                        '& .MuiAlert-icon': {
                          color: '#667eea',
                        }
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        Click the camera icon on your profile photo to upload a new image. 
                        Supported formats: JPG, JPEG, PNG, WebP (max 5MB)
                      </Typography>
                    </Alert>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Container>

      {/* Upload Modal */}
      <Modal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showUploadModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: '20px',
              boxShadow: 24,
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" component="h2" sx={{ mb: 3, fontWeight: 600 }}>
              Upload Profile Photo
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <Button
              variant="contained"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<CloudUploadIcon />}
              sx={{
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                color: '#ffffff',
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a6fd8, #6a4190)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 30px rgba(102, 126, 234, 0.6)',
                }
              }}
            >
              Choose File
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ElegantProfile; 