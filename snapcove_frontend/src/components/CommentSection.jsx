import { useState, useEffect } from 'react';
import { interactionsAPI } from '../services/api';
import './CommentSection.css';

const CommentSection = ({ photoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [photoId]);

  const fetchComments = async () => {
    try {
      setFetching(true);
      const data = await interactionsAPI.getComments(photoId);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    try {
      setLoading(true);
      const comment = await interactionsAPI.createComment(photoId, newComment);
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error creating comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId) => {
    if (!replyText.trim() || loading) return;

    try {
      setLoading(true);
      const reply = await interactionsAPI.replyToComment(commentId, replyText);
      // Refresh comments to get updated structure
      await fetchComments();
      setReplyingTo(null);
      setReplyText('');
    } catch (err) {
      console.error('Error replying to comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await interactionsAPI.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId && !c.replies?.some(r => r.id === commentId)));
      await fetchComments();
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const CommentItem = ({ comment, level = 0 }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isOwner = comment.user?.id === user.id;

    return (
      <div className={`comment-item ${level > 0 ? 'reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-user">
            <span className="user-email">{comment.user?.email || 'Unknown'}</span>
            <span className="comment-date">{formatDate(comment.created_at)}</span>
          </div>
          {isOwner && (
            <button 
              className="delete-comment-btn"
              onClick={() => handleDeleteComment(comment.id)}
            >
              Delete
            </button>
          )}
        </div>
        <div className="comment-content">{comment.content}</div>
        
        {level === 0 && (
          <button 
            className="reply-btn"
            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
          >
            Reply
          </button>
        )}

        {replyingTo === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              rows="2"
            />
            <div className="reply-actions">
              <button onClick={() => handleReply(comment.id)} disabled={loading}>
                {loading ? 'Posting...' : 'Post Reply'}
              </button>
              <button onClick={() => { setReplyingTo(null); setReplyText(''); }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          rows="3"
        />
        <button type="submit" disabled={loading || !newComment.trim()}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>

      {fetching ? (
        <div className="loading-comments">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="no-comments">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;


