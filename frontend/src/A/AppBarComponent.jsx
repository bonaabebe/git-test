// AppBarComponent.js
import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const AppBarComponent = ({ drawerOpen, setDrawerOpen }) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen((prev) => !prev)} aria-label="menu">
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Staff Management Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
