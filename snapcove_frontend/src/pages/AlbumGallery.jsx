import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import NavRail from "../components/NavRail"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
  }, [eventId, albumId])

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
            onClick={() => nav(`/events/${eventId}`)}
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
            Back to Albums
          </button>

          {/* Header Section */}
          <div className="mb-16">
            <h1 
              className="text-6xl font-bold mb-4"
              style={{ 
                color: '#ffffff',
                letterSpacing: '-0.02em',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              Gallery
            </h1>
            <p 
              className="text-xl"
              style={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 500
              }}
            >
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
            
            {/* Divider */}
            <div 
              className="h-px w-full mt-6"
              style={{ 
                background: 'linear-gradient(90deg, transparent, rgba(93, 217, 193, 0.3), transparent)'
              }}
            />
          </div>

          {/* Photos Grid or Empty State */}
          {photos.length === 0 ? (
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
                  🖼️
                </div>
                <h3 
                  className="text-3xl font-bold mb-4"
                  style={{ color: '#ffffff' }}
                >
                  No photos yet
                </h3>
                <p 
                  className="text-lg"
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: '1.6'
                  }}
                >
                  Photos will appear here once uploaded
                </p>
              </div>
            </div>
          ) : (
            <div 
              className="grid gap-6"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
              }}
            >
              {photos.map((photo, idx) => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  className="group cursor-pointer opacity-0"
                  style={{
                    animation: `slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${idx * 0.02}s forwards`
                  }}
                >
                  <div 
                    className="relative rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      aspectRatio: '4/3',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(93, 217, 193, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                    }}
                  >
                    {/* Photo */}
                    <img 
                      src={photo.image} 
                      alt={`Photo ${photo.id}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 0%, rgba(11, 19, 43, 0.9) 100%)'
                      }}
                    />
                    
                    {/* Hover Action */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                      style={{
                        transform: 'translateY(8px)'
                      }}
                    >
                      <div 
                        className="px-6 py-3 rounded-2xl font-semibold text-sm"
                        style={{
                          background: 'rgba(26, 41, 66, 0.9)',
                          backdropFilter: 'blur(20px)',
                          border: '1px solid rgba(93, 217, 193, 0.4)',
                          color: '#6fffe9',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        View Photo
                      </div>
                    </div>
                    
                    {/* Bottom Caption on Hover */}
                    {photo.caption && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(to top, rgba(11, 19, 43, 0.95) 0%, transparent 100%)'
                        }}
                      >
                        <p 
                          className="text-sm line-clamp-2"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.9)',
                            lineHeight: '1.5'
                          }}
                        >
                          {photo.caption}
                        </p>
                      </div>
                    )}
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