import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../Notification/Notification';
import './Auth.css';

const Login = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { login, currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      setNotification({
        message: 'Successfully logged in!',
        type: 'success'
      });
      setTimeout(() => {
        onClose();
      }, 1000); // Give user time to see the success message
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to sign in: ' + error.message);
      setNotification({
        message: 'Failed to sign in. Please try again.',
        type: 'error'
      });
    }
    setLoading(false);
  }

  // Debug info
  console.log('Current auth state:', currentUser ? 'Logged in' : 'Not logged in');
  if (currentUser) {
    console.log('User email:', currentUser.email);
    console.log('User ID:', currentUser.uid);
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button 
            className="auth-button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-toggle">
          Need an account?{' '}
          <button 
            className="auth-link" 
            onClick={onToggleForm}
          >
            Sign Up
          </button>
        </div>
      </div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Login; 