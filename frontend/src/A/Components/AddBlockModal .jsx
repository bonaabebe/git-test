import React from 'react';
import { Modal, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AddBlockModal = ({ open, handleClose, Block, SetBlock, handleAddBlock }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Add New Block
        </Typography>
        
        <TextField
          label="Block Name"
          variant="outlined"
          fullWidth
          value={Block.name}
          onChange={(e) => SetBlock({ ...Block, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Block Number"
          variant="outlined"
          fullWidth
          value={Block.blocknumber}
          onChange={(e) => SetBlock({ ...Block, blocknumber: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        <TextField
          label="Block Size"
          variant="outlined"
          fullWidth
          value={Block.blocksize}
          onChange={(e) => SetBlock({ ...Block, blocksize: e.target.value })}
          sx={{ mb: 2 }}
        />
        
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Sex</InputLabel>
          <Select
            name="sex"
            value={Block.Sex}
            onChange={(e) => SetBlock({ ...Block, Sex: e.target.value })}
            label="Sex"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Block Status</InputLabel>
          <Select
            name="Status"
            value={Block.Blockstatus}
            onChange={(e) => SetBlock({ ...Block, Blockstatus: e.target.value })}
            label="Block Status"
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleAddBlock} fullWidth>
          Add Block
        </Button>

        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default AddBlockModal;
