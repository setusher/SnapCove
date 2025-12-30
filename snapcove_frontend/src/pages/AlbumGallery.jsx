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
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Photo Gallery"
          subtitle={`${photos.length} ${photos.length === 1 ? 'photo' : 'photos'}`}
        />

        <div className="p-6">
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost mb-6">
            <span>←</span>
            Back to Albums
          </button>

          {photos.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 flex items-center justify-center text-4xl">
                🖼️
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No photos yet</h3>
              <p className="text-gray-400">Photos will appear here once uploaded</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
              {photos.map((photo, idx) => (
                <div 
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="break-inside-avoid mb-4 cursor-pointer stagger-item group"
                  style={{ animationDelay: `${idx * 0.05}s` }}>
                  <img 
                    src={photo.image} 
                    alt={`Photo ${photo.id}`}
                    className="w-full rounded-xl border border-gray-700 group-hover:border-cyan-500 transition-all"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <button 
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-white transition-all z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div 
            onClick={e => e.stopPropagation()}
            className="max-w-6xl max-h-[90vh] relative">
            <img 
              src={selectedPhoto.image} 
              alt="Full size"
              className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}