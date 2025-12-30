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
  }, [eventId, albumId])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="flex items-center gap-1.5 mb-6 transition-colors"
            style={{ 
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div className="mb-10" style={{ marginBottom: '40px' }}>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.2', fontSize: '32px' }}>
              Gallery
            </h1>
            <p className="text-base" style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                No photos yet. Photos will appear here once uploaded.
              </p>
            </div>
          ) : (
            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '28px'
              }}
            >
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  className="cursor-pointer relative transition-all group"
                  style={{
                    width: '100%',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    aspectRatio: '1'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.08)'
                    e.currentTarget.style.borderColor = 'var(--accent-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                    e.currentTarget.style.borderColor = 'var(--border-primary)'
                  }}
                >
                  <img 
                    src={photo.image} 
                    alt={`Photo ${photo.id}`}
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '1' }}
                    loading="lazy"
                  />
                  
                  {/* Metadata on hover */}
                  {photo.caption && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 p-4 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)'
                      }}
                    >
                      <div className="text-sm text-white">
                        {photo.caption}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
