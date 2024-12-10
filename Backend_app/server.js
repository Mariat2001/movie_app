const express = require("express");
const mysql = require("mysql");
const cors = require('cors');

const bcrypt = require('bcrypt');
const app = express();
require('dotenv').config(); // This will load variables from .env file
const jwt = require('jsonwebtoken');
app.use(cors());
app.use(express.json());

const jwtSecret = process.env.JWT_SECRET;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const port = process.env.PORT || 8087; // Fallback to 8082 if PORT is not set
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the .env file");
}
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"movieapp"

})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer schema

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    req.user = user; // Attach decoded user info to the request object
    next();
  });
}


app.post('/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
      // First, check if the email already exists
      const checkEmailSql = "SELECT * FROM users WHERE email = ?";
      db.query(checkEmailSql, [email], async (err, results) => {
          if (err) {
              console.error('Error checking email:', err);
              return res.status(500).json({ message: 'Error checking email' });
          }

          // If email already exists, return a response
          if (results.length > 0) {
              return res.status(400).json({ message: 'Email already in use' });
          }

          // If email is not found, hash the password and insert new user
          const hashedPassword = await bcrypt.hash(password, 10);
          const sql = "INSERT INTO users (name, email, password, phone, created_at) VALUES (?, ?, ?, ?, NOW())";
          const values = [name, email, hashedPassword, phone];

          db.query(sql, values, (err, data) => {
              if (err) {
                  console.error('Error executing query:', err);
                  return res.status(500).json({ message: 'Error creating user' });
              }
              return res.status(201).json({ message: 'User created successfully', userId: data.insertId });
          });
      });
  } catch (err) {
      console.error('Error hashing password:', err);
      res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  try {
    const checkEmailSql = "SELECT * FROM users WHERE email = ?";
    db.query(checkEmailSql, [email], async (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ message: 'Error checking email' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Invalid email or password' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email }, // Payload
        jwtSecret, // Secret key
        { expiresIn: '10h' } // Token expiry
      );

      return res.status(200).json({
        message: 'Signin successful',
        token, // Return token
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    });
  } catch (err) {
    console.error('Error during signin:', err);
    res.status(500).json({ message: 'Error during signin' });
  }
});


app.get('/favorites', authenticateToken, (req, res) => {
  const userId = req.user.id; // Extract user ID from token
  const query = 'SELECT * FROM favorites WHERE user_id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching favorites:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.json(results);
  });
});


// Add a favorite
// Add a favorite
app.post('/favorites', authenticateToken, (req, res) => {
  const { movieId, title, posterPath, releaseDate, status } = req.body;

  const userId = req.user.id; // Extract userId from the JWT token
  const query = 'INSERT INTO favorites (user_id, movie_id, title, poster_path, release_date, status) VALUES (?, ?, ?, ?, ?, ?)';
  const booleanStatus = status ? 1 : 0;

  db.query(query, [userId, movieId, title, posterPath, releaseDate, booleanStatus], (err) => {
    if (err) {
      console.error('Error adding favorite:', err);
      return res.status(500).send('Server error');
    }
    res.json({ success: true });
  });
});

// Get favorite status for a specific movie
app.get('/favorites/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  const query = 'SELECT status FROM favorites WHERE user_id = ? AND movie_id = ?';
  db.query(query, [userId, movieId], (err, results) => {
    if (err) {
      console.error('Error fetching favorite status:', err);
      return res.status(500).send('Server error');
    }
    if (results.length > 0) {
      return res.json({ status: results[0].status === 1 }); // Convert to boolean
    }
    res.json({ status: false }); // Default to false if no entry exists
  });
});

// Remove a favorite by ID
app.delete('/favorites', authenticateToken, (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  const query = 'DELETE FROM favorites WHERE user_id = ? AND id = ?';
  db.query(query, [userId, movieId], (err) => {
    if (err) {
      console.error('Error removing favorite:', err);
      return res.status(500).send('Server error');
    }
    res.json({ success: true });
  });
});

// Remove a favorite by Movie ID
app.delete('/favoritesHome', authenticateToken, (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id;

  const query = 'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?';
  db.query(query, [userId, movieId], (err) => {
    if (err) {
      console.error('Error removing favorite:', err);
      return res.status(500).send('Server error');
    }
    res.json({ success: true });
  });
});


const PORT = 8082;
app.listen(8082, ()=>{
  console.log(`Server running on http://localhost:${PORT}`);
})