import React from 'react';
import { Container, Typography, Snackbar, Alert } from '@mui/material';

const PageContainer = ({ currentView, snackbarOpen, snackbarMessage, snackbarColor, setSnackbarOpen, renderContent }) => {
  const getPageTitle = () => {
    switch (currentView) {
      case 'Register Prisoner':
        return 'Staff Register Prisoner';
      case 'profile':
        return 'User Profile';
      default:
        return '';
    }
  };

  return (
    <Container sx={{ flexGrow: 1, p: 3, marginTop: 8, width: 550, height: 100, marginLeft: 5 }}>
      <Typography variant="h5" marginBottom={-3} gutterBottom textAlign="center">
        {getPageTitle()}
      </Typography>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}  // Close the snackbar after 6 seconds or on click
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarColor}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/* Conditionally render content based on currentView */}
      {renderContent()}
    </Container>
  );
};

export default PageContainer;
