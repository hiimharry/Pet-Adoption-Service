import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { useAuth } from '..//AuthContext';

function Login() {
    const [credentials, setCredentials] = useState({
      username: '',
      password: '',
    });
    const [error, setError] = useState(''); // State to handle error message
    const navigate = useNavigate(); // Hook for redirection
    const { login } = useAuth();
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(''); // Reset error message on new submission
      try {
        await login(credentials.username, credentials.password);
        // Redirect to /animals on successful login
        navigate('/animals');
      } catch (error) {
        console.error('Login error:', error);
        // Set error message if login fails
        setError('Invalid username or password');
      }
    };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error} // Display error message here
          </Alert>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoFocus
          value={credentials.username}
          onChange={handleInputChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={credentials.password}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
      </form>
    </Container>
  );
}

export default Login;
