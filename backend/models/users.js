const mongoose = require('mongoose');

// Define the allowed values for the educationLevel field
const educationLevels = ['High School', 'Diploma', 'Degree', 'MA'];

// Define the allowed values for the role field
const validRoles = ['Admin', 'Staff Member', 'Prison Manager'];

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  sex: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: validRoles, // Only these roles are allowed
  },
  educationLevel: {
    type: String,
    required: true,
    enum: educationLevels,  // Use the enum validator with the predefined array
  },
  photo: { type: String }, 
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // Reference to Account model
});

module.exports = mongoose.model('User', UserSchema);
