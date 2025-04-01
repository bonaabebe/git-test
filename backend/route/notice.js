const express = require('express');
const mongoose = require('mongoose');
const Notice = require('../models/notice'); // Path to your Notice model

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    // Fetch all notices from the database and sort them by date in descending order
    const notices = await Notice.find().sort({ date: -1 });
    res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notices', message: error.message });
  }
});

// Route to post a new notice
router.post('/', async (req, res) => {
  try {
    // Destructure the incoming request body to extract the notice fields
    const { date, expiredDate, toWhom, title, content } = req.body;

    // Create a new Notice document
    const newNotice = new Notice({
      date,
      expiredDate,
      toWhom,
      title,
      content,
    });

    // Save the new notice to the database
    await newNotice.save();

    // Respond with the newly created notice
    res.status(201).json({ message: 'Notice posted successfully!', notice: newNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to post notice', message: error.message });
  }
});


// Route to update an existing notice (optional)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get notice ID from URL params
    const { date, expiredDate, toWhom, title, content } = req.body;

    // Find the notice by ID and update it with new data
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      { date, expiredDate, toWhom, title, content },
      { new: true } // Return the updated document
    );

    if (!updatedNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.status(200).json({ message: 'Notice updated successfully!', notice: updatedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update notice', message: error.message });
  }
});

// Route to delete a notice (optional)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get notice ID from URL params
    const deletedNotice = await Notice.findByIdAndDelete(id);

    if (!deletedNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.status(200).json({ message: 'Notice deleted successfully!', notice: deletedNotice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete notice', message: error.message });
  }
});

module.exports = router;
