import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  IconButton,
  Avatar,
  Grid,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Define roles and education levels
const roles = ['Admin', 'Staff Member', 'Prison Manager'];
const educationLevels = ['High School', 'Diploma', 'Degree', 'MA'];

const UserManagementModal = ({ open, onClose }) => {
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    sex: '',
    role: '',
    educationLevel: '',
    photo: null,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  // Validate the form fields
  const validateFields = () => {
    const { firstName, lastName, sex, role, educationLevel, phone } = newUser;
    const phonePattern = /^[0-9]{10}$/;
    return (
      firstName && 
      lastName && 
      sex && 
      phone && phonePattern.test(phone) &&
      role && 
      educationLevel
    );
  };

  // Handle adding the new user
  const handleAddUser = async () => {
    if (validateFields()) {
      const formData = new FormData();
      Object.keys(newUser).forEach((key) => {
        if (key === 'photo' && newUser[key]) {
          formData.append(key, newUser[key]);
        } else if (key !== 'photo') {
          formData.append(key, newUser[key]);
        }
      });

      try {
        setLoading(true);  // Start loading state
        const response = await fetch('http://localhost:4000/api/auth/register', {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();

        if (response.ok) {
          setSnackbarMessage('User added successfully!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          resetForm();
          onClose();
        } else {
          setSnackbarMessage(result.message || 'Failed to add user.');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarMessage('An error occurred. Please try again later.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);  // End loading state
      }
    } else {
      setSnackbarMessage('All fields are required and must be valid!');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setNewUser({ ...newUser, photo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewPhoto(reader.result);
      };
      reader.readAsDataURL(file);
      setSnackbarMessage('Photo uploaded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage('Please upload a valid image file.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setNewUser({
      firstName: '',
      lastName: '',
      phone: '',
      sex: '',
      role: '',
      educationLevel: '',
      photo: null,
    });
    setPreviewPhoto(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: '#fff',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
          Add New User
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={4}>
            <label htmlFor="avatar-upload">
              <input
                id="avatar-upload"
                type="file"
                hidden
                onChange={handlePhotoUpload}
              />
              <Avatar
                src={previewPhoto}
                sx={{ width: 100, height: 100, cursor: 'pointer', border: '2px solid #3f51b5', boxShadow: 2 }}
                alt="User Photo"
              />
            </label>
          </Grid>

          <Grid item xs={8}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#3f51b5',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#3f51b5',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  variant="outlined"
                  fullWidth
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  required
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#3f51b5',
                      },
                      '&:hover fieldset': {
                        borderColor: '#1e88e5',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#3f51b5',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1e88e5',
                    },
                  },
                }}>
                  <InputLabel htmlFor="sex">Sex</InputLabel>
                  <Select
                    id="sex"
                    value={newUser.sex}
                    onChange={(e) => setNewUser({ ...newUser, sex: e.target.value })}
                    label="Sex"
                    required
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#3f51b5',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1e88e5',
                    },
                  },
                }}>
                  <InputLabel htmlFor="role">Role</InputLabel>
                  <Select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    label="Role"
                    required
                  >
                    {roles.map((role) => (
                      <MenuItem key={role} value={role}>{role}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" sx={{
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#3f51b5',
                    },
                    '&:hover fieldset': {
                      borderColor: '#1e88e5',
                    },
                  },
                }}>
                  <InputLabel htmlFor="education-level">Education Level</InputLabel>
                  <Select
                    id="education-level"
                    value={newUser.educationLevel}
                    onChange={(e) => setNewUser({ ...newUser, educationLevel: e.target.value })}
                    label="Education Level"
                    required
                  >
                    {educationLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleAddUser}
            sx={{
              backgroundColor: '#3f51b5',
              color: '#fff',
              '&:hover': { backgroundColor: '#303f9f' },
              borderRadius: 20,
              padding: '10px 20px',
              boxShadow: 2,
            }}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            onClick={resetForm}
            sx={{
              borderColor: '#3f51b5',
              color: '#3f51b5',
              '&:hover': { borderColor: '#1e88e5', color: '#1e88e5' },
              borderRadius: 20,
              padding: '10px 20px',
              boxShadow: 2,
            }}
          >
            Reset
          </Button>
        </Box>

        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#3f51b5' }}>
          <CloseIcon />
        </IconButton>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};

export default UserManagementModal;
