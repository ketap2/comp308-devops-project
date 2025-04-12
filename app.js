const express = require('express');
const app = express();

// Load environment configuration
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
require('dotenv').config({
  path: envFile,
});

const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Environment-specific middleware
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  if (process.env.ENABLE_LOGGING === 'true') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
  }

  // Enable CORS for development and test
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (
      origin &&
      (origin === process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*')
    ) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );
    }
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    version: process.env.API_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// Sample in-memory data store
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the COMP308 DevOps Project API',
    version: '1.0.0',
    status: 'running',
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Get user by id
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Update a user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, email } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
  };

  res.json(users[userIndex]);
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users[userIndex];
  // Remove the user from the array
  users.splice(userIndex, 1);

  // Verify the user was actually deleted
  const userStillExists = users.some((u) => u.id === id);
  if (userStillExists) {
    return res.status(500).json({ error: 'Failed to delete user' });
  }

  res.json(deletedUser);
});

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${port}`
    );
  });
}

module.exports = app; // Export for testing
