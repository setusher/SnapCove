import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
  }, [])

  return (
    <div className="min-h-screen page-container px-6 py-10"
         style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Events</h1>
            <p className="text-gray-400 text-lg">Explore and manage your events</p>
          </div>

          {["admin", "coordinator"].includes(user?.role) && (
            <button 
              onClick={() => nav("/events/create")}
              className="glow-button px-6 py-3 rounded-xl font-semibold relative z-10 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #5bc0be, #6fffe9)', color: '#0b132b' }}>
              <span className="text-xl">+</span>
              Create Event
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((e, idx) => (
            <div 
              key={e.id} 
              onClick={() => nav(`/events/${e.id}`)}
              className="grid-item glow-card cursor-pointer p-6 rounded-2xl"
              style={{ 
                backgroundColor: '#1c2541',
                animationDelay: `${idx * 0.1}s`
              }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                     style={{ backgroundColor: '#3a506b' }}>
                  🎉
                </div>
                <div className="w-2 h-2 rounded-full pulse" 
                     style={{ backgroundColor: '#5bc0be' }}></div>
              </div>
              
              <h2 className="font-bold text-xl mb-2" style={{ color: '#6fffe9' }}>
                {e.title}
              </h2>
              <p className="text-gray-400 line-clamp-2">
                {e.description}
              </p>
              
              <div className="mt-4 pt-4 border-t flex items-center gap-2"
                   style={{ borderColor: 'rgba(91, 192, 190, 0.2)' }}>
                <span className="text-sm" style={{ color: '#5bc0be' }}>View Albums →</span>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-400 text-xl">No events yet. Create your first event!</p>
          </div>
        )}
      </div>
    </div>
  )
}