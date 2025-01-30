const mysql = require('mysql2');

// Buat koneksi pool ke MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'laravel', // Sesuaikan dengan nama database Anda
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export pool promise
module.exports = pool.promise();
