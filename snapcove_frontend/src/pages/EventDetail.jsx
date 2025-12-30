import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import NavRail from "../components/NavRail"

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
    <div 
      className="min-h-screen animate-pageFade" 
      style={{ 
        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)'
      }}
    >
      <NavRail />
      
      {/* Main Content */}
      <div className="pl-32 pr-16 py-16 min-h-screen">
        <div className="max-w-[1600px] mx-auto">
          
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
            className="mb-12 px-6 py-3 rounded-2xl font-medium text-sm transition-all hover:scale-105 inline-flex items-center gap-3"
            style={{
              background: 'rgba(26, 41, 66, 0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(58, 80, 107, 0.3)',
              color: 'rgba(255, 255, 255, 0.8)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(93, 217, 193, 0.4)';
              e.currentTarget.style.color = '#6fffe9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(58, 80, 107, 0.3)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <span>←</span>
            Back to Events
          </button>

          {/* Header Section */}
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
                  Albums
                </h1>
                <p 
                  className="text-xl"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: 500
                  }}
                >
                  {albums.length} photo {albums.length === 1 ? 'collection' : 'collections'}
                </p>
              </div>
              
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 hover:shadow-lg flex items-center gap-3"
                  style={{
                    background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                    color: '#0b132b',
                    boxShadow: '0 4px 24px rgba(93, 217, 193, 0.3)'
                  }}
                >
                  <span className="text-xl">+</span>
                  New Album
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

          {/* Albums Grid or Empty State */}
          {albums.length === 0 ? (
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
                  📸
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: '#ffffff' }}
                >
                  No albums yet
                </h3>
                <p 
                  className="text-lg mb-8"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.6'
                  }}
                >
                  Create your first album to organize photos
                </p>
                {["admin", "coordinator", "photographer"].includes(user?.role) && (
                  <button 
                    onClick={() => nav(`/events/${eventId}/albums/create`)}
                    className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 inline-flex items-center gap-3"
                    style={{
                      background: 'linear-gradient(135deg, #5bc0be, #6fffe9)',
                      color: '#0b132b',
                      boxShadow: '0 4px 24px rgba(93, 217, 193, 0.3)'
                    }}
                  >
                    <span className="text-xl">+</span>
                    Create Album
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {albums.map((album, idx) => (
                <div 
                  key={album.id}
                  onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
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
                    {/* Album Cover Area */}
                    <div 
                      className="h-64 relative overflow-hidden"
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
                        📷
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
                        {album.title}
                      </h3>
                      
                      <p 
                        className="text-sm line-clamp-2"
                        style={{ 
                          color: 'rgba(255, 255, 255, 0.6)',
                          lineHeight: '1.6',
                          minHeight: '2.8em'
                        }}
                      >
                        {album.description || "No description"}
                      </p>
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