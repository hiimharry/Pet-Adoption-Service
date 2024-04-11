import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';

function AddAnimal() {
    const [animalData, setAnimalData] = useState({
        species: '',
        breeds: '',
        dob: '',
        sex: '',
        name: '',
        size: '',
        personality: '',
        color: '',
        behavior: '',
        description: '',
        adoptionFee: '',
        neutered: false,
        vaccinated: false,
        complications: ''
        });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        type === 'checkbox' ? setAnimalData({ ...animalData, [name]: checked }) : setAnimalData({ ...animalData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/animals', animalData);
            console.log('Animal added:', response.data);
            // Optionally reset form or provide feedback
        } catch (error) {
            console.error('Failed to add animal:', error);
        }
    };

    return (
        <Container component="main" maxWidth="md">
            <Typography component="h1" variant="h5">Add Animal for Adoption</Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="species" label="Species" onChange={handleChange} value={animalData.species} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="breeds" label="Breed(s)" onChange={handleChange} value={animalData.breeds} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="dob" label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} onChange={handleChange} value={animalData.dob} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="sex" label="Sex" onChange={handleChange} value={animalData.sex} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required name="name" label="Name" onChange={handleChange} value={animalData.name} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="size" label="Size" onChange={handleChange} value={animalData.size} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="color" label="Color" onChange={handleChange} value={animalData.color} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required name="personality" label="Personality" multiline rows={2} onChange={handleChange} value={animalData.personality} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required name="behavior" label="Behavior" multiline rows={2} onChange={handleChange} value={animalData.behavior} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth required name="description" label="Description" multiline rows={4} onChange={handleChange} value={animalData.description} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth required name="adoptionFee" label="Adoption Fee" type="number" onChange={handleChange} value={animalData.adoptionFee} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={<Checkbox checked={animalData.neutered} onChange={handleChange} name="neutered" />}
                            label="Neutered"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={animalData.vaccinated} onChange={handleChange} name="vaccinated" />}
                            label="Vaccinated"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth name="complications" label="Medical Complications" multiline rows={3} onChange={handleChange} value={animalData.complications}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            required
                            name="pictureUrl"
                            label="Picture URL"
                            onChange={handleChange}
                            value={animalData.pictureUrl}
                            helperText="Enter a URL to an image of the animal"
                        />
                    </Grid>
                </Grid>
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3 }}>
                    Submit
                </Button>
            </form>
        </Container>
    );
}

export default AddAnimal;
