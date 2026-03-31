import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const apiBase = process.env.REACT_APP_BASE_URL || 'http://localhost:3005';

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${apiBase}/register`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      const backendVerificationUrl = response.data?.data?.verificationUrl;
      if (backendVerificationUrl) {
        const token = new URL(backendVerificationUrl).searchParams.get('token');
        if (token) {
          const frontendUrl = `${window.location.origin}/verify-email?token=${encodeURIComponent(token)}`;
          navigate('/verify-account', { state: { verificationUrl: frontendUrl } });
          return;
        }
      }

      // Fallback if no verification URL
      alert('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      console.error('Register API error:', err.response?.data || err.message);
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(apiError || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="auth-container">
          <div className="auth-card">
            <h2>Create Account</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  minLength="6"
                  maxLength="10"
                  required
                />
                <small className="form-text text-muted">
                  Username must be 6-10 characters
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="9"
                  required
                />
                <small className="form-text text-muted">
                  Must be at least 9 characters with uppercase, lowercase, number, and special character
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 btn-custom"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>
            <p className="mt-3 text-center">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
