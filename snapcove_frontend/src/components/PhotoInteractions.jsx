import { useEffect, useState } from "react"
import { api } from "../api/api"

export default function PhotoInteractions({ photo }) {
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(photo.is_liked || false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/photos/${photo.id}/comments/`)
      .then(r => {
        setComments(r.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [photo.id])

  const toggleLike = async () => {
    try {
      const r = await api.post(`/photos/${photo.id}/like/`)
      setLiked(r.data.liked)
    } catch (err) {
      console.error(err)
    }
  }

  const send = async () => {
    if (!text.trim()) return
    try {
      const r = await api.post(`/photos/${photo.id}/comments/`, { content: text })
      setComments([r.data, ...comments])
      setText("")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with Like Button */}
      <div className="mb-8">
        <button
          onClick={toggleLike}
          className="flex items-center gap-3 transition-all hover:scale-105"
        >
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
            style={{
              background: liked ? 'rgba(111, 255, 233, 0.2)' : 'rgba(58, 80, 107, 0.3)',
              border: `1px solid ${liked ? 'rgba(111, 255, 233, 0.4)' : 'rgba(58, 80, 107, 0.4)'}`,
              boxShadow: liked ? '0 0 24px rgba(111, 255, 233, 0.3)' : 'none'
            }}
          >
            <svg 
              className="w-6 h-6" 
              fill={liked ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              style={{ color: liked ? 'var(--mint)' : 'var(--text-secondary)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span 
            className="text-lg font-semibold"
            style={{ color: liked ? 'var(--mint)' : 'var(--text-primary)' }}
          >
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>
      </div>

      {/* Comments Feed */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-6 photo-interactions-scroll">
        {loading ? (
          <div className="text-center py-8">
            <p style={{ color: 'var(--text-secondary)' }}>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(c => (
            <div 
              key={c.id}
              className="pb-4 border-b"
              style={{ borderColor: 'rgba(58, 80, 107, 0.2)' }}
            >
              {/* Main Comment */}
              <div className="mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, var(--aqua), var(--mint))',
                      color: 'var(--ink)'
                    }}
                  >
                    {c.user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span 
                    className="font-semibold text-sm"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {c.user?.name || 'Unknown'}
                  </span>
                  <span 
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p 
                  className="text-sm leading-relaxed ml-11"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {c.content}
                </p>
              </div>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {c.replies.map(r => (
                    <div key={r.id} className="flex items-start gap-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{
                          background: 'rgba(93, 217, 193, 0.2)',
                          color: 'var(--aqua)'
                        }}
                      >
                        {r.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="font-semibold text-xs"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {r.user?.name || 'Unknown'}
                          </span>
                          <span 
                            className="text-xs"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p 
                          className="text-xs leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {r.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Comment Input */}
      <div className="pt-4 border-t" style={{ borderColor: 'rgba(58, 80, 107, 0.3)' }}>
        <div className="flex gap-3">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Write a comment..."
            className="flex-1 input-field"
            style={{
              padding: '12px 16px',
              fontSize: '0.875rem'
            }}
          />
          <button 
            onClick={send}
            className="w-12 h-12 rounded-[12px] flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: 'var(--aqua)',
              color: 'var(--ink)',
              boxShadow: '0 4px 16px rgba(93, 217, 193, 0.3)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
