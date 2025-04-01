const express = require('express');
const axios = require('axios');

const router = express.Router();

router.post('/predict', async (req, res) => {
    try {
        const data = req.body; 

        // Make the POST request to Flask server for prediction
        const response = await axios.post('http://localhost:5000/predict', { 
            features: data 
        });

        res.json(response.data); 
    } catch (error) {
        console.error('Error during communication with Flask:', error);
        res.status(500).json({ error: 'Error communicating with Flask server' });
    }
});

module.exports = router;