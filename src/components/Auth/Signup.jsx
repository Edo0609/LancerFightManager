import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../Notification/Notification';
import './Auth.css';

const Signup = ({ onToggleForm, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { signup, currentUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setNotification({
        message: 'Passwords do not match. Please try again.',
        type: 'error'
      });
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      setNotification({
        message: 'Account created successfully!',
        type: 'success'
      });
      setTimeout(() => {
        onClose();
      }, 1000); // Give user time to see the success message
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create an account: ' + error.message);
      setNotification({
        message: 'Failed to create account. Please try again.',
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
        <h2>Sign Up</h2>
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
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button 
            className="auth-button" 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-toggle">
          Already have an account?{' '}
          <button 
            className="auth-link" 
            onClick={onToggleForm}
          >
            Login
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

export default Signup; 