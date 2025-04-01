import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Grid, Avatar, TextField, Select, MenuItem, Button, IconButton, InputAdornment, Snackbar, Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const AddPrisonerModal = ({ openPrisonerModal, setOpenPrisonerModal, editPrisoner, setEditPrisoner, blocks }) => {
  const [newPrisoner, setNewPrisoner] = useState({
    firstname: '',
    middlename: '',
    lastname: '',
    age: '',
    sex: '',
    nationality: '',
    region: '',
    zone: '',
    woreda: '',
    entryDate: '',
    appointmentDate: '',
    releasedDate: '',
    crimeType: '',
    phoneNumber: '',
    releasedCase: '',
    courtName: '',
    mercy: '',
    block: '',
    photo: '', // For the photo
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);  // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Snackbar message
const [error, seterror] = useState(false)
  useEffect(() => {
    if (editPrisoner) {
      setNewPrisoner({
        ...editPrisoner,
        photo: editPrisoner.photo || '',
      });
    }
  }, [editPrisoner]);

  const handleInputChange = (field) => (event) => {
    setNewPrisoner({
      ...newPrisoner,
      [field]: event.target.value,
    });
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhotoFile(file);
      setNewPrisoner({ ...newPrisoner, photo: URL.createObjectURL(file) });
    }
  };

  const handleSavePrisoner = async () => {
    const method = editPrisoner ? 'PUT' : 'POST';
    const url = editPrisoner
      ? `http://localhost:4000/api/prisoner/${editPrisoner._id}` 
      : 'http://localhost:4000/api/prisoner';
  
    try {
      const formData = new FormData();
      formData.append('firstname', newPrisoner.firstname);
      formData.append('middlename', newPrisoner.middlename);
      formData.append('lastname', newPrisoner.lastname);
      formData.append('age', newPrisoner.age);
      formData.append('sex', newPrisoner.sex);
      formData.append('nationality', newPrisoner.nationality);
      formData.append('region', newPrisoner.region);
      formData.append('zone', newPrisoner.zone);
      formData.append('woreda', newPrisoner.woreda);
      formData.append('entryDate', newPrisoner.entryDate);
      formData.append('appointmentDate', newPrisoner.appointmentDate);
  
      // Ensure releasedDate is either a valid date or empty string
      formData.append('releasedDate', newPrisoner.releasedDate || '');
  
      formData.append('crimeType', newPrisoner.crimeType);
      formData.append('phoneNumber', newPrisoner.phoneNumber);
      formData.append('releasedCase', newPrisoner.releasedCase);
      formData.append('courtName', newPrisoner.courtName);
      formData.append('mercy', newPrisoner.mercy);
      formData.append('block', newPrisoner.block);
  
      if (photoFile) {
        formData.append('photo', photoFile);
      }
  
      const response = await fetch(url, {
        method,
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        return;
      }
  
      setSnackbarMessage(editPrisoner ? 'Prisoner updated successfully!' : 'Prisoner added successfully!');
      setSnackbarOpen(true);  // Show snackbar on success
  
      // Reset the form and close modal
      setNewPrisoner({
        firstname: '',
        middlename: '',
        lastname: '',
        age: '',
        sex: '',
        nationality: '',
        region: '',
        zone: '',
        woreda: '',
        entryDate: '',
        appointmentDate: '',
        releasedDate: '',
        crimeType: '',
        phoneNumber: '',
        releasedCase: '',
        courtName: '',
        mercy: '',
        block: '',
        photo: '',
      });
  
      setOpenPrisonerModal(false);
      setEditPrisoner(null);
    } catch (error) {
      console.error('Error saving prisoner:', error);
    }
  };
  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  let myRef = {}
// Example: assuming `blocks` contains a list of block data
const filteredBlocks = blocks.filter((block) => {
  const isSexMatching = block.Sex === newPrisoner.sex;
  const isBlockActive = block.Blockstatus === 'Active';
  const blockSize = Number(block.blocksize);  // Convert blocksize to a number

  const blockOccupancy = block.prisoners ? block.prisoners.length : 0; // Example: adjust this based on your actual data structure

  // Only include blocks where the occupancy is less than the block size
  return isSexMatching && isBlockActive && blockOccupancy < blockSize;
});

  
  

  return (
    <>
      <Modal open={openPrisonerModal} onClose={() => setOpenPrisonerModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '90%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {editPrisoner ? 'Edit Prisoner' : 'Add New Prisoner'}
          </Typography>

          {/* Avatar */}
          <Grid marginBottom={2} container justifyContent="center">
            <Grid item xs={12} sm={2}>
              <Avatar
                alt="Prisoner Photo"
                src={newPrisoner.photo || '/default-avatar.png'}
                sx={{ width: 100, height: 100, margin: '0 auto', cursor: 'pointer' }}
                onClick={() => document.getElementById('photo-input').click()}
              />
              <input
                type="file"
                id="photo-input"
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoChange}
                
              />
            </Grid>
          </Grid>

          {/* Form Fields */}
          <Grid container spacing={3}>
            {/* First Row - Name */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                value={newPrisoner.firstname}
                onChange={handleInputChange('firstname')}
                required
                
                error={error}
                helperText={error ? 'This field is required' : ''}
                
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Middle Name"
                variant="outlined"
                fullWidth
                value={newPrisoner.middlename}
                onChange={handleInputChange('middlename')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                value={newPrisoner.lastname}
                onChange={handleInputChange('lastname')}
              />
            </Grid>

            {/* Second Row - Age, Sex, Nationality */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Age"
                variant="outlined"
                fullWidth
                value={newPrisoner.age}
                onChange={handleInputChange('age')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Select

                label='Sex'
                variant="outlined"
                fullWidth
                value={newPrisoner.sex}
                onChange={handleInputChange('sex')}
              >
               
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Nationality"
                variant="outlined"
                fullWidth
                value={newPrisoner.nationality}
                onChange={handleInputChange('nationality')}
              />
            </Grid>

            {/* Third Row - Region, Zone, Woreda */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Region"
                variant="outlined"
                fullWidth
                value={newPrisoner.region}
                onChange={handleInputChange('region')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Zone"
                variant="outlined"
                fullWidth
                value={newPrisoner.zone}
                onChange={handleInputChange('zone')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Woreda"
                variant="outlined"
                fullWidth
                value={newPrisoner.woreda}
                onChange={handleInputChange('woreda')}
              />
            </Grid>

            {/* Fourth Row - Dates */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Entry Date"
                type="date"
                variant="outlined"
                fullWidth
                value={newPrisoner.entryDate}
                onChange={handleInputChange('entryDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Appointment Date"
                type="date"
                variant="outlined"
                fullWidth
                value={newPrisoner.appointmentDate}
                onChange={handleInputChange('appointmentDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Released Date"
                type="date"
                variant="outlined"
                fullWidth
                value={newPrisoner.releasedDate}
                onChange={handleInputChange('releasedDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            {/* Fifth Row - Crime, Phone, Block */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Crime Type"
                variant="outlined"
                fullWidth
                value={newPrisoner.crimeType}
                onChange={handleInputChange('crimeType')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                value={newPrisoner.phoneNumber}
                onChange={handleInputChange('phoneNumber')}
                InputProps={{
                  startAdornment: <InputAdornment position="start">+1</InputAdornment>,
                }}
              />
            </Grid>

            {/* Block Selection for Editing */}
            {editPrisoner && (
             <Grid item xs={12} sm={4}>
  <Select
    label="Block"
    variant="outlined"
    fullWidth
    value={newPrisoner.block}
    onChange={handleInputChange('block')}
  >
    <MenuItem value="">
      <em>Select Block</em>
    </MenuItem>
    {filteredBlocks.map((block) => (
  <MenuItem key={block._id} value={block.name}>
    {block.name} - {block.blocknumber} (Size: {block.blocksize})
  </MenuItem>
))}
  </Select>
</Grid>

            )}

            {/* Sixth Row - Released Case, Court Name, Mercy */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Released Case"
                variant="outlined"
                fullWidth
                value={newPrisoner.releasedCase}
                onChange={handleInputChange('releasedCase')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Court Name"
                variant="outlined"
                fullWidth
                value={newPrisoner.courtName}
                onChange={handleInputChange('courtName')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Mercy"
                variant="outlined"
                fullWidth
                value={newPrisoner.mercy}
                onChange={handleInputChange('mercy')}
              />
            </Grid>
          </Grid>

          {/* Save/Update Button */}
          <Button variant="contained" onClick={handleSavePrisoner} sx={{ mt: 3 }}>
            {editPrisoner ? 'Update Prisoner' : 'Add Prisoner'}
          </Button>

          {/* Close Button */}
          <IconButton onClick={() => setOpenPrisonerModal(false)} sx={{ position: 'absolute', top: 10, right: 10 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </Modal>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddPrisonerModal;
