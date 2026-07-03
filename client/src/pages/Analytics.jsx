import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  setExpenses,
  setLoading,
  setError,
} from '../store/slices/expenseSlice.js';
import api from '../api/axios.js';
import Navbar from '../components/layout/Navbar.jsx';

const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6'];

function Analytics() {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const [period, setPeriod] = useState('monthly');

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

  // ... rest of your component stays the same

  // Pie chart — income vs expense
  const pieData = useMemo(() => {
    const income = expenses
      .filter((e) => e.type === 'income')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const expense = expenses
      .filter((e) => e.type === 'expense')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);
    return [
      { name: 'Income', value: income },
      { name: 'Expense', value: expense },
    ];
  }, [expenses]);

  // Bar chart data based on period
  const barData = useMemo(() => {
    const onlyExpenses = expenses.filter((e) => e.type === 'expense');

    if (period === 'daily') {
      const map = {};
      onlyExpenses.forEach((e) => {
        const day = new Date(e.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        });
        map[day] = (map[day] || 0) + parseFloat(e.amount);
      });
      return Object.entries(map).map(([date, amount]) => ({ date, amount }));
    }

    if (period === 'weekly') {
      const map = {};
      onlyExpenses.forEach((e) => {
        const d = new Date(e.date);
        const week = `Week ${Math.ceil(d.getDate() / 7)} ${d.toLocaleString('en-IN', { month: 'short' })}`;
        map[week] = (map[week] || 0) + parseFloat(e.amount);
      });
      return Object.entries(map).map(([date, amount]) => ({ date, amount }));
    }

    // monthly
    const map = {};
    onlyExpenses.forEach((e) => {
      const month = new Date(e.date).toLocaleString('en-IN', {
        month: 'short',
        year: '2-digit',
      });
      map[month] = (map[month] || 0) + parseFloat(e.amount);
    });
    return Object.entries(map).map(([date, amount]) => ({ date, amount }));
  }, [expenses, period]);

  // Stats
  const onlyExpenses = expenses.filter((e) => e.type === 'expense');

  const biggestExpense = onlyExpenses.reduce(
    (max, e) => (parseFloat(e.amount) > parseFloat(max.amount || 0) ? e : max),
    {}
  );

  const avgPerDay = useMemo(() => {
    if (onlyExpenses.length === 0) return 0;
    const dates = onlyExpenses.map((e) => new Date(e.date).toDateString());
    const uniqueDays = new Set(dates).size;
    const total = onlyExpenses.reduce(
      (sum, e) => sum + parseFloat(e.amount),
      0
    );
    return (total / uniqueDays).toFixed(0);
  }, [onlyExpenses]);

  // Pie chart — spending by category
  const categoryData = useMemo(() => {
    const map = {};
    onlyExpenses.forEach((e) => {
      const key = e.category_name || 'Uncategorized';
      if (!map[key]) {
        map[key] = { name: key, value: 0, color: e.category_color || '#9ca3af' };
      }
      map[key].value += parseFloat(e.amount);
    });
    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [onlyExpenses]);

  const mostSpentCategory = useMemo(() => {
    const top = categoryData[0];
    return top
      ? { name: top.name, amount: `₹${top.value.toLocaleString('en-IN')}` }
      : null;
  }, [categoryData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Biggest expense</p>
            <p className="text-2xl font-semibold text-gray-800">
              {biggestExpense.amount
                ? `₹${parseFloat(biggestExpense.amount).toLocaleString('en-IN')}`
                : '—'}
            </p>
            {biggestExpense.title && (
              <p className="text-xs text-gray-400 mt-1">
                {biggestExpense.title}
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Average per day</p>
            <p className="text-2xl font-semibold text-gray-800">
              ₹{parseFloat(avgPerDay).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100">
            <p className="text-sm text-gray-400 mb-1">Top category spend</p>
            <p className="text-2xl font-semibold text-gray-800">
              {mostSpentCategory ? mostSpentCategory.amount : '—'}
            </p>
            {mostSpentCategory && (
              <p className="text-xs text-gray-400 mt-1">
                {mostSpentCategory.name}
              </p>
            )}
          </div>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie chart — income vs expenses */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-6">
              Income vs expenses
            </h2>
            {pieData.every((d) => d.value === 0) ? (
              <div className="text-center text-gray-400 text-sm py-12">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `₹${parseFloat(value).toLocaleString('en-IN')}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex justify-center gap-6 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie chart — spending by category */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-6">
              Spending by category
            </h2>
            {categoryData.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-12">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `₹${parseFloat(value).toLocaleString('en-IN')}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: entry.color }}
                  />
                  <span className="text-sm text-gray-500">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-800">Spending trend</h2>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {barData.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-12">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart
                  data={barData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    formatter={(value) => [
                      `₹${parseFloat(value).toLocaleString('en-IN')}`,
                      'Spent',
                    ]}
                  />
                  <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
