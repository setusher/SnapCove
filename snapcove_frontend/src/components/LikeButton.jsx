import { useState } from 'react';
import { interactionsAPI } from '../services/api';
import './LikeButton.css';

const LikeButton = ({ photoId, initialLiked, initialLikesCount, onUpdate }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount || 0);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      const response = await interactionsAPI.toggleLike(photoId);
      setLiked(response.liked);
      setLikesCount(prev => response.liked ? prev + 1 : prev - 1);
      if (onUpdate) {
        onUpdate(response.liked, response.liked ? likesCount + 1 : likesCount - 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`like-button ${liked ? 'liked' : ''}`}
      onClick={handleLike}
      disabled={loading}
    >
      <span className="like-icon">{liked ? '❤️' : '🤍'}</span>
      <span className="like-count">{likesCount}</span>
    </button>
  );
};

export default LikeButton;


