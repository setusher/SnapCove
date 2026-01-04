import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { Calendar, Camera, Plus } from "lucide-react"
import { canCreateEvent } from "../utils/roles"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Events
              </h1>
              <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>
                Manage and monitor all campus events
              </p>
            </div>
            
            {canCreateEvent(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
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
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <Plus size={16} strokeWidth={2} />
                Create Event
              </button>
            )}
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '48px', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No events yet. Create your first event to get started.
              </p>
              {canCreateEvent(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
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
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '28px'
            }}>
              {events.map(event => {
                const coverImage = event.cover_image || null
                const albumCount = event.albums?.length || 0
                const photoCount = event.albums?.reduce((sum, album) => sum + (album.photos?.length || 0), 0) || 0
                
                return (
                  <div
                    key={event.id}
                    onClick={() => nav(`/events/${event.id}`)}
                    style={{
                      width: '100%',
                      maxWidth: '380px',
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
                      const img = e.currentTarget.querySelector('.cover-image')
                      if (img) img.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.borderColor = 'var(--border)'
                      const img = e.currentTarget.querySelector('.cover-image')
                      if (img) img.style.transform = 'scale(1)'
                    }}
                  >
                    {/* Cover Image Section */}
                    <div style={{ 
                      height: '240px',
                      width: '100%',
                      background: coverImage ? 'none' : 'linear-gradient(135deg, #0F1620 0%, #1E2A3A 100%)',
                      borderBottom: '1px solid var(--border)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={event.title}
                          className="cover-image"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 400ms ease'
                          }}
                        />
                      ) : (
                        <div style={{ 
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px'
                        }}>
                          <Camera size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No photos yet</p>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '20px' }}>
                      {/* Event Title */}
                      <h3 style={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        marginBottom: '12px',
                        maxHeight: '46.8px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {event.title}
                      </h3>

                      {/* Date Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <Calendar size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {new Date(event.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <Camera size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                          {albumCount} {albumCount === 1 ? 'Album' : 'Albums'} · {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        background: 'rgba(91, 192, 190, 0.12)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(91, 192, 190, 0.3)'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'var(--accent)'
                        }}></div>
                        Active
                      </div>
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
