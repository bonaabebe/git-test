const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Activity Schema to log user actions
const activitySchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  action: {
    type: String,
    required: true
  },
  target: {
    type: String,  // Optional: could store the target user or entity involved
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
