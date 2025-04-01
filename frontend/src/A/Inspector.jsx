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
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const drawerWidth = 240;

const Inspector = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [inspections, setInspections] = useState([]);
  const [newInspection, setNewInspection] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [activeSection, setActiveSection] = useState('inspections');
  const [selectedInspectionIndex, setSelectedInspectionIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalStaffWorkers, setTotalStaffWorkers] = useState(10); // Example staff count

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddInspection = () => {
    if (newInspection.trim() && reportDetails.trim()) {
      setInspections([...inspections, { description: newInspection, report: reportDetails }]);
      setNewInspection('');
      setReportDetails('');
      handleClose();
      setSnackbarOpen(true);
    } else {
      alert("Both fields are required!");
    }
  };

  const handleEditInspection = () => {
    if (selectedInspectionIndex !== null && newInspection.trim() && reportDetails.trim()) {
      const updatedInspections = [...inspections];
      updatedInspections[selectedInspectionIndex] = {
        description: newInspection,
        report: reportDetails,
      };
      setInspections(updatedInspections);
      setNewInspection('');
      setReportDetails('');
      handleEditClose();
      setSnackbarOpen(true);
    } else {
      alert("Both fields are required!");
    }
  };

  const handleDeleteInspection = (index) => {
    const updatedInspections = inspections.filter((_, i) => i !== index);
    setInspections(updatedInspections);
    setSnackbarOpen(true);
  };

  const filteredInspections = inspections.filter(inspection =>
    inspection.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'inspections':
        return (
          <Box>
            <TextField
              label="Search Inspections"
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
                    <TableCell>Inspection ID</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Report</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInspections.map((inspection, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{inspection.description}</TableCell>
                      <TableCell>{inspection.report}</TableCell>
                      <TableCell>
                        <Button variant="outlined" onClick={() => {
                          setSelectedInspectionIndex(index);
                          setNewInspection(inspection.description);
                          setReportDetails(inspection.report);
                          handleEditOpen();
                        }}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteInspection(index)} sx={{ ml: 1 }}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      case 'reports':
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Inspection Reports</Typography>
            {inspections.length === 0 ? (
              <Typography>No reports available.</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Inspection ID</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Report</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {inspections.map((inspection, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{inspection.description}</TableCell>
                        <TableCell>{inspection.report}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        );

      case 'statistics':
        const totalInspections = inspections.length;

        // Sample data for the bar graph
        const barData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Inspections Conducted',
              data: [12, 19, 3, 5, 2, 3], // Sample data
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ],
        };

        // Sample data for the line chart
        const lineData = {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Inspection Trends',
              data: [5, 9, 4, 7, 6, 10], // Sample data
              fill: false,
              borderColor: 'rgba(255, 99, 132, 1)',
              tension: 0.1,
            },
          ],
        };

        // Sample data for the pie chart
        const pieData = {
          labels: ['Passed', 'Failed', 'Pending'],
          datasets: [
            {
              label: 'Inspection Status',
              data: [60, 30, 10], // Sample data
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)',
                'rgba(255, 206, 86, 0.6)',
              ],
            },
          ],
        };

        const chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Inspection Statistics',
            },
          },
          maintainAspectRatio: false,
        };

        return (
          <Box>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            <Grid container spacing={2}>
              {/* Row for cards */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Total Staff Workers</Typography>
                    <Typography variant="h6">{totalStaffWorkers}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>Total Inspections Conducted</Typography>
                    <Typography variant="h6">{totalInspections}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Row for charts */}
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '200px' }}>
                  <Pie data={pieData} options={chartOptions} />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '200px' }}>
                  <Bar data={barData} options={chartOptions} />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ height: '200px' }}>
                  <Line data={lineData} options={chartOptions} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Inspector Dashboard
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
          <ListItem button onClick={() => setActiveSection('inspections')}>
            <ListItemText primary="Inspections" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('reports')}>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('statistics')}>
            <ListItemText primary="Statistics" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, Inspector!
        </Typography>
        {renderActiveSection()}

        {/* Modal for Adding Inspections */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" component="h2">
              Add New Inspection
            </Typography>
            <TextField
              label="Inspection Description"
              variant="outlined"
              fullWidth
              value={newInspection}
              onChange={(e) => setNewInspection(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Report Details"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" onClick={handleAddInspection} sx={{ mt: 2 }}>
              Submit
            </Button>
          </Box>
        </Modal>

        {/* Modal for Editing Inspections */}
        <Modal open={editOpen} onClose={handleEditClose}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" component="h2">
              Edit Inspection
            </Typography>
            <TextField
              label="Inspection Description"
              variant="outlined"
              fullWidth
              value={newInspection}
              onChange={(e) => setNewInspection(e.target.value)}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Report Details"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button variant="contained" onClick={handleEditInspection} sx={{ mt: 2 }}>
              Update
            </Button>
          </Box>
        </Modal>

        {/* Snackbar for Feedback */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            Inspection {selectedInspectionIndex !== null ? 'updated' : 'added'} successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Inspector;
