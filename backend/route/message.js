const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// POST route to submit a contact message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new message entry in the database
    const newMessage = new Message({
      name,
      email,
      message,
    });

    // Save the message to the database
    await newMessage.save();

    // Respond with a success message
    res.status(201).json({ message: 'Message submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch all testimonials/messages
router.get('/testimonials', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
