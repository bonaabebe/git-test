import React from 'react';
import { TextField } from '@mui/material';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextField
      label="Search Prisoner"
      variant="outlined"
      fullWidth
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;