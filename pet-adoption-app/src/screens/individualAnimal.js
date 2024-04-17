import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, CardContent, Typography, CardMedia, Grid, Button } from '@mui/material';
import { useAuth } from '../AuthContext';

function AnimalDetail() {
    const [isInterested, setIsInterested] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [animal, setAnimal] = useState(null);
    const { animalId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [editMode, setEditMode] = useState(false);

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    const handleDeleteAnimal = () => {
        if (window.confirm('Are you sure you want to delete this animal?')) {
            axios.delete(`http://localhost:3000/animals/${animalId}`)
                .then(() => {
                    alert('Animal deleted successfully');
                    navigate('/animals'); // Redirect to list page
                })
                .catch(error => {
                    console.error('Error deleting animal:', error);
                    alert('Failed to delete animal');
                });
        }
    };

    useEffect(() => {
        const fetchAnimalDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/animals/${animalId}`);
                setAnimal(response.data);
    
                // Check if the user has this animal in their interest list
                const interestResponse = await axios.get(`http://localhost:3000/users/${user.id}/interests/${animalId}`);
                setIsInterested(interestResponse.data.isInterested);
    
                // Check if the user has already applied for this animal
                const applicationResponse = await axios.get(`http://localhost:3000/users/${user.id}/applications/${animalId}`);
                setHasApplied(applicationResponse.data.hasApplied);
            } catch (error) {
                console.error('Failed to fetch animal details or interest:', error);
            }
        };
    
        fetchAnimalDetails();
    }, [animalId, user.id]);

    const handleApply = () => {
        // Navigate to the application page for this animal
        navigate(`/apply/${animalId}`);
    };

    const handleToggleInterest = async () => {
        if (!user) {
            navigate('/login');  // Ensure the user is logged in before allowing toggle
            return;
        }

        try {
            const response = await axios.post(`http://localhost:3000/animals/${animalId}/toggle-interest`, { userId: user.id });
            setIsInterested(response.data.isInterested);  // Update based on the response
        } catch (error) {
            console.error('Failed to toggle interest:', error);
        }
    };


    if (!animal) {
        return <Typography>Loading animal details...</Typography>;
    }

    return (
        <Container>
            <Typography variant="h4" gutterBottom>{animal.Name}</Typography>
            <Grid container spacing={2}>
                {animal.Pictures.map((url, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardMedia
                                component="img"
                                image={url || 'default-image-url.jpg'} // Default image if URL is missing
                                alt={`Picture of ${animal.Name}`}
                                style={{ height: 200, objectFit: 'contain' }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="body1" color="textSecondary">{animal.Description}</Typography>
                    <Typography variant="body1">Species: {animal.Species}</Typography>
                    <Typography variant="body1">Breed: {animal.Breeds}</Typography>
                    <Typography variant="body1">DOB: {animal.DOB}</Typography>
                    <Typography variant="body1">Sex: {animal.Sex}</Typography>
                    <Typography variant="body1">Color: {animal.Color}</Typography>
                    <Typography variant="body1">Personality: {animal.Personality}</Typography>
                    <Typography variant="body1">Behavior: {animal.Behavior}</Typography>
                    <Typography variant="body1">Adoption Fee: ${animal.AdoptionFee}</Typography>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApply}
                            disabled={hasApplied}
                        >
                            {hasApplied ? "Application Received" : "Apply for Adoption"}
                        </Button>
                        </Grid>
                        <Grid item>
                        <Button
                            variant="contained"
                            color={isInterested ? "primary" : "secondary"}
                            onClick={handleToggleInterest}
                        >
                            {isInterested ? "Remove from Interested List" : "Add to Interested List"}
                        </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            {user.admin && (
                        <Button variant="contained" color="error" onClick={handleDeleteAnimal}>
                            Delete Animal
                        </Button>
            )}
        </Container>
    );
}

export default AnimalDetail;
