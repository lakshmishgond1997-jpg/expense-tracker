import pool from '../config/db.js';

export const getAllExpenses = async (userId) => {
  const [rows] = await pool.execute(
    'SELECT id,title, amount, type, description, date, category_id, created_at FROM expenses WHERE user_id= ? ORDER BY date DESC',
    [userId]
  );
  return rows;
};

export const getExpenseById = async (id, userId) => {
  const [rows] = await pool.execute(
    'SELECT id, title, amount, type, description, date, category_id, created_at FROM expenses Where id = ? AND user_id = ?',
    [id, userId]
  );
  return rows[0];
};

export const createExpense = async (
  userId,
  { title, amount, type, description, date, category_id }
) => {
  const [result] = await pool.execute(
    'INSERT INTO expenses (user_id, title, amount, type, description, date, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, title, amount, type, description, date, category_id]
  );
  return result;
};

export const updateExpense = async (
  id,
  userId,
  { title, amount, type, description, date, category_id }
) => {
  const [result] = await pool.execute(
    'UPDATE expenses SET title= ?, amount=?, type=?, description=?, date=?, category_id=? WHERE id=? AND user_id=?',
    [title, amount, type, description, date, category_id, id, userId]
  );
  return result;
};

export const deleteExpense = async (id, userId) => {
  const [result] = await pool.execute(
    'DELETE FROM expenses WHERE id=? AND user_id=?',
    [id, userId]
  );
  return result;
};
