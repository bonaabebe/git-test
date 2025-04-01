// PrisonerTable.js
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

const PrisonerTable = ({ prisoners, displayedPrisoners, startIndex, handleOpenPrisonerDetail, handleDeletePrisoner, setOpenPrisonerModal, setEditPrisoner }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Block</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPrisoners.map((prisoner, index) => (
            <TableRow key={prisoner._id}>
              <TableCell>{startIndex + index + 1}</TableCell>
              <TableCell>{prisoner.name}</TableCell>
              <TableCell>{prisoner.room}</TableCell>
              <TableCell>{prisoner.block}</TableCell>
              <TableCell>{prisoner.status}</TableCell>
              <TableCell>
                <IconButton color="primary" onClick={() => {
                  setEditPrisoner(prisoner);
                  setOpenPrisonerModal(true);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton color="secondary" onClick={() => handleOpenPrisonerDetail(prisoner)}>
                  <InfoIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDeletePrisoner(prisoner._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PrisonerTable;
