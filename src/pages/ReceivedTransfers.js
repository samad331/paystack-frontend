import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Pages.css';

function ReceivedTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReceivedTransfers();
  }, []);

  const fetchReceivedTransfers = async () => {
    try {
      setLoading(true);
      setError('');
      const apiBase = process.env.REACT_APP_BASE_URL;
      const token = localStorage.getItem('token');

      const response = await axios.get(`${apiBase}/paystack/received-transfers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Received transfers data:', response.data?.data?.transfers);
      setTransfers(response.data?.data?.transfers || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to fetch received transfers';
      setError(errorMsg);
      console.error('Error fetching received transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  const normalizeStatus = (status) => (status || '').toString().toLowerCase();
  const isSuccessStatus = (status) => ['completed', 'success', 'successful'].includes(normalizeStatus(status));
  const isPendingStatus = (status) => ['pending', 'processing'].includes(normalizeStatus(status));
  const isFailedStatus = (status) => ['failed', 'error'].includes(normalizeStatus(status));

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getTransferSource = (transfer) => {
    // Show sender email whenever available
    if (transfer.sender_email) {
      return {
        type: transfer.sender_id ? 'user' : 'paystack',
        label: transfer.sender_email,
        badge: transfer.sender_id ? 'primary' : 'success'
      };
    }
    
    // Check if it's a Paystack funding
    if (transfer.reference && !transfer.sender_id) {
      return {
        type: 'paystack',
        label: 'Paystack Wallet Funding',
        badge: 'success'
      };
    }
    
    // Unknown source
    return {
      type: 'unknown',
      label: 'Unknown Source',
      badge: 'secondary'
    };
  };

  return (
    <div className="content">
      <div className="page-container">
        <div className="transfer-container">
          <div className="transfer-card received-transfers-card">
            <h2>Received Transfers</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {loading ? (
              <div className="alert alert-info">Loading transfers...</div>
            ) : transfers.length === 0 ? (
              <div className="alert alert-info">
                No transfers received yet.
              </div>
            ) : (
              <div className="transfers-table-container table-responsive">
                <table className="table table-striped table-hover received-transfers-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Source</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transfers.map((transfer) => {
                      const source = getTransferSource(transfer);
                      return (
                        <tr key={transfer.id}>
                          <td>{formatDate(transfer.created_at)}</td>
                          <td className="source-cell">
                            <div className="source-content">
                              <span className={`badge bg-${source.badge} me-2`}>
                                {source.type === 'user' ? '👤 User' : source.type === 'paystack' ? '💳 Paystack' : '❓'}
                              </span>
                              <strong className="source-label">{source.label}</strong>
                            </div>
                          </td>
                          <td className="amount">
                            <strong className="text-success">₦{transfer.amount.toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className={`badge bg-${
                              isSuccessStatus(transfer.status)
                                ? 'success'
                                : isFailedStatus(transfer.status)
                                ? 'danger'
                                : isPendingStatus(transfer.status)
                                ? 'warning'
                                : 'secondary'
                            }`}>
                              {transfer.status?.charAt(0).toUpperCase() + transfer.status?.slice(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>💡 Legend:</strong>
                    <br />
                    👤 <strong>User transfers</strong> - Money received from other users
                    <br />
                    💳 <strong>Paystack</strong> - Wallet funding via Paystack payment gateway
                  </small>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceivedTransfers;