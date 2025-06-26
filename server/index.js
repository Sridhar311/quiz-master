require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const questionsRoutes = require('./routes/questions');
const resultsRoutes = require('./routes/results');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;
console.log('PORT:', process.env);

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/users', usersRoutes);

// Serve React build static files in production
app.use(express.static(path.join(__dirname, '../build')));

// Catch-all route: must be last!
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch(err => {
  console.error('MongoDB connection error:', err);
}); 