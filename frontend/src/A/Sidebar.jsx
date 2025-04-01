import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';

const Sidebar = ({ setDrawerOpen }) => {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={true}  // Adjust based on your state for opening/closing the drawer
    >
      <List>
        {/* List of 5 items in the sidebar */}
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Staff Management" />
        </ListItem>
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Reports" />
        </ListItem>
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Prisoners" />
        </ListItem>
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>

      <Divider />

      <List>
        {/* Logout option */}
        <ListItem button onClick={() => setDrawerOpen(false)}>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
