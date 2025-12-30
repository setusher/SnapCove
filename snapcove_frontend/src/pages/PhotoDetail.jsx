import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import PhotoInteractions from "../components/PhotoInteractions"

export default function PhotoDetail() {
  const { photoId } = useParams()
  const location = useLocation()
  const nav = useNavigate()
  const [photo, setPhoto] = useState(location.state?.photo || null)
  const [loading, setLoading] = useState(!location.state?.photo)

  useEffect(() => {
    // If photo wasn't passed via state, try to get it from localStorage as fallback
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
        // If no state and no localStorage, show error
        setLoading(false)
      }
    } else {
      // Save photo to localStorage as cache
      localStorage.setItem(`photo_${photoId}`, JSON.stringify(photo))
      setLoading(false)
    }
  }, [photoId, photo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pageFade" style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--navy) 100%)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-aqua border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pageFade" style={{ background: 'linear-gradient(135deg, var(--ink) 0%, var(--navy) 100%)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Photo not found</h2>
          <button onClick={() => nav(-1)} className="btn btn-primary">Go Back</button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen animate-pageFade overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--ink) 0%, var(--navy) 100%)'
      }}
    >
      {/* Close Button */}
      <button
        onClick={() => nav(-1)}
        className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-floating"
        style={{
          background: 'rgba(28, 37, 65, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(58, 80, 107, 0.3)',
          color: 'var(--text-primary)'
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 2-Panel Layout */}
      <div className="h-screen flex">
        {/* Left Panel - Photo (65%) */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: '65%',
            background: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          {/* Dark Vignette */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(10, 22, 40, 0.7) 100%)'
            }}
          />
          
          {/* Photo */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-16">
            <img 
              src={photo.image}
              alt={photo.caption || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-[32px]"
              style={{
                boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.8)'
              }}
            />
          </div>
        </div>

        {/* Right Panel - Interactions (35%) */}
        <div 
          className="relative overflow-hidden"
          style={{
            width: '35%',
            background: 'var(--navy)'
          }}
        >
          {/* Glass Interaction Rail */}
          <div 
            className="h-full flex flex-col rounded-l-[32px]"
            style={{
              background: 'rgba(28, 37, 65, 0.6)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderLeft: '1px solid rgba(58, 80, 107, 0.3)',
              boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="flex-1 overflow-y-auto p-8">
              <PhotoInteractions photo={photo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

