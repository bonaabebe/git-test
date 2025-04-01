import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Box, Typography, CircularProgress, Alert, Card, CardContent, Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

const Profile = () => {
  const [user, setUser] = useState(null); // State to store user profile data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling

  // Function to fetch the user profile from the backend API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT token from localStorage
        if (!token) {
          setError('No token found.');
          setLoading(false);
          return;
        }

        // Send a GET request to the /profile endpoint
        const response = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        });

        setUser(response.data); // Set user data
        setLoading(false); // Set loading to false
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
        setLoading(false);
      }
    };

    fetchProfile(); // Call the fetchProfile function on component mount
  }, []);

  // Conditional rendering based on loading, error, or user data
  if (loading) {
    return (
      <Container>
        <CircularProgress /> {/* Display loading spinner */}
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert> {/* Display error message */}
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Card sx={{ maxWidth: 600, width: '100%' }}>
          <CardContent>
            {/* Profile Image */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              {user.photo ? (
                <Avatar alt="Profile Picture" src={user.photo} sx={{ width: 120, height: 120 }} />
              ) : (
                <AccountCircle sx={{ fontSize: 120 }} />
              )}
            </Box>

            {/* Profile Details */}
            <Typography variant="h4" component="div" align="center">
              {user.username.toUpperCase()} 
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" gutterBottom>
              {user.role} {/* Display user role */}
            </Typography>

           
            <Typography variant="body1" color="text.primary">
              <strong>Phone:</strong> {user.phone} {/* Display user phone */}
            </Typography>
            <Typography variant="body1" color="text.primary">
              <strong>Education Level:</strong> {user.educationLevel} {/* Display user education level */}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Profile;
