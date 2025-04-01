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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  Grid,
  TextField,
  Button,
  Modal,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Pie, Bar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import countries from './data'; // Assuming this is still needed in your code.

const drawerWidth = 240;

const Admin = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [prisoners, setPrisoners] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', phone: '', role: '' });
  const [openUserModal, setOpenUserModal] = useState(false);

  const roles = ['Admin', 'Inspector', 'Officer', 'Viewer']; // Define your roles here

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const filteredPrisoners = prisoners.filter(prisoner =>
    prisoner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    if (newUser.username && newUser.email && newUser.phone && newUser.role) {
      setUsers([...users, newUser]);
      setNewUser({ username: '', email: '', phone: '', role: '' });
      setOpenUserModal(false);
      setSnackbarMessage('User added successfully!');
      setSnackbarOpen(true);
    } else {
      alert("All fields are required!");
    }
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    setSnackbarMessage('User deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleExportReports = () => {
    const reportData = prisoners.map(prisoner => `${prisoner.name},${prisoner.crime}`).join('\n');
    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prisoner_report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
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
          <ListItem button component={Link} to="/commissioner">
            <ListItemText primary="Commissioner" />
          </ListItem>
          <ListItem button component={Link} to="/inspector">
            <ListItemText primary="Inspector" />
          </ListItem>
          <ListItem button component={Link} to="/prisoner">
            <ListItemText primary="Prisoner" />
          </ListItem>
          <ListItem button component={Link} to="/feedback">
            <ListItemText primary="Feedback" />
          </ListItem>
          <ListItem button onClick={() => setOpenUserModal(true)}>
            <ListItemText primary="User Management" />
          </ListItem>
          <ListItem button onClick={handleExportReports}>
            <ListItemText primary="View Reports" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Prisoner Management
        </Typography>
        <TextField
          label="Search Prisoner"
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
                    <Button variant="outlined" color="error" onClick={() => {
                      const updatedPrisoners = prisoners.filter((_, i) => i !== index);
                      setPrisoners(updatedPrisoners);
                      setSnackbarMessage('Prisoner deleted successfully!');
                      setSnackbarOpen(true);
                    }}>
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

        {/* User Management Modal */}
        <Modal open={openUserModal} onClose={() => setOpenUserModal(false)}>
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
            <Typography variant="h6" component="h2" gutterBottom>
              Add New User
            </Typography>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Select
              label="Role"
              variant="outlined"
              fullWidth
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              sx={{ mb: 2 }}
            >
              <MenuItem value=""><em>Select Role</em></MenuItem>
              {roles.map((role) => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
            <Button variant="contained" onClick={handleAddUser}>
              Add User
            </Button>
            <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
              Existing Users
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <Button variant="outlined" color="error" onClick={() => handleDeleteUser(index)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <IconButton onClick={() => setOpenUserModal(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default Admin;
