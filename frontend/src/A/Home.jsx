import { Link } from 'react-router-dom'; // Make sure you're using react-router-dom for navigation

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Grid,
  Paper,
  Toolbar,
  Typography,
  TextField,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Menu, Phone, Fax, Message } from '@mui/icons-material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from '../A/wol.jpg'; // Background image for the welcome section

const Home = () => {
  const [bgColor, setBgColor] = useState('#e3f2fd');
  const [testimonials, setTestimonials] = useState([]);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if mobile

  useEffect(() => {
    const handleScroll = () => {
      const newColor = window.scrollY > 50 ? '#fafafa' : '#e3f2fd';
      setBgColor(newColor);
    };

    window.addEventListener('scroll', handleScroll);

    // Fetch Testimonials when the component mounts
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/testimonials/testimonials');
        setTestimonials(response.data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/testimonials/contact', contact);
      alert('Message sent successfully!');
      setContact({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Error submitting message');
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const renderNavLinks = () => (
    <>
      <Button color="inherit" variant="outlined" href='/login' sx={{ borderColor: '#fff', color: '#fff' }}>
        Login
      </Button>
      <Button color="inherit" variant="outlined" href="#about" sx={{ borderColor: '#fff', color: '#fff', ml: 1 }}>
        About Us
      </Button>
      <Button color="inherit" variant="outlined" href="#contact" sx={{ borderColor: '#fff', color: '#fff', ml: 1 }}>
        Contact Us
      </Button>
      <Button color="inherit" variant="outlined" href="#testimonials" sx={{ borderColor: '#fff', color: '#fff', ml: 1 }}>
        Testimonials
      </Button>
    </>
  );

  return (
    <Box>
      <CssBaseline />
      <AppBar position="sticky" sx={{ bgcolor: '#1976d2', boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: 15 }}>
            WOLAITA SODO PRISON INFORMATION MANAGEMENT SYSTEM
          </Typography>

          {isMobile ? (
            <>
              {/* Mobile Menu Icon */}
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <Menu />
              </IconButton>
             
              <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
  <List sx={{ width: 250 }}>
    {/* Use Link for React Router Navigation */}
    <ListItem button onClick={handleDrawerToggle}>
      <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemText primary="Login" />
      </Link>
    </ListItem>

    {/* Use anchor tag for smooth scrolling to sections */}
    <ListItem button onClick={handleDrawerToggle}>
      <a href="#about" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemText primary="About Us" />
      </a>
    </ListItem>

    <ListItem button onClick={handleDrawerToggle}>
      <a href="#contact" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemText primary="Contact Us" />
      </a>
    </ListItem>

    <ListItem button onClick={handleDrawerToggle}>
      <a href="#testimonials" style={{ textDecoration: 'none', color: 'inherit' }}>
        <ListItemText primary="Testimonials" />
      </a>
    </ListItem>
  </List>
</Drawer>
            </>
          ) : (
            // Desktop Navigation
            renderNavLinks()
          )}
        </Toolbar>
      </AppBar>

      {/* Welcome Section */}
      <Container maxWidth="lg" sx={{ mt: 2, mb: 4, bgcolor: bgColor, color: '#fff' }}>
        <Box
          sx={{
            backgroundImage: `url(${Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '85vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" color="white">
            Welcome to Our Prison Information Management System
          </Typography>
        </Box>
      </Container>

      {/* About Us Section */}
      <Container maxWidth="lg" id="about" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, display: 'flex', alignItems: 'center', bgcolor: '#fafafa' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h5" gutterBottom>
                About Us
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our system is designed to facilitate efficient management of prison operations,
                ensuring safety, security, and effective resource management. We leverage the latest
                technology to improve the administration process, making it seamless for all involved.
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Our dedicated team works tirelessly to provide the best solutions tailored to
                the needs of modern prison facilities.
              </Typography>
              <Typography variant="body1">
                We are committed to transparency, accountability, and innovation in all aspects
                of prison management. Your trust is our priority.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <img
                src={Image}
                alt="About Us"
                style={{ width: '100%', borderRadius: '8px', boxShadow: 2 }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Contact Us Section */}
      <Container maxWidth="lg" id="contact" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ padding: 3, bgcolor: '#fff' }}>
          <Typography variant="h5" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            We would love to hear from you! Please fill out the form below to get in touch.
          </Typography>
          <Grid container spacing={4} sx={{ mt: 3 }}>
            <Grid item xs={12} md={6}>
              <form onSubmit={handleSubmitMessage}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="name"
                  value={contact.name}
                  onChange={handleContactChange}
                />
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                />
                <TextField
                  label="Message"
                  variant="outlined"
                  multiline
                  rows={4}
                  fullWidth
                  sx={{ mb: 2 }}
                  name="message"
                  value={contact.message}
                  onChange={handleContactChange}
                />
                <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
                  Send Message
                </Button>
              </form>
            </Grid>
            <Grid item xs={12} md={6}>
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2368.7896041253825!2d37.75631820523757!3d6.851663808214788!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b1b13df1f76b49%3A0x9ddaef512e832e4e!2z4Yi24Yu2IOGIm-GIqOGImuGLqw!5e0!3m2!1sen!2set!4v1737669254760!5m2!1sen!2set"
                width="100%"
                height="310"
                style={{ border: 0, marginTop: 0 }}
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </Grid>
            <Grid sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ margin: 3 }}>
                <Phone sx={{ marginBottom: -2, fontSize: 36, color: 'green', marginRight: 1 }} /> Phone Number: +0465512095
              </Typography>
              <Typography sx={{ margin: 3 }}>
                <Fax sx={{ marginBottom: -1.5, fontSize: 36, color: 'gray', marginRight: 1 }} /> Fax Number: +0465513061
              </Typography>
              <Typography sx={{ margin: 3 }}>
                <Message color="primary" sx={{ marginBottom: -2, fontSize: 36, marginRight: 1 }} /> PoBox: 041
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Testimonials Section */}
      <Container maxWidth="lg" id="testimonials" sx={{ mt: 8 }}>
        <Paper
          elevation={12} // Elevated paper for a floating effect
          sx={{
            padding: 5,
            bgcolor: 'linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(255, 255, 255, 0.3))', // Soft gradient background
            borderRadius: '12px', // Rounded edges for modern look
            boxShadow: 10, // More shadow for a lifting effect
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: '700',
              color: '#1976d2',
              marginBottom: 5,
              fontSize: '2.5rem', // Larger font size for prominence
              fontFamily: 'Poppins, sans-serif', // Elegant font family
              letterSpacing: '1px',
            }}
          >
            What Our Users Are Saying
          </Typography>

          <Carousel
            showArrows={true}
            autoPlay
            infiniteLoop
            showThumbs={false}
            interval={5000}
            transitionTime={1000} // Smoother transition
            sx={{
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              padding: 3,
              overflow: 'hidden',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} style={{ padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontStyle: 'italic',
                    color: '#555',
                    marginBottom: 2,
                    fontSize: '1.2rem',
                    lineHeight: '1.6',
                    fontFamily: 'Roboto, sans-serif', // Elegant font for text
                    transition: 'all 0.3s ease-in-out', // Smooth hover effect
                    '&:hover': {
                      color: '#1976d2', // Color change on hover
                      transform: 'translateY(-5px)', // Lift effect on hover
                    },
                  }}
                >
                  "{testimonial.message}"
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '1rem',
                    fontFamily: 'Roboto, sans-serif',
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      color: '#1976d2',
                      transform: 'translateY(-2px)', // Subtle hover effect
                    },
                  }}
                >
                  - {testimonial.name}
                </Typography>
              </div>
            ))}
          </Carousel>
        </Paper>
      </Container>

      {/* Footer Section */}
      <Box sx={{ mt: 4, bgcolor: '#1976d2', color: 'white', padding: 2 }}>
        <Typography variant="body1" align="center">
          © 2024 WOLAITA SODO PRISON INFORMATION MANAGEMENT SYSTEM | All rights reserved.
        </Typography>
        <Grid sx={{ display: 'flex', alignItems: 'center', marginLeft: 39 }}>
          <Typography sx={{ margin: 3 }}>
            <Phone sx={{ marginBottom: -2, fontSize: 36, color: '#fff', marginRight: 1 }} /> Phone Number: +0465512095
          </Typography>
          <Typography sx={{ margin: 3 }}>
            <Fax sx={{ marginBottom: -1.5, fontSize: 36, color: '#fff', marginRight: 1 }} /> Fax Number: +0465513061
          </Typography>
          <Typography sx={{ margin: 3 }}>
            <Message sx={{ marginBottom: -2, fontSize: 36, marginRight: 1, color: '#fff' }} /> PoBox: 041
          </Typography>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;
