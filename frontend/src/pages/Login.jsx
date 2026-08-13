import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await loginUser(email, password);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAccountClick = () => {
    navigate('/signup');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-8 bg-surface rounded-xl shadow-sm">
        <div className="text-center mb-2">
          <span className="text-xl font-medium text-text-primary">
            <span className="text-accent">Un</span>Stuck
          </span>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary mb-6 text-center">
          Login
        </h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email</label>
          <input
            id="email"
            className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="password" className="block text-sm text-text-secondary mb-1">Password</label>
          <input
            id="password"
            className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent hover:bg-accent-dark text-surface px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          <button
            type="button"
            onClick={handleCreateAccountClick}
            className="w-full mt-2 text-accent hover:underline font-medium text-sm"
          >
            Don't have an account? Create one
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;