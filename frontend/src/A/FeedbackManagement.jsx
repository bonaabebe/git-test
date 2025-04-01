import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [newFeedback, setNewFeedback] = useState({ name: '', email: '', message: '' });
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);

  const handleAddFeedback = () => {
    if (newFeedback.name && newFeedback.email && newFeedback.message) {
      setFeedbackList([...feedbackList, { ...newFeedback, id: feedbackList.length + 1 }]);
      setNewFeedback({ name: '', email: '', message: '' });
      setOpenFeedbackModal(false);
    } else {
      alert("All fields are required!");
    }
  };

  return (
    <div>
      <Button variant="outlined" onClick={() => setOpenFeedbackModal(true)}>
        Add Feedback
      </Button>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackList.map((feedback) => (
              <TableRow key={feedback.id}>
                <TableCell>{feedback.id}</TableCell>
                <TableCell>{feedback.name}</TableCell>
                <TableCell>{feedback.email}</TableCell>
                <TableCell>{feedback.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Feedback Modal */}
      <Modal open={openFeedbackModal} onClose={() => setOpenFeedbackModal(false)}>
        <Box sx={{ width: 400, p: 4, bgcolor: 'background.paper', margin: 'auto', mt: '10%' }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Submit Feedback
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={newFeedback.name}
            onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={newFeedback.email}
            onChange={(e) => setNewFeedback({ ...newFeedback, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newFeedback.message}
            onChange={(e) => setNewFeedback({ ...newFeedback, message: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddFeedback}>
            Submit Feedback
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;
