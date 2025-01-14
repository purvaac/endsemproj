const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');

dotenv.config();  // Load environment variables

const app = express();
app.use(bodyParser.json());  // To parse JSON in incoming requests

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
