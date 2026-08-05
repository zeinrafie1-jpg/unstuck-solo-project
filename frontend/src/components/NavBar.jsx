import { useNavigate, Link } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the logoutUser function from authService.js to log the user out on the server side.
            logout(); // Call the logout function from AuthContext to clear the user state in the frontend.
            navigate('/login'); // Redirect the user to the login page after logging out.
        } catch (err) {
            console.error('Logout failed:', err); // Log any errors that occur during the logout process.
        }
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    }

return (
    <div>
        <nav>
            {user && <span>Welcome, {user.name}</span>}
            <button onClick={toggleMenu}>Decisions</button>
            {isOpen && (
                <div>
                    <Link to="/new-decision" onClick={() => setIsOpen(false)}>New Decision</Link>
                    <Link to="/my-decisions" onClick={() => setIsOpen(false)}>My Decisions</Link>
                </div>
            )}
            <button>Profile</button>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    </div>
    );
};

export default NavBar;