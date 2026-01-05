import { useEffect, useState } from "react"
import { api } from "../api/api"
import { Heart, Send, Info, X, Download } from "lucide-react"

export default function PhotoInteractions({ photo }) {
  const [photoData, setPhotoData] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(photo?.is_liked || false)
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (photo) {
      setLiked(photo.is_liked || false)
    }
  }, [photo])

 
  useEffect(() => {
    if (!photo?.id) return
    api.get(`/photos/${photo.id}/`).then(r => setPhotoData(r.data))
  }, [photo?.id])

 
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

    const updatedPhoto = await api.get(`/photos/${photoData.id}/`)
    setPhotoData(updatedPhoto.data)
  }

  const send = async () => {
    if (!text.trim()) return
    const r = await api.post(`/photos/${photoData.id}/comments/`, { content: text })
    setComments([r.data, ...comments])
    setText("")
  }

  const handleDownload = async () => {
    if (!photoData?.id || downloading) return
    
    try {
      setDownloading(true)
      const token = localStorage.getItem("access_token")
      const response = await fetch(`http://localhost:8000/api/photos/${photoData.id}/download/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Download failed')
      }
      

      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = `photo-${photoData.id}.jpg`
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }
      

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download photo. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (!photoData) return null

  const hasMetadata =
    photoData.camera_model ||
    photoData.gps_location ||
    (photoData.exif_data && Object.keys(photoData.exif_data).length > 0) ||
    (photoData.ai_tags && photoData.ai_tags.length > 0)


  const formatExifKey = (key) => {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')
  }

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
      background: 'var(--elevated)'
    }}>
      
      <div style={{
        display: 'flex',
        gap: '12px',
        padding: 'var(--card-padding)',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={toggleLike}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: 'var(--button-padding)',
            background: liked ? 'var(--accent)' : 'transparent',
            color: liked ? 'var(--text-primary)' : 'var(--text-primary)',
            border: liked ? 'none' : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-button)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!liked) {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!liked) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }
          }}
        >
          <Heart size={18} strokeWidth={liked ? 2.5 : 1.5} fill={liked ? 'currentColor' : 'none'} />
          <span>{liked ? "Liked" : "Like"}</span>
          {photoData?.likes_count !== undefined && photoData.likes_count > 0 && (
            <span style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)',
              fontWeight: 400,
              marginLeft: '4px'
            }}>
              {photoData.likes_count}
            </span>
          )}
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: 'var(--button-padding)',
            background: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-button)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: downloading ? 'not-allowed' : 'pointer',
            opacity: downloading ? 0.6 : 1,
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!downloading) {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!downloading) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }
          }}
        >
          <Download size={18} strokeWidth={1.5} />
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
            padding: 'var(--button-padding)',
            background: showDetails ? 'var(--surface)' : 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-button)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            fontFamily: 'inherit'
          }}
          onMouseEnter={(e) => {
            if (!showDetails) {
              e.currentTarget.style.background = 'var(--surface)'
              e.currentTarget.style.borderColor = 'var(--accent)'
            }
          }}
          onMouseLeave={(e) => {
            if (!showDetails) {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }
          }}
        >
          <Info size={18} strokeWidth={1.5} />
          Details
        </button>
      </div>

      
      {showDetails && (
        <div style={{
          padding: 'var(--card-padding)',
          borderBottom: '1px solid var(--border-subtle)',
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
                      background: 'var(--surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-button)',
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
                    borderBottom: '1px solid var(--border-subtle)'
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

  
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--card-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--form-field-gap)'
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
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
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

   
      <div style={{
        padding: 'var(--card-padding)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--elevated)'
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
              padding: '14px 16px',
              background: 'var(--surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-button)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s ease, outline 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.outline = '2px solid var(--accent)'
              e.target.style.outlineOffset = '0'
              e.target.style.borderColor = 'transparent'
            }}
            onBlur={(e) => {
              e.target.style.outline = 'none'
              e.target.style.borderColor = 'var(--border-subtle)'
            }}
          />
          <button
            onClick={send}
            style={{
              padding: 'var(--button-padding)',
              background: 'var(--accent)',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s ease',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1a9bc2'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
          >
            <Send size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
