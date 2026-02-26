/* USER DATA MODEL */
// DATA LAYER
// SQL QUERIES LIVE HERE

// REFERENCE
const db = require('../config/database');

const User = {

    // METHOD: READ ALL USERS
    getAllUsers: async function() {
        const [rows] = await db.query('SELECT * FROM users');

        if (rows.length <= 0){
            rows[0] = {"NoData": "true"};
        }

        return rows;
    },

    // METHOD: CREATE NEW USER
    create: async function(name, email, password) {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, email, password]);
        return result.insertId;
    },

    // create: async function(name, email, password) {
    //     const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    //     const [result] = await db.query(sql, [name, email, password]);
    //     console.log("Result: ", result);
    //     return result;
    // },

    // METHOD: FIND USER BY ID (MY ADDITION)
    findById: async function(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // METHOD: FIND USER BY EMAIL
    findByEmail: async function(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows[0];
    }

};

module.exports = User;