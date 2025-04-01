const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  blocknumber:{type:String,required:true},
  blocksize:{type:String,required:true},
  Sex:{type:String,enum:['Female','Male'],required:true},
  Blockstatus:{type:String,enum:['Active','Inactive'],required:true},

});

module.exports = mongoose.model('Block', blockSchema);