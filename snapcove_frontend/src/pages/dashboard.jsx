import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import NavRail from "../components/NavRail"

export default function Dashboard(){
  const [events, setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    api.get("/events/")
      .then(r => setEvents(r.data))
  }, [])

  return (
    <div 
      className="min-h-screen animate-pageFade" 
      style={{ 
        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)'
      }}
    >
      <NavRail />
      
      {/* Main Content - Properly Centered */}
      <div className="pl-32 pr-16 py-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Header Section - Fixed Spacing */}
          <div className="mb-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h1 
                  className="text-6xl font-bold mb-4"
                  style={{ 
                    color: '#ffffff',
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif"
                  }}
                >
                  Events
                </h1>
                <p 
                  className="text-xl"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 500
                  }}
                >
                  {events.length} {events.length === 1 ? 'event' : 'events'} in your gallery
                </p>
              </div>
              
              {["admin", "coordinator"].includes(user?.role) && (
                <button 
                  onClick={() => nav("/events/create")}
                  className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                    color: '#0b132b',
                    boxShadow: '0 4px 24px rgba(93, 217, 193, 0.3)'
                  }}
                >
                  <span className="text-xl">+</span>
                  Create Event
                </button>
              )}
            </div>
            
            {/* Divider */}
            <div 
              className="h-px w-full"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(93, 217, 193, 0.3), transparent)'
              }}
            />
          </div>

          {/* Events Grid or Empty State */}
          {events.length === 0 ? (
            <div className="flex items-center justify-center py-32 animate-fadeIn">
              <div className="text-center max-w-md">
                <div 
                  className="w-32 h-32 mx-auto mb-8 rounded-3xl flex items-center justify-center text-6xl"
                  style={{
                    background: 'rgba(26, 41, 66, 0.6)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(58, 80, 107, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  📅
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: '#ffffff' }}
                >
                  No events yet
                </h3>
                <p 
                  className="text-lg mb-8"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.6'
                  }}
                >
                  Create your first event to start building your gallery
                </p>
                {["admin", "coordinator"].includes(user?.role) && (
                  <button 
                    onClick={() => nav("/events/create")}
                    className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 inline-flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                      color: '#0b132b',
                      boxShadow: '0 4px 24px rgba(93, 217, 193, 0.3)'
                    }}
                  >
                    <span className="text-xl">+</span>
                    Create Your First Event
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {events.map((event, idx) => (
                <div 
                  key={event.id} 
                  onClick={() => nav(`/events/${event.id}`)}
                  className="group cursor-pointer opacity-0"
                  style={{
                    animation: `slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.05}s forwards`
                  }}
                >
                  {/* Card Container */}
                  <div 
                    className="rounded-3xl overflow-hidden transition-all duration-300"
                    style={{
                      background: 'rgba(26, 41, 66, 0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(58, 80, 107, 0.3)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 32px rgba(93, 217, 193, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(93, 217, 193, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                      e.currentTarget.style.borderColor = 'rgba(58, 80, 107, 0.3)';
                    }}
                  >
                    {/* Header Image Area */}
                    <div 
                      className="h-56 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #1c2541 0%, #3a506b 100%)'
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(11, 19, 43, 0.8) 100%)'
                        }}
                      />
                      
                      {/* Centered Icon */}
                      <div className="absolute inset-0 flex items-center justify-center text-7xl opacity-90 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                        🎉
                      </div>
                      
                      {/* Floating Badge */}
                      <div className="absolute top-4 right-4">
                        <div 
                          className="px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: 'rgba(93, 217, 193, 0.2)',
                            color: '#6fffe9',
                            border: '1px solid rgba(93, 217, 193, 0.3)',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          Active
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Body */}
                    <div className="p-6">
                      <h3 
                        className="text-xl font-bold mb-3 line-clamp-1"
                        style={{ 
                          color: '#ffffff',
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {event.title}
                      </h3>
                      
                      <p 
                        className="text-sm line-clamp-2 mb-6"
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          lineHeight: '1.6',
                          minHeight: '2.8em'
                        }}
                      >
                        {event.description || "No description provided"}
                      </p>
                      
                      {/* Divider */}
                      <div 
                        className="h-px w-full mb-4"
                        style={{ background: 'rgba(58, 80, 107, 0.3)' }}
                      />
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                          <span>📅</span>
                          <span className="text-xs">
                            {new Date(event.start_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric'
                            })}
                            {' - '}
                            {new Date(event.end_date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        
                        <div 
                          className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                          style={{
                            color: '#5bc0be',
                            background: 'rgba(93, 217, 193, 0.1)'
                          }}
                        >
                          View →
                        </div>
                      </div>
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