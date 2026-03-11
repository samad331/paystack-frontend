import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Transfer() {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBalance(token);
    }
  }, []);

  const fetchBalance = async (token) => {
    try {
      const apiBase = process.env.REACT_APP_BASE_URL;
      const response = await axios.get(`${apiBase}/paystack/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data?.data?.balance || 0);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const parsedAmount = parseInt(amount, 10);
      
      if (!parsedAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Enter a valid amount greater than ₦0');
        setLoading(false);
        return;
      }

      if (parsedAmount > balance) {
        setError(`Insufficient balance. Your balance is ₦${balance.toLocaleString()}`);
        setLoading(false);
        return;
      }

      if (!recipientEmail || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(recipientEmail)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      const apiBase = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${apiBase}/paystack/transfer-funds`,
        {
          recipientEmail,
          amount: parsedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('Transfer completed successfully!');
      setRecipientEmail('');
      setAmount('');
      
      // Refresh balance
      fetchBalance(token);
      
      // Clear success message after 3 seconds and redirect
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Transfer failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="transfer-container">
          <div className="transfer-card">
            <h2>Transfer Funds</h2>
            
            <div className="balance-info">
              <p>Current Balance: <strong>₦{balance.toLocaleString()}</strong></p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleTransfer}>
              <div className="mb-3">
                <label htmlFor="recipientEmail" className="form-label">
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="recipientEmail"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Enter recipient's email"
                  required
                />
                <small className="form-text text-muted">
                  Enter the email address of the person you want to transfer funds to
                </small>
              </div>

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
                  min="1"
                  step="1"
                  required
                />
                <small className="form-text text-muted">
                  Minimum amount: ₦1
                </small>
              </div>

              <div className="transfer-summary">
                <div className="summary-row">
                  <span>Amount to Transfer:</span>
                  <strong>₦{amount ? parseInt(amount, 10).toLocaleString() : '0'}</strong>
                </div>
                <div className="summary-row">
                  <span>Current Balance:</span>
                  <strong>₦{balance.toLocaleString()}</strong>
                </div>
                <div className="summary-total">
                  <span>Balance After Transfer:</span>
                  <strong>
                    ₦
                    {amount
                      ? (balance - parseInt(amount, 10)).toLocaleString()
                      : balance.toLocaleString()}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 btn-lg btn-custom mt-4"
                disabled={loading || !amount || !recipientEmail}
              >
                {loading ? 'Processing Transfer...' : 'Transfer Funds'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
