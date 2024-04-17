const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt');
const session = require('express-session');

// Create express app
const app = express();
app.use(
  cors({
    credentials: true,
  })
);
const sessionOptions = {
  secret: "any string",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOptions));

// Middleware to parse JSON bodies
app.use(bodyParser.json());


// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
app.post('/users/signup', (req, res) => {
  const { firstName, lastName, username, password, email, DOB, street, city, state, zipcode, admin} = req.body;
  const checkUsername = 'SELECT * FROM User WHERE username = ?';
  db.query(checkUsername, [username], (err, results) => {
    if (err) throw err;
    const [existingUser] = results;
    if (existingUser) {
      return res.status(400).send('Username already taken');
    }
  });
  const password_hash = bcrypt.hashSync(password, 10);
  const address_sql = 'INSERT INTO Address (street, city, state, zipcode) VALUES (?, ?, ?, ?)';
  var address_id;
  db.query(address_sql, [street, city, state, zipcode],  (err, results) => {
    if (err) throw err;
    address_id = results.insertId;
    const sql = 'INSERT INTO User (firstName, lastName, username, password, email, DOB, admin, address_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [firstName, lastName, username, password_hash, email, DOB, admin, address_id], (err, results) => {
      if (err) throw err;
      req.session.user = { id: results.insertId, username, admin };
      res.status(201).json(req.session.user);
    });
  });
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM User WHERE username = ?';

  db.query(sql, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }

    const [user] = results;
    if (!user) {
      return res.status(404).send('User not found');
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }

      if (!isMatch) {
        return res.status(401).send('Invalid credentials');
      }

      // User authentication successful, set user session or token here
      req.session.user = { id: user.id, username: user.username, admin: user.admin };
      res.status(200).json(req.session.user);
    });
  });
});


app.get('/users/account', (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  }
});

const logout = (req, res) => {
  req.session.destroy();
  res.json(200);
};
app.post("/users/logout", logout);

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
  const { species, breeds, dob, sex, name, size, personality, color, behavior, description, adoptionFee, pictures, neutered, vaccinated, complications } = req.body;
  
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
          for (const pictureUrl of pictures) {
            const pictureSql = 'INSERT INTO Picture (URL, animal_id) VALUES (?, ?)';
            db.query(pictureSql, [pictureUrl, animalId], (err, pictureResults) => {
                if (err) {
                    console.error('Failed to insert picture:', err);
                    return res.status(500).send('Failed to add picture');
                }
            });
          }
          res.status(200).send(`Animal added with ID: ${animalId}`);
      });
    });
});

