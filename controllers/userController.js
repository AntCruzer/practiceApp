const User = require('../models/User');

const userController = {
  // Handle GET /users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Database Failed' });
    }
  },

  // Handle POST /users
  createUser: async (req, res) => {
    try {
      // Validate Input
      if (!req.body.name || !req.body.email) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      const newId = await User.create(req.body.name, req.body.email);
      res.status(201).json({ id: newId, message: 'User created' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = userController;