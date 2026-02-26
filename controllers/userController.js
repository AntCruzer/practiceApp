// MANAGES BUSINESS LOGIC FOR USER RELEATED OPERATIONS
// LOGIC LAYER, HANDLES REQUESTS AND REPSONSES, VALIDATION 

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userController = {
  
  // GET /users (RETRIEVES ALL USERS RECORDED IN USERS TABLE)
  getAllUsers: async (req, res) => {
    
    try {

      const users = await User.getAllUsers();
      console.log("**GET getAllUsers Successful**");
      res.json(users);

    } catch (err) {

      console.log("**GET getAllUsers NOT SUCCESSFUL**");
      res.status(500).json({ error: 'Database Failed' });

    }
  },

  // Handle POST /users (CREATES AND ADDS A NEW USER TO TABLE)
    createUser: async (req, res) => {

      // IDENTIFY FIELDS
      const { name, email, password } = req.body;
      
      // CHECK IF ANY FIELDS ARE EMPTY
      if (!name || !email || !password){
        console.log("**POST createUser NOT SUCCESSFUL**");
        return res.status(400).json({ error: 'Name, Email and Password are required'});
      }

      // ATTEMPT HASHING PROVIDED PASWORD
      try {
        const hash = await bcrypt.hash(password, 10);
        console.log("Hash: ", hash);
        const newId = await User.create(name, email, hash);
        console.log("**POST createUser SUCCESSFUL**");
        res.status(201).json({ message:'User created', id: newId});

      } catch (error) {
        console.log("**POST createUser NOT SUCCESSFUL**");
        res.status(500).json({ error: error.message });
      }
    },

    login: async (req, res) => {

      // IDENTIFY INPUTTED FIELDS
      const { email, password } = req.body;

      // VERIFY LOGIN CREDS
      try {

        // EMAIL CHECK
        const user = await User.findByEmail(email);
        if (!user) return res.status(404).json({ error: "User not found"});

        // // EMAIL MATCHES STORED PASSWORD
        // const isMatch = await bcrypt.compare(password, user.password);
        
        // // if (!isMatch) res.status(400).json({ error: "Invalid Credentials"});
        // if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });


        // // ASSIGN WEB TOKEN
        // // const token = jwt.sign({id: user.email }, process.env.JWT_SECRET, {expiresIn: '1h'});
        // const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // res.json({token});

        // EMAIL MATCHES STORED PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

        // ASSIGN WEB TOKEN
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });

      } catch (err){
      
        res.status(500).json({error: err.message});
      }
    },


    // PUT /users/:id (UPDATES A USER)
    updateUser: async (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: "Invalid ID" });

        const { name, email, password } = req.body;

        // BUILD UPDATES OBJECT
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;

        // IF PASSWORD PROVIDED, HASH IT BEFORE UPDATING
        if (password) {
          const hash = await bcrypt.hash(password, 10);
          updates.password = hash;
        }

        if (Object.keys(updates).length === 0) {
          return res.status(400).json({ error: "Provide at least one field to update (name/email/password)" });
        }

        const affected = await User.updateById(id, updates);

        if (affected === 0) {
          return res.status(404).json({ error: "User not found (or nothing changed)" });
        }

        return res.status(200).json({ message: "User updated", id });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    },

    // DELETE /users/:id (DELETES A USER)
    deleteUser: async (req, res) => {
      try {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ error: "Invalid ID" });

        const affected = await User.deleteById(id);

        if (affected === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User deleted", id });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
};

module.exports = userController;