import express from "express";
import mysql from "mysql2/promise"; 
import cors from "cors";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

// get static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "0121250",
  port: 3306,
  database: "students",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Connect to MySQL server and setup database and table if they don't exist
// (async () => {
//   try {
//     const connection = await pool.getConnection();
//     console.log("Connected to MySQL server");

//     await connection.query("CREATE DATABASE IF NOT EXISTS students");
//     await connection.query("USE students");
//     await connection.query(`
//       CREATE TABLE IF NOT EXISTS students (
//         id INT PRIMARY KEY,
//         name VARCHAR(255) NOT NULL,
//         gpa DECIMAL(3, 2) NOT NULL,
//         age INT NOT NULL
//       )
//     `);
//     console.log("Database and table setup complete");
//     connection.release();
//   } catch (error) {
//     console.error("Error setting up database and table:", error);
//   }
// })();

// Route to fetch students data
app.get('/api/students', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query('SELECT * FROM students');
    connection.release();
    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
