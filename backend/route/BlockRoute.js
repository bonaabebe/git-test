const express = require('express');
const router = express.Router();
const Block = require('../models/Block');

// Get all blocks
router.get('/', async (req, res) => {
  try {
    const blocks = await Block.find();
    res.json(blocks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new block
router.post('/', async (req, res) => {
  const block = new Block({
    name: req.body.name,
    blocknumber:req.body.blocknumber,
    blocksize:req.body.blocksize,
    Sex:req.body.Sex,
    Blockstatus:req.body.Blockstatus
  });

  try {
    const newBlock = await block.save();
    res.status(201).json(newBlock);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a block
router.delete('/:id', async (req, res) => {
  try {
    const block = await Block.findById(req.params.id);
    if (!block) return res.status(404).json({ message: 'Block not found' });

    await block.remove();
    res.json({ message: 'Block deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;