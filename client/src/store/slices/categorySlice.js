import { createSlice } from '@reduxjs/toolkit';

const categorySlice = createSlice({
  name: 'category',
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.loading = false;
    },
    addCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(
        (c) => c.id !== action.payload
      );
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setCategories, addCategory, removeCategory, setLoading } =
  categorySlice.actions;

export default categorySlice.reducer;
