import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await loginUser(email, password);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);  // Set error message to display in the UI if login fails. this is taken from the error thrown in authService.js when the response is not ok. it will contain the message from the server (e.g. "Invalid email or password") or a default message ("Login failed").
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state on input change (as you type)
        />
        {error && <p style={{ color: 'red' }}>{error}</p>} {/*Display error message if login fails*/}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;