import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


// AUTH CONTEXT — shares login state across the whole app without prop drilling.

// Setup (done once, in App.jsx):
//    <AuthProvider> wraps the app, so every component inside can access auth state.
 
//   Usage (in any component):
//     import { useAuth } from '../context/AuthContext';
//     const { user, login, logout } = useAuth();
 
//     - user   → current logged-in user object, or null if logged out
//     - login(userData)  → call after a successful signup/login API response
//     - logout()         → call to clear the user (e.g. on logout button click)
