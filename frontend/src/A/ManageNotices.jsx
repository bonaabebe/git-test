import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Snackbar, Grid, Box, CircularProgress, Card, CardContent, CardActions, IconButton, Drawer, Slide, Tooltip, AppBar, Toolbar } from '@mui/material';
import { Edit, Delete, CheckCircle, Error } from '@mui/icons-material'; // Material icons
import axios from 'axios';
import { TransitionGroup } from 'react-transition-group';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const ManageNotices = ({ date, expiredDate, toWhom, title, content, setDate, setExpiredDate, setToWhom, setTitle, setContent }) => {
  const [notices, setNotices] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null); // To handle editing state
  const [darkMode, setDarkMode] = useState(false); // State to manage dark mode
  const [snackbarType, setSnackbarType] = useState('success'); // Snackbar type (success or error)

  // Fetch notices from backend when the component mounts
  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:4000/api/notice')
      .then((response) => {
        setNotices(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching notices:', error);
        setLoading(false);
      });
  }, []);

  // Handle posting a new notice to the backend
  const handlePostNotice = () => {
    const newNotice = {
      date,
      expiredDate,
      toWhom,
      title,
      content
    };

    axios.post('http://localhost:4000/api/notice', newNotice)
      .then((response) => {
        // Add the newly posted notice to the state
        setNotices(prevNotices => [...prevNotices, response.data.notice]);

        // Reset form fields
        setTitle('');
        setToWhom('');
        setDate('');
        setExpiredDate('');
        setContent('');

        // Snackbar success message
        setSnackbarMessage('Notice posted successfully!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error posting notice:', error);
        setSnackbarMessage('Error posting the notice');
        setSnackbarType('error');
        setSnackbarOpen(true);
      });
  };

  // Handle deleting a notice
  const handleDeleteNotice = (noticeId) => {
    axios.delete(`http://localhost:4000/api/notice/${noticeId}`)
      .then(() => {
        setNotices(prevNotices => prevNotices.filter(notice => notice._id !== noticeId));

        setSnackbarMessage('Notice deleted successfully!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error deleting notice:', error);
        setSnackbarMessage('Error deleting the notice');
        setSnackbarType('error');
        setSnackbarOpen(true);
      });
  };

  // Handle opening the edit form with existing data
  const handleEditNotice = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title);
    setToWhom(notice.toWhom);
    setDate(notice.date);
    setExpiredDate(notice.expiredDate);
    setContent(notice.content);
  };

  // Handle updating the edited notice
  const handleUpdateNotice = () => {
    const updatedNotice = {
      date,
      expiredDate,
      toWhom,
      title,
      content
    };

    axios.put(`http://localhost:4000/api/notice/${editingNotice._id}`, updatedNotice)
      .then((response) => {
        setNotices(prevNotices => prevNotices.map((notice) =>
          notice._id === editingNotice._id ? response.data.notice : notice
        ));

        // Reset form fields
        setEditingNotice(null);
        setTitle('');
        setToWhom('');
        setDate('');
        setExpiredDate('');
        setContent('');

        setSnackbarMessage('Notice updated successfully!');
        setSnackbarType('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error updating notice:', error);
        setSnackbarMessage('Error updating the notice');
        setSnackbarType('error');
        setSnackbarOpen(true);
      });
  };

  // Open the drawer with notice details
  const handleOpenDrawer = (notice) => {
    setSelectedNotice(notice);
    setOpenDrawer(true);
  };

  // Close the drawer
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setSelectedNotice(null);
  };

  // Theme setup for light/dark mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <Paper>
      <Paper sx={{ padding: '20px' }}>
        {/* Navbar */}
        <AppBar position="static" color='secondary'>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Manage Notices
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Form for posting or editing a new notice */}
        <Paper sx={{ padding: '20px', marginBottom: '30px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Expired Date"
                type="date"
                value={expiredDate}
                onChange={(e) => setExpiredDate(e.target.value)}
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="To Whom"
                value={toWhom}
                onChange={(e) => setToWhom(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                fullWidth
                multiline
                rows={4}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={editingNotice ? handleUpdateNotice : handlePostNotice}
                fullWidth
                sx={{
                  marginTop: '15px',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                {editingNotice ? 'Update Notice' : 'Post Notice'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Show a loading spinner if fetching data */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Posted Notices
            </Typography>

            {/* Display notices or message if none exist */}
            <TransitionGroup>
              {notices.length === 0 ? (
                <Typography>No notices posted.</Typography>
              ) : (
                notices.map((n) => (
                  <Slide key={n._id} direction="up" in mountOnEnter unmountOnExit>
                    <Card sx={{ marginBottom: '15px', cursor: 'pointer' }} onClick={() => handleOpenDrawer(n)}>
                      <CardContent>
                        <Typography variant="h6">{n.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          To: {n.toWhom}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Date: {new Date(n.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Expired Date: {new Date(n.expiredDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">{n.content}</Typography>
                      </CardContent>
                      <CardActions>
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEditNotice(n)}>
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="secondary" onClick={() => handleDeleteNotice(n._id)}>
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Slide>
                ))
              )}
            </TransitionGroup>
          </>
        )}

        {/* Snackbar to show success or error messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={
            <>
              {snackbarType === 'success' ? (
                <CheckCircle color="success" sx={{ marginRight: '8px' }} />
              ) : (
                <Error color="error" sx={{ marginRight: '8px' }} />
              )}
              {snackbarMessage}
            </>
          }
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
        
        {/* Drawer to show detailed notice */}
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={handleCloseDrawer}
          sx={{
            '& .MuiDrawer-paper': {
              width: '300px',
              padding: '20px',
            },
          }}
        >
          {selectedNotice && (
            <>
              <Typography variant="h6">Notice Details</Typography>
              <Typography variant="body1"><strong>Title:</strong> {selectedNotice.title}</Typography>
              <Typography variant="body1"><strong>To Whom:</strong> {selectedNotice.toWhom}</Typography>
              <Typography variant="body1"><strong>Date:</strong> {new Date(selectedNotice.date).toLocaleDateString()}</Typography>
              <Typography variant="body1"><strong>Expired Date:</strong> {new Date(selectedNotice.expiredDate).toLocaleDateString()}</Typography>
              <Typography variant="body1"><strong>Content:</strong> {selectedNotice.content}</Typography>
            </>
          )}
        </Drawer>
      </Paper>
    </Paper>
  );
};

export default ManageNotices;
