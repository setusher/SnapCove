import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft, Upload, X, UserPlus, XCircle } from "lucide-react"
import { useAuth } from "../auth/AuthProvider"
import { canUpload } from "../utils/roles"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos, setPhotos] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadFiles, setUploadFiles] = useState([])
  const [showTagModal, setShowTagModal] = useState(false)
  const [taggedUsers, setTaggedUsers] = useState([])
  const [userEmailInput, setUserEmailInput] = useState("")
  const [userSuggestions, setUserSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const suggestionRef = useRef(null)
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
      setShowTagModal(true)
      setTaggedUsers([])
      setUserEmailInput("")
    }
  }

  const searchUsers = async (query) => {
    if (!query || query.length < 2) {
      setUserSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const response = await api.get(`/auth/users/search/?q=${encodeURIComponent(query)}`)
      setUserSuggestions(response.data || [])
      setShowSuggestions(true)
    } catch (err) {
      console.error("Error searching users:", err)
      setUserSuggestions([])
    }
  }

  const handleUserInputChange = (e) => {
    const value = e.target.value
    setUserEmailInput(value)
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Debounce search
    const timeout = setTimeout(() => {
      searchUsers(value)
    }, 300)
    setSearchTimeout(timeout)
  }

  const selectUser = (user) => {
    const email = user.email.toLowerCase()
    if (!taggedUsers.includes(email)) {
      setTaggedUsers([...taggedUsers, email])
    }
    setUserEmailInput("")
    setShowSuggestions(false)
    setUserSuggestions([])
  }

  const addTaggedUser = () => {
    const email = userEmailInput.trim().toLowerCase()
    if (email && !taggedUsers.includes(email)) {
      setTaggedUsers([...taggedUsers, email])
      setUserEmailInput("")
      setShowSuggestions(false)
    }
  }

  const removeTaggedUser = (email) => {
    setTaggedUsers(taggedUsers.filter(e => e !== email))
  }

  const handleTagModalClose = () => {
    setShowTagModal(false)
    setTaggedUsers([])
    setUserEmailInput("")
    setShowSuggestions(false)
    setUserSuggestions([])
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
  }

  const handleTagModalConfirm = async () => {
    setShowTagModal(false)
    setShowSuggestions(false)
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    await handleUpload()
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        
        // Tag users to all uploaded photos
        if (taggedUsers.length > 0 && response.data.uploaded.length > 0) {
          try {
            let successCount = 0
            let failCount = 0
            
            // Tag each user to each photo using their email
            // Backend will automatically send notifications via WebSocket when tags are created
            for (const photoId of response.data.uploaded) {
              for (const userEmail of taggedUsers) {
                try {
                  await api.post(`/photos/${photoId}/tag/`, { 
                    email: userEmail 
                  })
                  successCount++
                } catch (tagErr) {
                  console.warn(`Failed to tag ${userEmail} to photo ${photoId}:`, tagErr)
                  failCount++
                  // Continue with other tags even if one fails
                }
              }
            }
            
            // Provide feedback on tagging results
            if (successCount > 0) {
              console.log(`Successfully tagged ${successCount} user(s) in ${response.data.uploaded.length} photo(s)`)
            }
            if (failCount > 0) {
              console.warn(`Failed to tag ${failCount} user(s). They may not exist in the system.`)
            }
          } catch (tagError) {
            console.error("Error tagging users:", tagError)
            // Don't fail the upload if tagging fails
          }
        }
      }
      
      // Clear files and refresh photos - add small delay to ensure backend has saved photos
      setUploadFiles([])
      setTaggedUsers([])
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
      
      <div style={{ paddingTop: '64px', padding: 'var(--section-padding-y) var(--page-padding-x)', minHeight: '100vh' }}>
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
              marginBottom: 'var(--section-padding-y)',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--section-padding-y)' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Gallery
              </h1>
              <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>
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
                    padding: 'var(--button-padding)',
                    background: 'var(--accent)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = '#1a9bc2'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!uploading) {
                      e.currentTarget.style.background = 'var(--accent)'
                    }
                  }}
                >
                  <Upload size={16} strokeWidth={2} />
                  {uploading ? 'Uploading...' : 'Upload Photos'}
                </button>

                {/* Upload Files Preview */}
                {uploadFiles.length > 0 && !uploading && !showTagModal && (
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
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
                      onClick={() => setShowTagModal(true)}
                      style={{
                        width: '100%',
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
                      Continue to Tag People
                    </button>
                  </div>
                )}

                {/* Upload Progress */}
                {uploading && (
                  <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
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
              background: 'var(--surface)', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-card)', 
              padding: 'var(--section-padding-y)', 
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
                          border: '2px solid var(--accent)',
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

      {/* Tag People Modal */}
      {showTagModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 17, 40, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={handleTagModalClose}>
          <div style={{
            background: 'var(--elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--card-padding)',
            maxWidth: '560px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--card-padding)' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Tag People
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Add people to tag in {uploadFiles.length} {uploadFiles.length === 1 ? 'photo' : 'photos'} (optional)
                </p>
              </div>
              <button
                onClick={handleTagModalClose}
                style={{
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
            </div>

            {/* Tag Input */}
            <div style={{ marginBottom: 'var(--form-field-gap)', position: 'relative' }} ref={suggestionRef}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Search & Tag People
              </label>
              <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={userEmailInput}
                    onChange={handleUserInputChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTaggedUser()
                      }
                    }}
                    onFocus={(e) => {
                      e.target.style.outline = '2px solid var(--accent)'
                      e.target.style.outlineOffset = '0'
                      e.target.style.borderColor = 'transparent'
                      if (userSuggestions.length > 0) {
                        setShowSuggestions(true)
                      }
                    }}
                    onBlur={(e) => {
                      e.target.style.outline = 'none'
                      e.target.style.borderColor = 'var(--border-subtle)'
                    }}
                    placeholder="Search by name or email..."
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-button)',
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s ease, outline 0.2s ease'
                    }}
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && userSuggestions.length > 0 && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      marginTop: '4px',
                      background: 'var(--elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-card)',
                      maxHeight: '240px',
                      overflowY: 'auto',
                      zIndex: 1000,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}>
                      {userSuggestions
                        .filter(u => !taggedUsers.includes(u.email.toLowerCase()))
                        .map((user) => (
                        <div
                          key={user.id}
                          onClick={() => selectUser(user)}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                            {user.name}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {user.email}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={addTaggedUser}
                  style={{
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
                    gap: '8px',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1a9bc2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent)'}
                >
                  <UserPlus size={16} />
                  Add
                </button>
              </div>
            </div>

            {/* Tagged Users List */}
            {taggedUsers.length > 0 && (
              <div style={{ marginBottom: 'var(--form-field-gap)' }}>
                <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tagged People ({taggedUsers.length})
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  padding: '12px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-card)',
                  minHeight: '60px',
                  maxHeight: '200px',
                  overflowY: 'auto'
                }}>
                  {taggedUsers.map((email, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 12px',
                        background: 'var(--elevated)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-button)',
                        fontSize: '13px',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <span>{email}</span>
                      <button
                        onClick={() => removeTaggedUser(email)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          padding: '0',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', paddingTop: 'var(--form-field-gap)' }}>
              <button
                onClick={handleTagModalClose}
                style={{
                  flex: 1,
                  padding: 'var(--button-padding)',
                  background: 'transparent',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-button)',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--surface)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleTagModalConfirm}
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
                <Upload size={16} />
                Upload & Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
