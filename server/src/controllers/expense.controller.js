import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../models/expense.model.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.user.id);
    res.status(200).json({ expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await getExpenseById(req.params.id, req.user.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { title, amount, type, description, date, category_id } = req.body;
    if (!title || !amount || !type || !date) {
      return res
        .status(400)
        .json({ message: 'Title, amount, type and date are required' });
    }
    const result = await createExpense(req.user.id, {
      title,
      amount,
      type,
      description,
      date,
      category_id,
    });
    res
      .status(201)
      .json({
        message: 'Expense created successfully',
        expenseId: result.insertId,
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const editExpense = async (req, res) => {
  try {
    const { title, amount, type, description, date, category_id } = req.body;
    const result = await updateExpense(req.params.id, req.user.id, {
      title,
      amount,
      type,
      description,
      date,
      category_id,
    });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeExpense = async (req, res) => {
  try {
    const result = await deleteExpense(req.params.id, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
