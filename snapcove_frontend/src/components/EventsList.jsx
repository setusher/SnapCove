import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import './EventsList.css';

const EventsList = ({ onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventsAPI.getEvents();
      // Deduplicate by ID in case of duplicates
      const uniqueEvents = Array.from(
        new Map(data.map(event => [event.id, event])).values()
      );
      setEvents(uniqueEvents);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError('Failed to load events');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="events-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Events</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <p>No events found. Create your first event!</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <div 
              key={event.id} 
              className="event-card"
              onClick={() => navigate(`/events/${event.id}/albums`)}
            >
              {event.cover_image && (
                <div className="event-cover">
                  <img 
                    src={getImageUrl(event.cover_image)} 
                    alt={event.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="event-content">
                <h2>{event.title}</h2>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                <div className="event-dates">
                  <span>📅 {formatDate(event.start_date)}</span>
                  {event.end_date && event.end_date !== event.start_date && (
                    <span> - {formatDate(event.end_date)}</span>
                  )}
                </div>
                <button className="view-albums-btn">View Albums →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsList;

