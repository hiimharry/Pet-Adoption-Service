import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  // Make sure this path is correct

function NavBar() {
  const { user, logout } = useAuth();  // Use logout from the context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout method from context
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Animal Adoption
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Home
        </Button>
        { user ? (
          <>
            <Button color="inherit" component={RouterLink} to="/animals">
              Adoptable Animals
            </Button>
            <Button color="inherit" component={RouterLink} to="/interests">
              Interested Animals
            </Button>
            <Button color="inherit" component={RouterLink} to="/applications">
              Applications
            </Button>
            <Button color="inherit" component={RouterLink} to="/addanimals">
              Register Animal
            </Button>
            <Button color="inherit" component={RouterLink} to="/account">
              Account
            </Button>
            { user.admin && (
              <Button color="inherit" component={RouterLink} to="/admin">
                Admin
              </Button>
            )}
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/register">
              Register
            </Button>
            <Button color="inherit" component={RouterLink} to="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
