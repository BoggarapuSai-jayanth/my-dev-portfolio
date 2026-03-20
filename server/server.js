require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contactRoutes = require('./routes/contactRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://my-dev-portfolio-ruby.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/test', (req, res) => {
  res.send("Server is alive");
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running successfully 🚀"
  });
});

// Database connection & Server start
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB Connected ✅");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error ❌", err);
  });
