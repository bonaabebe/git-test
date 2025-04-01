import React, { useState, useEffect } from 'react';
import { Paper, List, ListItem, ListItemText, Button, Typography, Grid, IconButton,Snackbar} from '@mui/material';
import axios from 'axios';
import { CheckCircle, Delete } from '@mui/icons-material';
const ManageGeneratedReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState('success'); 
   const [snackbarMessage, setSnackbarMessage] = useState('');
 const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Fetching the generated reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/reports', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

        setReports(response.data); 
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports(); 
  }, []);

  const handleViewReport = (file) => {
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:4000${file}`; 
    iframe.width = '100%';
    iframe.height = '600px';
    const newWindow = window.open();
    newWindow.document.body.appendChild(iframe);
  };


  const handleDeleteReport = async (reportId, fileUrl) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      // Send DELETE request to backend
      await axios.delete(`http://localhost:4000/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted report from the state
      setReports((prevReports) => prevReports.filter(report => report._id !== reportId));
   setSnackbarMessage('deleted successfully');
   setSnackbarType('success')
   setSnackbarOpen(true)
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Manage Generated Reports
      </Typography>

      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : (
        <List>
          {reports.length > 0 ? (
            reports.map((report) => (
              <ListItem key={report._id}>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <ListItemText
                      primary={`Reported by ${report.staffName}`}
                      secondary={`Date: ${report.reportDate}`}
                    />
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewReport(report.fileUrl)}  >
                      View Report
                    </Button>
                    <IconButton
                      sx={{ margin: 3 }}
                      color="secondary"
                      onClick={() => handleDeleteReport(report._id, report.fileUrl)}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </ListItem>
            ))
          ) : (
            <Typography>No reports found</Typography>
          )}
        </List>
      )}
       <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                message={
                  <>
                    {snackbarType === 'success' ? (
                      <CheckCircle color="success" sx={{ marginRight: '8px' }} />
                    ) : (
                      <Error color="error" sx={{ marginRight: '8px' }} />
                    )}
                    {snackbarMessage}
                  </>
                }
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              />
    </Paper>
  );
};

export default ManageGeneratedReports;
