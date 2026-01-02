import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft, Upload, X } from "lucide-react"
import { useAuth } from "../auth/AuthProvider"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFiles, setUploadFiles] = useState([])
  const nav = useNavigate()
  const fileInputRef = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchPhotos()
  }, [eventId, albumId])

  const fetchPhotos = () => {
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => setPhotos(r.data))
      .catch(err => console.error(err))
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setUploadFiles(files)
    }
  }

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = uploadFiles.map(async (file, index) => {
        const formData = new FormData()
        formData.append('image', file)

        try {
          await api.post(`/events/${eventId}/albums/${albumId}/photos/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          setUploadProgress(((index + 1) / uploadFiles.length) * 100)
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err)
          throw err
        }
      })

      await Promise.all(uploadPromises)
      
      // Clear files and refresh photos
      setUploadFiles([])
      setUploadProgress(0)
      fetchPhotos()
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Failed to upload photos. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Back Button */}
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '8px 0',
              marginBottom: '24px',
              transition: 'color 200ms ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Gallery
              </h1>
              <p style={{ fontSize: '16px', fontWeight: 400, color: 'var(--text-secondary)' }}>
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>

            {/* Upload Button */}
            {user && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'var(--accent)',
                    color: 'var(--bg)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = '#4da8a6'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = 'var(--accent)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  <Upload size={16} strokeWidth={2} />
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>

                {/* Upload Files Preview */}
                {uploadFiles.length > 0 && !uploading && (
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '300px',
                    maxWidth: '400px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {uploadFiles.length} {uploadFiles.length === 1 ? 'file' : 'files'} selected
                      </span>
                      <button
                        onClick={() => {
                          setUploadFiles([])
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                      {uploadFiles.map((file, index) => (
                        <div key={index} style={{ fontSize: '12px', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                          {file.name}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={handleUpload}
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        background: 'var(--accent)',
                        color: 'var(--bg)',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 200ms ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#4da8a6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                    >
                      Upload {uploadFiles.length} {uploadFiles.length === 1 ? 'Photo' : 'Photos'}
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '16px',
                    minWidth: '300px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Uploading photos...
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'var(--bg)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: 'var(--accent)',
                        transition: 'width 200ms ease'
                      }} />
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {Math.round(uploadProgress)}% complete
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Photos Grid */}
          {photos.length === 0 ? (
            <div style={{ 
              background: 'var(--bg)', 
              border: '1px solid var(--border)', 
              borderRadius: '10px', 
              padding: '48px', 
              textAlign: 'center' 
            }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                No photos yet. Upload photos to get started.
              </p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {photos.map(photo => (
                <div 
                  key={photo.id}
                  onClick={() => nav(`/photos/${photo.id}`, { state: { photo } })}
                  style={{
                    aspectRatio: '1',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <img 
                    src={photo.image} 
                    alt={`Photo ${photo.id}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
