const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create express app
const app = express();
app.use(cors());

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
  const { firstName, lastName, username, password, email, DOB, street, city, state, zipcode, admin} = req.body;
  const address_sql = 'INSERT INTO Address (street, city, state, zipcode) VALUES (?, ?, ?, ?)';
  var address_id;
  db.query(address_sql, [street, city, state, zipcode],  (err, results) => {
    if (err) throw err;
    address_id = results.insertId;
    const sql = 'INSERT INTO User (firstName, lastName, username, password, email, DOB, admin, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, username, password, email, DOB, admin, address_id], (err, results) => {
      if (err) throw err;
      res.status(201).send(`User added with ID: ${results.insertId}`);
    });
  });
});

app.get('/animals', (req, res) => {
  const sql = 'SELECT Animal.*, Picture.URL FROM Animal LEFT JOIN Picture ON Animal.ID = Picture.animal_id';
  db.query(sql, (err, results) => {
      if (err) {
          console.error('Failed to retrieve animals:', err);
          return res.status(500).send('Failed to retrieve animals');
      }
      // Organize animals and their pictures into a structured format
      const animals = results.reduce((acc, item) => {
          const { URL, ...animalData } = item;
          if (!acc[animalData.id]) { // First occurrence of this animal
              acc[animalData.id] = { ...animalData, Pictures: [] };
          }
          if (URL) {
              acc[animalData.id].Pictures.push(URL);
          }
          return acc;
      }, {});
      res.status(200).json(Object.values(animals));
  });
});

app.get('/animals/:animalId', (req, res) => {
  const { animalId } = req.params;

  const sql = `
      SELECT 
          Animal.*, 
          Picture.URL AS PictureUrl 
      FROM 
          Animal 
      LEFT JOIN 
          Picture ON Animal.id = Picture.animal_id
      WHERE 
          Animal.id = ?
  `;

  db.query(sql, [animalId], (err, results) => {
      if (err) {
          console.error('Failed to retrieve animal:', err);
          return res.status(500).send('Failed to retrieve animal');
      }
      if (results.length === 0) {
          return res.status(404).send('No animal found with the given ID');
      }

      // Organize the data into a structured format
      const animalData = results.reduce((acc, item) => {
          if (!acc) {
              acc = {
                  ...item,
                  Pictures: []
              };
          }
          if (item.PictureUrl) acc.Pictures.push(item.PictureUrl);
          return acc;
      }, null);

      res.status(200).json(animalData);
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

app.post('/animals', (req, res) => {
  const { species, breeds, dob, sex, name, size, personality, color, behavior, description, adoptionFee, pictureUrl, neutered, vaccinated, complications } = req.body;
  
  // First, insert into Medical_History table
  const medicalSql = 'INSERT INTO Medical_History (neutered, vaccinated, complications) VALUES (?, ?, ?)';
  db.query(medicalSql, [neutered, vaccinated, complications], (err, medicalResults) => {
      if (err) {
          console.error('Failed to insert medical history:', err);
          return res.status(500).send('Failed to add medical history');
      }

      const medicalHistoryId = medicalResults.insertId;

      // Now, insert into Animal table with the new medicalHistoryId
      const animalSql = `
          INSERT INTO Animal 
          (Species, Breeds, DOB, Sex, Name, Size, Personality, Color, Behavior, Description, AdoptionFee, MedicalHistory) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(animalSql, [species, breeds, dob, sex, name, size, personality, color, behavior, description, adoptionFee, medicalHistoryId], (err, animalResults) => {
          if (err) {
              console.error('Failed to insert animal:', err);
              return res.status(500).send('Failed to add animal');
          }
          
          const animalId = animalResults.insertId;

          // Finally, insert the picture URL into the Picture table
          const pictureSql = 'INSERT INTO Picture (URL, animal_id) VALUES (?, ?)';
          db.query(pictureSql, [pictureUrl, animalId], (err, pictureResults) => {
              if (err) {
                  console.error('Failed to insert picture:', err);
                  return res.status(500).send('Failed to add picture');
              }

              res.status(201).send(`Animal added with ID: ${animalId}, picture added with ID: ${pictureResults.insertId}`);
          });
      });
  });
});

