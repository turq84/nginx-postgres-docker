const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');
const pgClient = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

pgClient.on('connect', (client) => {
  client
    .query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch((err) => console.log('PG ERROR', err));
});

//Express route definitions
app.get('/', (req, res) => {
  res.send('Hi');
});

// get the values
app.get('/values', async (req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.json(values.rows);
});

// now the post -> insert value
app.post('/values', async (req, res) => {
  if (!req.body.value) {
    res.send('Error: there was a problem adding the item to the database');
  } else {
    pgClient.query('INSERT INTO values(number) VALUES($1)', [req.body.value]);
    res.send('Successfully added!');
  }
});

app.listen(5000, (err) => {
  console.log('Server is listening on port 5000');
});
