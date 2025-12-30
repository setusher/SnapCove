import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Heart, Send } from "lucide-react"

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
      {/* Like Button */}
      <div className="mb-8 pb-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <button
          onClick={toggleLike}
          className="flex items-center gap-3 transition-colors"
          style={{ color: liked ? 'var(--accent-primary)' : 'var(--text-primary)' }}
          onMouseEnter={(e) => {
            if (!liked) {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }
          }}
          onMouseLeave={(e) => {
            if (!liked) {
              e.currentTarget.style.color = 'var(--text-primary)'
            }
          }}
        >
          <Heart 
            size={20} 
            strokeWidth={1.5}
            fill={liked ? 'currentColor' : 'none'}
            style={{ color: 'currentColor' }}
          />
          <span className="text-body font-medium">
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>
      </div>

      {/* Comments Feed */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 mb-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-body" style={{ color: 'var(--text-secondary)' }}>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map(c => (
            <div 
              key={c.id}
              className="pb-4 border-b"
              style={{ borderColor: 'var(--border-subtle)' }}
            >
              {/* Main Comment */}
              <div className="mb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-primary)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    {c.user?.name?.[0]?.toUpperCase() || c.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-body font-medium">
                    {c.user?.name || c.user?.email?.split('@')[0] || 'Unknown'}
                  </span>
                  <span className="text-meta" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-body ml-11" style={{ color: 'var(--text-primary)' }}>
                  {c.content}
                </p>
              </div>

              {/* Replies */}
              {c.replies && c.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {c.replies.map(r => (
                    <div key={r.id} className="flex items-start gap-3">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center font-semibold text-xs flex-shrink-0"
                        style={{
                          background: 'var(--surface)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {r.user?.name?.[0]?.toUpperCase() || r.user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-body text-sm font-medium">
                            {r.user?.name || r.user?.email?.split('@')[0] || 'Unknown'}
                          </span>
                          <span className="text-meta" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(r.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-body text-sm" style={{ color: 'var(--text-primary)' }}>
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
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex gap-3">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Write a comment..."
            className="input-field flex-1"
          />
          <button 
            onClick={send}
            className="btn btn-primary px-4"
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
