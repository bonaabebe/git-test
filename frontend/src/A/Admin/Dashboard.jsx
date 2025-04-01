import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { styled } from '@mui/material/styles';

// Styled Card for hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[6],
  },
}));

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [updatedAccounts, setUpdatedAccounts] = useState(0);
  const [userGrowth, setUserGrowth] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]); // State for activities
  const [loading, setLoading] = useState(true);  // State to manage loading

  useEffect(() => {
    // Function to fetch dashboard summary
    const fetchSummary = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/employe/summary'); // Adjust URL as necessary
        const data = await response.json();
        
        if (response.ok) {
          setTotalUsers(data.totalEmployees);
          setTotalAccounts(data.totalAccounts);
          setUpdatedAccounts(data.updatedAccounts);

          // Assuming user growth is calculated from the updated accounts in the last 30 days
          const growth = (data.updatedAccounts / data.totalAccounts) * 100;
          setUserGrowth(growth.toFixed(2));  // Format growth as percentage
        } else {
          console.error('Failed to fetch summary data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    // Function to fetch recent activities
    const fetchRecentActivities = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/employe/recent-activities');
        const data = await response.json();
        
        if (response.ok) {
          setRecentActivities(data);
        } else {
          console.error('Failed to fetch recent activities:', data.message);
        }
      } catch (error) {
        console.error('Error fetching recent activities:', error);
      }
    };

    fetchSummary();
    fetchRecentActivities(); // Call fetch for activities
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard Overview
      </Typography>
      {/* Grid layout for cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="body1">{totalUsers}</Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Accounts
                  </Typography>
                  <Typography variant="body1">{totalAccounts}</Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      

        {/* Additional Cards for Recent Activities */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              {/* Render recent activities dynamically */}
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <Typography variant="body1" key={index}>
                    - {activity.user?.firstName} {activity.user?.lastName} {activity.action}
                  </Typography>
                ))
              ) : (
                <Typography variant="body1">No recent activities available.</Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;


