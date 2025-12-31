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
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <TopNav />
      
      <div className="container" style={{ paddingTop: '64px', padding: `var(--space-12) var(--space-6)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost"
            style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Events
          </button>

          {event && (
            <div className="flex-between" style={{ marginBottom: 'var(--space-10)' }}>
              <div>
                <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>{event.title}</h1>
                <p className="text-body" style={{ color: 'var(--secondary-text)' }}>
                  {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} · {albums.reduce((sum, album) => sum + (album.photos?.length || 0), 0)} Photos
                </p>
              </div>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary"
                >
                  <Plus size={16} strokeWidth={2} />
                  Create Album
                </button>
              )}
            </div>
          )}

          {albums.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>No albums yet. Create your first album to organize photos.</p>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--space-6)' }}
                >
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
              {albums.map(album => {
                const photoCount = album.photos?.length || 0
                return (
                  <div 
                    key={album.id}
                    onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                    className="card card-interactive"
                    style={{ overflow: 'hidden', padding: 0 }}
                  >
                    <div style={{ height: '200px', background: album.cover_image ? 'none' : 'var(--surface)', borderBottom: '1px solid var(--border)', overflow: 'hidden' }}>
                      {album.cover_image ? (
                        <img src={album.cover_image} alt={album.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      ) : (
                        <div className="flex-center" style={{ height: '100%' }}>
                          <span className="text-body" style={{ color: 'var(--secondary-text)' }}>{album.title}</span>
                        </div>
                      )}
                    </div>
                    <div style={{ padding: 'var(--space-5)' }}>
                      <h3 className="heading-sm" style={{ marginBottom: 'var(--space-2)' }}>{album.title}</h3>
                      <p className="text-caption">{photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}</p>
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
