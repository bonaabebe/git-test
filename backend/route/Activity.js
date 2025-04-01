const Activity = require('../models/Activity');  
// this activity is for assigning password and username for employee 
router.post('/assign/:userId', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    const existingAccount = await Account.findOne({ employeeId: user._id });
    if (existingAccount) {
      return res.status(400).json({ message: 'Account already assigned to this user' });
    }

    
    const usernameExists = await Account.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = new Account({
      employeeId: user._id,  
      username,
      password: hashedPassword,
    });

    await newAccount.save();


    const activity = new Activity({
      user: user._id,
      action: 'Created Account',
      target: newAccount._id
    });
    await activity.save();

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
module.exports = router;