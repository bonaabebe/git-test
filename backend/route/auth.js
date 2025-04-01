const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const Account = require('../models/AccountSchema');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set destination folder for uploaded photos
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Set file name to include a timestamp to avoid conflicts
    cb(null, Date.now() + '-' + file.originalname);
  },
});




// Initialize multer with the storage configuration
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    // Ensure the uploaded file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

// Register route with multer's middleware to handle photo upload
router.post('/register', upload.single('photo'), async (req, res) => {
  // Get the fields from req.body and the file path from multer
  const { firstName, lastName, phone, sex, role, educationLevel } = req.body;
  const photo = req.file ? req.file.path : null; 

  try {
    // Create new user object
    const newUser = new User({
      firstName,
      lastName,
      phone,
      sex,
      role,
      educationLevel,
      photo, // Save the photo file path to the database
    });

    // Save the new user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    // Log error and respond
    console.error('Error during user creation:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});





router.post('/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  try {
    // Search for user by username, not name
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare hashed password with bcrypt
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Retrieve associated user information
    const user = await User.findOne({ account: account._id });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the response with the token and user role
    res.json({
      token,
      user: {
        username: account.username, // Return username
        name: user.firstName + ' ' + user.lastName, // Full name
        role: user.role,  // User role
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret key
    req.userId = decoded.id;  // Attach userId to the request object
    next(); // Call the next middleware or route handler
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token' });
  }
};




router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // Assuming the user ID is stored in req.userId after JWT verification

    // Fetch the user from the User model (to get role, education level, etc.)
    const user = await User.findById(userId).select('role phone educationLevel photo account');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the associated account information (to get the username)
    const account = await Account.findOne({ _id: user.account }).select('username');
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Ensure the profile picture URL is absolute (so frontend can use it directly)
    if (user.photo) {
      user.photo = `${req.protocol}://${req.get('host')}/${user.photo}`;
    }

    // Respond with the required fields
    res.status(200).json({
      username: account.username,  // Get the username from the Account model
      photo: user.photo,  // Profile photo URL
      role: user.role,  // Role from User model
      phone: user.phone,  // Phone from User model
      educationLevel: user.educationLevel,  // Education level from User model
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});




module.exports = router;
