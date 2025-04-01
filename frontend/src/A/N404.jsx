import React from 'react'
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function N404() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <Box sx={{ padding: 3, textAlign: 'center' }}>
      <Typography variant="h4" color="error">
       Page Not Found
      </Typography>
      <Typography variant="h1" sx={{ marginBottom: 2 }}>
       404.
      </Typography>
      <Button variant="contained" color='error' onClick={handleGoBack}>
        Go Back
      </Button>
    </Box>
  );
}

export default N404