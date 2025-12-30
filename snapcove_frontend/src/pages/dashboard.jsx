import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { Calendar, Camera, Plus } from "lucide-react"

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
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div className="max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="mb-10 flex items-end justify-between" style={{ marginBottom: '40px' }}>
            <div>
              <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.2', fontSize: '32px' }}>
                Events
              </h1>
              <p className="text-base" style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
                Manage and monitor all campus events
              </p>
            </div>
            
            {["admin", "coordinator"].includes(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
                className="btn btn-primary flex items-center gap-2"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(91, 192, 190, 0.3)'
                }}
                onMouseLeave={(e) => {
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
              className="grid gap-7"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '28px'
              }}
            >
              {events.map(event => {
                const coverImage = event.cover_image || null
                const albumCount = event.albums?.length || 0
                const photoCount = event.albums?.reduce((sum, album) => sum + (album.photos?.length || 0), 0) || 0
                
                return (
                  <div
                    key={event.id}
                    onClick={() => nav(`/events/${event.id}`)}
                    className="cursor-pointer"
                    style={{
                      width: '100%',
                      minWidth: '280px',
                      maxWidth: '380px',
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)'
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.12)'
                      e.currentTarget.style.borderColor = 'var(--accent-primary)'
                      const img = e.currentTarget.querySelector('.cover-image')
                      if (img) img.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                      e.currentTarget.style.borderColor = 'var(--border-primary)'
                      const img = e.currentTarget.querySelector('.cover-image')
                      if (img) img.style.transform = 'scale(1)'
                    }}
                  >
                    {/* Cover Image */}
                    <div 
                      className="w-full relative overflow-hidden"
                      style={{
                        height: '240px',
                        background: coverImage 
                          ? 'none'
                          : 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--surface-elevated) 100%)',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={event.title}
                          className="cover-image w-full h-full object-cover"
                          style={{
                            height: '240px',
                            transition: 'transform 400ms ease'
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <Camera size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                          <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>No photos yet</p>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '20px' }}>
                      {/* Event Title */}
                      <h3 
                        className="font-semibold mb-3"
                        style={{ 
                          fontSize: '18px',
                          color: 'var(--text-primary)',
                          lineHeight: '1.3',
                          letterSpacing: '-0.01em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          marginBottom: '12px'
                        }}
                      >
                        {event.title}
                      </h3>

                      {/* Date */}
                      <div className="flex items-center gap-2 mb-2" style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                        <Calendar size={14} strokeWidth={1.5} />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-1.5 mb-4" style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                        <Camera size={14} strokeWidth={1.5} />
                        <span>{albumCount} {albumCount === 1 ? 'Album' : 'Albums'}</span>
                        <span>·</span>
                        <span>{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</span>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4">
                        <span 
                          className="inline-flex items-center gap-1.5"
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 500,
                            background: 'rgba(91, 192, 190, 0.12)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(91, 192, 190, 0.25)'
                          }}
                        >
                          <span 
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: 'var(--accent-primary)'
                            }}
                          />
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
