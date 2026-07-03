import pool from '../config/db.js';

export const getAllCategories = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT id, name, color FROM categories WHERE user_id = ? ORDER BY name ASC',
    [userId]
  );
  return rows;
};

export const createCategory = async (userId, name, color) => {
  const [result] = await pool.execute(
    'INSERT INTO categories (user_id, name, color) VALUES (?,?,?)',
    [userId, name, color]
  );
  return result;
};

export const deleteCategory = async (id, userId) => {
  const [result] = await pool.execute(
    'DELETE FROM categories WHERE id=? AND user_id = ?',
    [id, userId]
  );
  return result;
};
