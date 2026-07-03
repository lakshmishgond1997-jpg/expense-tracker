import express from 'express';

import {
  getCategories,
  addCategory,
  removeCategory,
} from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.use(protect);

router.get('/', getCategories);
router.post('/', addCategory);
router.delete('/:id', removeCategory);

export default router;
