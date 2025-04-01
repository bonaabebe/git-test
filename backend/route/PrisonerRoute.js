const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Prisoner = require('../models/Prisoner'); 
const cors = require('cors');
const router = express.Router();

// Use CORS middleware
router.use(cors());

// Ensure uploads directory exists
const uploadDir = 'prisoners/'; // Directory where files will be stored
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });  // Ensure the directory is created if it doesn't exist
  console.log('Uploads directory created:', uploadDir);
} else {
  console.log('Uploads directory already exists:', uploadDir);
}

// Set up multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);  // Save files in the 'prisoners' directory
  },
  filename: function (req, file, cb) {
    // Ensure the filename is unique (timestamp + original filename)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extname = path.extname(file.originalname); // Get file extension
    cb(null, uniqueSuffix + extname);  // Save with unique name and correct extension
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);  // Accept the file if it is an image
    } else {
      cb(new Error('Only image files are allowed.'));  // Reject if not an image
    }
  },
});

// Middleware to increase JSON body limit
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ limit: '10mb', extended: true }));

// Register a new prisoner (with photo upload)
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    // Extract form data and handle file upload
    const {
      firstname,
      middlename,
      lastname,
      age,
      sex,
      nationality,
      region,
      zone,
      woreda,
      entryDate,
      appointmentDate,
      releasedDate,
      crimeType,
      phoneNumber,
      releasedCase,
      courtName,
      mercy,
    } = req.body;

    // Handle the uploaded photo file
    const photo = req.file ? req.file.path : null;  // Store the relative file path

    console.log('Uploaded file path:', photo);  // Log the file path for debugging

    // Create a new prisoner document
    const prisoner = new Prisoner({
      firstname,
      middlename,
      lastname,
      age,
      sex,
      nationality,
      region,
      zone,
      woreda,
      entryDate,
      appointmentDate,
      releasedDate,
      crimeType,
      phoneNumber,
      releasedCase,
      courtName,
      mercy,
      photo,  // Store the file path in the database
    });

    // Save the prisoner to the database
    const newPrisoner = await prisoner.save();
    res.status(201).json({ message: 'Prisoner added successfully', prisoner: newPrisoner });

  } catch (err) {
    console.error('Upload error:', err);  // Log the error for debugging
    if (err instanceof multer.MulterError) {
      // Handle specific multer errors
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else {
      // Handle general errors
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
  }
});

// Custom error handler for multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
  next();
});


router.use('/uploads', express.static(path.join(__dirname, 'prisoners'))); // Serve from 'prisoners' folder

// Fetch all prisoners with photo URL
router.get('/', async (req, res) => {
  try {
    // Fetch all prisoners from the database
    const prisoners = await Prisoner.find();

    // Map over the prisoners and add the full URL to the photo
    const updatedPrisoners = prisoners.map((prisoner) => {
      const photoUrl = prisoner.photo ? `/uploads/${path.basename(prisoner.photo)}` : null;
      return {
        ...prisoner.toObject(),
        photoUrl, // Adding the full photo URL
      };
    });

    res.status(200).json(updatedPrisoners); // Send the updated list of prisoners
  } catch (err) {
    res.status(500).json({ message: 'Error fetching prisoners', error: err.message });
  }
});


router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const prisonerId = req.params.id;
    
    // Extract the updated data from the request body
    const {
      firstname,
      middlename,
      lastname,
      age,
      sex,
      nationality,
      region,
      zone,
      woreda,
      entryDate,
      appointmentDate,
      releasedDate,
      crimeType,
      phoneNumber,
      releasedCase,
      courtName,
      mercy,
      block,
    } = req.body;

    // Ensure releasedDate is either a valid Date or null
    const validReleasedDate = releasedDate && new Date(releasedDate) !== "Invalid Date" ? new Date(releasedDate) : null;

    // Check if a new photo was uploaded
    let updatedPhoto = req.file ? req.file.path : null;

    // Fetch the existing prisoner from the database
    const prisoner = await Prisoner.findById(prisonerId);
    if (!prisoner) {
      return res.status(404).json({ message: 'Prisoner not found' });
    }

    // If no new photo is provided, keep the existing photo
    updatedPhoto = updatedPhoto || prisoner.photo;

    // Update the prisoner's details
    prisoner.firstname = firstname || prisoner.firstname;
    prisoner.middlename = middlename || prisoner.middlename;
    prisoner.lastname = lastname || prisoner.lastname;
    prisoner.age = age || prisoner.age;
    prisoner.sex = sex || prisoner.sex;
    prisoner.nationality = nationality || prisoner.nationality;
    prisoner.region = region || prisoner.region;
    prisoner.zone = zone || prisoner.zone;
    prisoner.woreda = woreda || prisoner.woreda;
    prisoner.entryDate = entryDate || prisoner.entryDate;
    prisoner.appointmentDate = appointmentDate || prisoner.appointmentDate;
    prisoner.releasedDate = validReleasedDate || prisoner.releasedDate; // Handle releasedDate
    prisoner.crimeType = crimeType || prisoner.crimeType;
    prisoner.phoneNumber = phoneNumber || prisoner.phoneNumber;
    prisoner.releasedCase = releasedCase || prisoner.releasedCase;
    prisoner.courtName = courtName || prisoner.courtName;
    prisoner.mercy = mercy || prisoner.mercy;
    prisoner.block = block || prisoner.block;
    prisoner.photo = updatedPhoto; // Update the photo path if a new one is provided

    // Save the updated prisoner document
    const updatedPrisoner = await prisoner.save();

    res.status(200).json({
      message: 'Prisoner updated successfully',
      prisoner: updatedPrisoner,
    });
  } catch (err) {
    console.error('Error updating prisoner:', err);
    return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});


module.exports = router;
