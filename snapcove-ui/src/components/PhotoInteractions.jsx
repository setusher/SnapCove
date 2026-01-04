import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Heart, Send, Info, X } from "lucide-react"

export default function PhotoInteractions({ photo }) {
  const [photoData, setPhotoData] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(photo?.is_liked || false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (photo) {
      setLiked(photo.is_liked || false)
    }
  }, [photo])

  // 🔥 Always load the real enriched photo object
  useEffect(() => {
    if (!photo?.id) return
    api.get(`/photos/${photo.id}/`).then(r => setPhotoData(r.data))
  }, [photo?.id])

  /* 🔁 Auto refresh until AI done */
  useEffect(() => {
    if (!photo?.id) return
    if (photoData?.processing_status !== "done") {
      const t = setInterval(async () => {
        const r = await api.get(`/photos/${photo.id}/`)
        setPhotoData(r.data)
        if (r.data.processing_status === "done") clearInterval(t)
      }, 1200)
      return () => clearInterval(t)
    }
  }, [photo?.id])

  useEffect(() => {
    if (!photoData?.id) return
    api.get(`/photos/${photoData.id}/comments/`).then(r => {
      setComments(r.data)
      setLoading(false)
    })
  }, [photoData?.id])

  const toggleLike = async () => {
    const r = await api.post(`/photos/${photoData.id}/like/`)
    setLiked(r.data.liked)
  }

  const send = async () => {
    if (!text.trim()) return
    const r = await api.post(`/photos/${photoData.id}/comments/`, { content: text })
    setComments([r.data, ...comments])
    setText("")
  }

  if (!photoData) return null

  const hasMetadata =
    photoData.camera_model ||
    photoData.gps_location ||
    (photoData.exif_data && Object.keys(photoData.exif_data).length > 0) ||
    (photoData.ai_tags && photoData.ai_tags.length > 0)

  // Format EXIF key for display
  const formatExifKey = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

  // Format EXIF value for display
  const formatExifValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value)
    }
    return String(value)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--surface)'
    }}>
      {/* Action Buttons - Top */}
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: '24px',
        borderBottom: '1px solid var(--border)'
      }}>
        <button
          onClick={toggleLike}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: liked ? 'var(--accent)' : 'transparent',
            color: liked ? 'var(--bg)' : 'var(--text-primary)',
            border: liked ? 'none' : '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!liked) {
              e.currentTarget.style.background = 'var(--bg)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!liked) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border)'
            }
          }}
        >
          <Heart size={18} strokeWidth={liked ? 2.5 : 1.5} fill={liked ? 'currentColor' : 'none'} />
          {liked ? "Liked" : "Like"}
        </button>
        <button
          onClick={async () => {
            setShowDetails(!showDetails)
            if (!showDetails) {
              const r = await api.get(`/photos/${photoData.id}/`)
              setPhotoData(r.data)
            }
          }}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: showDetails ? 'var(--bg)' : 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 200ms ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!showDetails) {
              e.currentTarget.style.background = 'var(--bg)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!showDetails) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border)'
            }
          }}
        >
          <Info size={18} strokeWidth={1.5} />
          Details
        </button>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border)',
          maxHeight: '40vh',
          overflowY: 'auto'
        }}>
          {!hasMetadata && (
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              margin: 0
            }}>
              No metadata available for this photo
            </p>
          )}

          {photoData.camera_model && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Camera
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                {photoData.camera_model}
              </div>
            </div>
          )}

          {photoData.gps_location && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Location
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                {photoData.gps_location}
              </div>
            </div>
          )}

          {photoData.ai_tags && photoData.ai_tags.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                AI Tags
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {photoData.ai_tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '4px 12px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {photoData.exif_data && (
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                EXIF Metadata
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {Object.entries(photoData.exif_data).map(([key, value]) => (
                  <div key={key} style={{
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: 'var(--text-secondary)',
                      marginBottom: '4px'
                    }}>
                      {formatExifKey(key)}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      wordBreak: 'break-word'
                    }}>
                      {formatExifValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comments Feed - Scrollable */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '32px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              Loading comments...
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--text-secondary)'
            }}>
              No comments yet. Be the first to comment!
            </p>
          </div>
        ) : (
          comments.map(c => (
            <div
              key={c.id}
              style={{
                paddingBottom: '16px',
                borderBottom: '1px solid var(--border)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
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
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {c.user?.name?.[0]?.toUpperCase() || c.user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    {c.user?.name || c.user?.email?.split('@')[0] || 'Unknown'}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-secondary)'
                  }}>
                    {new Date(c.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <p style={{
                fontSize: '14px',
                color: 'var(--text-primary)',
                marginLeft: '44px',
                lineHeight: 1.5,
                margin: 0,
                wordBreak: 'break-word'
              }}>
                {c.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Comment Input - Fixed at Bottom */}
      <div style={{
        padding: '24px',
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)'
      }}>
        <div style={{
          display: 'flex',
          gap: '12px'
        }}>
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
              transition: 'background 200ms ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#6b9b9f'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
