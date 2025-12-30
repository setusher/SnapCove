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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div 
            className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4"
            style={{ 
              borderColor: 'var(--accent-primary)', 
              borderTopColor: 'transparent' 
            }}
          />
          <p className="text-body" style={{ color: 'var(--text-secondary)' }}>Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <h2 className="text-section-title mb-4">Photo not found</h2>
          <button onClick={() => nav(-1)} className="btn btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen overflow-hidden flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Close Button */}
      <button
        onClick={() => nav(-1)}
        className="absolute top-4 left-4 z-50 w-10 h-10 flex items-center justify-center cursor-pointer transition-colors"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          color: 'var(--text-primary)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-primary)'
        }}
      >
        <X size={20} strokeWidth={1.5} />
      </button>

      {/* Photo Panel - 70% (LEFT) */}
      <div 
        className="flex items-center justify-center relative"
        style={{ 
          width: '70%', 
          background: 'var(--bg-primary)',
          padding: '40px'
        }}
      >
        <img 
          src={photo.image}
          alt={photo.caption || 'Photo'}
          className="max-w-full max-h-full object-contain"
          style={{ maxHeight: '100vh' }}
        />
      </div>

      {/* Interactions Panel - 30% (RIGHT) */}
      <div 
        className="border-l flex flex-col"
        style={{ 
          width: '30%',
          background: 'var(--bg-primary)',
          borderColor: 'var(--border-primary)'
        }}
      >
        <div className="flex-1 overflow-y-auto">
          <PhotoInteractions photo={photo} />
        </div>
      </div>
    </div>
  )
}
