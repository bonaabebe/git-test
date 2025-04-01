import React from 'react';
import { Modal, Box, Typography, Grid, Avatar, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const PrisonerDetailModal = ({ openPrisonerDetailModal, setOpenPrisonerDetailModal, selectedPrisoner }) => {
  return (
    <Modal open={openPrisonerDetailModal} onClose={() => setOpenPrisonerDetailModal(false)}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 800 },
          bgcolor: 'white',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
          p: 4,
          borderRadius: 3,
          border: '3px solid #3f51b5',
          overflowY: 'auto',
          maxHeight: '90vh',
        }}
      >
        {/* Image (Avatar) on top */}
        {selectedPrisoner && (
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
            }}
          >
            <Avatar
              alt="Prisoner Photo"
              src={`http://localhost:4000/${selectedPrisoner.photo}`}
              sx={{
                width: 160,
                height: 160,
                border: '8px solid #f2f2f2',
                boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.1)',
                margin: '0 auto',
              }}
            />
          </Box>
        )}

        {/* Modal Header */}
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: '#3f51b5',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          Prisoner Information
        </Typography>

        {/* Certificate-like content */}
        {selectedPrisoner && (
          <>
            <Grid container spacing={4} alignItems="center">
              {/* Right Section: Details */}
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  {[
                    { label: 'First Name', value: selectedPrisoner.firstname },
                    { label: 'Middle Name', value: selectedPrisoner.middlename },
                    { label: 'Last Name', value: selectedPrisoner.lastname },
                    { label: 'Nationality', value: selectedPrisoner.nationality },
                    { label: 'Age', value: selectedPrisoner.age },
                    { label: 'Sex', value: selectedPrisoner.sex },
                    { label: 'Contact Number', value: selectedPrisoner.phoneNumber },
                    { label: 'Crime Type', value: selectedPrisoner.crimeType },
                    { label: 'Zone', value: selectedPrisoner.zone },
                    { label: 'Woreda', value: selectedPrisoner.woreda },
                    { label: 'Region', value: selectedPrisoner.region },
                    { label: 'Appointment Date', value: selectedPrisoner.appointmentDate },
                    { label: 'Released Date', value: selectedPrisoner.releasedDate },
                    { label: 'Entry Date', value: selectedPrisoner.entryDate },
                    { label: 'Released Case', value: selectedPrisoner.releasedCase },
                    { label: 'Court Name', value: selectedPrisoner.courtName },
            
                  ].map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                          color: '#3f51b5',
                          mb: 1,
                          textTransform: 'uppercase',
                        }}
                      >
                        {item.label}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#555', fontStyle: 'italic' }}>
                        {item.value || 'N/A'}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>

            {/* Divider */}
            <Divider sx={{ my: 3, borderColor: '#3f51b5' }} />

            {/* Close Button */}
            <IconButton
              onClick={() => setOpenPrisonerDetailModal(false)}
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#3f51b5',
                borderRadius: '50%',
                '&:hover': {
                  backgroundColor: '#303f9f',
                },
              }}
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default PrisonerDetailModal;



