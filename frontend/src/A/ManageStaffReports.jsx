import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Grid, Typography, Snackbar } from '@mui/material';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { CheckCircle, Error } from '@mui/icons-material'; // Import Error icon for error Snackbar

const ManageStaffReports = () => {
  const [staffName, setStaffName] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [snackbarMessage, setSnackbarMessage] = useState('');  // Ensure it's initialized with an empty string
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');
  const MAX_WORD_COUNT = 200;

  // Fetch the logged-in user's data for pre-filling the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get JWT token
        if (!token) {
          console.error('No token found');
          return;
        }

        // Fetch user profile data from backend
        const response = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in the header
          },
        });

        // Set profile data to state variables
        setStaffName(response.data.username); // Name from profile
        setStaffRole(response.data.role);     // Role from profile
        setStaffPhone(response.data.phone);   // Phone number from profile

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile(); // Call function on component mount
  }, []);

  const handleReportContentChange = (event) => {
    const content = event.target.value;
    const words = content.trim().split(/\s+/);
    const count = words.filter((word) => word.length > 0).length;

    setReportContent(content);
    setWordCount(count);
  };

  const handlePostReport = async () => {
    const doc = new jsPDF();

    // Set Title and Subtitle with centered alignment
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Staff Report', 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Prison Management System', 105, 30, { align: 'center' });

    // Add a line separator (horizontal line) for structure
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35); // Line across the page

    // Add Staff Details Section
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Staff Details', 105, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Staff Name: ${staffName}`, 20, 60);
    doc.text(`Role: ${staffRole}`, 20, 70);
    doc.text(`Phone: ${staffPhone}`, 20, 80);
    doc.text(`Report Date: ${reportDate}`, 20, 90);

    // Add spacing before the report content section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Report Content:', 105, 105, { align: 'center', fontSize: '16' });

    // Dynamic Box for Content
    const margin = 20;
    const boxWidth = 180;
    let contentY = 115;

    // Calculate the number of lines needed for the report content
    const lineHeight = 6;
    const text = reportContent;
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;

    // Get the number of lines the content will take
    const lines = doc.splitTextToSize(text, boxWidth);
    const numLines = lines.length;

    // Adjust content box height based on the number of lines
    const contentBoxHeight = numLines * lineHeight + 10; // Add some extra space for padding

    // Draw box for content
    doc.rect(margin, contentY - 5, boxWidth, contentBoxHeight);

    // Insert the text inside the box with wrapping
    doc.text(lines, margin + 5, contentY, { maxWidth: boxWidth, lineHeightFactor: 1.2 });

    contentY += contentBoxHeight; // Update contentY after inserting the content

    // Add Conclusion/Remarks Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Conclusion/Remarks', 105, contentY + 15, { align: 'center' });

    const conclusionText = `${staffName} continues to show great dedication to their role as ${staffRole}. Further training will enhance performance.`;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(conclusionText, margin + 5, contentY + 30, { maxWidth: boxWidth, lineHeightFactor: 1.2 });

    // Add Footer with page number and date (centered)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 270, { align: 'center' });
    doc.text(`Page ${doc.internal.getNumberOfPages()}`, 105, 280, { align: 'center' });

    // Save the PDF as Blob
    const pdfBlob = doc.output('blob');

    // Create FormData to send to the server
    const formData = new FormData();
    formData.append('reportFile', pdfBlob, `${staffName}_report_${reportDate}.pdf`);
    formData.append('staffName', staffName);
    formData.append('staffRole', staffRole);
    formData.append('reportDate', reportDate);
    formData.append('content', reportContent);

    // Upload PDF to the backend
    try {
      const response = await axios.post('http://localhost:4000/api/reports/uploadReport', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbarMessage('Successfully Generated');
      setSnackbarType('success');
      setSnackbarOpen(true); // Make sure the Snackbar shows

    } catch (error) {
      setSnackbarMessage('Error uploading');
      setSnackbarType('error');
      setSnackbarOpen(true); // Show error Snackbar
      console.error('Error uploading report:', error);
    }

    // Reset form fields after submission
    setStaffName('');
    setReportDate('');
    setReportContent('');
  };

  return (
    <Paper elevation={3} sx={{ padding: '20px' }}>
      <Typography variant="h6" gutterBottom>Generate Staff Reports</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Staff Name"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Role"
            value={staffRole}
            onChange={(e) => setStaffRole(e.target.value)}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            value={staffPhone}
            onChange={(e) => setStaffPhone(e.target.value)}
            fullWidth
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Report Date"
            type="date"
            value={reportDate}
            onChange={(e) => setReportDate(e.target.value)}
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Report Content"
            value={reportContent}
            onChange={handleReportContentChange}
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            helperText={`${wordCount} / ${MAX_WORD_COUNT} words`}
            error={wordCount > MAX_WORD_COUNT}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostReport}
            fullWidth
            disabled={wordCount > MAX_WORD_COUNT}
          >
            Generate Report
          </Button>
        </Grid>
      </Grid>

      {/* Snackbar for showing success or error message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={
          <>
            {snackbarType === 'success' ? (
              <CheckCircle color="success" sx={{ marginRight: '8px' }} />
            ) : (
              <Error color="error" sx={{ marginRight: '8px' }} />
            )}
            {snackbarMessage}
          </>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
};

export default ManageStaffReports;
