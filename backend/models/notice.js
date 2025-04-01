const mongoose = require('mongoose');

// Define a schema for the Notice
const noticeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now, // Default to current date if no date is provided
  },
  expiredDate: {
    type: Date,
    required: true,
  },
  toWhom: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' fields

// Create the Notice model from the schema
const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
