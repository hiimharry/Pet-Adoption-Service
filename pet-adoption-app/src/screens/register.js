import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Grid } from '@mui/material';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    email: '',
    DOB: '', // Date of birth
    street: '',
    city: '',
    state: '',
    zipcode: '',
    admin: false, // Assuming this is a boolean field for admin rights
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You would need to adjust your backend to handle address information properly
    // This may involve creating a separate address record and linking it to the user
    try {
      const response = await axios.post('http://localhost:3000/users', formData);
      console.log(response.data);
      // Handle success, redirect to login or show message
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error, show message to user
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Register
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="firstName"
          label="First Name"
          name="firstName"
          autoFocus
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="lastName"
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username" // Fixed typo in 'name' attribute
          value={formData.username}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <TextField
          id="DOB"
          label="Date of Birth"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
          name="DOB"
          value={formData.DOB}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="street"
          label="Street Address"
          name="street"
          value={formData.street}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="city"
          label="City"
          name="city"
          value={formData.city}
          onChange={handleInputChange}
        />
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="state"
              label="State"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="zipcode"
              label="Zip Code"
              name="zipcode"
              value={formData.zipcode}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
      </form>
    </Container>
  );
}

export default Register;
