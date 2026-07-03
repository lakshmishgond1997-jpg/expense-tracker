import { createSlice } from '@reduxjs/toolkit';

const expenseSlice = createSlice({
  name: 'expenses',
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setExpenses: (state, action) => {
      state.expenses = action.payload;
      state.loading = false;
    },
    addExpense: (state, action) => {
      state.expenses.unshift(action.payload);
    },
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex((e) => e.id === action.payload.id);
      if (index !== -1) state.expenses[index] = action.payload;
    },
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload.id);
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLoading,
  setExpenses,
  addExpense,
  updateExpense,
  removeExpense,
  setError,
} = expenseSlice.actions;
export default expenseSlice.reducer;
