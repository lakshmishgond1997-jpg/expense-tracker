import express from 'express';
import {
  getExpenses,
  getExpense,
  addExpense,
  editExpense,
  removeExpense,
} from '../controllers/expense.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getExpenses);
router.get('/:id', getExpense);
router.post('/', addExpense);
router.put('/:id', editExpense);
router.delete('/:id', removeExpense);

export default router;
