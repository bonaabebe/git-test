import React, { useState } from 'react';
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
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Snackbar,
  Alert,
  Grid,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Pie, Bar } from 'react-chartjs-2';
import nationalities from './data'; // Adjust the path as necessary

const drawerWidth = 240;

const Commissioner = () => {
  const [open, setOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [commissioners, setCommissioners] = useState([]);
  const [newCommissioner, setNewCommissioner] = useState({
    name: '',
    age: '',
    designation: '',
    department: '',
    joiningDate: '',
    nationality: '',
  });
  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ title: '', date: '', details: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalitySearch, setNationalitySearch] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleReportsOpen = () => setReportsOpen(true);
  const handleReportsClose = () => setReportsOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddCommissioner = () => {
    if (newCommissioner.name && newCommissioner.age && newCommissioner.designation) {
      setCommissioners([...commissioners, newCommissioner]);
      setNewCommissioner({
        name: '',
        age: '',
        designation: '',
        department: '',
        joiningDate: '',
        nationality: '',
      });
      handleClose();
      setSnackbarMessage('Commissioner added successfully!');
      setSnackbarOpen(true);
    } else {
      alert("All fields are required!");
    }
  };

  const handleDeleteCommissioner = (index) => {
    const updatedCommissioners = commissioners.filter((_, i) => i !== index);
    setCommissioners(updatedCommissioners);
    setSnackbarMessage('Commissioner deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleAddReport = () => {
    if (newReport.title && newReport.date && newReport.details) {
      setReports([...reports, newReport]);
      setNewReport({ title: '', date: '', details: '' });
      handleReportsClose();
      setSnackbarMessage('Report added successfully!');
      setSnackbarOpen(true);
    } else {
      alert("All fields are required!");
    }
  };

  const handleDeleteReport = (index) => {
    const updatedReports = reports.filter((_, i) => i !== index);
    setReports(updatedReports);
    setSnackbarMessage('Report deleted successfully!');
    setSnackbarOpen(true);
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCommissioners = commissioners.filter(comm =>
    comm.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredNationalities = nationalities.filter(nationality =>
    nationality.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // Statistics Data
  const totalCommissioners = commissioners.length;
  const departmentCounts = commissioners.reduce((acc, comm) => {
    acc[comm.department] = (acc[comm.department] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(departmentCounts),
    datasets: [{
      data: Object.values(departmentCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  const barData = {
    labels: ['Total Commissioners'],
    datasets: [{
      label: 'Commissioner Count',
      data: [totalCommissioners],
      backgroundColor: '#42A5F5',
    }]
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Commissioner Management
          </Typography>
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
          <ListItem button onClick={handleReportsOpen}>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={() => setReportsOpen(true)}>
            <ListItemText primary="Statistics" />
          </ListItem>
          <ListItem button onClick={handleOpen}>
            <ListItemText primary="Add Commissioner" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Commissioner List
        </Typography>

        <TextField
          label="Search Commissioner"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Commissioner
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCommissioners.map((comm, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{comm.name}</TableCell>
                  <TableCell>{comm.age}</TableCell>
                  <TableCell>{comm.designation}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteCommissioner(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Adding Commissioner */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 1000,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">
                Add New Commissioner
              </Typography>
              <IconButton onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={newCommissioner.name}
                  onChange={(e) => setNewCommissioner({ ...newCommissioner, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Age"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={newCommissioner.age}
                  onChange={(e) => setNewCommissioner({ ...newCommissioner, age: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Designation"
                  variant="outlined"
                  fullWidth
                  value={newCommissioner.designation}
                  onChange={(e) => setNewCommissioner({ ...newCommissioner, designation: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Department"
                  variant="outlined"
                  fullWidth
                  value={newCommissioner.department}
                  onChange={(e) => setNewCommissioner({ ...newCommissioner, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Joining Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={newCommissioner.joiningDate}
                  onChange={(e) => setNewCommissioner({ ...newCommissioner, joiningDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nationality"
                  variant="outlined"
                  fullWidth
                  value={nationalitySearch}
                  onChange={(e) => setNationalitySearch(e.target.value)}
                />
                <ul style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: 0 }}>
                  {filteredNationalities.map((nationality) => (
                    <li key={nationality} onClick={() => {
                      setNewCommissioner({ ...newCommissioner, nationality });
                      setNationalitySearch('');
                    }} style={{ padding: '8px', cursor: 'pointer' }}>
                      {nationality}
                    </li>
                  ))}
                </ul>
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleAddCommissioner} sx={{ mt: 2 }}>
              Add Commissioner
            </Button>
          </Box>
        </Modal>

        {/* Reports Section */}
        <Modal open={reportsOpen} onClose={handleReportsClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">
                Add Report
              </Typography>
              <IconButton onClick={handleReportsClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={newReport.date}
                  onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Details"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={newReport.details}
                  onChange={(e) => setNewReport({ ...newReport, details: e.target.value })}
                />
              </Grid>
            </Grid>
            <Button variant="contained" onClick={handleAddReport} sx={{ mt: 2 }}>
              Add Report
            </Button>
          </Box>
        </Modal>

        {/* Snackbar for Notifications */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Statistics Section */}
        <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
          Commissioner Statistics
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Total Commissioners: {totalCommissioners}
        </Typography>
        <Pie data={pieData} />
        <Bar data={barData} />
      </Container>
    </Box>
  );
};

export default Commissioner;
