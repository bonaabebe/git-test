// PaginationComponent.js
import React from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({ count, page, handleChangePage }) => {
  return (
    <Pagination
      count={count}
      page={page}
      onChange={handleChangePage}
      variant="outlined"
      shape="rounded"
      sx={{ mt: 2 }}
    />
  );
};

export default PaginationComponent;
