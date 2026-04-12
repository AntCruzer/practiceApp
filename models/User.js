const db = require('../config/database');


/* 
    USER MODEL 
    DIRECT DATABASE COMMANDS
*/

const User = {

    // METHOD: READ ALL USERS
    getAllUsers: async function () {
        const [rows] = await db.query('SELECT id, name, email FROM users');
        return rows;
    },

    // METHOD: CREATE NEW USER
    create: async function (name, email, password) {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [name, email, password]);
        return result.insertId;
    },

    // METHOD: FIND USER BY ID
    findById: async function (id) {
        const sql = 'SELECT id, name, email FROM users WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // METHOD: FIND USER BY EMAIL
    findByEmail: async function (email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.query(sql, [email]);
        return rows[0];
    },

    // METHOD: UPDATE USER BY ID (NAME/EMAIL/PASSWORD OPTIONAL)
    updateById: async function (id, updates) {
        const fields = [];
        const values = [];

        if (updates.name !== undefined) {
            fields.push('name = ?');
            values.push(updates.name);
        }
        if (updates.email !== undefined) {
            fields.push('email = ?');
            values.push(updates.email);
        }
        if (updates.password !== undefined) {
            fields.push('password = ?');
            values.push(updates.password); // EXPECT THIS TO ALREADY BE HASHED
        }

        if (fields.length === 0) {
            return 0;
        }

        const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        const [result] = await db.query(sql, values);
        return result.affectedRows;
    },

    // METHOD: DELETE USER BY ID
    deleteById: async function (id) {
        const sql = 'DELETE FROM users WHERE id = ?';
        const [result] = await db.query(sql, [id]);
        return result.affectedRows;
    },
};

module.exports = User;

// // REFERENCE(S)
// const db = require('../config/database');



// /* USER MODEL */

// const User = {

//     // METHOD: READ ALL USERS
//     getAllUsers: async function() {
//         const [rows] = await db.query('SELECT * FROM users');

//         // TO BE REMOVED
//         if (rows.length <= 0){
//             rows[0] = {"NoData": "true"};
//         }

//         return rows;
//     },

//     // METHOD: CREATE NEW USER
//     create: async function(name, email, password) {
//         const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
//         const [result] = await db.query(sql, [name, email, password]);
//         return result.insertId;
//     },

//     // METHOD: FIND USER BY ID
//     findById: async function(id) {
//         const sql = 'SELECT * FROM users WHERE id = ?';
//         const [rows] = await db.query(sql, [id]);
//         return rows[0];
//     },

//     // METHOD: FIND USER BY EMAIL
//     findByEmail: async function(email) {
//         const sql = 'SELECT * FROM users WHERE email = ?';
//         const [rows] = await db.query(sql, [email]);
//         return rows[0];
//     },

//     // METHOD: UPDATE USER BY ID (NAME/EMAIL/PASSWORD OPTIONAL)
//     updateById: async function(id, updates) {
//         const fields = [];
//         const values = [];

//         if (updates.name) {
//             fields.push('name = ?');
//             values.push(updates.name);
//         }
//         if (updates.email) {
//             fields.push('email = ?');
//             values.push(updates.email);
//         }
//         if (updates.password) {
//             fields.push('password = ?');
//             values.push(updates.password); // EXPECT THIS TO ALREADY BE HASHED
//         }

//         if (fields.length === 0) {
//             return 0; // NOTHING TO UPDATE
//         }

//         const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
//         values.push(id);

//         const [result] = await db.query(sql, values);
//         return result.affectedRows;
//     },

//     // METHOD: DELETE USER BY ID
//     deleteById: async function(id) {
//         const sql = 'DELETE FROM users WHERE id = ?';
//         const [result] = await db.query(sql, [id]);
//         return result.affectedRows;
//     },
    
// };

// module.exports = User;


