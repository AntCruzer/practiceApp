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

  // Handle POST /users
  // createUser: async (req, res) => {
  //   try {
  //     // Validate Input
  //     if (!req.body.name || !req.body.email) {
  //       return res.status(400).json({ error: 'Missing fields' });
  //     }
  //     const newId = await User.create(req.body.name, req.body.email);
  //     res.status(201).json({ id: newId, message: 'User created' });
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // }

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

        // EMAIL MATCHES STORED PASSWORD
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) res.status(400).json({ error: "Invalid Credentials"});

        // ASSIGN WEB TOKEN
        const token = jwt.sign({id: user.email }, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});

      } catch (err){
      
        res.status(500).json({error: err.message});
      }
    }
};

module.exports = userController;