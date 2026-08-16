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
    <nav className="relative flex items-center justify-between px-6 py-4 bg-surface border-b border-border">
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="font-medium text-text-primary hover:opacity-80 transition-opacity">
          <span className="text-accent">Un</span>Stuck
        </Link>
        {/* {user && <span className=" absolute left-1/2 -translate-x-1/2 text-text-secondary">Welcome, {user.name}!</span>} */}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center gap-1 text-text-secondary hover:text-text-primary font-medium"
          >
            Decisions
            <ChevronDown
              size={16}
              className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isOpen && (
            <div className="absolute top-full mt-2 right-0 bg-surface border border-border rounded-lg shadow-lg py-2 w-40">
              <Link
                to="/new-decision"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-text-secondary hover:bg-muted"
              >
                New Decision
              </Link>
              <Link
                to="/my-decisions"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-text-secondary hover:bg-muted"
              >
                My Decisions
              </Link>
            </div>
          )}
        </div>

        <button 
        className="text-text-secondary hover:text-text-primary font-medium"
        onClick={() => navigate('/profile')}
        >
          Profile
        </button>

        <button
          onClick={handleLogout}
          className="bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default NavBar;