import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock'; // For locked room icon
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // For already allocated icon

const AllocateRoomModal = ({
  openAllocateRoomModal,
  setOpenAllocateRoomModal,
  selectedPrisoner,
}) => {
  const [newRooms, setNewRooms] = useState('');
  const [newBlockNumbers, setNewBlockNumbers] = useState('');
  const [errorState, setErrorState] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [isRoomAllocated, setIsRoomAllocated] = useState(false);

  // Reset form fields
  const resetForm = () => {
    setNewRooms('');
    setNewBlockNumbers('');
    setErrorState('');
    setIsRoomAllocated(false);
  };

  // Fetch blocks based on the selected prisoner's sex
  useEffect(() => {
    if (selectedPrisoner) {
      const fetchBlocks = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/room/blocks/${selectedPrisoner._id}`);
          const data = await response.json();
          if (response.ok) setBlocks(data); // Set available blocks
          else setErrorState(data.message || "Error fetching blocks");
        } catch (err) {
          setErrorState("Error fetching blocks: " + err.message);
        }
      };
      fetchBlocks();
    }
  }, [selectedPrisoner]);

  // Check if the room is already allocated when a block is selected
  useEffect(() => {
    if (newBlockNumbers) {
      const checkRoomAllocation = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/room/allocation-status/${newBlockNumbers}`);
          const data = await response.json();
          if (isRoomAllocated) {
            setIsRoomAllocated(true); 
            
          } else {
            setIsRoomAllocated(false); // Room is available
          }
        } catch (err) {
          setErrorState("Error checking allocation status: " + err.message);
        }
      };

      checkRoomAllocation();
    }
  }, [newBlockNumbers]);

  // Handle room allocation
  const handleRoomAllocation = async () => {
    if (!newBlockNumbers || !newRooms) {
      setErrorState("All fields are required");
      return;
    }

    setLoading(true);
    const allocationData = {
      prisonerId: selectedPrisoner._id,
      blockId: newBlockNumbers,
      crimeType: selectedPrisoner.crimeType,
      sex: selectedPrisoner.sex,
      roomNumber: newRooms,
    };

    try {
      const response = await fetch('http://localhost:4000/api/room/room-allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allocationData),
      });


      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setErrorState('');
        
        alert('Room allocated successfully');

        resetForm();
      } else {
        setLoading(false);
        setErrorState(data.message || "Error allocating room");
      }
    } catch (err) {
      setLoading(false);
      setErrorState("Error allocating room: " + err.message);
    }
  };

  return (
    <Modal
      open={openAllocateRoomModal}
      onClose={() => {
        setOpenAllocateRoomModal(false);
        resetForm();
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Allocate Room
        </Typography>

        {/* Display selected prisoner */}
        <TextField
          label="Prisoner"
          variant="outlined"
          fullWidth
          value={`${selectedPrisoner?.firstname} ${selectedPrisoner?.middlename}`}
          disabled
          sx={{ mb: 2 }}
        />

        {/* Sex Selection (Disabled) */}
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Sex</InputLabel>
          <Select
            value={selectedPrisoner?.sex || ''}
            disabled
            label="Sex"
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
        </FormControl>

        {/* Crime Type */}
        <TextField
          label="Crime Type"
          variant="outlined"
          fullWidth
          value={selectedPrisoner?.crimeType || ''}
          disabled
          sx={{ mb: 2 }}
        />

        {/* Block Selection */}
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Block</InputLabel>
          <Select
            value={newBlockNumbers}
            onChange={(e) => setNewBlockNumbers(e.target.value)}
            label="Block"
            disabled={isRoomAllocated} // Disable if room already allocated
          >
            {blocks.map((block) => (
              <MenuItem key={block._id} value={block._id}>
               {block.name}- {block.blocknumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Room Number */}
        <TextField
          label="Room Number"
          variant="outlined"
          fullWidth
          value={newRooms}
          onChange={(e) => setNewRooms(e.target.value)}
          sx={{ mb: 2 }}
          disabled={isRoomAllocated} // Disable if room already allocated
        />

        {/* Error message */}
        {errorState && <Typography color="error" variant="body2">{errorState}</Typography>}

        {/* Allocate Room Button */}
        <Button
          variant="contained"
          onClick={handleRoomAllocation}
          disabled={loading || isRoomAllocated} // Disable if room already allocated
          startIcon={isRoomAllocated ? <CheckCircleIcon /> : <LockIcon />}
        >
          {loading ? 'Allocating...' : isRoomAllocated ? 'Room Already Allocated' : 'Allocate Room'}
        </Button>

        {/* Close Button */}
        <IconButton
          onClick={() => {
            setOpenAllocateRoomModal(false);
            resetForm();
          }}
          sx={{ position: 'absolute', top: 10, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default AllocateRoomModal;
