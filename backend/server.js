const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

// Create express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your database username
  password: 'gumdrop2508', // replace with your database password
  database: 'AnimalAdoption'
});

// Connect to MySQL
db.connect(err => {
  if (err) throw err;
  console.log('Connected to the AnimalAdoption MySQL database.');
});

// Define routes
app.get('/', (req, res) => {
  res.send('Welcome to the Animal Adoption API!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// POST endpoint to add a new user
app.post('/users', (req, res) => {
  const { firstName, lastName, username, password, email, DOB, admin } = req.body;
  const sql = 'INSERT INTO User (firstName, lastName, username, password, email, DOB, admin) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [firstName, lastName, username, password, email, DOB, admin], (err, results) => {
    if (err) throw err;
    res.status(201).send(`User added with ID: ${results.insertId}`);
  });
});

// GET endpoint to retrieve all animals
app.get('/animals', (req, res) => {
  const sql = 'SELECT * FROM Animal';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
});

// DELETE endpoint to delete a user by ID
app.delete('/users/:id', (req, res) => {
  const sql = 'DELETE FROM User WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) throw err;
    res.status(200).send(`User deleted with ID: ${req.params.id}`);
  });
});