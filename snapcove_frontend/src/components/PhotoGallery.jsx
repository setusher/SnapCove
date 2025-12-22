import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { photosAPI, albumsAPI, eventsAPI } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import './PhotoGallery.css';

const PhotoGallery = ({ onLogout }) => {
  const { eventId, albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [album, setAlbum] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, albumId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [photosData, albumData, eventData] = await Promise.all([
        photosAPI.getPhotos(eventId, albumId),
        albumsAPI.getAlbum(eventId, albumId),
        eventsAPI.getEvent(eventId),
      ]);
      // Deduplicate by ID in case of duplicates
      const uniquePhotos = Array.from(
        new Map(photosData.map(photo => [photo.id, photo])).values()
      );
      setPhotos(uniquePhotos);
      setAlbum(albumData);
      setEvent(eventData);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      } else {
        setError('Failed to load photos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLikeUpdate = (photoId, liked, likesCount) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, is_liked: liked, likes_count: likesCount }
        : photo
    ));
    if (selectedPhoto?.id === photoId) {
      setSelectedPhoto({ ...selectedPhoto, is_liked: liked, likes_count: likesCount });
    }
  };

  if (loading) {
    return (
      <div className="photo-gallery-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="photo-gallery-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="photo-gallery-container">
      <div className="gallery-header">
        <div>
          <button onClick={() => window.history.back()} className="back-button">
            ← Back
          </button>
          <h1>{album?.title || 'Photos'}</h1>
          {event && <p className="event-name">{event.title}</p>}
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="empty-state">
          <p>No photos in this album yet.</p>
        </div>
      ) : (
        <>
          <div className="photos-grid">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-card"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="photo-image">
                  <img 
                    src={getImageUrl(photo.image)} 
                    alt={photo.caption || 'Photo'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="photo-overlay">
                  <div className="photo-stats">
                    <span className="likes-stat">❤️ {photo.likes_count ?? 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPhoto && (
            <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
              <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal" onClick={() => setSelectedPhoto(null)}>×</button>
                <div className="modal-photo">
                  <img 
                    src={getImageUrl(selectedPhoto.image)} 
                    alt={selectedPhoto.caption || 'Photo'}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
                    }}
                  />
                </div>
                <div className="modal-details">
                  <div className="modal-header">
                    <div>
                      {selectedPhoto.caption && (
                        <p className="photo-caption">{selectedPhoto.caption}</p>
                      )}
                      <p className="photo-uploader">
                        Uploaded by: {selectedPhoto.uploaded_by?.email || 'Unknown'}
                      </p>
                    </div>
                    <LikeButton
                      photoId={selectedPhoto.id}
                      initialLiked={selectedPhoto.is_liked}
                      initialLikesCount={selectedPhoto.likes_count}
                      onUpdate={(liked, count) => handleLikeUpdate(selectedPhoto.id, liked, count)}
                    />
                  </div>
                  <CommentSection photoId={selectedPhoto.id} />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PhotoGallery;

