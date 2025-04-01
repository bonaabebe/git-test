import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Autocomplete,
  Box,
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  TextField,
  Button,
  Modal,
  IconButton,
  Select,
  MenuItem,
  Menu,
  Avatar,
  Divider,
  Pagination,
  InputAdornment,
  Grid,
  FormControl,
  InputLabel,
  Tooltip

} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import InfoIcon from '@mui/icons-material/Info';
import { CSVLink } from 'react-csv';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Profile from './Admin/Profile';
import AllocateRoomModal from './Components/AllocateRoomModal';
import AddPrisonerModal from './Components/AddPrisonerModal';
import PrisonerDetailModal from './Components/PrisonerDetailModal ';
import ViewBlock from './Components/ViewBlock';
import PageContainer from './Components/PageContainer';
import AddBlockModal from './Components/AddBlockModal ';
import AppBarComponent from './Components/AppBarComponent';
import { VerifiedUser } from '@mui/icons-material';
const drawerWidth = 240;

const StaffManagement = () => {


  const [openUserModal, setOpenUserModal] = useState(false);


  // State variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorState, setErrorState] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [prisoners, setPrisoners] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openPrisonerModal, setOpenPrisonerModal] = useState(false);
  const [openBlockModal, setOpenBlockModal] = useState(false);
  const [openPrisonerDetailModal, setOpenPrisonerDetailModal] = useState(false);
  const [openViewBlocksModal, setOpenViewBlocksModal] = useState(false);
  const [selectedPrisoner, setSelectedPrisoner] = useState(null);
  const [newPrisoner, setNewPrisoner] = useState({ name: '', room: '', block: '', status: 'Active' });
  const [editPrisoner, setEditPrisoner] = useState(null);
  const [openAllocateRoomModal, setOpenAllocateRoomModal] = useState(false);
  const [newBlockNumber, setNewBlockNumber] = useState('');
  const [error, setError] = useState('');
  const [loadingBlocks, setLoadingBlocks] = useState('');
  const [currentView, setCurrentView] = useState('');
  const [photoFile, setPhotoFile] = useState(null); // Initialize photoFile state
  const [NewSex, setNewSex] = useState('')
  const [snackbarColor, setSnackbarColor] = useState('success'); // Default to 'success' (green) color
  const [Block, SetBlock] = useState({
    name: '',
    blocknumber: '',
    blocksize: '',
    Sex: '',
    Blockstatus: ''
  })
  const [newRooms, setNewRooms] = useState("");
  const [newBlockNumbers, setNewBlockNumbers] = useState("");
  const [selectedPrisoners, setSelectedPrisoners] = useState(null);
  const [NewSexs, setNewSexs] = useState("");
  const [crimeType, setCrimeType] = useState('');
  const [loading, setLoading] = useState(false);
 

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

  // Handle View Block Modal
  const handleOpenViewBlocks = () => {
    setOpenViewBlocksModal(true);
  };

  const handleCloseViewBlocks = () => {
    setOpenViewBlocksModal(false);
  };

  // Handle CSV download
  const handleDownloadReport = () => {
    const csvData = prisoners.map(prisoner => ({
      Name: prisoner.firstname,
      LastName: prisoner.middlename,
      Age: prisoner.age,
      Sex:prisoner.sex,
      Region:prisoner.region,
      Woreda:prisoner.woreda,
      Nationality:prisoner.nationality,
      CrimeType:prisoner.crimeType,
      courtName:prisoner.courtName,
      Zone:prisoner.zone,


    }));
    return csvData;
  };


  const filteredPrisoners = prisoners.filter(prisoner =>
  (prisoner.firstname?.toLowerCase().includes(searchTerm.toLowerCase())
    || prisoner.middlename?.toLowerCase().includes(searchTerm.toLowerCase())
    || prisoner.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prisoner.sex?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  // Pagination handling
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedPrisoners = filteredPrisoners.slice(startIndex, endIndex);

  
  // Handle delete prisoner

  // Handle prisoner detail modal
  const handleOpenPrisonerDetail = (prisoner) => {
    setSelectedPrisoner(prisoner);
    setOpenPrisonerDetailModal(true);
  };


  // Handle adding new block
  const handleAddBlock = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Block),
      });
      if (!response.ok) throw new Error('Failed to add block');
      setSnackbarMessage('Block added successfully');
      setSnackbarOpen(true);
      SetBlock('');
      fetchBlocks();
      setOpenBlockModal(false);
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'Register Prisoner':
        return <RegisterPrisoner />;
      case 'profile':
        return <Profile />;
      default:
        return null; // You can render a default or placeholder component here
    }
  };



  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Store the file in the state
      setPhotoFile(file); // Set photoFile state to the selected file

      // Optionally, set preview URL for the image
      setNewPrisoner((prevState) => ({
        ...prevState,
        photo: URL.createObjectURL(file), // For image preview
      }));
    }
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          setSnackbarMessage('No token found');
          setSnackbarOpen(true);
          return;
        }

        const response = await axios.get('http://localhost:4000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setSnackbarMessage('Error fetching profile');
        setSnackbarOpen(true);
      }
    };

    fetchUserProfile();
  }, []);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => setAnchorEl(null);

  const handleInputChange = (field) => (e) => {
    setNewPrisoner({ ...newPrisoner, [field]: e.target.value });
  };

  const handleAllocateRoomSuccess = (data) => {
    // This function will be called on successful room allocation
    console.log("Room allocated successfully:", data);

    // You can set success messages or update state here
    setSnackbarMessage("Room allocated successfully!");
    setSnackbarColor("success");
    setSnackbarOpen(true);  // Show success snackbar

    // Close the modal
    setOpenAllocateRoomModal(false);
    setSelectedPrisoner(null);
    setNewRooms("");  // Reset room input
    setNewBlockNumbers("");  // Reset block number input
  };

  // const handleAllocateRoom = async () => {
  //   // Check if all required fields are filled
  //   if (!selectedPrisoner || !newBlockNumbers || !crimeType || !NewSexs || !newRooms) {
  //     setErrorState("All fields are required.");
  //     return;
  //   }

  //   const roomData = {
  //     prisonerId: selectedPrisoner._id,  // Selected prisoner ID
  //     blockId: newBlockNumbers,  // Selected block ID
  //     crimeType: crimeType,  // Crime type input
  //     sex: NewSexs,  // Sex selection (Male/Female)
  //     roomNumber: newRooms,  // Room number input
  //   };

  //   try {
  //     // Set loading state to true while the request is processing
  //     setLoading(true);

  //     // Sending the POST request to allocate the room
  //     const response = await fetch("http://localhost:4000/api/room/room-allocation", {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(roomData),  // Send room allocation data in the request body
  //     });

  //     // Parse the response from the server
  //     const data = await response.json();

  //     // If the response is not OK, throw an error
  //     if (!response.ok) {
  //       throw new Error(data.message || "Failed to allocate room.");
  //     }

  //     // Successfully allocated room, handle success
  //     setLoading(false);

  //     // Success handler: Trigger success message or actions here
  //     handleAllocateRoomSuccess(data);

  //     // Reset form or fields if needed
  //     resetForm();
  //   } catch (err) {
  //     // If there is an error, stop loading and show the error message
  //     setLoading(false);
  //     setErrorState("Error allocating room: " + err.message);
  //     console.error("Room allocation error:", err);
  //   }
  // };


  const handleAllocateRoom = async () => {
    if (!selectedPrisoner || !newBlockNumbers || !crimeType || !NewSexs || !newRooms) {
      setErrorState("All fields are required.");
      return;
    }
  
    try {
      const block = blocks.find(block => block.blocknumber === newBlockNumbers);
      if (!block) {
        setErrorState("Block not found.");
        return;
      }
  
      const roomsOccupied = await fetchRoomsOccupied(block._id); 
      if (roomsOccupied >= block.blocksize) {
        setErrorState("No available rooms in this block.");
        return;
      }
  
      const roomData = {
        prisonerId: selectedPrisoner._id,
        blockId: block._id,
        roomNumber: newRooms,
        crimeType: crimeType,
        sex: NewSexs,
      };
      const response = await fetch("http://localhost:4000/api/room/room-allocation", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roomData),
      });
  
      if (!response.ok) throw new Error('Failed to allocate room');
      const data = await response.json();
  
      handleAllocateRoomSuccess(data);
    } catch (error) {
      setErrorState(error.message);
    }
  };
  

  const resetForm = () => {
    setSelectedPrisoner(null); 
    setNewRooms('');           
    setCrimeType('');         
    setNewSexs('');            
    setNewBlockNumbers('');    
    setErrorState('');        
  };
  const handleOpenBlockModal = () => setOpenBlockModal(true);
  // Function to close the modal
  const handleCloseBlockModal = () => setOpenBlockModal(false);
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
 <AppBarComponent drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} handleProfileClick={handleProfileClick} />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={drawerOpen}
      >
        <Toolbar />
        <List sx={{display:'flex',
          flexDirection:'column',
         mt:10,
         

        }}>
          
          <ListItem button onClick={() => { setOpenPrisonerModal(true); setEditPrisoner(null); }}>
         
          

            <Button sx={{
                textDecoration:'none',
                color:'black'
              }}>Register Prisoner</Button>
              
          </ListItem>

          <ListItem button onClick={() => setOpenBlockModal(true)}>
          
            <Button  sx={{
                textDecoration:'none',
                color:'black',
                
              }}>Record Block</Button>
          </ListItem>
          <ListItem button onClick={handleOpenViewBlocks}>

            <Button  sx={{
                textDecoration:'none',
                color:'black',
                
              }}>View Block</Button>
          </ListItem>
          <ListItem button>
            <CSVLink data={handleDownloadReport()} filename={"prisoners_report.csv"}
          >
              <Button  sx={{
                textDecoration:'none',
                color:'black',
                
              }}> Generate report</Button>
            </CSVLink>
          </ListItem>
        </List>
      </Drawer>

      <Container sx={{ flexGrow: 1, p: 3, marginTop: 8 }}>
        <Typography variant="h4" gutterBottom>
          Staff Management
        </Typography>
        <TextField
          label="Search Prisoner"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2,
           }}
           
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
              <IconButton color="primary" onClick={() => {
                setNewPrisoner(prisoner);
                setEditPrisoner(prisoner);
                setOpenPrisonerModal(true);
              }}>
                <EditIcon />
              </IconButton>
              <IconButton color="secondary" onClick={() => handleOpenPrisonerDetail(prisoner)}>
                <InfoIcon />
              </IconButton>

              <IconButton
                color="default"
                onClick={() => {
                  setSelectedPrisoner(prisoner); // Ensure selected prisoner is set
                  setOpenAllocateRoomModal(true);
                }}
                disabled={prisoner.block && prisoner.room} // Disable if prisoner is already assigned to a block and room
              >
                <DomainAddIcon />
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

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}  // Duration in ms before the snackbar auto-closes
          onClose={() => setSnackbarOpen(false)}  // Close the snackbar when it's dismissed
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarColor}>
            {snackbarMessage}
          </Alert>
        </Snackbar>


        {/* View Blocks Modal */}

        <ViewBlock
          open={openViewBlocksModal}
          handleClose={handleCloseViewBlocks}
          blocks={blocks}
        />

        {/* Add Prisoner Modal and update prisoner */}
        <AddPrisonerModal
          openPrisonerModal={openPrisonerModal}
          setOpenPrisonerModal={setOpenPrisonerModal}
          editPrisoner={editPrisoner}
          setEditPrisoner={setEditPrisoner}
          blocks={blocks}
        />
        {/* Add Block Modal */}
    
