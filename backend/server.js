require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const sportRoutes = require('./routes/sports');
const sessionRoutes = require('./routes/sessions');
const reportRoutes = require('./routes/reports');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true, useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(console.error);

app.use('/auth', authRoutes);
app.use('/sports', sportRoutes);
app.use('/sessions', sessionRoutes);
app.use('/reports', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
