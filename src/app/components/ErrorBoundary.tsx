import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Error, Refresh } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ErrorContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  minHeight: '50vh',
  background: 'linear-gradient(135deg, #FFF8DC 0%, #FDF5E6 100%)',
  border: `2px solid #DEB887`,
  borderRadius: theme.spacing(2),
  textAlign: 'center',
}));

const ErrorIcon = styled(Error)(({ theme }) => ({
  fontSize: '4rem',
  color: '#8B4513',
  marginBottom: theme.spacing(2),
}));

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer elevation={3}>
          <ErrorIcon />
          <Typography variant="h4" color="#8B4513" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body1" color="#8B7355" paragraph>
            We're sorry, but something unexpected happened. 
            Our team has been notified and is working to fix this issue.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={this.handleRetry}
            sx={{
              backgroundColor: '#8B4513',
              '&:hover': {
                backgroundColor: '#654321',
              },
              mt: 2,
            }}
          >
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box sx={{ mt: 3, textAlign: 'left', maxWidth: '100%', overflow: 'auto' }}>
              <Typography variant="h6" color="#8B4513" gutterBottom>
                Error Details (Development):
              </Typography>
              <Typography variant="body2" color="#8B7355" component="pre" sx={{ 
                background: '#F5F5F5', 
                padding: 1, 
                borderRadius: 1,
                fontSize: '0.8rem',
                overflow: 'auto'
              }}>
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 