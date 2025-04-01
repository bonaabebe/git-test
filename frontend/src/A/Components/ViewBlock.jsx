import React from 'react';
import { Modal, Box, Typography, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ViewBlock = ({ open, handleClose, blocks }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 800, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Blocks Information
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Block Name</TableCell>
                <TableCell>Block Status</TableCell>
                <TableCell>Block Number</TableCell>
                <TableCell>Block Size</TableCell>
                <TableCell>Sex</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block._id}>
                  <TableCell>{block.name}</TableCell>
                  <TableCell>{block.Blockstatus}</TableCell>
                  <TableCell>{block.blocknumber}</TableCell>
                  <TableCell>{block.blocksize}</TableCell>
                  <TableCell>{block.Sex}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <IconButton onClick={handleClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default ViewBlock;
