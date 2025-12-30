import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { Calendar } from "lucide-react"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 48px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)', lineHeight: '1.2' }}>
                Events
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Manage and monitor all campus events
              </p>
            </div>
            
            {["admin", "coordinator"].includes(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
                className="btn btn-primary"
              >
                + Create Event
              </button>
            )}
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                No events yet. Create your first event to get started.
              </p>
              {["admin", "coordinator"].includes(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  className="btn btn-primary mt-6"
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div 
              className="grid gap-6"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, 320px)',
                justifyContent: 'start'
              }}
            >
              {events.map(event => {
                // Get cover image (last uploaded photo) - for now using placeholder
                const coverImage = event.cover_image || null
                const albumCount = event.albums?.length || 0
                const photoCount = event.albums?.reduce((sum, album) => sum + (album.photos?.length || 0), 0) || 0
                
                return (
                  <div
                    key={event.id}
                    onClick={() => nav(`/events/${event.id}`)}
                    className="cursor-pointer transition-all"
                    style={{
                      width: '320px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '8px',
                      overflow: 'hidden'
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
                    {/* Cover Image */}
                    <div 
                      className="w-full flex items-center justify-center"
                      style={{
                        height: '200px',
                        background: coverImage 
                          ? `url(${coverImage}) center/cover no-repeat`
                          : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface-elevated) 100%)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      {!coverImage && (
                        <div className="text-center">
                          <Calendar size={48} style={{ opacity: 0.3 }} />
                          <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>No photos yet</p>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '20px' }}>
                      {/* Event Title */}
                      <h3 
                        className="font-semibold mb-3"
                        style={{ 
                          fontSize: '16px',
                          color: 'var(--text-primary)',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center gap-2 mb-2" style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                        <Calendar size={16} />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-1 mb-4" style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                        <span>{albumCount} {albumCount === 1 ? 'Album' : 'Albums'}</span>
                        <span>·</span>
                        <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4">
                        <span className="badge badge-active">
                          Active
                        </span>
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
