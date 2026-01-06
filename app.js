const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const activityRoutes = require('./src/routes/activityRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/activity', activityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));