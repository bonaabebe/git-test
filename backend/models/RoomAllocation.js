const mongoose = require('mongoose');

const roomAllocationSchema = new mongoose.Schema({
  prisonerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prisoner',
    required: true,
  },
  blockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Block',
    required: true,
  },
  crimeType: { type: String, required: true },
  sex: { type: String, enum: ['Male', 'Female'], required: true },
  roomNumber: { type: String, required: true }  // New roomNumber field
});

module.exports = mongoose.model('RoomAllocation', roomAllocationSchema);
