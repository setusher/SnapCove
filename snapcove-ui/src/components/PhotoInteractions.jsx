import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Heart, Send, Info, X } from "lucide-react"

export default function PhotoInteractions({ photo }) {
  const [photoData, setPhotoData] = useState(photo)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(photo?.is_liked || false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)

  // Update photoData when photo prop changes
  useEffect(() => {
    if (photo) {
      setPhotoData(photo)
      setLiked(photo.is_liked || false)
    }
  }, [photo])

  // Auto-refresh photo data when processing - polling every 2 seconds until done
  // Note: This requires the backend endpoint /photos/{id}/ to exist
  // If it doesn't exist, polling will be skipped
  useEffect(() => {
    if (!photoData) return
    
    const processingStatus = photoData.processing_status
    if (processingStatus && processingStatus !== 'done' && processingStatus !== 'failed') {
      const interval = setInterval(async () => {
        try {
          const r = await api.get(`/photos/${photoData.id}/`)
          setPhotoData(r.data)
       
          if (r.data) {
            setPhotoData(r.data)
            if (r.data.processing_status === 'done' || r.data.processing_status === 'failed') {
              clearInterval(interval)
            }
          }
        } catch (err) {
          // Endpoint might not exist - silently skip polling
          console.log('Photo polling endpoint not available, skipping auto-refresh')
          clearInterval(interval)
        }
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [photoData?.id, photoData?.processing_status])

  useEffect(() => {
    if (!photoData?.id) return
    
    api.get(`/photos/${photoData.id}/comments/`)
      .then(r => {
        setComments(r.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [photoData?.id])

  const toggleLike = async () => {
    if (!photoData?.id) return
    try {
      const r = await api.post(`/photos/${photoData.id}/like/`)
      setLiked(r.data.liked)
    } catch (err) {
      console.error(err)
    }
  }

  const send = async () => {
    if (!text.trim() || !photoData?.id) return
    try {
      const r = await api.post(`/photos/${photoData.id}/comments/`, { content: text })
      setComments([r.data, ...comments])
      setText("")
    } catch (err) {
      console.error(err)
    }
  }

  const formatExifKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatExifValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const hasMetadata = photoData?.exif_data || photoData?.camera_model || photoData?.gps_location || photoData?.capture_time || photoData?.width || photoData?.height

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '24px' }}>
      {/* Like and Details Buttons */}
      <div style={{ marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
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

        <button
          onClick={async () => {
            setShowDetails(!showDetails)
            if (!showDetails && photoData?.id) {
              const r = await api.get(`/photos/${photoData.id}/`)
              setPhotoData(r.data)
            }
          }}
          
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            color: showDetails ? 'var(--accent)' : 'var(--text-primary)',
            transition: 'color 200ms ease'
          }}
          onMouseEnter={(e) => {
            if (!showDetails) {
              e.currentTarget.style.color = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!showDetails) {
              e.currentTarget.style.color = 'var(--text-primary)'
            }
          }}
        >
          <Info
            size={20}
            strokeWidth={1.5}
            style={{ color: showDetails ? 'var(--accent)' : 'currentColor' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 500 }}>
            {showDetails ? 'Hide Details' : 'Show Details'}
          </span>
        </button>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div style={{
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '24px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>Photo Details</h3>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 200ms ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Dimensions */}
            {(photoData.width || photoData.height) && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dimensions
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {photoData.width && photoData.height ? `${photoData.width} × ${photoData.height} pixels` : photoData.width ? `${photoData.width}px width` : `${photoData.height}px height`}
                </div>
              </div>
            )}

            {/* Camera Model */}
            {photoData.camera_model && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Camera
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {photoData.camera_model}
                </div>
              </div>
            )}

            {/* GPS Location */}
            {photoData.gps_location && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Location
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {photoData.gps_location}
                </div>
              </div>
            )}

            {/* Capture Time */}
            {photoData.capture_time && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Taken
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {new Date(photoData.capture_time).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}

            {/* Uploaded Time */}
            {photoData.uploaded_at && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Uploaded
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                  {new Date(photoData.uploaded_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            )}

            {/* EXIF Data */}
            {photoData.exif_data && (
              <div>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  EXIF Metadata
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(photoData.exif_data).map(([key, value]) => (
                    <div key={key} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {formatExifKey(key)}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                        {formatExifValue(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!photoData.camera_model && !photoData.gps_location && !photoData.capture_time && (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No metadata available for this photo
              </div>
            )}
          </div>
        </div>
      )}

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
