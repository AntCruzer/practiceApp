const db = require('../config/database');

const User = {
    getAllUsers: async function() {
        const [rows] = await db.query('SELECT * FROM users');
        return rows;
    },
    create: async function(name, email) {
        const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
        const [result] = await db.query(sql, [name, email]);
        return result.insertId;
    },

    findById: async function(id) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    }


};

module.exports = User;