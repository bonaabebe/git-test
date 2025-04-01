import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const AppBarComponent = ({ drawerOpen, setDrawerOpen, handleProfileClick }) => {
  // Toggle the drawer and change the icon accordingly
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);  // Toggle the drawer open/close
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleDrawerToggle}
          aria-label="menu"
        >
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Staff Management Dashboard
        </Typography>
        <IconButton color="inherit" onClick={handleProfileClick}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
