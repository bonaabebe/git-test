import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, IconButton, Tooltip, Menu, MenuItem, Avatar, Divider, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Brightness4, Brightness7, AccountCircle, Menu as MenuIcon } from '@mui/icons-material'; // For dark/light mode icons
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use the hook to navigate

function Navbar({ toggleDrawer, toggleDarkMode, darkMode }) {
  const [anchorEl, setAnchorEl] = useState(null); // To handle dropdown menu
  const [user, setUser] = useState(null); // Store user profile data
  const [openProfileDialog, setOpenProfileDialog] = useState(false); // State to control the profile dialog
  const navigate = useNavigate(); // To handle navigation

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Exit if no token is found

        const response = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data); // Set user profile data
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileDetailsOpen = () => {
    setOpenProfileDialog(true);
    handleMenuClose();
  };

  const handleProfileDetailsClose = () => {
    setOpenProfileDialog(false);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page (or homepage, depending on your app structure)
    navigate('/login'); // Adjust the path as needed
  };

  // Ensure user is not null before accessing properties
  if (!user) {
    return null; // You can optionally display a loading indicator here
  }

  return (
    <Box sx={{ position: 'relative', marginBottom: '75px' }}>
      <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
        <Toolbar>
          {/* Menu Button */}
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Prison Manager Dashboard
          </Typography>

          {/* Dark/Light Mode Toggle */}
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* Profile Dropdown */}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            {user.photo ? (
              <Avatar alt="Profile Picture" src={user.photo} />
            ) : (
              <AccountCircle />
            )}
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{ 'aria-labelledby': 'profile-button' }}
          >
            {/* Profile Picture and Name */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px', width: '200px' }}>
              {user.photo ? (
                <Avatar alt="Profile Picture" src={user.photo} sx={{ width: 60, height: 60 }} />
              ) : (
                <AccountCircle sx={{ fontSize: 60 }} />
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.role}
              </Typography>
            </Box>

            <Divider />

            {/* Profile Details Button */}
            <MenuItem onClick={handleProfileDetailsOpen}>
              Profile Details
            </MenuItem>

            {/* Logout Button */}
            <MenuItem onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Profile Details Dialog */}
      <Dialog open={openProfileDialog} onClose={handleProfileDetailsClose}>
        <DialogTitle>Profile Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            {user.photo ? (
              <Avatar alt="Profile Picture" src={user.photo} sx={{ width: 100, height: 100 }} />
            ) : (
              <AccountCircle sx={{ fontSize: 100 }} />
            )}
            <Typography variant="h5" sx={{ mt: 2 }}>
              {user.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role}
            </Typography>
          </Box>
          <Typography variant="body1">
            <strong>Phone:</strong> {user.phone}
          </Typography>
          <Typography variant="body1">
            <strong>Education Level:</strong> {user.educationLevel}
          </Typography>
          {/* Add any other user details you want */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileDetailsClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Navbar;
