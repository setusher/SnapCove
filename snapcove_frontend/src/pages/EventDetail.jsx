import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import NavRail from "../components/NavRail"
import TopNav from "../components/TopNav"

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
    <div className="min-h-screen animate-pageFade" style={{ background: 'var(--ink)' }}>
      <NavRail />
      
      <div className="dashboard-container" style={{ paddingTop: '120px' }}>
        <TopNav 
          title="Albums"
          subtitle={`${albums.length} photo collections`}
          action={
            ["admin", "coordinator", "photographer"].includes(user?.role) && (
              <button 
                onClick={() => nav(`/events/${eventId}/albums/create`)}
                className="btn btn-primary"
              >
                <span>➕</span>
                New Album
              </button>
            )
          }
        />

        <div className="px-8 lg:px-16 py-12">
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost mb-8 flex items-center gap-2"
            style={{ marginBottom: '24px' }}
          >
            <span>←</span>
            Back to Events
          </button>

          {albums.length === 0 ? (
            <div className="text-center py-48 animate-fadeIn">
              <div 
                className="w-32 h-32 mx-auto mb-12 rounded-[24px] flex items-center justify-center text-7xl shadow-floating"
                style={{
                  background: 'rgba(26, 41, 66, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(58, 80, 107, 0.3)'
                }}
              >
                📸
              </div>
              <h3 
                className="text-section mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                No albums yet
              </h3>
              <p 
                className="text-meta mb-12 max-w-md mx-auto"
                style={{ color: 'var(--text-secondary)' }}
              >
                Create your first album to organize photos
              </p>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary"
                >
                  <span>➕</span>
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album, idx) => (
                <div 
                  key={album.id}
                  onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                  className="event-card stagger-item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="event-card-header">
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-5xl"
                      style={{ zIndex: 1 }}
                    >
                      📷
                    </div>
                  </div>
                  
                  <div className="event-card-body">
                    <h3 
                      className="text-lg font-bold mb-3"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {album.title}
                    </h3>
                    <p 
                      className="text-sm line-clamp-2 leading-relaxed"
                      style={{ 
                        color: 'var(--text-secondary)',
                        opacity: 0.7
                      }}
                    >
                      {album.description || "No description"}
                    </p>
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
