import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@reservation-system/data-access';
import { LOGIN_MUTATION } from '../graphql/auth.queries';
import { useMutation } from '@apollo/client/react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation<any>(LOGIN_MUTATION);

  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    setError('');

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('user_token', data.access_token);

      localStorage.setItem('user_user', JSON.stringify(data.user));

      // Close the modal first

      onClose();

      // Redirect if Employee, otherwise stay and refresh

      if (data.user.role === UserRole.EMPLOYEE) {
        navigate('/dashboard');
      } else {
        navigate('/reservation');
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents closing when clicking inside the form */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-x" onClick={onClose}>
          &times;
        </button>

        <h2 className="modal-title">Portal</h2>
        <p className="modal-subtitle">Sign in to manage your luxury stay.</p>

        <form onSubmit={handleLogin} className="modal-form">
          <div className="form-group">
            <label className="label-gold">Email Address</label>
            <input
              className="input-luxury"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="label-gold">Password</label>
            <input
              className="input-luxury"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="footer-note">
          New guest?{' '}
          <span
            className="register-link"
            onClick={() => {
              onClose();
              navigate('/register');
            }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};
