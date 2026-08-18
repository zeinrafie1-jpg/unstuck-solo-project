import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Search, Compass } from 'lucide-react';

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
      login(data.user, data.token);
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center">
        {/* Explainer */}
        <div>
          <span className="text-2xl font-medium text-text-primary">
            <span className="text-accent">Un</span>Stuck
          </span>
          <p className="text-text-secondary mt-3 mb-8">
            Stuck between two choices? Let UnStuck help you make a decision with confidence.
          </p>

          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <MessageSquare size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Describe your two options</p>
                <p className="text-sm text-text-secondary">Tell us what's making it hard to choose.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <Search size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">We check what's really going on</p>
                <p className="text-sm text-text-secondary">Assessing whether you're overthinking or genuinely torn.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="bg-accent-light text-accent-dark rounded-full p-2 flex-shrink-0 h-fit">
                <Compass size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">Get a clear and honest lean</p>
                <p className="text-sm text-text-secondary">Backed by real reasoning you can trust.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full p-8 bg-surface rounded-xl shadow-sm">
          <h1 className="text-2xl font-semibold text-text-primary mb-4 text-center">
            Login
          </h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email" className="block text-sm text-text-secondary mb-1">Email</label>
            <input
              id="email"
              className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              type="email"
              // placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password" className="block text-sm text-text-secondary mb-1">Password</label>
            <input
              id="password"
              className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent mb-4"
              type="password"
              // placeholder="Password"
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
              className="w-full border-2 border-accent text-accent hover:bg-accent hover:text-surface transition-colors px-4 py-2 rounded-lg font-medium"
            >
              Create an account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;