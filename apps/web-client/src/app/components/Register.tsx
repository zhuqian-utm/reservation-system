import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '@reservation-system/data-access';
import { authService } from '../services/auth.service';

export const Register = () => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    const baseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          code: formData.code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('hilton_token', data.access_token);
      localStorage.setItem('hilton_user', JSON.stringify(data.user));

      setTimeout(() => {
        const user = authService.getCurrentUser();
        if (user?.role === UserRole.EMPLOYEE) {
          navigate('/dashboard');
        } else if (user?.role === UserRole.EMPLOYEE) {
          navigate('/reservation');
        } else {
          navigate('/');
        }
      }, 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <div className="register-header">
          <h1 className="hilton-logo-text">HILTON</h1>
          <h2>Create Your Account</h2>
          <p>Join our honors program for exclusive table reservations.</p>
        </div>

        <form onSubmit={handleRegister} className="registration-form">
          <div className="form-group">
            <label>Invitation Code</label>
            <input
              className="input-luxury"
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="label-gold">Full Name</label>
            <input
              className="input-luxury"
              type="text"
              required
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="label-gold">Email Address</label>
            <input
              className="input-luxury"
              type="email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="label-gold">Password</label>
              <input
                className="input-luxury"
                type="password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className="form-group flex-1">
              <label className="label-gold">Confirm Password</label>
              <input
                className="input-luxury"
                type="password"
                required
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>
          </div>

          {error && <p className="error-text text-center">{error}</p>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'CREATING ACCOUNT...' : 'REGISTER'}
          </button>
        </form>

        <p className="footer-note">
          Already have an account?
          <Link to="/" className="register-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
