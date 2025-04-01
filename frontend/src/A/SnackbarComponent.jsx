import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarComponent = ({ snackbarOpen, snackbarMessage, handleSnackbarClose }) => {
  return (
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
