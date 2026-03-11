import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Payment() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const apiBase = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const parsedUser = userData ? JSON.parse(userData) : null;

      const parsedAmount = parseInt(amount, 10);
      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount < 100) {
        setError('Enter a valid amount of at least ₦100');
        setLoading(false);
        return;
      }

      if (!parsedUser?.email) {
        setError('Missing user email. Please log in again.');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `${apiBase}/paystack/fund-wallet`,
        {
          amount: parsedAmount,
          email: parsedUser.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const authorizationUrl = response.data?.data?.authorization_url;
      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        setError('Payment initialization failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Payment initialization failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="payment-container">
          <div className="payment-card">
            <h2>Make a Payment</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handlePayment}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Amount (₦)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="100"
                  step="100"
                  required
                />
                <small className="form-text text-muted">
                  Minimum amount: ₦100
                </small>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is this payment for?"
                  rows="3"
                ></textarea>
              </div>

              <div className="payment-summary">
                <div className="summary-row">
                  <span>Amount:</span>
                  <strong>₦{amount ? parseInt(amount).toLocaleString() : '0'}</strong>
                </div>
                <div className="summary-row">
                  <span>Fee (1.5%):</span>
                  <strong>
                    ₦
                    {amount ? Math.round((parseInt(amount) * 1.5) / 100).toLocaleString() : '0'}
                  </strong>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <strong>
                    ₦
                    {amount
                      ? (parseInt(amount) + Math.round((parseInt(amount) * 1.5) / 100)).toLocaleString()
                      : '0'}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 btn-lg btn-custom mt-4"
                disabled={loading || !amount}
              >
                {loading ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
