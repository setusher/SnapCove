import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft } from "lucide-react"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
      .catch(err => console.error(err))
  }, [eventId, albumId])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <TopNav />
      
      <div className="container" style={{ paddingTop: '64px', padding: `var(--space-12) var(--space-6)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost"
            style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>Gallery</h1>
            <p className="text-body" style={{ color: 'var(--secondary-text)' }}>
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
              <p className="text-body" style={{ color: 'var(--secondary-text)' }}>No photos yet. Photos will appear here once uploaded.</p>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  className="card card-interactive"
                  style={{ overflow: 'hidden', padding: 0, aspectRatio: '1' }}
                >
                  <img 
                    src={photo.image} 
                    alt={`Photo ${photo.id}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', aspectRatio: '1' }}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

