import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { ChevronLeft, Plus } from "lucide-react"

export default function EventDetail(){
  const { eventId } = useParams()
  const { user } = useAuth()
  const [albums, setAlbums] = useState([])
  const [event, setEvent] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/`)
      .then(r => setEvent(r.data))
    api.get(`/events/${eventId}/albums/`)
      .then(r => setAlbums(r.data))
  }, [eventId])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
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
            Back to Events
          </button>

          {/* Page Header */}
          {event && (
            <div className="mb-10 flex items-end justify-between" style={{ marginBottom: '40px' }}>
              <div>
                <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.2', fontSize: '32px' }}>
                  {event.title}
                </h1>
                <p className="text-base" style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
                  {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} · {albums.reduce((sum, album) => sum + (album.photos?.length || 0), 0)} Photos · Active
                </p>
              </div>
              
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary flex items-center gap-2"
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 500
                  }}
                >
                  <Plus size={16} strokeWidth={2} />
                  Create Album
                </button>
              )}
            </div>
          )}

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
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '28px'
              }}
            >
              {albums.map(album => {
                const photoCount = album.photos?.length || 0
                return (
                  <div 
                    key={album.id}
                    onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                    className="cursor-pointer transition-all group relative"
                    style={{
                      width: '280px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
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
                    {/* Album Cover */}
                    <div 
                      className="w-full relative overflow-hidden"
                      style={{
                        height: '200px',
                        background: album.cover_image 
                          ? 'none'
                          : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface-elevated) 100%)',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      {album.cover_image ? (
                        <img 
                          src={album.cover_image} 
                          alt={album.title}
                          className="w-full h-full object-cover cover-image"
                          style={{
                            height: '200px',
                            transition: 'transform 400ms ease'
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>{album.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      <h3 
                        className="font-semibold mb-2"
                        style={{ 
                          fontSize: '16px',
                          color: 'var(--text-primary)',
                          lineHeight: '1.3',
                          marginBottom: '8px'
                        }}
                      >
                        {album.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
