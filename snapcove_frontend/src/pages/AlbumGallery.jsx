import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
  }, [eventId, albumId])

  return (
    <div className="min-h-screen page-container px-6 py-10"
         style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 50%, #0b132b 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="text-sm mb-4 flex items-center gap-2 hover:gap-3 transition-all"
            style={{ color: '#5bc0be' }}>
            ← Back to Albums
          </button>
          <h1 className="text-5xl font-bold gradient-text mb-2">Photo Gallery</h1>
          <p className="text-gray-400 text-lg">
            {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
          </p>
        </div>

        {photos.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
            {photos.map((p, idx) => (
              <div 
                key={p.id}
                onClick={() => setSelectedPhoto(p)}
                className="grid-item break-inside-avoid mb-4 cursor-pointer"
                style={{ animationDelay: `${idx * 0.05}s` }}>
                <img 
                  src={p.image} 
                  alt={`Photo ${p.id}`}
                  className="image-hover w-full rounded-xl"
                  style={{ border: '2px solid rgba(91, 192, 190, 0.2)' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-gray-400 text-xl">No photos in this album yet</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(11, 19, 43, 0.95)' }}>
          <div 
            onClick={e => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh] relative">
            <button 
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center glow-button"
              style={{ background: 'linear-gradient(135deg, #5bc0be, #6fffe9)', color: '#0b132b' }}>
              ✕
            </button>
            <img 
              src={selectedPhoto.image} 
              alt="Full size"
              className="max-w-full max-h-[90vh] rounded-2xl"
              style={{ boxShadow: '0 0 60px rgba(91, 192, 190, 0.5)' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}