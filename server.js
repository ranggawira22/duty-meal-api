const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
const dutyMealRoutes = require('./routes/dutyMealRoutes');
const scheduleMealLimitReset = require('./schedulers/mealLimitScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', dutyMealRoutes);

// Inisialisasi scheduler
scheduleMealLimitReset();

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});