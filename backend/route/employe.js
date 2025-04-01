const express = require('express');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/users');  // Import User model
const Account = require('../models/AccountSchema');  // Import Account model
const Activity = require('../models/Activity');  // Adjust the path as necessary

const { parse } = require('json2csv'); 
const app = express();
const router = express.Router();

// Configure multer to store files in the 'uploads' directory
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify the folder to save uploaded files
  },
  filename: (req, file, cb) => {
    // Create a unique filename based on the timestamp and the original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer setup with a file size limit (e.g., 10MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit to 10 MB
}).single('photo');  // Expect only a single file under the 'photo' field in the request

// Increase the body size limit for large payloads
app.use(express.json({ limit: '100mb' }));  // Increase limit for JSON data
app.use(express.urlencoded({ limit: '100mb', extended: true }));  // Increase limit for URL-encoded data

// Fetch all users
router.get('/fetch', async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);  // Respond with the list of users
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});
router.put('/update/:id', upload, async (req, res) => {
  const { firstName, lastName, phone, sex, role, educationLevel } = req.body;
  const photo = req.file ? req.file.path : undefined;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (sex) user.sex = sex;
    if (role) user.role = role;
    if (educationLevel) user.educationLevel = educationLevel;
    if (photo) user.photo = photo;

    // Save the updated user
    await user.save();

    // Log the activity of profile update
    const activity = new Activity({
      user: user._id,
      action: 'Updated Profile',
      target: user._id
    });
    await activity.save();

    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/assign/:userId', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has an account
    const existingAccount = await Account.findOne({ employeeId: user._id });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account already assigned to this user' });
    }

    // Check if the username is already taken
    const usernameExists = await Account.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = new Account({
      employeeId: user._id,  // Link to the User model
      username,
      password: hashedPassword,
    });

    await newAccount.save();

    // Log the activity of account creation
    const activity = new Activity({
      user: user._id,
      action: 'Created Account',
      target: newAccount._id
    });
    await activity.save();

    // Now associate the newly created account with the user
    user.account = newAccount._id;
    await user.save();

    res.status(201).json({
      message: 'Account assigned successfully',
      account: newAccount,
    });
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/updateAccount/:userId', async (req, res) => {
  const { username, password } = req.body;
  console.log('Updating account with data:', req.body);  // Log incoming data
  
  try {
    const user = await User.findById(req.params.userId).populate('account');
    if (!user || !user.account) {
      console.log('User or account not found');
      return res.status(404).json({ message: 'User or account not found' });
    }

    const updatedAccountData = {};
    if (username) updatedAccountData.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedAccountData.password = await bcrypt.hash(password, salt);
    }

    // Ensure updatedAt is set
    const updatedAccount = await Account.findByIdAndUpdate(user.account._id, updatedAccountData, { 
      new: true,    // Return the updated document
      runValidators: true  // Ensure the validators are run on the update
    });

    console.log('Updated Account:', updatedAccount);  // Log updated account data

    res.status(200).json({ message: 'Account updated successfully', account: updatedAccount });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




// Delete User (and associated Account)
router.delete('/delete/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const account = await Account.findOneAndDelete({ employeeId: user._id });
    if (account) {
      console.log('Associated account deleted:', account);
    }

    await user.remove();

    res.json({ message: 'User and associated account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/summary', async (req, res) => {
  try {
    // Count of all users
    const totalEmployees = await User.countDocuments();

    // Count of all accounts
    const totalAccounts = await Account.countDocuments();

    // Count accounts that were updated in the last 30 days
    const updatedAccounts = await Account.countDocuments({
      updatedAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) }  // Accounts updated in the last 30 days
    });
    res.json({
      totalEmployees,
      totalAccounts,
      updatedAccounts,  // This will reflect the updated accounts correctly now
    });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.status(500).json({ message: 'Failed to fetch report data' });
  }
});
router.get('/recent-activities', async (req, res) => {
  try {
    // Fetch recent activities, limit to 5 most recent
    const activities = await Activity.find()
      .populate('user', 'firstName lastName') // Populating user details for display
      .sort({ createdAt: -1 })  // Sort by most recent
      .limit(5);  // Get only the 5 most recent activities

    res.status(200).json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Failed to fetch recent activities' });
  }
});


// Export the router
module.exports = router;
