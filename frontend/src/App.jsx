import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyDecisions from './pages/MyDecisions';
import NewDecision from './pages/NewDecision';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/my-decisions" 
            element={
              <ProtectedRoute>
                <MyDecisions />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-decision" 
            element={
              <ProtectedRoute>
                <NewDecision />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;