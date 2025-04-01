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
import countries from './data'; // Adjust the path accordingly

const drawerWidth = 240;

const Prisoner = () => {
  const [open, setOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [prisoners, setPrisoners] = useState([]);
  const [newPrisoner, setNewPrisoner] = useState({
    name: '',
    age: '',
    crime: '',
    gender: '',
    sentenceLength: '',
    releaseDate: '',
    nationality: '',
    dateOfBirth: '',
    medicalConditions: '',
  });

  const [reports, setReports] = useState([]);
  const [newReport, setNewReport] = useState({ title: '', date: '', details: '', author: '', severity: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [nationalitySearchTerm, setNationalitySearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleReportsOpen = () => setReportsOpen(true);
  const handleReportsClose = () => setReportsOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddPrisoner = () => {
    if (newPrisoner.name && newPrisoner.age && newPrisoner.crime) {
      setPrisoners([...prisoners, newPrisoner]);
      setNewPrisoner({
        name: '',
        age: '',
        crime: '',
        gender: '',
        sentenceLength: '',
        releaseDate: '',
        nationality: '',
        dateOfBirth: '',
        medicalConditions: '',
      });
      handleClose();
      setSnackbarMessage('Prisoner added successfully!');
      setSnackbarOpen(true);
    } else {
      alert("All fields are required!");
    }
  };

  const handleDeletePrisoner = (index) => {
    const updatedPrisoners = prisoners.filter((_, i) => i !== index);
    setPrisoners(updatedPrisoners);
    setSnackbarMessage('Prisoner deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleAddReport = () => {
    if (newReport.title && newReport.date && newReport.details && newReport.author && newReport.severity) {
      setReports([...reports, newReport]);
      setNewReport({ title: '', date: '', details: '', author: '', severity: '' });
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

  const handleNationalitySearch = (e) => {
    const searchValue = e.target.value;
    setNationalitySearchTerm(searchValue);

    const filtered = countries.filter(country =>
      country.toLowerCase().startsWith(searchValue.toLowerCase())
    );

    setFilteredCountries(filtered);
  };

  const filteredReports = reports.filter(report =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrisoners = prisoners.filter(prisoner =>
    prisoner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics Data
  const totalPrisoners = prisoners.length;
  const crimeCounts = prisoners.reduce((acc, prisoner) => {
    acc[prisoner.crime] = (acc[prisoner.crime] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(crimeCounts),
    datasets: [{
      data: Object.values(crimeCounts),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
    }]
  };

  const barData = {
    labels: ['Total Prisoners'],
    datasets: [{
      label: 'Prisoners Count',
      data: [totalPrisoners],
      backgroundColor: '#42A5F5',
    }]
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Prisoner Management
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
          <ListItem button onClick={() => setStatisticsOpen(true)}>
            <ListItemText primary="Statistics" />
          </ListItem>
          <ListItem button onClick={handleOpen}>
            <ListItemText primary="Add Prisoner" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Prisoner List
        </Typography>

        <TextField
          label="Search Prisoner"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
          Add New Prisoner
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Crime</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPrisoners.map((prisoner, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{prisoner.name}</TableCell>
                  <TableCell>{prisoner.age}</TableCell>
                  <TableCell>{prisoner.crime}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDeletePrisoner(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Adding Prisoner */}
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
                Add New Prisoner
              </Typography>
              <IconButton onClick={handleClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.name}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Age"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={newPrisoner.age}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, age: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Crime"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.crime}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, crime: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Gender"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.gender}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, gender: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Sentence Length"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.sentenceLength}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, sentenceLength: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Release Date"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={newPrisoner.releaseDate}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, releaseDate: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Date of Birth"
                  variant="outlined"
                  fullWidth
                  type="date"
                  value={newPrisoner.dateOfBirth}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, dateOfBirth: e.target.value })}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Nationality"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.nationality}
                  onChange={(e) => {
                    handleNationalitySearch(e);
                    setNewPrisoner({ ...newPrisoner, nationality: e.target.value });
                  }}
                />
                {nationalitySearchTerm && (
                  <Box sx={{ maxHeight: 200, overflow: 'auto', border: '1px solid #ccc', mt: 1 }}>
                    {filteredCountries.map((country, index) => (
                      <ListItem button key={index} onClick={() => {
                        setNewPrisoner({ ...newPrisoner, nationality: country });
                        setNationalitySearchTerm(''); // Clear search term
                        setFilteredCountries(countries); // Reset the list
                      }}>
                        <ListItemText primary={country} />
                      </ListItem>
                    ))}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Medical Conditions"
                  variant="outlined"
                  fullWidth
                  value={newPrisoner.medicalConditions}
                  onChange={(e) => setNewPrisoner({ ...newPrisoner, medicalConditions: e.target.value })}
                />
              </Grid>
            </Grid>
            <Button variant="contained" sx={{ mt: 3 }} onClick={handleAddPrisoner}>
              Add Prisoner
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
            width: 800,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" component="h2">
                Add New Report
              </Typography>
              <IconButton onClick={handleReportsClose} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <TextField
              label="Title"
              variant="outlined"
              fullWidth
              value={newReport.title}
              onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              variant="outlined"
              fullWidth
              type="date"
              value={newReport.date}
              onChange={(e) => setNewReport({ ...newReport, date: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Details"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={newReport.details}
              onChange={(e) => setNewReport({ ...newReport, details: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Author"
              variant="outlined"
              fullWidth
              value={newReport.author}
              onChange={(e) => setNewReport({ ...newReport, author: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Severity"
              variant="outlined"
              fullWidth
              value={newReport.severity}
              onChange={(e) => setNewReport({ ...newReport, severity: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddReport}>
              Add Report
            </Button>
          </Box>
        </Modal>

        {/* Reports Table */}
        <Typography variant="h5" sx={{ mt: 4 }}>
          Reports
        </Typography>
        <TextField
          label="Search Reports"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>{report.title}</TableCell>
                  <TableCell>{report.date}</TableCell>
                  <TableCell>{report.author}</TableCell>
                  <TableCell>{report.severity}</TableCell>
                  <TableCell>{report.details}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteReport(index)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Snackbar for Notifications */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Statistics Section */}
        {statisticsOpen && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5">Statistics</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
              <Pie data={pieData} />
              <Bar data={barData} />
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Prisoner;
