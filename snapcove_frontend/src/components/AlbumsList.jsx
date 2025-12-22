import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { albumsAPI, eventsAPI } from '../services/api';
import './AlbumsList.css';

const AlbumsList = ({ onLogout }) => {
  const { eventId } = useParams();
  const [albums, setAlbums] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [eventId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [albumsData, eventData] = await Promise.all([
        albumsAPI.getAlbums(eventId),
        eventsAPI.getEvent(eventId),
      ]);
      setAlbums(albumsData);
      setEvent(eventData);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError('Failed to load albums');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="albums-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="albums-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="albums-container">
      <div className="albums-header">
        <div>
          <button onClick={() => navigate('/dashboard')} className="back-button">
            ← Back to Events
          </button>
          <h1>{event?.title || 'Albums'}</h1>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      {albums.length === 0 ? (
        <div className="empty-state">
          <p>No albums found in this event.</p>
        </div>
      ) : (
        <div className="albums-grid">
          {albums.map((album) => (
            <div 
              key={album.id} 
              className="album-card"
              onClick={() => navigate(`/events/${eventId}/albums/${album.id}/photos`)}
            >
              {album.cover_image && (
                <div className="album-cover">
                  <img 
                    src={`http://localhost:8000${album.cover_image}`} 
                    alt={album.title}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="album-content">
                <h2>{album.title}</h2>
                {album.description && (
                  <p className="album-description">{album.description}</p>
                )}
                <button className="view-photos-btn">View Photos →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlbumsList;

