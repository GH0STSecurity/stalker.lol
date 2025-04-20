const { Sequelize } = require('sequelize');
const path = require('path');

// Create a new Sequelize instance with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false // Set to console.log to see SQL queries
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize the database
const initDatabase = async () => {
  try {
    // Sync all models - using force: false to avoid dropping tables
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  testConnection,
  initDatabase
};
