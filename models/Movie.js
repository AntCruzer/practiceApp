// REFERENCES
const db = require('../config/database');

/* MOVIE MODEL */
/* DIRECT DATABASE QUERIES FOR THE MOVIES TABLE */

const Movie = {
  /*
    GET ALL CACHED MOVIES
  */
  getAllMovies: async () => {
    const sql = `
      SELECT
        id,
        tmdb_id,
        title,
        release_date,
        poster_path,
        runtime,
        last_synced_at,
        created_at,
        updated_at
      FROM movies
      ORDER BY
        release_date IS NULL,
        release_date ASC,
        title ASC
    `;

    const [rows] = await db.query(sql);
    return rows;
  },

  /*
    FIND ONE MOVIE BY LOCAL DATABASE ID
  */
  findById: async (id) => {
    const sql = `
      SELECT
        id,
        tmdb_id,
        title,
        release_date,
        poster_path,
        runtime,
        last_synced_at,
        created_at,
        updated_at
      FROM movies
      WHERE id = ?
    `;

    const [rows] = await db.query(sql, [id]);
    return rows[0];
  },

  /*
    FIND ONE MOVIE BY TMDB ID
  */
  findByTmdbId: async (tmdbId) => {
    const sql = `
      SELECT
        id,
        tmdb_id,
        title,
        release_date,
        poster_path,
        runtime,
        last_synced_at,
        created_at,
        updated_at
      FROM movies
      WHERE tmdb_id = ?
    `;

    const [rows] = await db.query(sql, [tmdbId]);
    return rows[0];
  },

  /*
    CREATE A NEW MOVIE RECORD
  */
  create: async (tmdbId, title, releaseDate, posterPath, runtime, lastSyncedAt) => {
    const sql = `
      INSERT INTO movies (
        tmdb_id,
        title,
        release_date,
        poster_path,
        runtime,
        last_synced_at
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      tmdbId,
      title,
      releaseDate,
      posterPath,
      runtime,
      lastSyncedAt
    ]);

    return result.insertId;
  },

  /*
    UPDATE A MOVIE BY LOCAL DATABASE ID
    ONLY THE PROVIDED FIELDS WILL BE UPDATED
  */
  updateById: async (id, updates) => {
    const fields = [];
    const values = [];

    if (updates.tmdb_id !== undefined) {
      fields.push('tmdb_id = ?');
      values.push(updates.tmdb_id);
    }

    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }

    if (updates.release_date !== undefined) {
      fields.push('release_date = ?');
      values.push(updates.release_date);
    }

    if (updates.poster_path !== undefined) {
      fields.push('poster_path = ?');
      values.push(updates.poster_path);
    }

    if (updates.runtime !== undefined) {
      fields.push('runtime = ?');
      values.push(updates.runtime);
    }

    if (updates.last_synced_at !== undefined) {
      fields.push('last_synced_at = ?');
      values.push(updates.last_synced_at);
    }

    if (fields.length === 0) {
      return 0;
    }

    const sql = `
      UPDATE movies
      SET ${fields.join(', ')}
      WHERE id = ?
    `;

    values.push(id);

    const [result] = await db.query(sql, values);
    return result.affectedRows;
  }
};

module.exports = Movie;


// // REFERENCES
// const db = require('../config/database');

// /* MOVIE MODEL */
// /* DIRECT DATABASE QUERIES FOR THE MOVIES TABLE */

// const Movie = {
//   /*
//     GET ALL MOVIES
//   */
//   getAllMovies: async () => {
//     const sql = `
//       SELECT
//         id,
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at,
//         created_at,
//         updated_at
//       FROM movies
//       ORDER BY release_date ASC, title ASC
//     `;

//     const [rows] = await db.query(sql);
//     return rows;
//   },

//   /*
//     FIND ONE MOVIE BY LOCAL DATABASE ID
//   */
//   findById: async (id) => {
//     const sql = `
//       SELECT
//         id,
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at,
//         created_at,
//         updated_at
//       FROM movies
//       WHERE id = ?
//     `;

//     const [rows] = await db.query(sql, [id]);
//     return rows[0];
//   },

//   /*
//     FIND ONE MOVIE BY TMDB ID
//   */
//   findByTmdbId: async (tmdbId) => {
//     const sql = `
//       SELECT
//         id,
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at,
//         created_at,
//         updated_at
//       FROM movies
//       WHERE tmdb_id = ?
//     `;

//     const [rows] = await db.query(sql, [tmdbId]);
//     return rows[0];
//   },

//   /*
//     CREATE A NEW MOVIE RECORD
//   */
//   create: async (tmdbId, title, releaseDate, posterPath, runtime, lastSyncedAt) => {
//     const sql = `
//       INSERT INTO movies (
//         tmdb_id,
//         title,
//         release_date,
//         poster_path,
//         runtime,
//         last_synced_at
//       )
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await db.query(sql, [
//       tmdbId,
//       title,
//       releaseDate,
//       posterPath,
//       runtime,
//       lastSyncedAt
//     ]);

//     return result.insertId;
//   },

//   /*
//     UPDATE A MOVIE BY LOCAL DATABASE ID
//     ONLY THE PROVIDED FIELDS WILL BE UPDATED
//   */
//   updateById: async (id, updates) => {
//     const fields = [];
//     const values = [];

//     if (updates.tmdb_id !== undefined) {
//       fields.push('tmdb_id = ?');
//       values.push(updates.tmdb_id);
//     }

//     if (updates.title !== undefined) {
//       fields.push('title = ?');
//       values.push(updates.title);
//     }

//     if (updates.release_date !== undefined) {
//       fields.push('release_date = ?');
//       values.push(updates.release_date);
//     }

//     if (updates.poster_path !== undefined) {
//       fields.push('poster_path = ?');
//       values.push(updates.poster_path);
//     }

//     if (updates.runtime !== undefined) {
//       fields.push('runtime = ?');
//       values.push(updates.runtime);
//     }

//     if (updates.last_synced_at !== undefined) {
//       fields.push('last_synced_at = ?');
//       values.push(updates.last_synced_at);
//     }

//     if (fields.length === 0) {
//       return 0;
//     }

//     const sql = `
//       UPDATE movies
//       SET ${fields.join(', ')}
//       WHERE id = ?
//     `;

//     values.push(id);

//     const [result] = await db.query(sql, values);
//     return result.affectedRows;
//   },

//   /*
//     DELETE A MOVIE BY LOCAL DATABASE ID
//   */
//   deleteById: async (id) => {
//     const sql = `DELETE FROM movies WHERE id = ?`;
//     const [result] = await db.query(sql, [id]);
//     return result.affectedRows;
//   }
// };

// module.exports = Movie;