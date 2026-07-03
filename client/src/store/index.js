import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import expenseReducer from './slices/expenseSlice.js';
import categoryReducer from './slices/categorySlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    categories: categoryReducer,
  },
});
