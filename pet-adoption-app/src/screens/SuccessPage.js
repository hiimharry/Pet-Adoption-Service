import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Container } from '@mui/material';

function SuccessPage() {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/');  // Assuming '/' is your homepage route
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '50px', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Application Received
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your application. We have received it and will process it soon.
            </Typography>
            <Button variant="contained" color="primary" onClick={goHome} style={{ marginTop: '20px' }}>
                Go Home
            </Button>
        </Container>
    );
}

export default SuccessPage;
