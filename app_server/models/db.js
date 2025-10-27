const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/space-crafters';

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// --- FIXED Shutdown block for Mongoose v7+ ---
const gracefulShutdown = async (msg) => {
  try {
    await mongoose.connection.close();
    console.log('Mongoose disconnected through ' + msg);
  } catch (err) {
    console.error('Error during shutdown:', err);
  }
};

process.once('SIGUSR2', async () => {
  await gracefulShutdown('nodemon restart');
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', async () => {
  await gracefulShutdown('app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await gracefulShutdown('Heroku app shutdown');
  process.exit(0);
});

require('./locations');
