import {
  getAllCategories,
  createCategory,
  deleteCategory,
} from '../models/category.model.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await getAllCategories(req.user.id);
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ message: 'Name and color are required' });
    }
    const result = await createCategory(req.user.id, name, color);
    res.status(201).json({
      message: 'Category created successfully',
      categoryId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const removeCategory = async (req, res) => {
  try {
    const result = await deleteCategory(req.params.id, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
