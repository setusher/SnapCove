import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import NavRail from "../components/NavRail"
import TopNav from "../components/TopNav"


export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
  }, [eventId, albumId])

  return (
    <div className="min-h-screen animate-pageFade" style={{ background: 'var(--ink)' }}>
      <NavRail />
      
      <div className="dashboard-container" style={{ paddingTop: '120px' }}>
        <TopNav 
          title="Photo Gallery"
          subtitle={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}
        />

        <div className="px-8 lg:px-16 py-12">
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost mb-8 flex items-center gap-2"
            style={{ marginBottom: '24px' }}
          >
            <span>←</span>
            Back to Albums
          </button>

          {photos.length === 0 ? (
            <div className="text-center py-48 animate-fadeIn">
              <div 
                className="w-32 h-32 mx-auto mb-12 rounded-[24px] flex items-center justify-center text-7xl shadow-floating"
                style={{
                  background: 'rgba(26, 41, 66, 0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(58, 80, 107, 0.3)'
                }}
              >
                🖼️
              </div>
              <h3 
                className="text-section mb-6"
                style={{ color: 'var(--text-primary)' }}
              >
                No photos yet
              </h3>
              <p 
                className="text-meta"
                style={{ color: 'var(--text-secondary)' }}
              >
                Photos will appear here once uploaded
              </p>
            </div>
          ) : (
            <div className="masonry-grid">
              {photos.map((photo, idx) => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  className="masonry-item cursor-pointer stagger-item group"
                  style={{ animationDelay: `${idx * 0.02}s` }}
                >
                  <div className="relative overflow-hidden rounded-[12px]">
                    <img 
                      src={photo.image} 
                      alt={`Photo ${photo.id}`}
                      className="w-full h-auto"
                      style={{
                        border: '1px solid rgba(58, 80, 107, 0.2)',
                        transition: 'all 0.3s ease-in-out'
                      }}
                      loading="lazy"
                    />
                    
                    <div className="gradient-overlay rounded-[12px]" />
                    
                    <div className="floating-caption">
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ zIndex: 2 }}
                      >
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                          style={{
                            background: 'rgba(26, 41, 66, 0.9)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(93, 217, 193, 0.3)',
                            color: 'var(--aqua)'
                          }}
                        >
                          🔍
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
