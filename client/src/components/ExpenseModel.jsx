import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategories } from '../store/slices/categorySlice.js';
import { addExpense, updateExpense } from '../store/slices/expenseSlice.js';
import api from '../api/axios.js';

function ExpenseModal({ onClose, expense }) {
  const dispatch = useDispatch();
  const isEdit = !!expense;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: expense?.title || '',
    amount: expense?.amount || '',
    type: expense?.type || 'expense',
    description: expense?.description || '',
    date: expense?.date
      ? new Date(expense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    category_id: expense?.category_id || null,
  });
  const { categories } = useSelector((state) => state.categories);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        dispatch(setCategories(res.data.categories));
      } catch (err) {
        console.error('Failed to fetch categories');
      }
    };
    if (categories.length === 0) fetchCategories();
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/expenses/${expense.id}`, formData);
        dispatch(
          updateExpense({
            ...expense,
            ...formData,
            amount: parseFloat(formData.amount),
          })
        );
      } else {
        const res = await api.post('/expenses', formData);
        dispatch(
          addExpense({
            id: res.data.expenseId,
            ...formData,
            amount: parseFloat(formData.amount),
          })
        );
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit expense' : 'Add expense'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Lunch at MTR"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                required
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Description <span className="text-gray-300">(optional)</span>
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a note..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Category <span className="text-gray-300">(optional)</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id || ''}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Add expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseModal;
