import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Grid, Paper, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../AuthContext';

function UserProfile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const userId = user.id;
    const [userc, setUser] = useState(null);
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            axios.delete(`http://localhost:3000/users/${userId}`)
                .then(() => {
                    alert('Account deleted successfully.');
                    logout();
                    navigate('/');  // Redirect to the home page or login page
                })
                .catch(error => {
                    alert('Error deleting account:', error);
                });
        }
    };

    if (!userc) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    Account Information
                </Typography>
                <List>
                    <ListItem divider>
                        <ListItemText primary="First Name" secondary={userc.firstName} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary="Last Name" secondary={userc.lastName} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary="Username" secondary={userc.username} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary="Email" secondary={userc.email} />
                    </ListItem>
                    <ListItem divider>
                        <ListItemText primary="Date of Birth" secondary={new Date(userc.DOB).toLocaleDateString()} />
                    </ListItem>
                </List>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                        <Button variant="contained" color="error" fullWidth onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default UserProfile;
