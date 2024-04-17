import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        complications: '',
        pictures: []
    });
    const [error, setError] = useState(''); // State to handle error message
    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        type === 'checkbox' ? setAnimalData({ ...animalData, [name]: checked }) : setAnimalData({ ...animalData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        if (!animalData.species || !animalData.breeds || !animalData.dob || !animalData.sex || !animalData.name || !animalData.size || !animalData.color || !animalData.personality || !animalData.behavior || !animalData.description || !animalData.adoptionFee || !animalData.pictures) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/animals', animalData);
            console.log('Animal added:', response.data);
            navigate('/animals'); // Redirect to the animals page
        } catch (error) {
            console.error('Failed to add animal:', error);
            setError('Failed to submit form. Please try again.');
        }
    };

    const handleAddPicture = () => {
        setAnimalData({ ...animalData, pictures: [...animalData.pictures, ''] });
    };
    
    const handlePictureChange = (index, value) => {
        const updatedPictures = [...animalData.pictures];
        updatedPictures[index] = value;
        setAnimalData({ ...animalData, pictures: updatedPictures });
    };
    
    const handleRemovePicture = (index) => {
        const filteredPictures = animalData.pictures.filter((_, idx) => idx !== index);
        setAnimalData({ ...animalData, pictures: filteredPictures });
    };

    return (
        <Container component="main" maxWidth="md">
            <Typography component="h1" variant="h5">Add Animal for Adoption</Typography>
            {error && <Typography color="error">{error}</Typography>}
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
                        {animalData.pictures.map((url, index) => (
                            <Grid container spacing={1} key={index}>
                                <Grid item xs={10}>
                                    <TextField
                                        fullWidth
                                        name={`pictureUrl-${index}`}
                                        label="Picture URL"
                                        onChange={(e) => handlePictureChange(index, e.target.value)}
                                        value={url}
                                        helperText="Enter a URL to an image of the animal"
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <Button onClick={() => handleRemovePicture(index)} color="error">Remove</Button>
                                </Grid>
                            </Grid>
                        ))}
                        <Button onClick={handleAddPicture} variant="outlined" sx={{ mt: 1 }}>
                            Add Another Picture
                        </Button>
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
