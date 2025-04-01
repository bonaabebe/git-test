// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');

dotenv.config(); // Load environment variables from .env file

const authRoutes = require('./route/auth');
const BlockRoutes = require('./route/BlockRoute');
const PrisonerRoutes = require('./route/PrisonerRoute');
const Message=require('./route/message')
const Room = require('./route/roomRoute');
const Employee = require('./route/employe');
const Prediction = require('./route/predictionRoute');
const Notice = require('./route/notice');
const Report=require('./route/reports')
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Allow frontend React app on this URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Parse JSON request bodies
app.use(express.json());

// Serve static files from "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/prisoners', express.static(path.join(__dirname, 'prisoners')));


// Serve static files from the 'reports' directory
app.use('/reports', express.static(path.join(__dirname, 'reports')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI) // Use the MONGO_URI from .env file
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Routes
app.use('/api/room', Room);
app.use('/api/auth', authRoutes);
app.use('/api/block', BlockRoutes);
app.use('/api/prisoner', PrisonerRoutes);
app.use('/api/notice', Notice);
app.use('/api/prediction', Prediction);
app.use('/api/employe', Employee);
app.use('/api/testimonials',Message)
app.use('/api/reports',Report);
// Create the server using HTTP/1.1
const server = http.createServer(app);

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT is not set in .env
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
