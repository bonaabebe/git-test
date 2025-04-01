import React from 'react';
import { Drawer, List, ListItem, ListItemText, Toolbar } from '@mui/material';
import { CSVLink } from 'react-csv';

const DrawerComponent = ({ 
  drawerOpen, 
  setOpenPrisonerModal, 
  setEditPrisoner, 
  setOpenBlockModal, 
  handleOpenViewBlocks, 
  handleDownloadReport, 
  drawerWidth 
}) => {
  return (
   <Drawer
         sx={{
           width: drawerWidth,
           flexShrink: 0,
           '& .MuiDrawer-paper': {
             width: drawerWidth,
             boxSizing: 'border-box',
           },
         }}
         variant="persistent"
         anchor="left"
         open={drawerOpen}
       >
         <Toolbar />
         <List>
           <ListItem button onClick={() => { setOpenPrisonerModal(true); setEditPrisoner(null); }}>
             <ListItemText primary="Register Prisoner" />
           </ListItem>
 
           <ListItem button onClick={() => setOpenBlockModal(true)}>
             <ListItemText primary="Record Block" />
           </ListItem>
           <ListItem button onClick={handleOpenViewBlocks}>
             <ListItemText primary="View Block" />
           </ListItem>
           <ListItem button>
             <CSVLink data={handleDownloadReport()} filename={"prisoners_report.csv"}>
               <ListItemText primary="Generate Report" />
             </CSVLink>
           </ListItem>
         </List>
       </Drawer>
  );
};

export default DrawerComponent;
