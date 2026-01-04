import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { Calendar, Camera, Plus } from "lucide-react"
import { canCreateEvent } from "../utils/roles"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const [eventStats, setEventStats] = useState({})
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => {
        const eventsData = r.data.results || r.data || []
        setEvents(eventsData)
        
        // Fetch stats for each event
        eventsData.forEach(event => {
          api.get(`/events/${event.id}/albums/`)
            .then(albumRes => {
              const albums = albumRes.data.results || albumRes.data || []
              setEventStats(prev => ({
                ...prev,
                [event.id]: { albumCount: albums.length, photoCount: 0 }
              }))
              
              // Fetch photo counts
              const photoPromises = albums.map(album => 
                api.get(`/events/${event.id}/albums/${album.id}/photos/`)
                  .then(photoRes => {
                    const photos = photoRes.data.results || photoRes.data || []
                    return photos.length
                  })
                  .catch(() => 0)
              )
              
              Promise.all(photoPromises).then(counts => {
                setEventStats(prev => ({
                  ...prev,
                  [event.id]: {
                    ...prev[event.id],
                    photoCount: counts.reduce((sum, count) => sum + count, 0)
                  }
                }))
              })
            })
            .catch(() => {
              setEventStats(prev => ({
                ...prev,
                [event.id]: { albumCount: 0, photoCount: 0 }
              }))
            })
        })
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: 'var(--section-padding-y) var(--page-padding-x)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Page Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--section-padding-y)' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px', paddingTop: 'var(--space-2)' }}>
                Events
              </h1>
              <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>
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
                  padding: 'var(--button-padding)',
                  background: 'var(--accent)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-button)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#1a9bc2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent)'
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
              background: 'var(--surface)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-card)', 
              padding: 'var(--section-padding-y)', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No events yet. Create your first event to get started.
              </p>
              {canCreateEvent(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  style={{
                    marginTop: 'var(--space-3)',
                    padding: 'var(--button-padding)',
                    background: 'var(--accent)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a9bc2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--card-gap)'
            }}>
              {events.map(event => {
                const coverImage = event.cover_image || null
                const stats = eventStats[event.id] || { albumCount: 0, photoCount: 0 }
                const albumCount = stats.albumCount
                const photoCount = stats.photoCount
                
                return (
                  <div
                    key={event.id}
                    onClick={() => nav(`/events/${event.id}`)}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-card)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }}
                  >
                    {/* Cover Image Section */}
                    <div style={{ 
                      height: '200px',
                      width: '100%',
                      background: coverImage ? 'none' : 'var(--elevated)',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={event.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
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
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>No thumbnail</p>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: 'var(--card-padding)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Event Title */}
                      <h3 style={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {event.title}
                      </h3>

                      {/* Date Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Calendar size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {new Date(event.created_at).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Stats Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <Camera size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                          {albumCount} {albumCount === 1 ? 'Album' : 'Albums'} · {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-button)',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: 'transparent',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent)',
                        marginTop: 'auto'
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
