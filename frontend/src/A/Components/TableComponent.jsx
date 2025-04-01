import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DomainAddIcon from '@mui/icons-material/DomainAdd';

const TableComponent = ({ displayedPrisoners, startIndex, handleOpenPrisonerDetail, setSelectedPrisoner, setOpenAllocateRoomModal, setOpenPrisonerModal }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Middle Name</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayedPrisoners && displayedPrisoners.length > 0 ? (
            displayedPrisoners.map((prisoner, index) => (
              <TableRow key={prisoner._id}>
                <TableCell>{startIndex + index + 1}</TableCell>
                <TableCell>{prisoner.firstname}</TableCell>
                <TableCell>{prisoner.middlename}</TableCell>
                <TableCell>{prisoner.region}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => { setSelectedPrisoner(prisoner); setOpenPrisonerModal(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenPrisonerDetail(prisoner)}>
                    <InfoIcon />
                  </IconButton>
                  <IconButton color="default" onClick={() => { setSelectedPrisoner(prisoner); setOpenAllocateRoomModal(true); }}>
                    <DomainAddIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <Typography variant="h4" sx={{ fontWeight: 600, fontFamily: 'verdana' }}>There is no Available Data</Typography>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
