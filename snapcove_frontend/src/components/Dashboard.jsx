import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Then fetch from API to verify token is still valid
        const userData = await authAPI.getMe();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        if (err.response?.status === 401) {
          // Token expired or invalid
          onLogout();
        } else {
          setError('Failed to fetch user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [onLogout]);

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="success-badge">
          <span className="checkmark">✓</span>
          <span>Authentication Successful!</span>
        </div>

        <div className="user-info">
          <h2>User Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{user?.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user?.role}</span>
            </div>
            {user?.batch && (
              <div className="info-item">
                <span className="info-label">Batch:</span>
                <span className="info-value">{user.batch}</span>
              </div>
            )}
            {user?.department && (
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{user.department}</span>
              </div>
            )}
            {user?.profile_picture && (
              <div className="info-item">
                <span className="info-label">Profile Picture:</span>
                <span className="info-value">{user.profile_picture}</span>
              </div>
            )}
          </div>
        </div>

        <div className="token-info">
          <h3>Token Status</h3>
          <div className="token-display">
            <div className="token-item">
              <span className="token-label">Access Token:</span>
              <span className="token-value">
                {localStorage.getItem('access_token') 
                  ? `${localStorage.getItem('access_token').substring(0, 50)}...` 
                  : 'Not found'}
              </span>
            </div>
            <div className="token-item">
              <span className="token-label">Refresh Token:</span>
              <span className="token-value">
                {localStorage.getItem('refresh_token') 
                  ? `${localStorage.getItem('refresh_token').substring(0, 50)}...` 
                  : 'Not found'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

