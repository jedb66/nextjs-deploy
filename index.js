const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Use process.env.DATABASE_URL directly, and handle potential errors during connection
const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    // It's crucial to handle the error here.  The application might not work correctly
    // without a database connection.  You might want to throw an error, exit the process,
    // or attempt to reconnect.  For this example, I'll just log and continue (bad practice for production).
    // throw err; // Would stop the app.
    return; // IMPORTANT:  Return here to prevent further execution.
  }
  console.log('Connected to MySQL database');
});

app.get('/', (req, res) => {
  res.send('Hello world!!');
});

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', function (err, results, fields) {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send({ error: 'Database query failed' }); // Send an appropriate error response
      return;
    }
    res.send(results);
  });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM users WHERE id = ?', [id], function (err, results, fields) {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send({ error: 'Database query failed' }); // Send an appropriate error response
      return;
    }
    if (results.length === 0) {
      res.status(404).send({ error: 'User not found' }); // Handle the case where no user is found
      return;
    }
    res.send(results);
  });
});

app.post('/users', (req, res) => {
  const { fname, lname, username, password, avatar } = req.body; // Destructure for clarity
  if (!fname || !lname || !username || !password) {
    res.status(400).send({ error: 'Missing required fields' });
    return;
  }

  connection.query(
    'INSERT INTO `users` (`fname`, `lname`, `username`, `password`, `avatar`) VALUES (?, ?, ?, ?, ?)',
    [fname, lname, username, password, avatar], // Use the destructured variables
    function (err, results, fields) {
      if (err) {
        console.error('Error inserting into database:', err);
        res.status(500).send({ error: 'Database insert failed' }); // Send error
        return;
      }
      res.send(results);
    }
  );
});

app.put('/users', (req, res) => {
  const { fname, lname, username, password, avatar, id } = req.body;
    if (!fname || !lname || !username || !password || !id) {
        res.status(400).send({ error: 'Missing required fields' });
        return;
    }
  connection.query(
    'UPDATE `users` SET `fname`=?, `lname`=?, `username`=?, `password` =?, `avatar` =? WHERE id =? ',
    [fname, lname, username, password, avatar, id],
    function (err, results, fields) {
      if (err) {
        console.error('Error updating database:', err);
        res.status(500).send({ error: 'Database update failed' }); // Send error
        return;
      }
      res.send(results);
    }
  );
});

app.delete('/users', (req, res) => {
    const { id } = req.body; // Extract id from the request body
     if (!id) {
        res.status(400).send({ error: 'Missing required fields. Provide ID of user to delete.' });
        return;
    }
  connection.query('DELETE FROM `users` WHERE id =?', [id], function (err, results, fields) {
    if (err) {
      console.error('Error deleting from database:', err);
      res.status(500).send({ error: 'Database delete failed' }); // Send error
      return;
    }
    res.send(results);
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`CORS-enabled web server listening on port ${port}`);
});
