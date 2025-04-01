import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import { CSVLink } from "react-csv"; // We'll use the 'react-csv' library to generate a CSV file

const Report = () => {
  // Initial state for the report data and loading status
  const [reportData, setReportData] = useState({
    totalEmployees: 0,
    totalAccounts: 0,
    updatedAccounts: 0,
  });

  const [loading, setLoading] = useState(true);  // Loading state
  const [error, setError] = useState(null);      // Error state

  // Fetch the report data from the backend when the component mounts
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/employe/summary');
        if (!response.ok) {
          throw new Error('Failed to fetch data from the backend');
        }
        const data = await response.json();
        console.log('Fetched data:', data);  // Log the fetched data
        setReportData({
          totalEmployees: data.totalEmployees,
          totalAccounts: data.totalAccounts,
          updatedAccounts: data.updatedAccounts,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReportData();
  }, []);
  
  // CSV data for download
  const csvReportData = [
    ['Metric', 'Value'],  // CSV Headers
    ['Total Employees', reportData.totalEmployees],
    ['Total Accounts', reportData.totalAccounts],
    ['Updated Accounts', reportData.updatedAccounts],
  ];

  if (loading) {
    // Show a loading spinner while the data is being fetched
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    // Show an error message if something goes wrong during the fetch
    return (
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Admin Report
        </Typography>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Admin Report
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#34495e', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Employees</Typography>
              <Typography variant="h4">{reportData.totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#34495e', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Total Accounts</Typography>
              <Typography variant="h4">{reportData.totalAccounts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#34495e', color: 'white' }}>
            <CardContent>
              <Typography variant="h6">Updated Accounts</Typography>
              <Typography variant="h4">{reportData.updatedAccounts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Download CSV button */}
      <Box sx={{ marginTop: 3 }}>
        <CSVLink
          data={csvReportData}
          filename="admin_report.csv"
        >
          <Button variant="contained" color="primary">
            Download Report as CSV
          </Button>
        </CSVLink>
      </Box>
    </Box>
  );
};

export default Report;
