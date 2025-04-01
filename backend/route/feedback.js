const express = require('express');
const Feedback = require('../models/feedback');
const User =require('../models/users')
const router = express.Router();

// Create Feedback
router.post('/create', async (req, res) => {
  const { name, email, message } = req.body;
   
  try {
    // const Users=new User.find({name,email})
    if(!name && !email) return alert('register before you give feedback')
     const newFeedback = new Feedback({ name, email, message });
     await newFeedback.save();
     res.status(201).json({ message: 'Feedback submitted successfully' });

   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Feedback
router.get('/', async (req, res) => {
  try {
    const feedbackList = await Feedback.find();
    res.json(feedbackList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
