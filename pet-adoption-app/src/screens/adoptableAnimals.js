import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography, CardMedia, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AdoptableAnimals() {
    const [animals, setAnimals] = useState([]);
    const navigate = useNavigate();  // Create a navigate function

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await axios.get('http://localhost:3000/animals');
                setAnimals(response.data);
            } catch (error) {
                console.error('Fetch animals error:', error);
            }
        };

        fetchAnimals();
    }, []);

    const handleCardClick = (animalId) => {
        navigate(`/animals/${animalId}`);  // Navigate to the detail page of the clicked animal
    };

    return (
        <Container>
            {animals.map((animal) => (
                <Card key={animal.id} sx={{ mb: 2 }} onClick={() => handleCardClick(animal.id)}>
                    <CardActionArea>
                        {animal.Pictures.length > 0 &&
                        <CardMedia
                            component="img"
                            height="140"
                            image={animal.Pictures.length > 0 ? animal.Pictures[0] : 'default-image-url.jpg'}
                            alt={`Picture of ${animal.Name}`}
                        />}
                        <CardContent>
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

export default AdoptableAnimals;
