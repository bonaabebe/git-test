const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: String,
  password: String,
}, { timestamps: true }); 
const Account = mongoose.model('Account', accountSchema);  
module.exports = Account; 