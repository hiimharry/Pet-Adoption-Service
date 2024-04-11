import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Container, Card, CardContent, Typography, CardMedia, Grid } from '@mui/material';

function AnimalDetail() {
    const [animal, setAnimal] = useState(null);
    const { animalId } = useParams(); // Get the animal ID from the URL

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/animals/${animalId}`);
                setAnimal(response.data);
            } catch (error) {
                console.error('Failed to fetch animal details:', error);
            }
        };

        fetchAnimal();
    }, [animalId]);

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
                </CardContent>
            </Card>
        </Container>
    );
}

export default AnimalDetail;
