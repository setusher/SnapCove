import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft } from "lucide-react"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
      .catch(err => console.error(err))
  }, [eventId, albumId])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Back Button */}
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 0',
              marginBottom: '24px',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
              Gallery
            </h1>
            <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '48px', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No photos yet. Photos will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  style={{
                    aspectRatio: '1',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img 
                    src={photo.image} 
                    alt={`Photo ${photo.id}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
