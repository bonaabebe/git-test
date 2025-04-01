import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Grid, TextField,
   Button, Typography, 
  Paper, Snackbar, Alert,  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,Pagination,IconButton, 
  CircularProgress} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ReactDOMServer from 'react-dom/server';  // Import this to render JSX to HTML
import EditIcon from '@mui/icons-material/Edit';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import InfoIcon from '@mui/icons-material/Info';
import PrisonerDetailModal from './Components/PrisonerDetailModal ';
const Dashboard = () => {
  const [hour, setHour] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [month, setMonth] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [description, setDescription] = useState('');
  const [markerPosition, setMarkerPosition] = useState(null);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [NewSexs, setNewSexs] = useState("");
  const [crimeType, setCrimeType] = useState('');
  const [loading, setLoading] = useState(false);
 const [prisoners, setPrisoners] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [errorState, setErrorState] = useState("");
 const [Blocks, setBlocks] = useState('')



   const [searchTerm, setSearchTerm] = useState('');
  const handleSearchChange = (event, newValue) => {
    setSelectedPrisoners(newValue);
  };
  // Fetch prisoners and blocks
  const fetchData = async () => {
    try {
      // Perform both fetch calls in parallel using Promise.all
      const [prisonersResponse, blocksResponse] = await Promise.all([
        fetch('http://localhost:4000/api/prisoner'),
        fetch('http://localhost:4000/api/block')
      ]);

      // Check if the responses are ok
      if (!prisonersResponse.ok) throw new Error('Failed to fetch prisoners');
      if (!blocksResponse.ok) throw new Error('Failed to fetch blocks');

      // Parse the response JSON data
      const prisonersData = await prisonersResponse.json();
      const blocksData = await blocksResponse.json();

      // Set the fetched data to state
      setPrisoners(prisonersData);
      setBlocks(blocksData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorState('Failed to fetch data. Please try again later.');
    }
  };

  // Fetch data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Handle Snackbar close
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const lat = parseFloat(latitude);
  //   const lon = parseFloat(longitude);

  //   if (isNaN(lat) || isNaN(lon)) {
  //     setError('Invalid latitude or longitude');
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   try {
  //     const payload = {
  //       hour: parseInt(hour),
  //       day_of_week: parseInt(dayOfWeek),
  //       month: parseInt(month),
  //       latitude: lat,
  //       longitude: lon,
  //     };

  //     // Send the data to the backend
  //     const response = await axios.post('http://127.0.0.1:5000/predict', payload);

  //     if (response.data.prediction !== undefined) {
  //       setPrediction(response.data.prediction);
  //       setDescription(response.data.description);
  //       setMarkerPosition([lat, lon]);
  //       setError(null); // Reset error if prediction is successful
  //     } else {
  //       setError('Unexpected response format');
  //     }

  //     setOpenSnackbar(true); // Show success message
  //   } catch (err) {
  //     console.log('Error:', err);
  //     setError('Error fetching prediction: ' + err.message);
  //     setOpenSnackbar(true); // Show error message
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   // Parse latitude and longitude as floats
  //   const lat = parseFloat(latitude);
  //   const lon = parseFloat(longitude);
  
  //   // Validate input fields
  //   if (isNaN(lat) || isNaN(lon)) {
  //     setError('Invalid latitude or longitude');
  //     setOpenSnackbar(true);
  //     return;
  //   }
  //   if (isNaN(hour) || isNaN(dayOfWeek) || isNaN(month)) {
  //     setError('Hour, Day of Week, and Month must be valid numbers');
  //     setOpenSnackbar(true);
  //     return;
  //   }
  //   if (hour < 0 || hour > 23 || dayOfWeek < 0 || dayOfWeek > 6 || month < 1 || month > 12) {
  //     setError('Hour should be between 0-23, Day of Week should be between 0-6, Month should be between 1-12');
  //     setOpenSnackbar(true);
  //     return;
  //   }
  
  //   // Create payload object
  //   const payload = {
  //     hour: parseInt(hour),
  //     day_of_week: parseInt(dayOfWeek),
  //     month: parseInt(month),
  //     latitude: lat,
  //     longitude: lon,
  //   };
  
  //   try {
  //     // Send POST request to the backend API
  //     const response = await axios.post('http://127.0.0.1:5000/predict', payload);
      
  //     // Handle successful response
  //     if (response.data.prediction !== undefined) {
  //       setPrediction(response.data.prediction);
  //       setDescription(response.data.description);
  //       setMarkerPosition([lat, lon]);
  //       setError(null); // Reset error if prediction is successful
  //     } else {
  //       setError('Unexpected response format');
  //     }
  
  //     setOpenSnackbar(true); // Show success message
  //   } catch (err) {
  //     // Log and handle error responses
  //     console.log('Error:', err);
  //     if (err.response && err.response.data && err.response.data.error) {
  //       setError(`Error: ${err.response.data.error}`);
  //     } else {
  //       setError('Error fetching prediction');
  //     }
  //     setOpenSnackbar(true); // Show error message
  //   }
  // };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
  
    if (isNaN(lat) || isNaN(lon)) {
      setError('Invalid latitude or longitude');
      setOpenSnackbar(true);
      return;
    }
    if (isNaN(hour) || isNaN(dayOfWeek) || isNaN(month)) {
      setError('Hour, Day of Week, and Month must be valid numbers');
      setOpenSnackbar(true);
      return;
    }
    if (hour < 0 || hour > 23 || dayOfWeek < 0 || dayOfWeek > 6 || month < 1 || month > 12) {
      setError('Hour should be between 0-23, Day of Week should be between 0-6, Month should be between 1-12');
      setOpenSnackbar(true);
      return;
    }
  
    setLoading(true);
  
    const payload = {
      hour: parseInt(hour),
      day_of_week: parseInt(dayOfWeek),
      month: parseInt(month),
      latitude: lat,
      longitude: lon,
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', payload);
  
      if (response.data.prediction !== undefined) {
        setPrediction(response.data.prediction);
        setDescription(response.data.description);
        setMarkerPosition([lat, lon]);
        setError(null);
        setHour('');
        setDayOfWeek('');
        setMonth('');
        setLatitude('');
        setLongitude('');
      } else {
        setError('Unexpected response format');
      }
    } catch (err) {
      console.log('Error:', err);
      setError('Error fetching prediction: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };
  


  const filteredPrisoners = prisoners.filter(prisoner =>
    (prisoner.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
      || prisoner.middlename?.toLowerCase().includes(searchTerm.toLowerCase())
      || prisoner.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prisoner.sex?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );

     const [selectedPrisoner, setSelectedPrisoner] = useState(null);
     const [openPrisonerDetailModal, setOpenPrisonerDetailModal] = useState(false);
    const handleOpenPrisonerDetail = (prisoner) => {
      setSelectedPrisoner(prisoner);
      setOpenPrisonerDetailModal(true);
    };
    // Pagination handling
    const handleChangePage = (event, value) => {
      setPage(value);
    };
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const displayedPrisoners = filteredPrisoners.slice(startIndex, endIndex);
  
  // Marker icon color based on the prediction
  const getMarkerColor = () => {
    if (prediction === 1) {
      return 'red';  // Red for crime predicted
    } else if (prediction === 0) {
      return 'green'; // Green for no crime predicted
    }
    return 'blue';  // Default to blue if no prediction
  };

  // Create a Material UI icon marker using divIcon
  const predictionIcon = L.divIcon({
    className: 'leaflet-div-icon',
    html: ReactDOMServer.renderToStaticMarkup(  // Convert the Material UI icon to HTML string
      <div style={{ color: getMarkerColor(), fontSize: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LocationOnIcon />
      </div>
    ),
    iconSize: [32, 32],  // Icon size
    iconAnchor: [16, 32],  // Anchor point for the icon
    popupAnchor: [0, -32],  // Popup position
  });
  const defaultPosition = [6.843950, 37.756267]; // Default to San Francisco
  const zoomLevel = markerPosition ? 15 : 13; // Zoom in if markerPosition is set

  return (
    <Container>
   <Grid container spacing={4} sx={{ marginTop: 4 }}>
  {/* Left side: Prediction Form */}
  <Grid item xs={12} md={6}>
    <Paper elevation={3} sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom>
        Crime Prediction Form
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Hour"
          type="number"
          value={hour}
          onChange={(e) => setHour(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
          InputProps={{ inputProps: { min: 0, max: 23 } }}
        />
        <TextField
          label="Day of Week"
          type="number"
          value={dayOfWeek}
          onChange={(e) => setDayOfWeek(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
          InputProps={{ inputProps: { min: 0, max: 6 } }}
        />
        <TextField
          label="Month"
          type="number"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
          InputProps={{ inputProps: { min: 1, max: 12 } }}
        />
        <TextField
          label="Latitude"
          type="number"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <TextField
          label="Longitude"
          type="number"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          fullWidth
          required
          sx={{ marginBottom: 2 }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Predict Crime Activity'}
        </Button>
      </form>
    </Paper>
  </Grid>

  {/* Right side: Map */}
  <Grid item xs={12} md={6}>
    <Paper elevation={3} sx={{ padding: 3, height: '100%' }}>
      <Typography variant="h5" gutterBottom>
        Crime Analytics
      </Typography>
      <MapContainer
        center={markerPosition || defaultPosition}
        zoom={zoomLevel}
        style={{ width: '100%', height: '400px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markerPosition && (
          <Marker
            position={markerPosition}
            icon={predictionIcon}
          >
            <Popup>
              <b>Prediction:</b> {prediction}<br />
              <b>Details:</b> {description}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </Paper>
  </Grid>
</Grid>


      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom sx={{textAlign:'center'}}>
          Search Prisoner
        </Typography>
        <TextField
          label="Search Prisoner"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>ID</TableCell>
        <TableCell>Name</TableCell>
        <TableCell>Middle Name</TableCell>
        <TableCell>Region</TableCell>
        <TableCell>Sex</TableCell>
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {(displayedPrisoners.length > 0 ? displayedPrisoners : filteredPrisoners.length > 0 ? filteredPrisoners : []).length > 0
        ? (displayedPrisoners.length > 0 ? displayedPrisoners : filteredPrisoners).map((prisoner, index) => (
          <TableRow key={prisoner._id}>
            <TableCell>{startIndex + index + 1}</TableCell>
            <TableCell>{prisoner.firstname}</TableCell>
            <TableCell>{prisoner.middlename}</TableCell>
            <TableCell>{prisoner.region}</TableCell>
            <TableCell>{prisoner.sex}</TableCell>
            <TableCell>
  
              <IconButton color="secondary" onClick={() => handleOpenPrisonerDetail(prisoner)}>
                <InfoIcon />
              </IconButton>

          
            </TableCell>
          </TableRow>
        ))
        : <Typography variant='h6' sx={{textAlign:'center', fontWeight: 600, fontFamily: 'verdana', ml:26}}>There is no Available Data </Typography>
      }
    </TableBody>
  </Table>
</TableContainer>

        <Pagination
          count={Math.ceil(filteredPrisoners.length / rowsPerPage)}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          sx={{ mt: 2 }}
        />
      </Container>   
      <PrisonerDetailModal
          openPrisonerDetailModal={openPrisonerDetailModal}
          setOpenPrisonerDetailModal={setOpenPrisonerDetailModal}
          selectedPrisoner={selectedPrisoner}
        />

      {/* Snackbar for showing success or error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || 'Prediction was successful!'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Dashboard;
