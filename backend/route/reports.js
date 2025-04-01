const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');  // Adjust according to your actual model path

const router = express.Router();

// Set up Multer storage to save files in the 'reports' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'reports'); 
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // Create directory if it doesn't exist
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Get file extension
    const filename = Date.now() + ext;  // Use timestamp as the filename
    cb(null, filename);
  }
});

// Initialize Multer for handling file uploads
const upload = multer({ storage });

// Route for uploading a report
router.post('/uploadReport', upload.single('reportFile'), async (req, res) => {
  const { staffName, staffRole, reportDate, content } = req.body;
  const fileUrl = `/reports/${req.file.filename}`;  // Updated to match the 'reports' route

  try {
    // Create a new report document and save it to the database
    const newReport = new Report({
      staffName,
      staffRole,
      reportDate,
      content,
      fileUrl,  // Save the file path in the database
    });

    await newReport.save();  // Save the report in the database
    res.status(201).json(newReport);  // Respond with the saved report
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading report' });
  }
});

// Route to fetch all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();  // Fetch all reports from the database
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Route to fetch a specific report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);  // Find the report by ID
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json(report);  // Return the specific report
  } catch (error) {
    res.status(500).json({ message: 'Error fetching report' });
  }
});


router.delete('/:id', async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
  
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      // Delete the report file from the filesystem
      const filePath = path.join(__dirname, '..', report.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
  
      // Delete the report document from the database
      await Report.findByIdAndDelete(req.params.id);
  
      res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting report' });
    }
  });

module.exports = router;
