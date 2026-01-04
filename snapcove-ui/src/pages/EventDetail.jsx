import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import TopNav from "../components/TopNav"
import { ChevronLeft, Plus, Image as ImageIcon, X, Upload, Info } from "lucide-react"
import { canCreateAlbum } from "../utils/roles"

export default function EventDetail(){
  const { eventId } = useParams()
  const { user } = useAuth()
  const [albums, setAlbums] = useState([])
  const [event, setEvent] = useState(null)
  const [albumPhotoCounts, setAlbumPhotoCounts] = useState({})
  const [showAlbumThumbnailModal, setShowAlbumThumbnailModal] = useState(false)
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false)
  const [showAlbumDetailsModal, setShowAlbumDetailsModal] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const eventThumbnailInputRef = useRef(null)
  const albumThumbnailInputRef = useRef(null)
  const nav = useNavigate()

  useEffect(() => {
    fetchEvent()
    fetchAlbums()
  }, [eventId])

  const fetchEvent = () => {
    api.get(`/events/${eventId}/`)
      .then(r => setEvent(r.data))
      .catch(err => console.error(err))
  }

  const fetchAlbums = () => {
    api.get(`/events/${eventId}/albums/`)
      .then(r => {
        const albumsData = r.data.results || r.data || []
        setAlbums(albumsData)
        
        // Fetch photo counts for each album
        const photoCountPromises = albumsData.map(album => 
          api.get(`/events/${eventId}/albums/${album.id}/photos/`)
            .then(photoRes => {
              const photos = photoRes.data.results || photoRes.data || []
              return { albumId: album.id, count: photos.length }
            })
            .catch(() => ({ albumId: album.id, count: 0 }))
        )
        
        Promise.all(photoCountPromises).then(counts => {
          const countsMap = {}
          counts.forEach(({ albumId, count }) => {
            countsMap[albumId] = count
          })
          setAlbumPhotoCounts(countsMap)
        })
      })
      .catch(err => console.error(err))
  }

  const handleEventThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingThumbnail(true)
    const formData = new FormData()
    formData.append('cover_image', file)

    try {
      await api.patch(`/events/${eventId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      fetchEvent()
    } catch (err) {
      console.error('Failed to upload event thumbnail:', err)
      alert('Failed to upload thumbnail. Please try again.')
    } finally {
      setUploadingThumbnail(false)
      if (eventThumbnailInputRef.current) {
        eventThumbnailInputRef.current.value = ''
      }
    }
  }

  const handleAlbumThumbnailUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !selectedAlbum) return

    setUploadingThumbnail(true)
    const formData = new FormData()
    formData.append('cover_image', file)

    try {
      const response = await api.patch(`/events/${eventId}/albums/${selectedAlbum.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      fetchAlbums()
      // Update selectedAlbum in modal with the new data and preserve photo count
      if (response.data) {
        const photoCount = selectedAlbum.photoCount !== undefined ? selectedAlbum.photoCount : (albumPhotoCounts[selectedAlbum.id] || 0)
        setSelectedAlbum({
          ...response.data,
          photoCount: photoCount
        })
      }
    } catch (err) {
      console.error('Failed to upload album thumbnail:', err)
      alert('Failed to upload thumbnail. Please try again.')
    } finally {
      setUploadingThumbnail(false)
      if (albumThumbnailInputRef.current) {
        albumThumbnailInputRef.current.value = ''
      }
    }
  }

  const openAlbumDetailsModal = (album, e) => {
    e.stopPropagation()
    setSelectedAlbum(album)
    setShowAlbumDetailsModal(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: 'var(--section-padding-y) var(--page-padding-x)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '12px 0',
              marginBottom: '32px',
              marginTop: '16px',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Events
          </button>

          {/* Page Header */}
          {event && (
            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {event.title}
                  </h1>
                  <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>
                    {albums.length} {albums.length === 1 ? 'Album' : 'Albums'} · {Object.values(albumPhotoCounts).reduce((sum, count) => sum + count, 0)} Photos · Active
                  </p>
                </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowEventDetailsModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--surface)'
                    e.currentTarget.style.borderColor = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  <Info size={16} strokeWidth={2} />
                  Event Details
                </button>
                {canCreateAlbum(user?.role) && (
                  <button 
                    onClick={() => nav(`/events/${eventId}/albums/create`)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: 'var(--accent)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'all 200ms ease'
                    }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1a9bc2'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(18, 130, 162, 0.3)'
                  }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--accent)'
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <Plus size={16} strokeWidth={2} />
                    Create Album
                  </button>
                )}
              </div>
              </div>
            </div>
          )}

          {/* Albums Grid */}
          {albums.length === 0 ? (
            <div style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-card)', 
              padding: 'var(--section-padding-y)', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No albums yet. Create your first album to organize photos.
              </p>
              {canCreateAlbum(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  style={{
                    marginTop: 'var(--space-3)',
                    padding: 'var(--button-padding)',
                    background: 'var(--accent)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a9bc2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                >
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--card-gap)'
            }}>
              {albums.map(album => {
                const photoCount = albumPhotoCounts[album.id] || 0
                return (
                  <div 
                    key={album.id}
                    onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
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
                    {/* Album Cover */}
                    <div style={{ 
                      height: '200px',
                      width: '100%',
                      background: album.cover_image ? 'none' : 'var(--elevated)',
                      overflow: 'hidden'
                    }}>
                      {album.cover_image ? (
                        <img 
                          src={album.cover_image} 
                          alt={album.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{ 
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{album.title}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ padding: 'var(--card-padding)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ 
                        fontSize: '18px',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                      }}>
                        {album.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        {photoCount} {photoCount === 1 ? 'Photo' : 'Photos'}
                      </p>
                      <button
                        onClick={(e) => openAlbumDetailsModal(album, e)}
                        style={{
                          width: '100%',
                          padding: 'var(--button-padding)',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-button)',
                          fontSize: '14px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: 'auto'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--elevated)'
                          e.currentTarget.style.borderColor = 'var(--accent)'
                          e.currentTarget.style.color = 'var(--accent)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.borderColor = 'var(--border-subtle)'
                          e.currentTarget.style.color = 'var(--text-secondary)'
                        }}
                      >
                        <Info size={14} strokeWidth={2} />
                        Album Details
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Event Details Modal */}
          {showEventDetailsModal && event && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 17, 40, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }} onClick={() => setShowEventDetailsModal(false)}>
              <div style={{
                background: 'var(--elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--card-padding)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--card-padding)' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Event Details
                  </h2>
                  <button
                    onClick={() => setShowEventDetailsModal(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Title
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {event.title}
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Description
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {event.description}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Start Date
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {new Date(event.start_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        End Date
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                        {new Date(event.end_date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Created
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {new Date(event.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {event.created_by && (
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                          by {event.created_by.name || event.created_by.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Albums
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent)' }}>
                        {albums.length}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Total Photos
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent)' }}>
                        {Object.values(albumPhotoCounts).reduce((sum, count) => sum + count, 0)}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Status
                    </div>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 500,
                      background: 'transparent',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent)'
                    }}>
                      <div style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent)'
                      }}></div>
                      {event.is_public ? 'Public' : 'Private'}
                    </div>
                  </div>

                  {/* Thumbnail Section */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Thumbnail
                    </div>
                    {event.cover_image ? (
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '12px'
                      }}>
                        <img 
                          src={event.cover_image} 
                          alt="Event thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        borderRadius: '8px',
                        border: '1px dashed var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        marginBottom: '12px'
                      }}>
                        No thumbnail set
                      </div>
                    )}
                    <input
                      ref={eventThumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleEventThumbnailUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => eventThumbnailInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                      style={{
                        padding: 'var(--button-padding)',
                        background: 'var(--accent)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-button)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: uploadingThumbnail ? 'not-allowed' : 'pointer',
                        opacity: uploadingThumbnail ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!uploadingThumbnail) {
                          e.currentTarget.style.background = '#1a9bc2'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!uploadingThumbnail) {
                          e.currentTarget.style.background = 'var(--accent)'
                        }
                      }}
                    >
                      <Upload size={16} strokeWidth={2} />
                      {uploadingThumbnail ? 'Uploading...' : event.cover_image ? 'Change Thumbnail' : 'Set Thumbnail'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Album Details Modal */}
          {showAlbumDetailsModal && selectedAlbum && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(10, 17, 40, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }} onClick={() => {
              setShowAlbumDetailsModal(false)
              setSelectedAlbum(null)
            }}>
              <div style={{
                background: 'var(--elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--card-padding)',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto'
              }} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--card-padding)' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Album Details
                  </h2>
                  <button
                    onClick={() => {
                      setShowAlbumDetailsModal(false)
                      setSelectedAlbum(null)
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    <X size={20} strokeWidth={2} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Title */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Title
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {selectedAlbum.title}
                    </div>
                  </div>

                  {/* Description */}
                  {selectedAlbum.description && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Description
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                        {selectedAlbum.description}
                      </div>
                    </div>
                  )}

                  {/* Created Info */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Created
                    </div>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {new Date(selectedAlbum.created_at).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {selectedAlbum.created_by && (
                        <span style={{ color: 'var(--text-secondary)', marginLeft: '8px' }}>
                          by {selectedAlbum.created_by.name || selectedAlbum.created_by.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Photo Count */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Photos
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent)' }}>
                      {selectedAlbum.photoCount !== undefined ? selectedAlbum.photoCount : (albumPhotoCounts[selectedAlbum.id] || 0)}
                    </div>
                  </div>

                  {/* Thumbnail Section */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Thumbnail
                    </div>
                    {selectedAlbum.cover_image ? (
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '12px'
                      }}>
                        <img 
                          src={selectedAlbum.cover_image} 
                          alt="Album thumbnail"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        height: '200px',
                        borderRadius: '8px',
                        border: '1px dashed var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '14px',
                        marginBottom: '12px'
                      }}>
                        No thumbnail set
                      </div>
                    )}
                    <input
                      ref={albumThumbnailInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAlbumThumbnailUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      onClick={() => albumThumbnailInputRef.current?.click()}
                      disabled={uploadingThumbnail}
                      style={{
                        padding: 'var(--button-padding)',
                        background: 'var(--accent)',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-button)',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: uploadingThumbnail ? 'not-allowed' : 'pointer',
                        opacity: uploadingThumbnail ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!uploadingThumbnail) {
                          e.currentTarget.style.background = '#1a9bc2'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!uploadingThumbnail) {
                          e.currentTarget.style.background = 'var(--accent)'
                        }
                      }}
                    >
                      <Upload size={16} strokeWidth={2} />
                      {uploadingThumbnail ? 'Uploading...' : selectedAlbum.cover_image ? 'Change Thumbnail' : 'Set Thumbnail'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
