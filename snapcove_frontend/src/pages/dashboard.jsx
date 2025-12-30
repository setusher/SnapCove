import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import NavRail from "../components/NavRail"
import TopNav from "../components/TopNav"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
  }, [])

  return (
    <div className="min-h-screen animate-pageFade" style={{ background: 'var(--ink)' }}>
      <NavRail />
      
      <div className="dashboard-container" style={{ paddingTop: '120px' }}>
        <TopNav 
          title="Events"
          subtitle={`${events.length} total events`}
          action={
            ["admin", "coordinator"].includes(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
                className="btn btn-primary"
              >
                <span>➕</span>
                New Event
              </button>
            )
          }
        />

        <div className="px-16 py-12">
          {events.length === 0 ? (
            <div className="text-center py-48 animate-fadeIn">
              <div 
                className="w-32 h-32 mx-auto mb-12 rounded-[36px] flex items-center justify-center text-7xl shadow-floating"
                style={{
                  background: 'rgba(28, 37, 65, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(58, 80, 107, 0.2)'
                }}
              >
                📅
              </div>
              <h3 
                className="text-section mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                No events yet
              </h3>
              <p 
                className="text-meta mb-12 max-w-md mx-auto"
                style={{ color: 'var(--text-secondary)' }}
              >
                Create your first event to get started
              </p>
              {["admin", "coordinator"].includes(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  className="btn btn-primary"
                >
                  <span>➕</span>
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {events.map((event, idx) => (
                <div 
                  key={event.id} 
                  onClick={() => nav(`/events/${event.id}`)}
                  className="event-card stagger-item"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Cinematic Header */}
                  <div className="event-card-header">
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-6xl"
                      style={{ zIndex: 1 }}
                    >
                      🎉
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="event-card-body">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <h3 
                          className="text-card-title mb-3"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {event.title}
                        </h3>
                        <p 
                          className="text-meta line-clamp-2 mb-6 leading-relaxed"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {event.description || "No description"}
                        </p>
                      </div>
                      <span className="badge">Active</span>
                    </div>
                    
                    <div 
                      className="flex items-center justify-between pt-6"
                      style={{ borderTop: '1px solid rgba(58, 80, 107, 0.15)' }}
                    >
                      <span 
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                      </span>
                      <span 
                        className="text-sm font-medium transition-colors"
                        style={{ color: 'var(--aqua)' }}
                      >
                        View →
                      </span>
                    </div>
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
