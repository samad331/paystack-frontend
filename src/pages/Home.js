import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="content">
        <div className="page-container">
          <div className="hero-section">
            <h1 className="hero-title">Welcome to DPS</h1>
            <p className="hero-subtitle">
              Manage your payments and transactions effortlessly
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary btn-lg btn-custom"
                onClick={() => navigate('/payment')}
              >
                Make a Payment
              </button>
              <button 
                className="btn btn-outline-primary btn-lg btn-custom"
                onClick={() => navigate('/dashboard')}
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-container">
        <div className="hero-section">
          <h1 className="hero-title">Welcome to Paystack Payment System</h1>
          <p className="hero-subtitle">
            Secure, fast, and reliable payment processing
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-lg btn-custom">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-primary btn-lg btn-custom">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
