import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
          <h1>Welcome, {user?.name || 'User'}!</h1>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="user-info">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value role-badge">{user?.role || 'Not set'}</span>
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
          </div>
        </div>

        <div className="dashboard-actions">
          <button 
            className="primary-action-btn"
            onClick={() => navigate('/events')}
          >
            Browse Events
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

