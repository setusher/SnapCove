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
      .catch(err => console.error(err))
    api.get(`/events/${eventId}/albums/`)
      .then(r => setAlbums(r.data))
      .catch(err => console.error(err))
  }, [eventId])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
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
            Back to Events
          </button>

          {/* Page Header */}
          {event && (
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {event.title}
                </h1>
                <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>
                  {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} · {albums.reduce((sum, album) => sum + (album.photos?.length || 0), 0)} Photos · Active
                </p>
              </div>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#4da8a6'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 192, 190, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
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
            <div style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '48px', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No albums yet. Create your first album to organize photos.
              </p>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  style={{
                    marginTop: '24px',
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
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '28px'
            }}>
              {albums.map(album => {
                const photoCount = album.photos?.length || 0
                return (
                  <div 
                    key={album.id}
                    onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                    style={{
                      width: '280px',
                      background: 'var(--bg)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)'
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.3)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = 'var(--border)'
                    }}
                  >
                    {/* Album Cover */}
                    <div style={{ 
                      height: '200px',
                      width: '100%',
                      background: album.cover_image ? 'none' : 'linear-gradient(135deg, #0F1620 0%, #1E2A3A 100%)',
                      borderBottom: '1px solid var(--border)',
                      overflow: 'hidden'
                    }}>
                      {album.cover_image ? (
                        <img 
                          src={album.cover_image} 
                          alt={album.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{album.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px' }}>
                      <h3 style={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                      }}>
                        {album.title}
                      </h3>
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
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
