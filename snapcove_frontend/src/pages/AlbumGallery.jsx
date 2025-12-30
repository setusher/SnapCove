import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
  }, [eventId, albumId])

  return (
    <div className="app-layout animate-pageFade">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Photo Gallery"
          subtitle={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}
        />

        <div className="p-8 lg:p-12">
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost mb-8">
            <span>←</span>
            Back to Albums
          </button>

          {photos.length === 0 ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-navy border border-slate/30 flex items-center justify-center text-5xl shadow-floating">
                🖼️
              </div>
              <h3 className="text-section text-[#e8eaed] mb-3 tracking-tight">No photos yet</h3>
              <p className="text-meta text-[#e8eaed]/60">Photos will appear here once uploaded</p>
            </div>
          ) : (
            <div className="masonry-grid">
              {photos.map((photo, idx) => (
                <div 
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="masonry-item cursor-pointer stagger-item group"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <div className="relative overflow-hidden rounded-[24px]">
                    <img 
                      src={photo.image} 
                      alt={`Photo ${photo.id}`}
                      className="w-full h-auto rounded-[24px] border border-slate/20 group-hover:border-aqua/40 transition-all duration-500"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient overlay on hover */}
                    <div className="gradient-overlay"></div>
                    
                    {/* Floating caption chip */}
                    <div className="floating-caption">
                      <div className="bg-navy/90 backdrop-blur-md px-4 py-3 rounded-[16px] border border-aqua/20 shadow-floating">
                        <p className="text-sm text-aqua font-medium">View Full Size</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal - Premium */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-ink/98 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-8 right-8 w-14 h-14 rounded-[20px] bg-navy/80 hover:bg-navy border border-slate/30 hover:border-aqua/40 flex items-center justify-center text-[#e8eaed] transition-all z-10 backdrop-blur-md shadow-floating">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            onClick={e => e.stopPropagation()}
            className="max-w-7xl max-h-[90vh] relative">
            <img 
              src={selectedPhoto.image} 
              alt="Full size"
              className="max-w-full max-h-[90vh] rounded-[32px] shadow-floating-lg border border-slate/20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
