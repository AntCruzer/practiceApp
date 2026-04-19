// REFERENCES
const db = require('../config/database');

/* CONVERTS JAVASCRIPT TRUE/FALSE INTO MYSQL 1/0 */
const toTinyInt = (value) => (value ? 1 : 0);

/* WATCHLIST MODEL */
/* DIRECT DATABASE QUERIES FOR THE WATCHLISTS TABLE */

const Watchlist = {
  /*
    GET ALL WATCHLIST ENTRIES FOR A SPECIFIC USER
    JOINS MOVIE DATA SO THE FRONTEND CAN SHOW USEFUL DETAILS
  */
  getAllByUserId: async (userId) => {
    const sql = `
      SELECT
        w.id,
        w.user_id,
        w.movie_id,
        w.region,
        w.platform,
        w.remind_on_sale,
        w.remind_on_release,
        w.ticket_on_sale_date_override,
        w.created_at,
        w.updated_at,
        m.tmdb_id,
        m.title,
        m.release_date,
        m.poster_path,
        m.runtime,
        m.last_synced_at
      FROM watchlists w
      INNER JOIN movies m
        ON w.movie_id = m.id
      WHERE w.user_id = ?
      ORDER BY m.release_date ASC, m.title ASC
    `;

    const [rows] = await db.query(sql, [userId]);
    return rows;
  },

  /*
    FIND A SINGLE WATCHLIST ENTRY BY ITS LOCAL ID
  */
  findById: async (id) => {
    const sql = `
      SELECT
        id,
        user_id,
        movie_id,
        region,
        platform,
        remind_on_sale,
        remind_on_release,
        ticket_on_sale_date_override,
        created_at,
        updated_at
      FROM watchlists
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  /*
    FIND WHETHER A USER IS ALREADY FOLLOWING A MOVIE
    USES THE LOCAL MOVIES.ID VALUE, NOT TMDB_ID
  */
  findByUserAndMovie: async (userId, movieId) => {
    const sql = `
      SELECT
        id,
        user_id,
        movie_id,
        region,
        platform,
        remind_on_sale,
        remind_on_release,
        ticket_on_sale_date_override,
        created_at,
        updated_at
      FROM watchlists
      WHERE user_id = ? AND movie_id = ?
    `;

    const [rows] = await db.query(sql, [userId, movieId]);
    return rows[0];
  },

  /*
    CREATE A NEW WATCHLIST ENTRY
  */
  create: async (
    userId,
    movieId,
    region,
    platform,
    remindOnSale,
    remindOnRelease,
    ticketOnSaleDateOverride
  ) => {
    const sql = `
      INSERT INTO watchlists (
        user_id,
        movie_id,
        region,
        platform,
        remind_on_sale,
        remind_on_release,
        ticket_on_sale_date_override
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      userId,
      movieId,
      region ?? null,
      platform ?? null,
      toTinyInt(remindOnSale),
      toTinyInt(remindOnRelease),
      ticketOnSaleDateOverride ?? null
    ]);

    return result.insertId;
  },

  /*
    UPDATE A WATCHLIST ENTRY BY ITS LOCAL ID
    ONLY PROVIDED FIELDS WILL BE UPDATED
  */
  updateById: async (id, updates) => {
    const fields = [];
    const values = [];

    if (updates.user_id !== undefined) {
      fields.push('user_id = ?');
      values.push(updates.user_id);
    }

    if (updates.movie_id !== undefined) {
      fields.push('movie_id = ?');
      values.push(updates.movie_id);
    }

    if (updates.region !== undefined) {
      fields.push('region = ?');
      values.push(updates.region);
    }

    if (updates.platform !== undefined) {
      fields.push('platform = ?');
      values.push(updates.platform);
    }

    if (updates.remind_on_sale !== undefined) {
      fields.push('remind_on_sale = ?');
      values.push(toTinyInt(updates.remind_on_sale));
    }

    if (updates.remind_on_release !== undefined) {
      fields.push('remind_on_release = ?');
      values.push(toTinyInt(updates.remind_on_release));
    }

    if (updates.ticket_on_sale_date_override !== undefined) {
      fields.push('ticket_on_sale_date_override = ?');
      values.push(updates.ticket_on_sale_date_override);
    }

    if (fields.length === 0) {
      return 0;
    }

    const sql = `
      UPDATE watchlists
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(sql, values);
    return result.affectedRows;
  },

  /*
    DELETE A WATCHLIST ENTRY BY ITS LOCAL ID
  */
  deleteById: async (id) => {
    const sql = `
      DELETE FROM watchlists
      WHERE id = ?
    `;

    const [result] = await db.query(sql, [id]);
    return result.affectedRows;
  },

  /*
    OPTIONAL CONVENIENCE METHOD:
    UNFOLLOW A MOVIE USING USER ID + MOVIE ID
  */
  deleteByUserAndMovie: async (userId, movieId) => {
    const sql = `
      DELETE FROM watchlists
      WHERE user_id = ? AND movie_id = ?
    `;

    const [result] = await db.query(sql, [userId, movieId]);
    return result.affectedRows;
  }
};

module.exports = Watchlist;