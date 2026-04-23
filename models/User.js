const db = require('../config/database');

/*
  USER MODEL
  DIRECT DATABASE QUERIES FOR THE USERS TABLE
*/

const User = {
  // READ ALL USERS
  getAllUsers: async () => {
    const [rows] = await db.query(
      'SELECT id, name, email FROM users ORDER BY id ASC'
    );
    return rows;
  },

  // CREATE A NEW USER
  create: async (name, email, password) => {
    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, email, password]);
    return result.insertId;
  },

  // FIND USER BY ID
  findById: async (id) => {
    const sql = `
      SELECT id, name, email
      FROM users
      WHERE id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  // FIND USER BY EMAIL
  findByEmail: async (email) => {
    const sql = `
      SELECT id, name, email, password
      FROM users
      WHERE email = ?
    `;
    const [rows] = await db.query(sql, [email]);
    return rows[0];
  },

  // UPDATE USER BY ID
  updateById: async (id, updates) => {
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
      values.push(updates.password);
    }

    if (fields.length === 0) {
      return 0;
    }

    const sql = `
      UPDATE users
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(sql, values);
    return result.affectedRows;
  },

  // DELETE USER BY ID
  deleteById: async (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.query(sql, [id]);
    return result.affectedRows;
  }
};

module.exports = User;

