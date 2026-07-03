import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';
import api from '../api/axios.js';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        w-full
        max-w-md
      >
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Welcome Back
        </h1>
        <p className="text-gray-400 text-sm mb-6">sign to your account</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition  disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an acount?{' '}
            <Link to="/register" classNmae="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
