import pool from '../config/db.js';

export const createUser = async (name, email, hashedPassword) => {
  const [result] = await pool.execute(
    'INSERT INTO users (name , email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return result;
};

export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [
    email,
  ]);
  return rows[0];
};

export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};
