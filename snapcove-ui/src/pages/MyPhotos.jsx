import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { X, Eye, Heart, MessageCircle, Download, Calendar, Folder, Image as ImageIcon } from "lucide-react"

export default function MyPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [photoMetrics, setPhotoMetrics] = useState(null)
  const [loadingMetrics, setLoadingMetrics] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await api.get("/photos/user/")
      setPhotos(response.data)
    } catch (err) {
      console.error("Failed to fetch photos:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchPhotoMetrics = async (photoId) => {
    setLoadingMetrics(true)
    try {
      
      const photoRes = await api.get(`/photos/${photoId}/`)
      const photo = photoRes.data


      const commentsRes = await api.get(`/photos/${photoId}/comments/`)
      const commentsCount = commentsRes.data?.length || 0

      
      let album = null
      let event = null
      if (photo.album_id) {
        try {
          const albumRes = await api.get(`/events/${photo.event_id}/albums/${photo.album_id}/`)
          album = albumRes.data
          
          if (photo.event_id) {
            const eventRes = await api.get(`/events/${photo.event_id}/`)
            event = eventRes.data
          }
        } catch (err) {
          console.error("Error fetching album/event:", err)
        }
      }

      setPhotoMetrics({
        ...photo,
        comments_count: commentsCount,
        album,
        event
      })
    } catch (err) {
      console.error("Failed to fetch photo metrics:", err)
    } finally {
      setLoadingMetrics(false)
    }
  }

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo)
    fetchPhotoMetrics(photo.id)
  }

  const handleDownload = (photo) => {

    const link = document.createElement('a')
    link.href = photo.image
    link.download = `photo-${photo.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: 'var(--section-padding-y) var(--page-padding-x)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          <div style={{ marginBottom: 'var(--section-padding-y)' }}>
            <h1 style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px', paddingTop: 'var(--space-2)' }}>
              My Photos
            </h1>
            <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>
              View and manage all your uploaded photos
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 'var(--section-padding-y)' }}>
              <div 
                style={{ 
                  width: '32px',
                  height: '32px',
                  border: '2px solid var(--accent)',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  margin: '0 auto',
                  animation: 'spin 1s linear infinite'
                }}
              />
            </div>
          ) : photos.length === 0 ? (
            <div style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-card)', 
              padding: 'var(--section-padding-y)', 
              textAlign: 'center' 
            }}>
              <ImageIcon size={64} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                You haven't uploaded any photos yet.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 'var(--card-gap)'
            }}>
              {photos.map(photo => (
                <div
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)}
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  }}
                >
                  <div style={{ 
                    height: '200px',
                    width: '100%',
                    background: photo.thumbnail ? 'none' : 'var(--elevated)',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {photo.thumbnail ? (
                      <img 
                        src={photo.thumbnail} 
                        alt={photo.caption || 'Photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : photo.image ? (
                      <img 
                        src={photo.image} 
                        alt={photo.caption || 'Photo'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ImageIcon size={32} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                      </div>
                    )}
                  </div>

                  <div style={{ padding: 'var(--card-padding)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {photo.caption && (
                      <p style={{ 
                        fontSize: '14px', 
                        fontWeight: 500, 
                        color: 'var(--text-primary)', 
                        marginBottom: '8px',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {photo.caption}
                      </p>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      marginTop: 'auto',
                      fontSize: '12px',
                      color: 'var(--text-secondary)'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Heart size={14} />
                        {photo.likes_count || 0}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageCircle size={14} />
                        -
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedPhoto && photoMetrics && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 17, 40, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => {
          setSelectedPhoto(null)
          setPhotoMetrics(null)
        }}>
          <div style={{
            background: 'var(--elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--card-padding)',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setSelectedPhoto(null)
                setPhotoMetrics(null)
              }}
              style={{
                position: 'absolute',
                top: 'var(--card-padding)',
                right: 'var(--card-padding)',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            {loadingMetrics ? (
              <div style={{ textAlign: 'center', padding: 'var(--section-padding-y)' }}>
                <div 
                  style={{ 
                    width: '32px',
                    height: '32px',
                    border: '2px solid var(--accent)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    margin: '0 auto',
                    animation: 'spin 1s linear infinite'
                  }}
                />
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 'var(--card-padding)' }}>
                  <img 
                    src={photoMetrics.image} 
                    alt={photoMetrics.caption || 'Photo'}
                    style={{ 
                      width: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'contain',
                      borderRadius: 'var(--radius-card)'
                    }}
                  />
                </div>

 
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--form-field-gap)',
                  marginBottom: 'var(--card-padding)'
                }}>
        
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'var(--card-padding)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(236, 72, 153, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Heart size={20} style={{ color: '#ec4899' }} fill="#ec4899" />
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {photoMetrics.likes_count || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Likes</div>
                    </div>
                  </div>

         
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'var(--card-padding)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(18, 130, 162, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <MessageCircle size={20} style={{ color: 'var(--accent)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {photoMetrics.comments_count || 0}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Comments</div>
                    </div>
                  </div>

              
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-card)',
                    padding: 'var(--card-padding)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(34, 197, 94, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Download size={20} style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        -
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Downloads</div>
                    </div>
                  </div>
                </div>

          
                <div style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  padding: 'var(--card-padding)',
                  marginBottom: 'var(--card-padding)'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--form-field-gap)' }}>
                    Photo Details
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--form-field-gap)' }}>
                    {photoMetrics.caption && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Caption
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {photoMetrics.caption}
                        </div>
                      </div>
                    )}

                    {photoMetrics.event && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Event
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Folder size={16} />
                          {photoMetrics.event.title}
                        </div>
                      </div>
                    )}

                    {photoMetrics.album && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Album
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Folder size={16} />
                          {photoMetrics.album.title}
                        </div>
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Uploaded
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} />
                        {new Date(photoMetrics.uploaded_at).toLocaleDateString('en-US', { 
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                  </div>
                </div>

      
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => nav(`/photos/${photoMetrics.id}`)}
                    style={{
                      flex: 1,
                      padding: 'var(--button-padding)',
                      background: 'var(--accent)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-button)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1a9bc2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                  >
                    <Eye size={16} />
                    View Photo
                  </button>
                  <button
                    onClick={() => handleDownload(photoMetrics)}
                    style={{
                      flex: 1,
                      padding: 'var(--button-padding)',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-button)',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease, border-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--surface)'
                      e.currentTarget.style.borderColor = 'var(--accent)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    }}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

