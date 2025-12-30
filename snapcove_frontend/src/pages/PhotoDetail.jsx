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
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: '#0b132b' }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ 
              borderColor: '#5bc0be', 
              borderTopColor: 'transparent' 
            }}
          />
          <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Loading photo...</p>
        </div>
      </div>
    )
  }

  if (!photo) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: '#0b132b' }}
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#ffffff' }}>
            Photo not found
          </h2>
          <button 
            onClick={() => nav(-1)} 
            className="px-8 py-4 rounded-2xl font-semibold"
            style={{
              background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
              color: '#0b132b'
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="h-screen w-screen overflow-hidden animate-pageFade"
      style={{ background: '#0b132b' }}
    >
      {/* Close Button - Fixed Position */}
      <button
        onClick={() => nav(-1)}
        className="fixed top-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: 'rgba(26, 41, 66, 0.9)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(58, 80, 107, 0.4)',
          color: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(93, 217, 193, 0.2)';
          e.currentTarget.style.borderColor = 'rgba(93, 217, 193, 0.5)';
          e.currentTarget.style.color = '#6fffe9';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(26, 41, 66, 0.9)';
          e.currentTarget.style.borderColor = 'rgba(58, 80, 107, 0.4)';
          e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
        }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* 2-Panel Layout: 65% Photo / 35% Interactions */}
      <div className="flex h-full">
        
        {/* Left Panel - Photo (65%) */}
        <div 
          className="relative flex items-center justify-center"
          style={{
            width: '65%',
            background: 'radial-gradient(circle at center, #1c2541 0%, #0b132b 100%)'
          }}
        >
          {/* Dark Vignette Effect */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(11, 19, 43, 0.8) 100%)',
              mixBlendMode: 'multiply'
            }}
          />
          
          {/* Photo Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-20">
            <img 
              src={photo.image}
              alt={photo.caption || 'Photo'}
              className="max-w-full max-h-full object-contain rounded-3xl"
              style={{
                boxShadow: '0 32px 80px -16px rgba(0, 0, 0, 0.8), 0 0 48px rgba(0, 0, 0, 0.5)'
              }}
            />
          </div>
        </div>

        {/* Right Panel - Interactions (35%) */}
        <div 
          className="relative"
          style={{
            width: '35%',
            background: '#1c2541'
          }}
        >
          {/* Frosted Glass Rail */}
          <div 
            className="h-full flex flex-col rounded-l-3xl overflow-hidden"
            style={{
              background: 'rgba(26, 41, 66, 0.7)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderLeft: '1px solid rgba(58, 80, 107, 0.3)',
              boxShadow: 'inset 1px 0 0 rgba(255, 255, 255, 0.05), -8px 0 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Interactions Content */}
            <div className="flex-1 overflow-y-auto p-10">
              <PhotoInteractions photo={photo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}