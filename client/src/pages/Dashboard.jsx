import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setExpenses,
  setLoading,
  setError,
  removeExpense,
} from '../store/slices/expenseSlice.js';
import {
  setCategories,
  addCategory,
  removeCategory,
} from '../store/slices/categorySlice.js';
import api from '../api/axios.js';
import Navbar from '../components/layout/Navbar.jsx';
import ExpenseModal from '../components/ExpenseModel.jsx';

function Dashboard() {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { categories } = useSelector((state) => state.categories);
  const [showModal, setShowModal] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#6366f1',
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      dispatch(removeExpense(id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) return;
    try {
      const res = await api.post('/categories', newCategory);
      dispatch(addCategory({ id: res.data.categoryId, ...newCategory }));
      setNewCategory({ name: '', color: '#6366f1' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      dispatch(removeCategory(id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      dispatch(setLoading());
      try {
        const res = await api.get('/expenses');
        dispatch(setExpenses(res.data.expenses));
      } catch (err) {
        dispatch(setError(err.response?.data?.message || 'Failed to fetch'));
      }
    };
    fetchExpenses();
  }, [dispatch]);

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
  }, [dispatch]);

  const totalIncome = expenses
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const totalExpense = expenses
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Balance</p>
            <p
              className={`text-2xl font-semibold ${balance >= 0 ? 'text-gray-800' : 'text-red-500'}`}
            >
              ₹{balance.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Total income</p>
            <p className="text-2xl font-semibold text-green-500">
              ₹{totalIncome.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Total expenses</p>
            <p className="text-2xl font-semibold text-red-500">
              ₹{totalExpense.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Recent expenses</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              + Add expense
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              Loading...
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No expenses yet. Add your first one!
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium text-right">Amount</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr
                    key={expense.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {expense.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          expense.type === 'income'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-500'
                        }`}
                      >
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {expense.category_name ? (
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium text-white"
                          style={{ background: expense.category_color }}
                        >
                          {expense.category_name}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(expense.date).toLocaleDateString('en-IN')}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium text-right ${
                        expense.type === 'income'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {expense.type === 'income' ? '+' : '-'}₹
                      {parseFloat(expense.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setEditExpense(expense)}
                          className="text-xs text-indigo-500 hover:text-indigo-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Category Manager */}
        <div className="bg-white rounded-2xl border border-gray-100 mt-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800">Categories</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, color: e.target.value })
                }
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <button
                onClick={handleAddCategory}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>

            {categories.length === 0 ? (
              <p className="text-sm text-gray-400">No categories yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm text-white"
                    style={{ background: cat.color }}
                  >
                    {cat.name}
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="opacity-70 hover:opacity-100 transition text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && <ExpenseModal onClose={() => setShowModal(false)} />}
      {editExpense && (
        <ExpenseModal
          expense={editExpense}
          onClose={() => setEditExpense(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
