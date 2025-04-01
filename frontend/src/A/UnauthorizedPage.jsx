import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <Box sx={{ padding: 3, textAlign: 'center' }}>
      <Typography variant="h4" color="error">
        Unauthorized Access
        
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 2 }}>
        You do not have permission to access this page.
      </Typography>
      <Button variant="contained" onClick={handleGoBack}>
        Go Back
      </Button>
    </Box>
    
  );
};

export default UnauthorizedPage;
