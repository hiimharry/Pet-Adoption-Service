import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';
import { useAuth } from '../AuthContext';

function AdoptionApplication() {
    const [reason, setReason] = useState('');
    const [animal, setAnimal] = useState(null);  // Store animal data
    const { animalId } = useParams();  // Get animal ID from URL parameters
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/animals/${animalId}`);
                setAnimal(response.data);  // Assuming the response data has all the details of the animal
                console.log('Animal details:', response.data);
            } catch (error) {
                console.error('Error fetching animal details:', error);
            }
        };

        fetchAnimal();
    }, [animalId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Submit the reason for adoption
            await axios.post(`http://localhost:3000/application`, { description: reason, animalId, userId: user.id});
            navigate('/success');  // Redirect to a success page
        } catch (error) {
            console.error('Failed to submit application:', error);
        }
    };

    if (!animal) {
        return <Typography>Loading animal details...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            {console.log(animal)}
            <Card>
                <CardMedia
                    component="img"
                    height="250"
                    image={animal.PictureUrl}
                    alt={`Picture of ${animal.Name}`}
                />
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {animal.Name}
                    </Typography>
                </CardContent>
            </Card>
            <Typography variant="h5" gutterBottom>
                Adoption Application
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Why do you want to adopt this animal?"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                    required
                />
                <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
                    Submit Application
                </Button>
            </form>
        </Container>
    );
}

export default AdoptionApplication;
