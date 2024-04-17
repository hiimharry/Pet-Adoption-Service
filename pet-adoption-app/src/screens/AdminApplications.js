import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

function AdminApplications() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3000/applications')
            .then(response => setApplications(response.data))
            .catch(error => console.error('Error fetching applications:', error));
    }, []);

    const handleDecision = (id, decision) => {
        axios.put(`http://localhost:3000/applications/${id}`, { decision })
            .then(() => {
                alert('Decision updated successfully');
                setApplications(applications.map(app => 
                    app.id === id ? { ...app, decision: decision ? 'Approved' : 'Denied' } : app
                ));
            })
            .catch(error => alert('Error updating decision:', error));
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Animal Name</TableCell>
                        <TableCell>Applicant Username</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Current Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell>{app.AnimalName}</TableCell>
                            <TableCell>{app.UserName}</TableCell>
                            <TableCell>{app.description}</TableCell>
                            <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                            <TableCell>{app.decision ? 'Approved' : 'Pending'}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleDecision(app.id, true)} disabled={app.decision}>Approve</Button>
                                <Button onClick={() => handleDecision(app.id, false)} disabled={app.decision}>Deny</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default AdminApplications;
