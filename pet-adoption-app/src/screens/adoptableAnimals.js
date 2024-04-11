import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, CardContent, Typography } from '@mui/material';

function AdoptableAnimals() {
    const [animals, setAnimals] = useState([]);
  
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
  
    return (
    <Container>
      {animals.map((animal) => (
        <Card key={animal.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {animal.Name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {animal.Description}
            </Typography>
            {/* Additional details and styling here */}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default AdoptableAnimals;
s