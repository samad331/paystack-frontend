import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Pages.css';

function VerifyAccount() {
  const [verificationUrl, setVerificationUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get verification URL from navigation state
    const url = location.state?.verificationUrl;
    if (url) {
      setVerificationUrl(url);
    } else {
      // If no URL provided, redirect back to register
      navigate('/register');
    }
  }, [location.state, navigate]);

  if (!verificationUrl) {
    return (
      <div className="content">
        <div className="page-container">
          <div className="auth-container">
            <div className="auth-card">
              <h2>Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-container">
        <div className="auth-container">
          <div className="auth-card">
            <h2>Verify Your Account</h2>
            <div className="alert alert-success">
              <h4>Registration Successful!</h4>
              <p>Your account has been created. Click the button below to verify your email address.</p>
            </div>

            <div className="mb-3 text-center">
              <a href={verificationUrl} className="btn btn-success w-100 btn-custom">
                Verify Email Address
              </a>
            </div>

            <div className="text-center">
              <p className="text-muted">
                Didn't receive the verification? <Link to="/register">Try registering again</Link>
              </p>
              <p>
                Already verified? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyAccount;