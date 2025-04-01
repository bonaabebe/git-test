// PrisonManager.js
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Container, Snackbar, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './Dashboard';
import ManageNotices from './ManageNotices';
import ManageStaffReports from './ManageStaffReports'; // Import ManageStaffReports
import 'leaflet/dist/leaflet.css';
import Navbar from './Navbar';
import ManageGeneratedReports from './ManageGeneratedReports';

const PrisonManager = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [date, setDate] = useState('');
  const [expiredDate, setExpiredDate] = useState('');
  const [toWhom, setToWhom] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notices, setNotices] = useState([]);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  const handlePostNotice = () => {
    const newNotice = { id: notices.length + 1, title, toWhom, date, expiredDate, content };
    setNotices([...notices, newNotice]);
    setTitle('');
    setToWhom('');
    setDate('');
    setExpiredDate('');
    setContent('');
    setSnackbarMessage('Notice posted successfully!');
    setSnackbarOpen(true);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setDrawerOpen(false);
  };

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This ensures that the global styles are applied */}
      <Container>
        <Navbar toggleDrawer={toggleDrawer} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

        <Drawer open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button onClick={() => handleSectionChange('dashboard')}>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('manageReports')}>
              <ListItemText primary="Generate Reports" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('manageNotices')}>
              <ListItemText primary="Post Notices" />
            </ListItem>
            <ListItem button onClick={() => handleSectionChange('manageGeneratedReports')}>
              <ListItemText primary="Manage report" />
            </ListItem>
          </List>
        </Drawer>

        {/* Conditional rendering based on active section */}
        {activeSection === 'manageGeneratedReports' && <ManageGeneratedReports />} {/* New Section */}

        {activeSection === 'dashboard' && <Dashboard />}
        {activeSection === 'manageNotices' && (
          <ManageNotices
            date={date}
            expiredDate={expiredDate}
            toWhom={toWhom}
            title={title}
            content={content}
            setDate={setDate}
            setExpiredDate={setExpiredDate}
            setToWhom={setToWhom}
            setTitle={setTitle}
            setContent={setContent}
            notices={notices}
            handlePostNotice={handlePostNotice}
          />
        )}
        {activeSection === 'manageReports' && <ManageStaffReports />} {/* Show ManageStaffReports */}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </Container>
    </ThemeProvider>
  );
};

export default PrisonManager;
