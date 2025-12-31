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
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {/* Like Button */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={toggleLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: liked ? 'var(--accent)' : 'var(--text-primary)',
            transition: 'color 200ms ease'
          }}
          onMouseEnter={(e) => {
            if (!liked) {
              e.currentTarget.style.color = 'var(--accent)'
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
            fill={liked ? 'var(--accent)' : 'none'}
            style={{ color: liked ? 'var(--accent)' : 'currentColor' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            {liked ? 'Liked' : 'Like'}
          </span>
        </button>
      </div>

      {/* Comments Feed - Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '32px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading comments...</p>
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {comments.map(c => (
              <div
                key={c.id}
                style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}
              >
                {/* Main Comment */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '12px'
                      }}
                    >
                      {c.user?.name?.[0]?.toUpperCase() || c.user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {c.user?.name || c.user?.email?.split('@')[0] || 'Unknown'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-primary)', marginLeft: '44px', lineHeight: 1.5 }}>
                    {c.content}
                  </p>
                </div>

                {/* Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div style={{ marginLeft: '44px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {c.replies.map(r => (
                      <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'var(--bg)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: '10px',
                            flexShrink: 0
                          }}
                        >
                          {r.user?.name?.[0]?.toUpperCase() || r.user?.email?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {r.user?.name || r.user?.email?.split('@')[0] || 'Unknown'}
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
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

      {/* Comment Input - Fixed at Bottom */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && send()}
            placeholder="Write a comment..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'border-color 200ms ease'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={send}
            style={{
              padding: '12px 16px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#4da8a6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
