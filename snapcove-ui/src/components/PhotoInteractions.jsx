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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 'var(--space-6)' }}>
      <div style={{ marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={toggleLike}
          className="flex items-center"
          style={{ 
            gap: 'var(--space-3)',
            color: liked ? 'var(--accent)' : 'var(--primary-text)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
          onMouseEnter={(e) => {
            if (!liked) {
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!liked) {
              e.currentTarget.style.color = 'var(--primary-text)'
            }
          }}
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            fill={liked ? 'var(--accent)' : 'none'}
            style={{ color: liked ? 'var(--accent)' : 'currentColor' }}
          />
          <span className="text-body" style={{ fontWeight: 500 }}>
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', marginBottom: 'var(--space-6)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
            <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <p className="text-body" style={{ color: 'var(--secondary-text)' }}>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {comments.map(c => (
              <div
                key={c.id}
                style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}
              >
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="flex items-center" style={{ gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <div
                      className="flex-center"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--primary-text)',
                        fontWeight: 600,
                        fontSize: '12px'
                      }}
                    >
                      {c.user?.name?.[0]?.toUpperCase() || c.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-body" style={{ fontWeight: 500 }}>
                      {c.user?.name || c.user?.email?.split('@')[0] || 'Unknown'}
                    </span>
                    <span className="text-caption">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-body" style={{ marginLeft: '44px' }}>
                    {c.content}
                  </p>
                </div>
                {c.replies && c.replies.length > 0 && (
                  <div style={{ marginLeft: '44px', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {c.replies.map(r => (
                      <div key={r.id} className="flex items-start" style={{ gap: 'var(--space-3)' }}>
                        <div
                          className="flex-center flex-shrink-0"
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--secondary-text)',
                            fontWeight: 600,
                            fontSize: '10px'
                          }}
                        >
                          {r.user?.name?.[0]?.toUpperCase() || r.user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                            <span className="text-body" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {r.user?.name || r.user?.email?.split('@')[0] || 'Unknown'}
                            </span>
                            <span className="text-caption">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-body" style={{ fontSize: '13px' }}>
                            {r.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)' }}>
        <div className="flex" style={{ gap: 'var(--space-3)' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Write a comment..."
            className="input"
            style={{ flex: 1, background: 'var(--surface)' }}
          />
          <button
            onClick={send}
            className="btn btn-primary"
            style={{ padding: '0 var(--space-4)' }}
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

