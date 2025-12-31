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
      <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div 
            style={{ 
              width: '32px',
              height: '32px',
              border: '2px solid var(--accent)',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              margin: '0 auto var(--space-4)',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 className="heading-md" style={{ marginBottom: 'var(--space-4)' }}>Photo not found</h2>
          <button onClick={() => nav(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', display: 'flex', background: 'var(--primary-bg)' }}>
      <button
        onClick={() => nav(-1)}
        className="flex-center"
        style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          zIndex: 50,
          width: '40px',
          height: '40px',
          background: 'var(--secondary-bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          color: 'var(--primary-text)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--accent)'
          e.currentTarget.style.color = 'white'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--secondary-bg)'
          e.currentTarget.style.color = 'var(--primary-text)'
        }}
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      <div className="flex-center" style={{ width: '70%', background: 'var(--primary-bg)', padding: 'var(--space-10)', position: 'relative' }}>
        <img 
          src={photo.image}
          alt={photo.caption || 'Photo'}
          style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', borderRadius: '6px' }}
        />
      </div>

      <div className="flex-col" style={{ width: '30%', background: 'var(--secondary-bg)', borderLeft: '1px solid var(--border)', display: 'flex' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <PhotoInteractions photo={photo} />
        </div>
      </div>
    </div>
  )
}
