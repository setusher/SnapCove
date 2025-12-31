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
      .catch(err => console.error(err))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <TopNav />
      
      <div className="container" style={{ paddingTop: '64px', padding: `var(--space-12) var(--space-6)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-10)' }}>
            <div>
              <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>Events</h1>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Manage and monitor all campus events</p>
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

          {events.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>No events yet. Create your first event to get started.</p>
              {["admin", "coordinator"].includes(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--space-6)' }}
                >
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              {events.map(event => {
                const coverImage = event.cover_image || null
                const albumCount = event.albums?.length || 0
                const photoCount = event.albums?.reduce((sum, album) => sum + (album.photos?.length || 0), 0) || 0
                
                return (
                  <div
                    key={event.id}
                    onClick={() => nav(`/events/${event.id}`)}
                    className="card card-interactive"
                    style={{ overflow: 'hidden', padding: 0 }}
                  >
                    <div style={{ height: '200px', background: coverImage ? 'none' : 'var(--surface)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                      {coverImage ? (
                        <img src={coverImage} alt={event.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      ) : (
                        <div className="flex-center" style={{ height: '100%', flexDirection: 'column' }}>
                          <Camera size={32} style={{ color: 'var(--secondary-text)', opacity: 0.5 }} />
                          <p className="text-caption" style={{ marginTop: 'var(--space-3)' }}>No photos yet</p>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 'var(--space-5)' }}>
                      <h3 className="heading-sm line-clamp-2" style={{ marginBottom: 'var(--space-3)' }}>{event.title}</h3>
                      <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                        <Calendar size={14} strokeWidth={1.5} style={{ color: 'var(--secondary-text)' }} />
                        <span className="text-caption">
                          {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center" style={{ gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                        <Camera size={14} strokeWidth={1.5} style={{ color: 'var(--secondary-text)' }} />
                        <span className="text-caption">
                          {albumCount} {albumCount === 1 ? 'Album' : 'Albums'} · {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                        </span>
                      </div>
                      <span className="badge badge-primary">Active</span>
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
