import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
};

// AUTH CONTEXT — shares login state across the whole app without prop drilling.

// Setup (done once, in App.jsx):
//    <AuthProvider> wraps the app, so every component inside can access auth state.
 
//   Usage (in any component):
//     import { useAuth } from '../context/AuthContext';
//     const { user, login, logout } = useAuth();
 
//     - user   → current logged-in user object, or null if logged out
//     - login(userData)  → call after a successful signup/login API response
//     - logout()         → call to clear the user (e.g. on logout button click)
