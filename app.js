const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Sample in-memory data store
let users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the COMP308 DevOps Project API",
    version: "1.0.0",
    status: "running",
  });
});

// Create a new user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app; // Export for testing
