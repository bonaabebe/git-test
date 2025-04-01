import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Modal,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function BlockModal({ openViewBlocksModal, setOpenViewBlocksModal, blocks }) {
    const handleCloseViewBlocks = () => {
        setOpenViewBlocksModal(false);
    };

    return (
        <Modal open={openViewBlocksModal} onClose={handleCloseViewBlocks}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Blocks Information
                </Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Block Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {blocks.map((block) => (
                                <TableRow key={block._id}>
                                    <TableCell>{block.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <IconButton onClick={handleCloseViewBlocks} sx={{ position: 'absolute', top: 10, right: 10 }}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Modal>
    );
}

export default BlockModal;
