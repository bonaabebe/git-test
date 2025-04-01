const mongoose = require('mongoose');

// Define the schema for the Prisoner model
const prisonerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  middlename: {
    type: String,
    required: false, // Optional field
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  sex: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  woreda: {
    type: String,
    required: true,
  },
  entryDate: {
    type: Date,
    required: true,
  },
  appointmentDate: {
    type: Date,
    required: false, // Optional field
  },
  releasedDate: {
    type: Date,
    required: false, // Optional field
  },
  crimeType: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  photo: {
    type: String, // Base64 encoded string for the photo
    required: false, // Optional field
  },
  releasedCase: {
    type: String,
    required: false, // Optional field
  },
  courtName: {
    type: String,
    required: false, // Optional field
  },
  mercy: {
    type: String,
    required: false, // Optional field
  },
  block: {
    type: String,
    required: false,
  },
});

// Create a model from the schema
const Prisoner = mongoose.model('Prisoner', prisonerSchema);

module.exports = Prisoner;
