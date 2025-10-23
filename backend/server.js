const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/auth');
const resourceRoutes = require('./routes/resources');
const internshipRoutes = require('./routes/internships');
const adminRoutes = require('./routes/admin'); // Only one line per route

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/admin', adminRoutes);

// Default route
app.get('/', (req, res) => res.send('🚀 CampusHub Backend Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
