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
    <div className="app-layout animate-pageFade">
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

        <div className="p-8 lg:p-12">
          {events.length === 0 ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-navy border border-slate/30 flex items-center justify-center text-5xl shadow-floating">
                📅
              </div>
              <h3 className="text-section text-[#e8eaed] mb-3 tracking-tight">No events yet</h3>
              <p className="text-meta text-[#e8eaed]/60 mb-8">Create your first event to get started</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, idx) => (
                <div 
                  key={event.id} 
                  onClick={() => nav(`/events/${event.id}`)}
                  className="card p-8 cursor-pointer stagger-item group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-[20px] bg-aqua/10 border border-aqua/20 flex items-center justify-center text-3xl group-hover:bg-aqua/20 group-hover:border-aqua/40 transition-all">
                      🎉
                    </div>
                    <span className="badge">Active</span>
                  </div>
                  
                  <h3 className="text-card-title text-[#e8eaed] mb-3 tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-meta text-[#e8eaed]/60 line-clamp-2 mb-6 leading-relaxed">
                    {event.description || "No description"}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs pt-4 border-t border-slate/20">
                    <span className="text-meta text-[#e8eaed]/50">
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </span>
                    <span className="text-aqua font-medium group-hover:text-mint transition-colors">View →</span>
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
