import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, FormControlLabel, Checkbox } from '@mui/material';

function AdoptionApplication() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        comments: '',
        agreeToTerms: false
    });
    const { animalId } = useParams();  // Retrieve the animal ID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        // Optional: Fetch specific animal details if needed
        console.log('Applying for animal ID:', animalId);
    }, [animalId]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!formData.agreeToTerms) {
            alert("You must agree to the terms.");
            return;
        }
        const applicationData = {
            ...formData,
            animalId: animalId  // Include the animal ID in the submission
        };
        try {
            const response = await axios.post('http://localhost:3000/applications', applicationData);
            console.log(response.data);
            alert("Application submitted successfully!");
            navigate(`/animal/${animalId}/thankyou`); // Navigate to a thank you page or back to the animal detail page
        } catch (error) {
            console.error('Failed to submit application:', error);
            alert("Failed to submit application.");
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Typography component="h1" variant="h5">Adopt {animalId}</Typography>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                {/* Form fields remain unchanged */}
                <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} margin="normal" required />
                {/* Additional form fields */}
                <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>
                    Submit Application
                </Button>
            </form>
        </Container>
    );
}

export default AdoptionApplication;
