import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CardMedia, CardActionArea, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function UserInterests() {
    const navigate = useNavigate();
    const [animals, setAnimals] = useState([]);
    const { user } = useAuth();
    const userId = user.id;
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}/interests`);
                setAnimals(response.data);
            } catch (error) {
                console.error('Error fetching interests:', error);
            }
        };

        fetchInterests();
    }, [userId]);

    const handleCardClick = (animalId) => {
        navigate(`/animals/${animalId}`);  // Navigate to the detail page of the clicked animal
    };

    return (
        <Container>
            <Typography variant="h4" component="h1" gutterBottom>
                My Interested Animals
            </Typography>
            {animals.map((animal) => (
                <Card key={animal.id} sx={{ display: 'flex', mb: 2 }} onClick={() => handleCardClick(animal.id)}>
                    <CardActionArea sx={{ display: 'flex', width: '100%' }}>
                        {animal.Pictures.length > 0 &&
                        <CardMedia
                            component="img"
                            sx={{ width: 140, height: 140 }} // fixed size, adjust as needed
                            image={animal.Pictures.length > 0 ? animal.Pictures[0] : 'default-image-url.jpg'}
                            alt={`Picture of ${animal.Name}`}
                        />}
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {animal.Name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
                                {animal.Description}
                            </Typography>
                            {/* Additional details and styling here */}
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </Container>
    );
}

export default UserInterests;
