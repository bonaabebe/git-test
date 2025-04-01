
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Header() {
    return (
        <AppBar position="fixed" style={{ backgroundColor: '#2980b9' }}>
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    Prison Administration
                </Typography>
                <Button component={RouterLink} to="/login" color="inherit">
                    Login
                </Button>
                <Button component="a" href="#about" color="inherit">
                    About Us
                </Button>
                <Button component="a" href="#contact" color="inherit">
                    Contact
                </Button>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
