import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  createTheme,
  styled,
  Avatar,
  Grid
} from '@mui/material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogTitle-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1, 3),
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
});

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '&.MuiButton-contained': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  '&.MuiButton-outlined': {
    borderColor: theme.palette.primary.main,
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const UserCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(2),
  transition: 'box-shadow 0.2s',
  '&:hover': {
    boxShadow: theme.shadows[3],
  },
}));

const AccountManagementModal = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    sex: '',
    role: '',
    educationLevel: '',
    photo: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('');
  const [localSnackbarOpen, setLocalSnackbarOpen] = useState(false);
  const [localSnackbarMessage, setLocalSnackbarMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/employe/fetch');
        const data = await response.json();
        if (response.ok) {
          setUsers(data);
          setFilteredUsers(data);
        } else {
          setLocalSnackbarMessage('Failed to load users');
          setLocalSnackbarOpen(true);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setLocalSnackbarMessage('Error fetching users');
        setLocalSnackbarOpen(true);
      }
    };
    fetchUsers();
  }, []);

  // Filter users based on the search query
  useEffect(() => {
    const results = users.filter(user =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchQuery, users]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photo: file,
      }));
    }
  };

  const handleAssignAccount = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/employe/assign/${selectedUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user._id === updatedUser.account.employeeId ? updatedUser.account : user)));
        setLocalSnackbarMessage('Account assigned successfully');
      } else {
        const errorMessage = await response.text();
        setLocalSnackbarMessage(`Error:Account already assigned to this user`);
      }
      setLocalSnackbarOpen(true);
      handleModalClose();  // Close modal after assignment
    } catch (error) {
      setLocalSnackbarMessage('Error assigning account');
      setLocalSnackbarOpen(true);
    }
  };

  const handleUpdateAccount = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/employe/updateAccount/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
        setLocalSnackbarMessage('Account updated successfully');
      } else {
        setLocalSnackbarMessage('Error updating account');
      }
      setLocalSnackbarOpen(true);
      handleModalClose();
    } catch (error) {
      setLocalSnackbarMessage('Error updating account');
      setLocalSnackbarOpen(true);
    }
  };

  const handleEditUser = async () => {
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/employe/update/${selectedUser._id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
        setLocalSnackbarMessage('User updated successfully');
        handleModalClose();
      } else {
        setLocalSnackbarMessage('Error updating user');
      }
      setLocalSnackbarOpen(true);
    } catch (error) {
      setLocalSnackbarMessage('Error updating user');
      setLocalSnackbarOpen(true);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      sex: '',
      role: '',
      educationLevel: '',
      photo: '',
    });
  };

  const handleSnackbarClose = () => setLocalSnackbarOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 3 }}>
        {/* Search bar */}
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ marginBottom: 2 }}
        />

        {/* Displaying filtered users */}
        {filteredUsers.length === 0 ? (
          <Typography variant="h6" color="textSecondary">
            No users found.
          </Typography>
        ) : (
          filteredUsers.map((user) => (
            <UserCard key={user._id}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={`http://localhost:4000/${user.photo}`} sx={{ width: 40, height: 40, marginRight: 2 }} />
                <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
              </Box>
              <Box>
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({ username: '', password: '' }); // Clear username and password
                    setFormMode('assign');
                    setOpenModal(true);
                  }}
                >
                  Assign Account
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({ username: user.username, password: '' }); // Populate username and password for updating
                    setFormMode('update');
                    setOpenModal(true);
                  }}
                >
                  Update Account
                </StyledButton>
                <StyledButton
                  variant="contained"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData(user); // Populate form data for editing
                    setFormMode('edit');
                    setOpenModal(true);
                  }}
                >
                  Edit
                </StyledButton>
              </Box>
            </UserCard>
          ))
        )}

        {/* Modal and Snackbar */}
        <StyledDialog open={openModal} onClose={handleModalClose}>
          <DialogTitle>{formMode === 'assign' ? 'Assign Account' : formMode === 'update' ? 'Update Account' : 'Edit User'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              {formMode === 'assign' || formMode === 'update' ? (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      variant="outlined"
                      fullWidth
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type="password"
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="First Name"
                      variant="outlined"
                      fullWidth
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Last Name"
                      variant="outlined"
                      fullWidth
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Sex</InputLabel>
                      <Select
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        label="Sex"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
  <InputLabel>Role</InputLabel>
  <Select
    name="role"
    value={formData.role}
    onChange={handleChange}
    label="Role"
  >
    <MenuItem value="Admin">Admin</MenuItem>
    <MenuItem value="Staff Member">Staff Member</MenuItem>
    <MenuItem value="Prison Manager">Prison Manager</MenuItem>
  </Select>
</FormControl>

                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Education Level</InputLabel>
                      <Select
                        name="educationLevel"
                        value={formData.educationLevel}
                        onChange={handleChange}
                        label="Education Level"
                      >
                        <MenuItem value="High School">High School</MenuItem>
                        <MenuItem value="Diploma">Diploma</MenuItem>
                        <MenuItem value="Degree">Degree</MenuItem>
                        <MenuItem value="MA">MA</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>Photo</Typography>
                    <Avatar
                      src={formData.photo instanceof File ? URL.createObjectURL(formData.photo) : '/default-avatar.png'}
                      sx={{ width: 80, height: 80, marginBottom: 2 }}
                    />
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                    >
                      Upload Photo
                      <input
                        type="file"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleModalClose} color="secondary">
              Cancel
            </Button>
            <StyledButton
              variant="contained"
              onClick={formMode === 'assign' ? handleAssignAccount : formMode === 'update' ? handleUpdateAccount : handleEditUser}
            >
              {formMode === 'assign' ? 'Assign' : formMode === 'update' ? 'Update' : 'Save Changes'}
            </StyledButton>
          </DialogActions>
        </StyledDialog>

        <Snackbar
          open={localSnackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {localSnackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default AccountManagementModal;