<AddBlockModal
        open={openBlockModal}
        handleClose={handleCloseBlockModal}
        Block={Block}
        SetBlock={SetBlock}
        handleAddBlock={handleAddBlock}
      />
        {/* Prisoner Detail Modal */}
        <PrisonerDetailModal
          openPrisonerDetailModal={openPrisonerDetailModal}
          setOpenPrisonerDetailModal={setOpenPrisonerDetailModal}
          selectedPrisoner={selectedPrisoner}
        />


        {/* allocating prisoner Modal */}
        <AllocateRoomModal
          openAllocateRoomModal={openAllocateRoomModal}
          setOpenAllocateRoomModal={setOpenAllocateRoomModal}
          selectedPrisoner={selectedPrisoner}
          blocks={blocks}  // Pass the blocks based on the sex of the prisoner
          error={error}
        />
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}  // Ensures the menu is open only when anchorEl is set
        onClose={handleClosePopover}
        MenuListProps={{ 'aria-labelledby': 'basic-button' }}
        anchorOrigin={{
          vertical: 'bottom', // Aligns the menu below the icon
          horizontal: 'right', // Aligns the menu to the right side of the icon
        }}
        transformOrigin={{
          vertical: 'top', // Aligns the top of the menu with the bottom of the icon
          horizontal: 'right', // Aligns the menu to the right side of the icon
        }}
      >
        <MenuItem onClick={() => setCurrentView('profile')}>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
            {user && user.photo ? (
              <Avatar
                alt="Profile"
                src={user.photo}
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: 2,
                  border: '2px solid #ddd',
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  marginRight: 2,
                  border: '2px solid #ddd',
                  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
                }}
              />
            )}
            <Box>
              <Typography variant="h6" component="div">
                {user?.username?.toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>
          </Box>
        </MenuItem>

        <Divider />
        <MenuItem
          onClick={() => {
            // Handle logout logic
            localStorage.removeItem('token');
            window.location.href = '/login'; // Redirect to login page
          }}
        >
          Logout
        </MenuItem>
      </Menu>
      <PageContainer
        currentView={currentView}
        snackbarOpen={snackbarOpen}
        snackbarMessage={snackbarMessage}
        snackbarColor={snackbarColor}
        setSnackbarOpen={setSnackbarOpen}
        renderContent={renderContent}
      />

    </Box>

  );
};

export default StaffManagement;