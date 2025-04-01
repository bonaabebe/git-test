import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Snackbar,
  Alert,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from '@mui/material';
import UserManagementModal from './UserManagementModal'; // Ensure this component is functional
import AccountManagement from './AccountManagementModal'; // Ensure this is for managing accounts
import Profile from './Profile'; // Profile of logged-in user
import Dashboard from './Dashboard'; // Main dashboard for admin overview
import Report from './Report'; // Add Report component here
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import axios from 'axios';

const drawerWidth = 240;

const Admin = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openUserModal, setOpenUserModal] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setSnackbarMessage('No token found');
          setSnackbarOpen(true);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        setUser(response.data); // Store profile data (including username from Account)
      } catch (error) {
        console.error('Error fetching profile:', error);
        setSnackbarMessage('Error fetching profile');
        setSnackbarOpen(true);
      }
    };

    fetchUserProfile();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile />;
      case 'account':
        return (
          <AccountManagement
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMessage={setSnackbarMessage}
          />
        );
      case 'report':
        return <Report />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
          <IconButton color="inherit" onClick={handleProfileClick}>
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setCurrentView('dashboard')} selected={currentView === 'dashboard'}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => setOpenUserModal(true)} selected={openUserModal}>
            <ListItemText primary="Register Employee" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('account')} selected={currentView === 'account'}>
            <ListItemText primary="Account Management" />
          </ListItem>
          <ListItem button onClick={() => setCurrentView('report')} selected={currentView === 'report'}>
            <ListItemText primary="Generate Report" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          {currentView === 'dashboard'
            ? 'Dashboard'
            : currentView === 'account'
            ? 'Account Management'
            : currentView === 'report'
            ? 'Admin Report'
            : 'User Profile'}
        </Typography>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {renderContent()}

        <UserManagementModal
          open={openUserModal}
          onClose={() => setOpenUserModal(false)}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
        />
      </Container>

      {/* Profile Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClosePopover}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => setCurrentView('profile')}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            {user && user.photo ? (
              <Avatar
                alt="Profile"
                src={user.photo}
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: 2,
                  border: '2px solid #ddd',
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: 2,
                  border: '2px solid #ddd',
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
              />
            )}
            <Box>
              <Typography variant="h6" component="div">
                {user && user.username.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user && user.role}
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={() => {
            // Handle logout logic
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Admin;
