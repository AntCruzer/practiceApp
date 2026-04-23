const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* CHECK WHETHER THE LOGGED-IN USER OWNS THE TARGET ACCOUNT */
const canAccessUserAccount = (reqUser, targetUserId) => {
  if (!reqUser) return false;
  return Number(reqUser.id) === targetUserId;
};

const userController = {
  /*
    GET /api/users
    RETRIEVE ALL USERS
  */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAllUsers();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Database failed' });
    }
  },

  /*
    POST /api/auth/register
    CREATE A NEW USER
  */
  createUser: async (req, res) => {
    try {
      const name = req.body.name?.trim();
      const email = req.body.email?.trim();
      const password = req.body.password;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: 'Name, email, and password are required'
        });
      }

      const hash = await bcrypt.hash(password, 10);
      const newId = await User.create(name, email, hash);

      return res.status(201).json({
        message: 'User created',
        id: newId
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already in use' });
      }

      return res.status(500).json({ error: err.message });
    }
  },

  /*
    POST /api/auth/login
    VALIDATE USER CREDENTIALS AND RETURN JWT
  */
  login: async (req, res) => {
    try {
      const email = req.body.email?.trim();
      const password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      const user = await User.findByEmail(email);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  /*
    PUT /api/users/:id
    UPDATE THE CURRENT LOGGED-IN USER
  */
  updateUser: async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      if (!canAccessUserAccount(req.user, id)) {
        return res.status(403).json({
          error: 'Forbidden: You can only update your own account'
        });
      }

      const updates = {};

      if (req.body.name !== undefined) {
        updates.name = req.body.name?.trim();
      }

      if (req.body.email !== undefined) {
        updates.email = req.body.email?.trim();
      }

      if (req.body.password !== undefined) {
        updates.password = await bcrypt.hash(req.body.password, 10);
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          error: 'Provide at least one field to update'
        });
      }

      const affected = await User.updateById(id, updates);

      if (affected === 0) {
        return res.status(404).json({
          error: 'User not found (or nothing changed)'
        });
      }

      return res.status(200).json({
        message: 'User updated',
        id
      });
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Email already in use' });
      }

      return res.status(500).json({ error: err.message });
    }
  },

  /*
    DELETE /api/users/:id
    DELETE THE CURRENT LOGGED-IN USER
  */
  deleteUser: async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!id) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      if (!canAccessUserAccount(req.user, id)) {
        return res.status(403).json({
          error: 'Forbidden: You can only delete your own account'
        });
      }

      const affected = await User.deleteById(id);

      if (affected === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({
        message: 'User deleted',
        id
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};

module.exports = userController;


// // BUSINESS LOGIC FOR USER RELATED OPERATIONS
// // LOGIC LAYER, HANDLES REQUESTS AND RESPONSES, VALIDATION

// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// /* CHECKS WHETHER THE LOGGED-IN USER OWNS THE TARGET ACCOUNT
//    OR HAS ADMIN PRIVILEGES */
// const canAccessUserAccount = (reqUser, targetUserId) => {
//   if (!reqUser) return false;

//   return Number(reqUser.id) === targetUserId || reqUser.isAdmin === true;
// };

// const userController = {
//   /*
//     GET /users
//     ATTEMPTS TO RETRIEVE ALL USERS RECORDED IN USERS TABLE IN THE DB
//   */
//   getAllUsers: async (req, res) => {
//     try {
//       const users = await User.getAllUsers();
//       console.log('**GET getAllUsers SUCCESSFUL**');
//       res.json(users);
//     } catch (err) {
//       console.log('**GET getAllUsers FAILED**');
//       res.status(500).json({ error: 'Database Failed' });
//     }
//   },

//   /*
//     POST /users
//     CREATES AND ADDS A NEW USER'S DETAILS TO DB
//   */
//   createUser: async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       console.log('**POST createUser FAILED**');
//       return res.status(400).json({ error: 'Name, Email and Password are required' });
//     }

//     try {
//       const hash = await bcrypt.hash(password, 10);
//       console.log('Hash: ', hash);

//       const newId = await User.create(name, email, hash);
//       console.log('**POST createUser SUCCESSFUL**');

//       res.status(201).json({ message: 'User created', id: newId });
//     } catch (error) {
//       console.log('**POST createUser FAILED**');
//       res.status(500).json({ error: error.message });
//     }
//   },

//   /*
//     POST /login
//     VALIDATES USER'S CREDENTIALS AND ASSIGNS JWT IF RECORD IS FOUND
//   */
//   login: async (req, res) => {
//     const { email, password } = req.body;

//     try {
//       const user = await User.findByEmail(email);
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         return res.status(400).json({ error: 'Invalid Credentials' });
//       }

//       const token = jwt.sign(
//         { id: user.id, email: user.email },
//         process.env.JWT_SECRET,
//         { expiresIn: '1h' }
//       );

//       return res.json({ token });
//     } catch (err) {
//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     PUT /users/:id
//     UPDATES CURRENT LOGGED-IN USER
//   */
//   updateUser: async (req, res) => {
//     try {
//       const id = Number(req.params.id);
//       if (!id) {
//         return res.status(400).json({ error: 'Invalid ID' });
//       }

//       /* BLOCK USERS FROM EDITING OTHER USERS */
//       if (!canAccessUserAccount(req.user, id)) {
//         return res.status(403).json({ error: 'Forbidden: You can only update your own account' });
//       }

//       const { name, email, password } = req.body;

//       const updates = {};
//       if (name) updates.name = name;
//       if (email) updates.email = email;

//       if (password) {
//         const hash = await bcrypt.hash(password, 10);
//         updates.password = hash;
//       }

//       if (Object.keys(updates).length === 0) {
//         return res.status(400).json({
//           error: 'Provide at least one field to update (name/email/password)',
//         });
//       }

//       const affected = await User.updateById(id, updates);

//       if (affected === 0) {
//         return res.status(404).json({ error: 'User not found (or nothing changed)' });
//       }

//       return res.status(200).json({ message: 'User updated', id });
//     } catch (err) {
//       return res.status(500).json({ error: err.message });
//     }
//   },

//   /*
//     DELETE /users/:id
//     DELETES USER WITH MATCHING CREDENTIALS FROM TABLE IN DB
//   */
//   deleteUser: async (req, res) => {
//     try {
//       const id = Number(req.params.id);
//       if (!id) {
//         return res.status(400).json({ error: 'Invalid ID' });
//       }

//       /* BLOCK USERS FROM DELETING OTHER USERS */
//       if (!canAccessUserAccount(req.user, id)) {
//         return res.status(403).json({ error: 'Forbidden: You can only delete your own account' });
//       }

//       const affected = await User.deleteById(id);

//       if (affected === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       return res.status(200).json({ message: 'User deleted', id });
//     } catch (err) {
//       return res.status(500).json({ error: err.message });
//     }
//   },
// };

// module.exports = userController;