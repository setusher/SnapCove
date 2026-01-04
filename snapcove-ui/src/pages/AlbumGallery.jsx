import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft, Upload, X } from "lucide-react"
import { useAuth } from "../auth/AuthProvider"
import { canUpload } from "../utils/roles"

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

  // Poll for processing photos to refresh when they're done
  useEffect(() => {
    const hasProcessingPhotos = photos.some(p => 
      (p.processing_status === 'processing' || p.processing_status === 'pending') && !p.image
    )
    
    if (!hasProcessingPhotos) return

    const interval = setInterval(() => {
      fetchPhotos()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [photos, eventId, albumId])

  const fetchPhotos = () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:22',message:'fetchPhotos called',data:{eventId,albumId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H3'})}).catch(()=>{});
    // #endregion
    
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r => {
        // Handle paginated response (DRF viewsets may return {results: [...]})
        const photosData = r.data.results || r.data
        const photosArray = Array.isArray(photosData) ? photosData : []
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:26',message:'fetchPhotos response received',data:{photoCount:photosArray.length,hasResults:!!r.data.results,isArray:Array.isArray(photosData),firstPhotoId:photosArray[0]?.id,firstPhotoImage:photosArray[0]?.image,firstPhotoThumbnail:photosArray[0]?.thumbnail,firstPhotoProcessingStatus:photosArray[0]?.processing_status,allPhotoIds:photosArray.map(p=>p.id),allPhotosWithImages:photosArray.filter(p=>p.image).length,allPhotosWithThumbnails:photosArray.filter(p=>p.thumbnail).length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H4'})}).catch(()=>{});
        // #endregion
        
        console.log('Fetched photos data:', photosData)
        console.log('First photo:', photosData?.[0])
        console.log('First photo image field:', photosData?.[0]?.image)
        setPhotos(photosArray)
      })
      .catch(err => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:32',message:'fetchPhotos error',data:{error:err?.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        console.error('Error fetching photos:', err)
        setPhotos([])
      })
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
      // Create FormData for bulk upload
      const formData = new FormData()
      
      // Append all files to the formData
      // The backend expects 'files' as a list field
      uploadFiles.forEach((file) => {
        formData.append('files', file)
      })

      // Optional: Add caption and tags if needed in the future
      // formData.append('caption', '')
      // formData.append('tags', JSON.stringify([]))

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          // Gradually increase progress, but don't go to 100% until done
          if (prev < 90) {
            return prev + 10
          }
          return prev
        })
      }, 200)

      // Make bulk upload request
      const response = await api.post(
        `/events/${eventId}/albums/${albumId}/photos/bulk/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Check if upload was successful
      if (response.data && response.data.uploaded) {
        console.log(`Successfully uploaded ${response.data.uploaded.length} photos`)
      }
      
      // Clear files and refresh photos - add small delay to ensure backend has saved photos
      setUploadFiles([])
      setUploadProgress(0)
      
      // Wait a moment for backend to process, then fetch
      setTimeout(() => {
        fetchPhotos()
      }, 500)
    } catch (err) {
      console.error('Bulk upload failed:', err)
      alert(`Failed to upload photos: ${err?.response?.data?.detail || err?.message || 'Unknown error'}`)
      setUploadProgress(0)
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
              padding: '12px 0',
              marginBottom: '32px',
              marginTop: '16px',
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
            {user && canUpload(user.role) && (
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
                      e.currentTarget.style.background = '#6b9b9f'
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
              {photos.map(photo => {
                // Use image or thumbnail - prefer thumbnail for gallery, fallback to image
                const imageSource = photo.thumbnail || photo.image
                
                // #region agent log
                fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:295',message:'Rendering photo',data:{photoId:photo.id,hasImage:!!photo.image,hasThumbnail:!!photo.thumbnail,imageValue:photo.image,thumbnailValue:photo.thumbnail,processingStatus:photo.processing_status,imageSource},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2,H5'})}).catch(()=>{});
                // #endregion
                
                console.log('Rendering photo:', photo.id, 'image:', photo.image, 'thumbnail:', photo.thumbnail, 'processing_status:', photo.processing_status)
                let imageUrl = null
                if (imageSource) {
                  if (imageSource.startsWith('http://') || imageSource.startsWith('https://')) {
                    imageUrl = imageSource
                  } else if (imageSource.startsWith('/')) {
                    imageUrl = `http://localhost:8000${imageSource}`
                  } else {
                    imageUrl = `http://localhost:8000/${imageSource}`
                  }
                  
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:300',message:'Image URL constructed',data:{photoId:photo.id,imageUrl,imageSource},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H5'})}).catch(()=>{});
                  // #endregion
                } else {
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/69418a1c-11a7-4033-a5d0-1680a2112c44',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AlbumGallery.jsx:308',message:'No image source available',data:{photoId:photo.id,hasImage:!!photo.image,hasThumbnail:!!photo.thumbnail},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'H2'})}).catch(()=>{});
                  // #endregion
                }
                
                return (
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
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={`Photo ${photo.id}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        loading="lazy"
                        onError={(e) => {
                          console.error('Image failed to load:', imageUrl, 'Photo data:', photo)
                          e.target.style.display = 'none'
                        }}
                      />
                    ) : photo.processing_status === 'processing' || photo.processing_status === 'pending' ? (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        gap: '8px'
                      }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          border: '3px solid var(--border)',
                          borderTopColor: 'var(--accent)',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        background: 'var(--surface)',
                        color: 'var(--text-secondary)',
                        fontSize: '12px'
                      }}>
                        No image
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
