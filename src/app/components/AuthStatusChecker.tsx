import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useGlobals } from '../hooks/useGlobals';
import Cookies from 'universal-cookie';

const AuthStatusChecker: React.FC = () => {
  const { authMember } = useGlobals();
  const cookies = new Cookies();

  const checkAuthStatus = () => {
    console.log("=== AUTHENTICATION STATUS CHECK ===");
    console.log("authMember from context:", authMember);
    console.log("localStorage memberData:", localStorage.getItem("memberData"));
    console.log("accessToken cookie:", cookies.get("accessToken"));
    console.log("All cookies:", document.cookie);
  };

  const clearAuth = () => {
    localStorage.removeItem("memberData");
    cookies.remove("accessToken");
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2, m: 2, maxWidth: 400 }}>
      <Typography variant="h6" gutterBottom>
        Authentication Status
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Context authMember:</strong> {authMember ? "Logged In" : "Not Logged In"}
        </Typography>
        <Typography variant="body2">
          <strong>localStorage memberData:</strong> {localStorage.getItem("memberData") ? "Present" : "Missing"}
        </Typography>
        <Typography variant="body2">
          <strong>accessToken cookie:</strong> {cookies.get("accessToken") ? "Present" : "Missing"}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button variant="outlined" size="small" onClick={checkAuthStatus}>
          Check Status (Console)
        </Button>
        <Button variant="outlined" size="small" color="error" onClick={clearAuth}>
          Clear Auth
        </Button>
      </Box>
    </Paper>
  );
};

export default AuthStatusChecker; 