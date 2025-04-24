require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/auth');
const { testConnection, initDatabase } = require('./config/database');
const { User, Token } = require('./models');

const app = express();
const PORT = process.env.PORT || 3001;

// Create config directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'config'))) {
  fs.mkdirSync(path.join(__dirname, 'config'));
}

// Middleware
app.use(cors({
  origin: ['https://stalker.lol', 'http://localhost:8001'], // Allow specific origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you need to handle cookies/auth
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests explicitly
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Stalker.Lol Authentication API' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Initialize database
    await initDatabase();

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ where: { isAdmin: true } });
    if (!adminExists && process.env.ADMIN_PASSWORD) {
      const admin = await User.create({
        passwordHash: process.env.ADMIN_PASSWORD,
        isAdmin: true
      });
      console.log(`Admin user created with UUID: ${admin.uuid}`);
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
