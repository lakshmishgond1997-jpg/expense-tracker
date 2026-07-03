import pool from '../config/db.js';

export const getAllExpenses = async (userId) => {
  const [rows] = await pool.execute(
    `SELECT e.id, e.title, e.amount, e.type, e.description, e.date, e.category_id, e.created_at,
            c.name AS category_name, c.color AS category_color
     FROM expenses e
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.user_id = ?
     ORDER BY e.date DESC`,
    [userId]
  );
  return rows;
};

export const getExpenseById = async (id, userId) => {
  const [rows] = await pool.execute(
    `SELECT e.id, e.title, e.amount, e.type, e.description, e.date, e.category_id, e.created_at,
            c.name AS category_name, c.color AS category_color
     FROM expenses e
     LEFT JOIN categories c ON e.category_id = c.id
     WHERE e.id = ? AND e.user_id = ?`,
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
