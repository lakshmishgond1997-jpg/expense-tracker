import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice.js';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('passwords do not match');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Create account
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Start tracking your expenses today
        </p>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Lakshmish"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus::outline-none foucus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="test@test.com"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus::outline-none foucus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus::outline-none foucus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus::outline-none foucus:ring-2 focus:ring-indigo-500"
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
