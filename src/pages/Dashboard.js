import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pages.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    if (token) {
      fetchTransactions(token);
      fetchBalance(token);
    }
  }, []);

  const fetchTransactions = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/paystack/transaction-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const transactionData = response.data?.data?.transactions || response.data?.data || [];
      setTransactions(transactionData);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => (status || '').toString().trim().toLowerCase();
  const isSuccessStatus = (status) => ['completed', 'success', 'successful'].includes(normalizeStatus(status));
  const isPendingStatus = (status) => ['pending', 'processing'].includes(normalizeStatus(status));
  const isFailedStatus = (status) => ['failed', 'error'].includes(normalizeStatus(status));

  const fetchBalance = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/paystack/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBalance(response.data?.data?.balance || 0);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="page-container">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="page-container">
        <div className="dashboard-header">
          <h1>Welcome back!</h1>
          <p className="text-muted">{user?.email}</p>
        </div>

        <div className="row mb-4">
          <div className="col-md-3">
            <div className="stats-card">
              <h6>Wallet Balance</h6>
              <h3>₦{balance.toLocaleString()}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <h6>Total Transactions</h6>
              <h3>{transactions.length}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <h6>Successful</h6>
              <h3>{transactions.filter((t) => isSuccessStatus(t.status)).length}</h3>
            </div>
          </div>
          <div className="col-md-3">
            <div className="stats-card">
              <h6>Pending</h6>
              <h3>{transactions.filter((t) => isPendingStatus(t.status)).length}</h3>
            </div>
          </div>
        </div>

        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          {transactions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.reference}</td>
                      <td>₦{transaction.amount?.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            isSuccessStatus(transaction.status)
                              ? 'success'
                              : isFailedStatus(transaction.status)
                              ? 'danger'
                              : isPendingStatus(transaction.status)
                              ? 'warning'
                              : 'secondary'
                          }`}
                        >
                          {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
                        </span>
                      </td>
                      <td>{new Date(transaction.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted">No transactions yet. Make your first payment!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
