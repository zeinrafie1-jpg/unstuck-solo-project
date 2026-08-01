import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the logoutUser function from authService.js to log the user out on the server side.
            logout(); // Call the logout function from AuthContext to clear the user state in the frontend.
            navigate('/login'); // Redirect the user to the login page after logging out.
        } catch (err) {
            console.error('Logout failed:', err); // Log any errors that occur during the logout process.
        }
    };
return (
    <div>
        <nav>
            {user && <span>Welcome, {user.email}</span>}
            <button onClick={handleLogout}>Logout</button>
        </nav>
    </div>
    );
};

export default NavBar;