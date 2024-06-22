"use client";

import axios from 'axios'; 
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Grid, Button, Modal, Box, TextField, CircularProgress } from '@mui/material';

const DisplayRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({
    type: '',
    amenities: '',
    price: '',
    beds: '',
    imageBase64: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://ez1pt1j0a5.execute-api.us-east-1.amazonaws.com/displayRoom/display-room');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit room with id ${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://v2bam8aejj.execute-api.us-east-1.amazonaws.com/development/agent/room/delete-room/${id}`);
      setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
      console.log('Room information deleted successfully');
    } catch (error) {
      console.error('Error deleting room', error);
    }
  };

  const handleInputChange = (e) => {
    setRoomForm({
      ...roomForm,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setIsUploading(false);
        setRoomForm({
          ...roomForm,
          imageBase64: reader.result.split(',')[1] // Extract base64 data
        });
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ez1pt1j0a5.execute-api.us-east-1.amazonaws.com/addRoom/add-room', roomForm);
      console.log('Room added successfully:', response.data);
      setRooms(prevRooms => [...prevRooms, response.data]);
      handleClose();
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRoomForm({
      type: '',
      amenities: '',
      price: '',
      beds: '',
      imageBase64: '',
    });
  };

  return (
    <div>
      <h1>Rooms</h1>
      <Button variant="contained" color="primary" onClick={handleOpen} style={{ marginBottom: '20px' }}>
        Add Room
      </Button>

      <Grid container spacing={3}>
        {rooms.map(room => (
          <Grid item key={room.id} xs={12} sm={6} md={4} lg={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={room.image_url}
                alt={`Image of ${room.type}`}
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
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(room.id)}>
                    Edit
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(room.id)} style={{ marginLeft: '10px' }}>
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
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="add-room-modal-title" variant="h6" component="h2" gutterBottom>
            Add Room
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
            {isUploading && <CircularProgress size={24} style={{ marginLeft: '10px' }} />}
            <Button type="submit" variant="contained" color="primary" disabled={!roomForm.imageBase64}>
              Add Room
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default DisplayRoom;
