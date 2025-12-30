import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
  }, [])

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Events"
          subtitle={`${events.length} total events`}
          action={
            ["admin", "coordinator"].includes(user?.role) && (
              <button 
                onClick={() => nav("/events/create")}
                className="btn btn-primary">
                <span>➕</span>
                New Event
              </button>
            )
          }
        />

        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 flex items-center justify-center text-4xl">
                📅
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No events yet</h3>
              <p className="text-gray-400 mb-6">Create your first event to get started</p>
              {["admin", "coordinator"].includes(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  className="btn btn-primary">
                  <span>➕</span>
                  Create Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  onClick={() => nav(`/events/${event.id}`)}
                  className="card p-6 cursor-pointer stagger-item">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-400/20 flex items-center justify-center text-2xl">
                      🎉
                    </div>
                    <span className="badge">Active</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2 mb-4">
                    {event.description || "No description"}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </span>
                    <span className="text-cyan-400 font-medium">View →</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}