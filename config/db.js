require('dotenv').config();
const mysql = require('mysql2');

const config = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT, 10),
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false
  },
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Buat pool koneksi
const pool = mysql.createPool(process.env.DATABASE_URL || config);

// Handle error koneksi
pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

// Test koneksi saat startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to database');
  connection.release();
});

module.exports = pool.promise();