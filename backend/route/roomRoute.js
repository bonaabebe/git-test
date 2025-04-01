const express = require('express');
const router = express.Router();
const RoomAllocation = require('../models/RoomAllocation');
const Block = require('../models/Block');
const Prisoner = require('../models/Prisoner');

// Endpoint to fetch blocks based on the prisoner's sex
router.get('/blocks/:prisonerId', async (req, res) => {
  const prisonerId = req.params.prisonerId;

  try {
    const prisoner = await Prisoner.findById(prisonerId);
    if (!prisoner) {
      return res.status(404).json({ message: 'Prisoner not found' });
    }

    const blocks = await Block.find({
      Sex: prisoner.sex,
      Blockstatus: 'Active',
    });

    // Ensure that the block size is not exceeded
    const availableBlocks = [];
    for (let block of blocks) {
      const existingAllocations = await RoomAllocation.find({ blockId: block._id });
      if (existingAllocations.length < block.blocksize) {
        availableBlocks.push(block);
      }
    }

    res.json(availableBlocks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blocks', error: err });
  }
});

// Endpoint to create a new room allocation
router.post('/room-allocation', async (req, res) => {
  const { prisonerId, blockId, crimeType, sex, roomNumber } = req.body;

  // Validate the input
  if (!prisonerId || !blockId || !crimeType || !sex || !roomNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if prisonerId and blockId exist in the database
    const prisoner = await Prisoner.findById(prisonerId);
    if (!prisoner) {
      return res.status(404).json({ message: 'Prisoner not found' });
    }

    const block = await Block.findById(blockId);
    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    // Check if the block has room available based on block size
    const currentAllocations = await RoomAllocation.find({ blockId: block._id });
    if (currentAllocations.length >= block.blocksize) {
      return res.status(400).json({ message: 'This block is full' });
    }

    // Check if the prisoner already has a room allocation
    const existingAllocation = await RoomAllocation.findOne({ prisonerId });
    if (existingAllocation) {
      return res.status(400).json({ message: 'This prisoner is already assigned to a room and block' });
    }

    // Create a new room allocation document
    const newRoomAllocation = new RoomAllocation({
      prisonerId,
      blockId,
      crimeType,
      sex,
      roomNumber,
    });

    // Save the new room allocation to the database
    await newRoomAllocation.save();

    // Return the created room allocation
    res.status(201).json(newRoomAllocation);
  } catch (err) {
    console.error('Error creating room allocation:', err);
    res.status(500).json({ message: 'Error creating room allocation', error: err });
  }
});


// Endpoint to check if a room is already allocated
router.get('/allocation-status/:blockId', async (req, res) => {
  const blockId = req.params.blockId;

  try {
    const allocation = await RoomAllocation.findOne({ blockId });

    if (allocation) {
      res.json({ isAllocated: true });
    } else {
      res.json({ isAllocated: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error checking allocation status', error: err });
  }
});

module.exports = router;
