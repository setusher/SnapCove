import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { ChevronLeft } from "lucide-react"

export default function EventDetail(){
  const { eventId } = useParams()
  const { user } = useAuth()
  const [albums, setAlbums] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/`)
      .then(r => setAlbums(r.data))
  }, [eventId])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 48px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost mb-6 flex items-center gap-2"
            style={{ marginBottom: '24px' }}
          >
            <ChevronLeft size={18} />
            Back to Events
          </button>

          {/* Page Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)', lineHeight: '1.2' }}>
                Albums
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                {albums.length} {albums.length === 1 ? 'album' : 'albums'}
              </p>
            </div>
            
            {["admin", "coordinator", "photographer"].includes(user?.role) && (
              <button 
                onClick={() => nav(`/events/${eventId}/albums/create`)}
                className="btn btn-primary"
              >
                New Album
              </button>
            )}
          </div>

          {/* Albums Grid */}
          {albums.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                No albums yet. Create your first album to organize photos.
              </p>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary mt-6"
                >
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))'
              }}
            >
              {albums.map(album => (
                <div 
                  key={album.id}
                  onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                  className="cursor-pointer transition-all group relative"
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
                  {/* Album Cover/Thumbnail */}
                  {album.cover_image ? (
                    <img 
                      src={album.cover_image} 
                      alt={album.title}
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '1' }}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-tertiary)',
                        aspectRatio: '1'
                      }}
                    >
                      <span className="text-small font-medium">{album.title}</span>
                    </div>
                  )}
                  
                  {/* Metadata overlay on hover */}
                  <div 
                    className="p-3 transition-opacity absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderTop: '1px solid var(--border-primary)'
                    }}
                  >
                    <div className="font-medium text-body" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                      {album.title}
                    </div>
                    {album.description && (
                      <div className="text-meta mt-1 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {album.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
