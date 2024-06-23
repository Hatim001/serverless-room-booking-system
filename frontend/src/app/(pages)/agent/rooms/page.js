'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Button,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const DisplayRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    id: null,
    type: '',
    amenities: '',
    price: '',
    beds: '',
    image_url: '',
    imageType: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isImageUpdated, setIsImageUpdated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchRooms = async () => {
    try {
      const response = await axios.get(
        'https://ez1pt1j0a5.execute-api.us-east-1.amazonaws.com/displayRoom/display-room',
      );
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEdit = (id) => {
    const roomToEdit = rooms.find((room) => room.id === id);
    if (roomToEdit) {
      setRoomForm({
        id: roomToEdit.id,
        type: roomToEdit.type,
        amenities: roomToEdit.amenities,
        price: roomToEdit.price,
        beds: roomToEdit.beds,
        image_url: roomToEdit.image_url,
        imageType: roomToEdit.imageType,
      });
      setIsImageUpdated(false);
      handleOpen();
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(
        'https://v2bam8aejj.execute-api.us-east-1.amazonaws.com/development/agent/room/delete-room',
        { id },
      );
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      showSnackbar('Room deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting room:', error);
      showSnackbar('Failed to delete room', 'error');
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleInputChange = (e) => {
    setRoomForm({
      ...roomForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setIsImageUpdated(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setIsUploading(false);
        setRoomForm({
          ...roomForm,
          image_url: `data:${file.type};base64,${reader.result.split(',')[1]}`,
          imageType: file.type,
        });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = { ...roomForm };

    if (!isImageUpdated) {
      delete roomData.image_url;
      delete roomData.imageType;
    }

    try {
      const apiUrl = roomForm.id
        ? `https://kw1eb8d81k.execute-api.us-east-1.amazonaws.com/update-room/update-room`
        : `https://g25rcl49d9.execute-api.us-east-1.amazonaws.com/createRoom/create-room`;

      const method = roomForm.id ? 'put' : 'post';

      await axios[method](apiUrl, roomData);

      fetchRooms();

      handleClose();
      showSnackbar(
        roomForm.id ? 'Room updated successfully' : 'Room added successfully',
        'success',
      );
    } catch (error) {
      console.error('Error adding/updating room:', error);
      showSnackbar('Failed to add/update room', 'error');
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request data:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoomForm({
      id: null,
      type: '',
      amenities: '',
      price: '',
      beds: '',
      image_url: '',
      imageType: '',
    });
    setIsImageUpdated(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>Rooms</h1>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '20px',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<AddIcon />}
        >
          Add Room
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item key={room.id} xs={12} sm={6} md={4} lg={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardMedia
                component="img"
                height="200"
                width="100%"
                image={room.image_url}
                alt={`Image of ${room.type}`}
                style={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                  Type: {room.type}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Amenities: {room.amenities}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: {room.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Beds: {room.beds}
                </Typography>
                <div style={{ marginTop: 'auto' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleEdit(room.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDelete(room.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-room-modal-title"
        aria-describedby="add-room-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="add-room-modal-title"
            variant="h6"
            component="h2"
            gutterBottom
          >
            {roomForm.id ? 'Edit Room' : 'Add Room'}
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Type"
              name="type"
              value={roomForm.type}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Amenities"
              name="amenities"
              value={roomForm.amenities}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Price"
              name="price"
              value={roomForm.price}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Beds"
              name="beds"
              value={roomForm.beds}
              onChange={handleInputChange}
              required
            />
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}
            >
              <input
                accept="image/*"
                id="image-upload-button"
                type="file"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload-button">
                <Button variant="contained" component="span">
                  Upload Image
                </Button>
              </label>
              {isUploading && (
                <CircularProgress size={24} sx={{ marginLeft: '10px' }} />
              )}
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{ marginTop: '20px' }}
            >
              {roomForm.id ? 'Update Room' : 'Add Room'}
            </Button>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default DisplayRoom;
