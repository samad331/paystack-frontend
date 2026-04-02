import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const reference =
      searchParams.get('reference') ||
      searchParams.get('trxref') ||
      searchParams.get('ref');

    if (!reference) {
      setStatus('error');
      setMessage('No payment reference provided. Redirecting to dashboard...');
      const timeout = setTimeout(() => navigate('/dashboard'), 3000);
      return () => clearTimeout(timeout);
    }

    verifyPayment(reference);
  }, [searchParams, navigate]);

  const verifyPayment = async (reference) => {
    try {
      const apiBase = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(
        `${apiBase}/paystack/verify-payment?reference=${reference}`
      );

      if (response.data.status === 'success') {
        setStatus('success');
        setMessage('Payment verified successfully! Your balance has been updated.');
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('failed');
        setMessage('Payment verification failed. Please contact support.');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to verify payment');
    }
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="payment-verify-container">
          <div className="payment-verify-card">
            {status === 'verifying' && (
              <>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Verifying...</span>
                </div>
                <h3>Verifying Payment</h3>
                <p>Please wait while we confirm your payment...</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="success-icon mb-3">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#28a745" strokeWidth="2" fill="none"/>
                    <path d="M8 12l2 2 4-4" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-success">Payment Successful!</h3>
                <p>{message}</p>
                <p className="text-muted">Redirecting to dashboard...</p>
              </>
            )}

            {status === 'failed' && (
              <>
                <div className="error-icon mb-3">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2" fill="none"/>
                    <path d="M15 9l-6 6M9 9l6 6" stroke="#dc3545" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-danger">Payment Failed</h3>
                <p>{message}</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/payment')}>
                  Try Again
                </button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="error-icon mb-3">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#ffc107" strokeWidth="2" fill="none"/>
                    <path d="M12 8v4M12 16h.01" stroke="#ffc107" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <h3 className="text-warning">Verification Error</h3>
                <p>{message}</p>
                <button className="btn btn-primary mt-3" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentVerify;
