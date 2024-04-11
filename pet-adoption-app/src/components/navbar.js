import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Animal Adoption
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        <Button color="inherit" component={RouterLink} to="/register">
          Register
        </Button>
        <Button color="inherit" component={RouterLink} to="/login">
          Login
        </Button>
        <Button color="inherit" component={RouterLink} to="/animals">
          Adoptable Animals
        </Button>
        <Button color="inherit" component={RouterLink} to="/apply">
          Application
        </Button>
        <Button color="inherit" component={RouterLink} to="/addanimals">
          Register Animal
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
