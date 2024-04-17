import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Card, CardMedia, CardContent, Grid, CardActionArea } from '@mui/material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

function UserApplications() {
    const [applications, setApplications] = useState([]);
    const { user } = useAuth();
    const userId = user.id;
    const navigate = useNavigate(); // Hook to handle navigation

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}/applications`);
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };

        fetchApplications();
    }, [userId]);

    const handleCardClick = (animalId) => {
        navigate(`/animals/${animalId}`);  // Navigate to the animal detail page
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>My Applications</Typography>
            <Grid container spacing={2}>
                {applications.map((app, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(app.id)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={app.pictureUrl || 'default-placeholder.png'}
                                    alt={`Picture of ${app.name}`}
                                />
                                <CardContent>
                                    <Typography variant="h5">{app.name}</Typography>
                                    <Typography variant="body2">Applied on: {new Date(app.date).toLocaleDateString()}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Status: {app.decision !== null ? (app.decision ? "Approved" : "Denied") : "Pending"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default UserApplications;
