const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  staffName: { type: String, required: true },
  staffRole: { type: String, required: true },
  reportDate: { type: Date, required: true },
  content: { type: String, required: true },
  fileUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
