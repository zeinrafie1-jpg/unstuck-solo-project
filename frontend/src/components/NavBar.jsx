import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

function NavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        {user && <span className="text-gray-600">Welcome, {user.name}</span>}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium"
          >
            Decisions
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-40">
              <Link
                to="/new-decision"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                New Decision
              </Link>
              <Link
                to="/my-decisions"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                My Decisions
              </Link>
            </div>
          )}
        </div>

        <button className="text-gray-700 hover:text-gray-900 font-medium">
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;