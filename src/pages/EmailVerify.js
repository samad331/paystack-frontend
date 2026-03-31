import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function EmailVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. Token is missing.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const protocol = window.location.protocol || 'http:';
        const hostname = window.location.hostname || 'localhost';
        const fallbackApiBase = `${protocol}//${hostname}:3005`;
        const apiBase = process.env.REACT_APP_BASE_URL || fallbackApiBase;
        const response = await axios.get(`${apiBase}/verify/${encodeURIComponent(token)}`);

        if (response.data?.status === 'successful') {
          setStatus('success');
          setMessage('Email verified successfully. You can now log in.');
          return;
        }

        setStatus('error');
        setMessage(response.data?.message || 'Verification failed. Please try again.');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || err.response?.data?.error || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="content">
      <div className="page-container">
        <div className="auth-container">
          <div className="auth-card">
            <h2>Email Verification</h2>
            {status === 'verifying' && <div className="alert alert-info">{message}</div>}
            {status === 'success' && <div className="alert alert-success">{message}</div>}
            {status === 'error' && <div className="alert alert-danger">{message}</div>}

            <p className="mt-3 text-center">
              <Link to="/login">Go to Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerify;
