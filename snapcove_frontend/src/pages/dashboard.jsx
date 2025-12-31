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
    <div className="min-h-screen bg-bg">
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: `var(--space-12)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Page Header */}
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-page-title mb-2">
                Events
              </h1>
              <p className="text-body text-secondary">
                Manage and monitor all campus events
              </p>
            </div>
            
            {["admin", "coordinator"].includes(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
                className="btn btn-primary"
              >
                <Plus size={16} strokeWidth={2} />
                Create Event
              </button>
            )}
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <p className="text-body text-secondary">
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
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
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
                    className="card cursor-pointer"
                    style={{
                      overflow: 'hidden',
                      padding: 0
                    }}
                  >
                    {/* Cover Image */}
                    <div 
                      style={{
                        height: '200px',
                        background: coverImage ? 'none' : 'var(--surface)',
                        borderBottom: '1px solid var(--border)',
                        overflow: 'hidden'
                      }}
                    >
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={event.title}
                          className="w-full h-full object-cover"
                          style={{ height: '200px' }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Camera size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                          <p className="text-meta mt-3">No photos yet</p>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--space-5)' }}>
                      <h3 className="text-section-title mb-3 line-clamp-2">
                        {event.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-meta">
                          {new Date(event.start_date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <Camera size={14} strokeWidth={1.5} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-meta">
                          {albumCount} {albumCount === 1 ? 'Album' : 'Albums'} · {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>

                      <span className="badge badge-active">Active</span>
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
