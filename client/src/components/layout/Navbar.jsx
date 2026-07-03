import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex item-center justify-center">
          <span className="text-white text-sm font-bold">₹</span>
        </div>
        <span className="font-semibold text-gray-800">ExpenseTracker</span>
      </div>
      <div className="flex items-center gap-6">
        <Link
          to="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/analytics"
          className="text-sm text-gray-500 hover:text-gray-800 transition"
        >
          Analytics
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <span>Hi, {user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
