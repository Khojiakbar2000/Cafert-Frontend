import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Save as SaveIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductService, { ProductInput } from '../../services/ProductService';
import { ProductCollection, ProductSize, ProductStatus } from '../../../lib/enums/product.enum';
import { useTranslation } from 'react-i18next';

const ProductCreator: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';

  const [formData, setFormData] = useState<ProductInput>({
    productName: '',
    productPrice: 0,
    productLeftCount: 0,
    productSize: ProductSize.NORMAL,
    productVolume: 0,
    productDesc: '',
    productImages: [],
    productCollection: ProductCollection.COFFEE,
    productStatus: ProductStatus.PROCESS
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  const handleInputChange = (field: keyof ProductInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      const productService = new ProductService();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await productService.uploadProductImage(file);
        setFormData(prev => ({
          ...prev,
          productImages: [...prev.productImages, imageUrl]
        }));
      }
      
      setMessage({
        type: 'success',
        text: `${files.length} image(s) uploaded successfully!`
      });
    } catch (error) {
      console.error('Image upload error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to upload image(s). Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.productName.trim()) {
      setMessage({
        type: 'error',
        text: 'Product name is required!'
      });
      return;
    }

    if (formData.productPrice <= 0) {
      setMessage({
        type: 'error',
        text: 'Product price must be greater than 0!'
      });
      return;
    }

    try {
      setLoading(true);
      const productService = new ProductService();
      const newProduct = await productService.createProduct(formData);
      
      setMessage({
        type: 'success',
        text: `Product "${newProduct.productName}" created successfully!`
      });
      
      // Reset form
      setFormData({
        productName: '',
        productPrice: 0,
        productLeftCount: 0,
        productSize: ProductSize.NORMAL,
        productVolume: 0,
        productDesc: '',
        productImages: [],
        productCollection: ProductCollection.COFFEE,
        productStatus: ProductStatus.PROCESS
      });
    } catch (error) {
      console.error('Product creation error:', error);
      setMessage({
        type: 'error',
        text: 'Failed to create product. Please check your input and try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      productName: '',
      productPrice: 0,
      productLeftCount: 0,
      productSize: ProductSize.NORMAL,
      productVolume: 0,
      productDesc: '',
      productImages: [],
      productCollection: ProductCollection.COFFEE,
      productStatus: ProductStatus.PROCESS
    });
    setMessage(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={isDarkMode ? 8 : 4}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: isDarkMode ? '#2a2a2a' : '#ffffff'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              color: isDarkMode ? '#ffffff' : '#2c2c2c',
              mb: 3,
              textAlign: 'center'
            }}
          >
            {t('admin.createProduct', 'Create New Product')}
          </Typography>

          {message && (
            <Alert 
              severity={message.type} 
              sx={{ mb: 3 }}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Product Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('admin.productName', 'Product Name')}
                  value={formData.productName}
                  onChange={(e) => handleInputChange('productName', e.target.value)}
                  required
                  variant="outlined"
                />
              </Grid>

              {/* Price and Stock */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.productPrice', 'Price')}
                  type="number"
                  value={formData.productPrice}
                  onChange={(e) => handleInputChange('productPrice', parseFloat(e.target.value) || 0)}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: <span>$</span>
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.productStock', 'Stock Quantity')}
                  type="number"
                  value={formData.productLeftCount}
                  onChange={(e) => handleInputChange('productLeftCount', parseInt(e.target.value) || 0)}
                  required
                  variant="outlined"
                />
              </Grid>

              {/* Collection and Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.productCollection', 'Category')}</InputLabel>
                  <Select
                    value={formData.productCollection}
                    onChange={(e) => handleInputChange('productCollection', e.target.value)}
                    label={t('admin.productCollection', 'Category')}
                  >
                    {Object.values(ProductCollection).map((collection) => (
                      <MenuItem key={collection} value={collection}>
                        {collection}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.productStatus', 'Status')}</InputLabel>
                  <Select
                    value={formData.productStatus}
                    onChange={(e) => handleInputChange('productStatus', e.target.value)}
                    label={t('admin.productStatus', 'Status')}
                  >
                    {Object.values(ProductStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Size and Volume */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('admin.productSize', 'Size')}</InputLabel>
                  <Select
                    value={formData.productSize}
                    onChange={(e) => handleInputChange('productSize', e.target.value)}
                    label={t('admin.productSize', 'Size')}
                  >
                    {Object.values(ProductSize).map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('admin.productVolume', 'Volume (ml)')}
                  type="number"
                  value={formData.productVolume}
                  onChange={(e) => handleInputChange('productVolume', parseInt(e.target.value) || 0)}
                  variant="outlined"
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('admin.productDescription', 'Description')}
                  value={formData.productDesc}
                  onChange={(e) => handleInputChange('productDesc', e.target.value)}
                  multiline
                  rows={4}
                  variant="outlined"
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {t('admin.productImages', 'Product Images')}
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadIcon />}
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    {t('admin.uploadImages', 'Upload Images')}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </Button>

                  {/* Display uploaded images */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.productImages.map((image, index) => (
                      <Chip
                        key={index}
                        label={`Image ${index + 1}`}
                        onDelete={() => removeImage(index)}
                        deleteIcon={<DeleteIcon />}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={loading}
                    sx={{
                      minWidth: 120,
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #5a6fd8, #6a4190)'
                      }
                    }}
                  >
                    {loading ? t('common.loading', 'Loading...') : t('admin.createProduct', 'Create Product')}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<ClearIcon />}
                    onClick={handleClear}
                    disabled={loading}
                    sx={{ minWidth: 120 }}
                  >
                    {t('common.clear', 'Clear')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default ProductCreator; 