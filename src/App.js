import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount';
import EmailVerify from './pages/EmailVerify';
import Dashboard from './pages/Dashboard';
import Payment from './pages/Payment';
import PaymentVerify from './pages/PaymentVerify';
import Transfer from './pages/Transfer';
import ReceivedTransfers from './pages/ReceivedTransfers';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="container-main">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/verify-email" element={<EmailVerify />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment"
              element={
                <ProtectedRoute>
                  <Payment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payment/verify"
              element={
                <ProtectedRoute>
                  <PaymentVerify />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transfer"
              element={
                <ProtectedRoute>
                  <Transfer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/received-transfers"
              element={
                <ProtectedRoute>
                  <ReceivedTransfers />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
