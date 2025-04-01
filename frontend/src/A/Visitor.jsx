import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Button,
  TextField,
  Snackbar,
  Alert,
  Modal,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const drawerWidth = 240;

const Visitor = () => {
  const [open, setOpen] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    prisonerName: '',
    relationship: '',
    visitDate: '',
    contact: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);
  const [cancelIndex, setCancelIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('book');
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const handleCancelClose = () => setConfirmCancelOpen(false);

  const handleAddVisitor = () => {
    const today = new Date();
    const visitDate = new Date(newVisitor.visitDate);
    
    if (
      newVisitor.name &&
      newVisitor.prisonerName &&
      newVisitor.relationship &&
      newVisitor.visitDate &&
      newVisitor.contact &&
      visitDate > today
    ) {
      setVisitors([...visitors, newVisitor]);
      setNewVisitor({ name: '', prisonerName: '', relationship: '', visitDate: '', contact: '' });
      handleClose();
      setSnackbarMessage('Appointment booked successfully!');
      setSnackbarOpen(true);
    } else {
      alert("Please fill all fields correctly and ensure the visit date is in the future!");
    }
  };

  const handleCancelAppointment = (index) => {
    const updatedVisitors = visitors.filter((_, i) => i !== index);
    setVisitors(updatedVisitors);
    setSnackbarMessage('Appointment canceled successfully!');
    setSnackbarOpen(true);
    handleCancelClose();
  };

  const handleOpenCancelDialog = (index) => {
    setCancelIndex(index);
    setConfirmCancelOpen(true);
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setFeedbackSubmitted(true);
      setFeedback('');
      setSnackbarMessage('Feedback submitted successfully!');
      setSnackbarOpen(true);
    } else {
      alert("Please enter your feedback before submitting!");
    }
  };

  const filteredVisitors = visitors.filter(visitor =>
    visitor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Visitor Appointment Booking
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActiveSection('book')}>
            <ListItemText primary="Book Appointment" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('history')}>
            <ListItemText primary="View Appointment History" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('cancel')}>
            <ListItemText primary="Cancel Appointment" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('search')}>
            <ListItemText primary="Search Visitor Appointments" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('support')}>
            <ListItemText primary="Contact Support" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('faq')}>
            <ListItemText primary="FAQ" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('policies')}>
            <ListItemText primary="Visitor Policies" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('feedback')}>
            <ListItemText primary="Feedback" />
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        {activeSection === 'book' && (
          <>
            <Typography variant="h4" gutterBottom>
              Schedule a Visit
            </Typography>
            <TextField
              label="Search Visitor"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
              Book New Appointment
            </Button>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Prisoner Name</TableCell>
                    <TableCell>Relationship</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Visit Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVisitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.prisonerName}</TableCell>
                      <TableCell>{visitor.relationship}</TableCell>
                      <TableCell>{visitor.contact}</TableCell>
                      <TableCell>{new Date(visitor.visitDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => handleOpenCancelDialog(index)}
                        >
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeSection === 'history' && (
          <>
            <Typography variant="h4" gutterBottom>
              Appointment History
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Prisoner Name</TableCell>
                    <TableCell>Relationship</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Visit Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.prisonerName}</TableCell>
                      <TableCell>{visitor.relationship}</TableCell>
                      <TableCell>{visitor.contact}</TableCell>
                      <TableCell>{new Date(visitor.visitDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeSection === 'cancel' && (
          <>
            <Typography variant="h4" gutterBottom>
              Cancel Appointment
            </Typography>
            <Typography variant="body1">
              To cancel an appointment, please use the "Book Appointment" section to manage your appointments.
            </Typography>
          </>
        )}

        {activeSection === 'search' && (
          <>
            <Typography variant="h4" gutterBottom>
              Search Visitor Appointments
            </Typography>
            <TextField
              label="Search by Name"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Prisoner Name</TableCell>
                    <TableCell>Relationship</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Visit Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVisitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.prisonerName}</TableCell>
                      <TableCell>{visitor.relationship}</TableCell>
                      <TableCell>{visitor.contact}</TableCell>
                      <TableCell>{new Date(visitor.visitDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {activeSection === 'support' && (
          <>
            <Typography variant="h4" gutterBottom>
              Contact Support
            </Typography>
            <Typography variant="body1">
              For any inquiries, please contact our support team at support@example.com or call 1-800-555-0199.
            </Typography>
          </>
        )}

        {activeSection === 'faq' && (
          <>
            <Typography variant="h4" gutterBottom>
              Frequently Asked Questions
            </Typography>
            <Typography variant="body1">
              <strong>Q: How do I schedule a visit?</strong><br />
              A: You can schedule a visit by filling out the booking form in the "Book Appointment" section.<br /><br />
              <strong>Q: What identification do I need to bring?</strong><br />
              A: Visitors must bring a valid government-issued ID.<br /><br />
              <strong>Q: Can I reschedule my appointment?</strong><br />
              A: Yes, you can reschedule by contacting our support team.
            </Typography>
          </>
        )}

        {activeSection === 'policies' && (
          <>
            <Typography variant="h4" gutterBottom>
              Visitor Policies
            </Typography>
            <Typography variant="body1">
              Please adhere to the following visitor policies:
              <ul>
                <li>All visitors must check in at least 30 minutes before the scheduled visit.</li>
                <li>Items such as cell phones, cameras, and bags are not allowed in the visiting area.</li>
                <li>Visitors must maintain a respectful demeanor while on the premises.</li>
              </ul>
            </Typography>
          </>
        )}

        {activeSection === 'feedback' && (
          <>
            <Typography variant="h4" gutterBottom>
              Feedback
            </Typography>
            <TextField
              label="Your Feedback"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleFeedbackSubmit}>
              Submit Feedback
            </Button>
            {feedbackSubmitted && (
              <Typography variant="body2" color="success.main" sx={{ mt: 2 }}>
                Thank you for your feedback!
              </Typography>
            )}
          </>
        )}

        {/* Modal for Booking Appointment */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              width: 400,
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" component="h2" gutterBottom>
              Book Appointment
            </Typography>
            <TextField
              label="Visitor Name"
              variant="outlined"
              fullWidth
              value={newVisitor.name}
              onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Prisoner Name"
              variant="outlined"
              fullWidth
              value={newVisitor.prisonerName}
              onChange={(e) => setNewVisitor({ ...newVisitor, prisonerName: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Relationship"
              variant="outlined"
              fullWidth
              value={newVisitor.relationship}
              onChange={(e) => setNewVisitor({ ...newVisitor, relationship: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Visit Date"
              type="date"
              variant="outlined"
              fullWidth
              value={newVisitor.visitDate}
              onChange={(e) => setNewVisitor({ ...newVisitor, visitDate: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Contact Number"
              variant="outlined"
              fullWidth
              value={newVisitor.contact}
              onChange={(e) => setNewVisitor({ ...newVisitor, contact: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleAddVisitor} sx={{ mt: 2 }}>
              Book Appointment
            </Button>
          </Box>
        </Modal>

        {/* Snackbar for Notifications */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* Confirmation Dialog for Canceling Appointment */}
        <Dialog open={confirmCancelOpen} onClose={handleCancelClose}>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this appointment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelClose} color="primary">
              No
            </Button>
            <Button onClick={() => handleCancelAppointment(cancelIndex)} color="secondary">
              Yes, Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Visitor;