// Route to add user interest in an animal
app.post('/animals/:animalId', (req, res) => {
  const { userId } = req.body; // Extract userId from request body
  const animalId = req.params.animalId; // Extract animalId from URL parameters

  if (!userId) {
      return res.status(400).send("User ID is required");
  }
  // Check if the animal exists
  db.query('SELECT id FROM Animal WHERE id = ?', [animalId], (err, results) => {
      if (err) {
          console.error('Failed to check animal:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          return res.status(404).send("Animal not found");
      }
  });

  // Check if the user exists
  db.query('SELECT id FROM User WHERE id = ?', [userId], (err, results) => {
      if (err) {
          console.error('Failed to check user:', err);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          return res.status(404).send("User not found");
      }
  });

  // Insert into User_Interest_List
  db.query('INSERT INTO User_Interest_List (user_id, animal_id) VALUES (?, ?)', [userId, animalId], (err, results) => {
      if (err) {
          console.error('Failed to add interest:', err);
          return res.status(500).send('Internal Server Error');
      }
    res.status(201).send(`Interest added with ID: ${results.insertId}`);
  });
});

app.get('/users/:userId/interests', (req, res) => {
  const userId = req.params.userId;

  db.query(`
      SELECT A.*, P.url AS pictureUrl
      FROM User_Interest_List UIL
      JOIN Animal A ON UIL.animal_id = A.id
      LEFT JOIN Picture P ON A.id = P.animal_id
      WHERE UIL.user_id = ?
  `, [userId], (err, results) => {
      if (err) {
          console.error('Failed to fetch interests:', err);
          return res.status(500).send('Internal Server Error');
      }

      if (results.length === 0) {
          return res.status(404).send('No interests found for this user');
      }

      const animals = results.reduce((acc, item) => {
        const { pictureUrl, ...animalData } = item;
        if (!acc[animalData.id]) {
            acc[animalData.id] = { ...animalData, Pictures: [] };
        }
        if (pictureUrl) {
            acc[animalData.id].Pictures.push(pictureUrl);
        }
        return acc;
    }, {});
    res.status(200).json(Object.values(animals));
  });
});


// On your server
app.get('/users/:userId/interests/:animalId', (req, res) => {
  const { userId, animalId } = req.params;
  db.query(`
    SELECT 1 FROM User_Interest_List 
    WHERE user_id = ? AND animal_id = ?
  `, [userId, animalId], (err, result) => {
    if (err) {
      console.error('Failed to check interest:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.json({ isInterested: result.length > 0 });
  });
});

app.post('/animals/:animalId/toggle-interest', (req, res) => {
  const { userId } = req.body;
  const { animalId } = req.params;

  // Check for the existence of the user and animal
  db.query(
      `SELECT 1 FROM User_Interest_List WHERE user_id = ? AND animal_id = ?`,
      [userId, animalId],
      (err, exists) => {
          if (err) {
              console.error('Database query error:', err);
              return res.status(500).send('Internal Server Error');
          }

          if (exists.length > 0) {
              // User is already interested, remove their interest
              db.query(
                  `DELETE FROM User_Interest_List WHERE user_id = ? AND animal_id = ?`,
                  [userId, animalId],
                  (err, result) => {
                      if (err) {
                          console.error('Delete interest error:', err);
                          return res.status(500).send('Internal Server Error');
                      }
                      res.send({ isInterested: false });
                  }
              );
          } else {
              // User is not interested yet, add their interest
              db.query(
                  `INSERT INTO User_Interest_List (user_id, animal_id) VALUES (?, ?)`,
                  [userId, animalId],
                  (err, result) => {
                      if (err) {
                          console.error('Insert interest error:', err);
                          return res.status(500).send('Internal Server Error');
                      }
                      res.send({ isInterested: true });
                  }
              );
          }
      }
  );
});

app.post('/application', (req, res) => {
  const { userId, animalId, description } = req.body;

  if (!userId || !animalId || !description) {
      return res.status(400).send('All fields are required');
  }

  const query = `
      INSERT INTO Application (date, description, decision, user_id, animal_id)
      VALUES (CURDATE(), ?, NULL, ?, ?)
  `;

  db.query(query, [description, userId, animalId], (err, result) => {
      if (err) {
          console.error('Failed to insert application:', err);
          return res.status(500).send('Failed to submit application');
      }
      res.status(201).send(`Application submitted with ID: ${result.insertId}`);
  });
});

app.get('/users/:userId/applications/:animalId', (req, res) => {
  const { userId, animalId } = req.params;

  const query = `
      SELECT EXISTS (
          SELECT 1 FROM Application
          WHERE user_id = ? AND animal_id = ?
      ) AS hasApplied;
  `;

  db.query(query, [userId, animalId], (error, results) => {
      if (error) {
          console.error('Failed to check application status:', error);
          return res.status(500).send('Internal Server Error');
      }

      // results[0].hasApplied will be 0 if no application exists, 1 if it does
      const hasApplied = Boolean(results[0].hasApplied);
      res.json({ hasApplied });
  });
});

app.get('/users/:userId/applications', (req, res) => {
  const { userId } = req.params;

  // Modified query to include a subquery that selects the minimum picture URL for each animal
  const query = `
      SELECT A.name, A.id, AP.date, AP.decision, 
             (SELECT MIN(P.url) FROM Picture P WHERE P.animal_id = A.id) AS pictureUrl
      FROM Application AP
      JOIN Animal A ON AP.animal_id = A.id
      WHERE AP.user_id = ?
      ORDER BY AP.date DESC;
  `;

  db.query(query, [userId], (error, results) => {
      if (error) {
          console.error('Failed to retrieve applications:', error);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          return res.status(404).send('No applications found');
      }
      res.json(results.map(app => ({
        ...app,
        pictureUrl: app.pictureUrl // Default picture if none is found
      })));
  });
});

app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;

  const query = `
      SELECT id, firstName, lastName, username, email, DOB, admin 
      FROM User 
      WHERE id = ?;
  `;

  db.query(query, [userId], (error, results) => {
      if (error) {
          console.error('Failed to retrieve user data:', error);
          return res.status(500).send('Internal Server Error');
      }
      if (results.length === 0) {
          return res.status(404).send('User not found');
      }
      res.json(results[0]);
  });
});

app.delete('/users/:userId', (req, res) => {
  const { userId } = req.params;

  const query = 'DELETE FROM User WHERE id = ?';

  db.query(query, [userId], (error, results) => {
      if (error) {
          console.error('Failed to delete user:', error);
          return res.status(500).send('Internal Server Error');
      }
      res.send('Account deleted successfully.');
  });
});

app.delete('/animals/:animalId', (req, res) => {
  const { animalId } = req.params;

  if (!req.isAdmin) {
      return res.status(403).send('Unauthorized');
  }

  const query = 'DELETE FROM Animal WHERE id = ?';

  db.query(query, [animalId], (error) => {
      if (error) {
          return res.status(500).send('Failed to delete animal');
      }
      res.send('Animal deleted successfully');
  });
});

app.get('/applications', (req, res) => {
  const query = `
      SELECT Application.id, Application.date, Application.description, Application.decision,
             Animal.Name as AnimalName, User.username as UserName
      FROM Application
      JOIN Animal ON Application.animal_id = Animal.id
      JOIN User ON Application.user_id = User.id
      ORDER BY Application.date DESC;
  `;

  db.query(query, (error, results) => {
      if (error) {
          console.error('Failed to retrieve applications:', error);
          return res.status(500).send('Internal Server Error');
      }
      res.json(results);
  });
});

app.put('/applications/:id', (req, res) => {
  const { id } = req.params;
  const { decision } = req.body;  // decision should be a boolean
  const query = 'UPDATE Application SET decision = ? WHERE id = ?';

  db.query(query, [decision, id], (error) => {
      if (error) {
          console.error('Failed to update application:', error);
          return res.status(500).send('Internal Server Error');
      }
      res.send('Application updated successfully');
  });
});
