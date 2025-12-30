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
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 48px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost mb-6 flex items-center gap-2"
            style={{ marginBottom: '24px' }}
          >
            <ChevronLeft size={18} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)', lineHeight: '1.2' }}>
              Gallery
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'
              }}
            >
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  className="cursor-pointer relative transition-all group"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    aspectRatio: '1'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
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
                      className="p-3 transition-opacity absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        borderTop: '1px solid var(--border-primary)'
                      }}
                    >
                      <div className="text-body text-sm" style={{ color: 'var(--text-primary)' }}>
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
