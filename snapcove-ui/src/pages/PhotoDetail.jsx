import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import PhotoInteractions from "../components/PhotoInteractions"
import { X } from "lucide-react"

export default function PhotoDetail() {
  const { photoId } = useParams()
  const location = useLocation()
  const nav = useNavigate()
  const [photo, setPhoto] = useState(location.state?.photo || null)
  const [loading, setLoading] = useState(!location.state?.photo)

  useEffect(() => {
    if (!photo) {
      const savedPhoto = localStorage.getItem(`photo_${photoId}`)
      if (savedPhoto) {
        try {
          setPhoto(JSON.parse(savedPhoto))
          setLoading(false)
        } catch (e) {
          console.error(e)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } else {
      localStorage.setItem(`photo_${photoId}`, JSON.stringify(photo))
      setLoading(false)
    }
  }, [photoId, photo])

  if (loading) {
    return (
      <div style={{ 
        position: 'fixed',
        inset: 0,
        top: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              width: '32px',
              height: '32px',
              border: '2px solid var(--accent)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto 16px',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div style={{ 
        position: 'fixed',
        inset: 0,
        top: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>Photo not found</h2>
          <button 
            onClick={() => nav(-1)} 
            style={{
              padding: '10px 20px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      position: 'fixed',
      inset: 0,
      top: '64px',
      display: 'flex',
      background: 'var(--bg)',
      overflow: 'hidden'
    }}>
      {/* Close Button - Top Left */}
      <button
        onClick={() => nav(-1)}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 50,
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-subtle)'
        }}
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Photo Panel - Left Side */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--card-padding)',
        background: 'var(--bg)'
      }}>
        <img 
          src={photo.image}
          alt={photo.caption || 'Photo'}
          style={{ 
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 64px)',
            objectFit: 'contain'
          }}
        />
      </div>

      {/* Comments Panel - Right Side (360px) */}
      <div style={{ 
        width: '360px',
        background: 'var(--elevated)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <PhotoInteractions photo={photo} />
        </div>
      </div>
    </div>
  )
}
