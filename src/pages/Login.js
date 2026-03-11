import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

function Login() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, {
        userid,
        password,
      });
      const token = response.data?.data?.token;
      let emailFromToken = '';
      try {
        const payload = token?.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
          emailFromToken = decoded?.email || '';
        }
      } catch (decodeErr) {
        console.warn('Could not decode token payload', decodeErr);
      }

      login(token, { email: emailFromToken || userid });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="auth-container">
          <div className="auth-card">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="userid" className="form-label">
                  Email or Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="userid"
                  value={userid}
                  onChange={(e) => setUserid(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 btn-custom"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="mt-3 text-center">
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
