import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { Camera, User as UserIcon } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      api.get(`/photos/user/?user_id=${user.id}`)
        .then(r => {
          setPhotos(r.data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user])

  const getRoleDisplay = (role) => {
    const roleMap = {
      'admin': 'Admin',
      'coordinator': 'Event Coordinator',
      'photographer': 'Photographer',
      'student': 'Student'
    }
    return roleMap[role] || role || 'Not set'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
       
          <div style={{ 
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '40px',
            marginBottom: '40px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px' }}>

              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: user?.profile_picture ? 'none' : 'var(--surface)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                {user?.profile_picture ? (
                  <img 
                    src={user.profile_picture} 
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <UserIcon size={48} style={{ color: 'var(--text-secondary)', opacity: 0.5 }} />
                )}
              </div>


              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: 600, 
                  lineHeight: 1.2, 
                  color: 'var(--text-primary)', 
                  marginBottom: '12px' 
                }}>
                  {user?.name || 'User'}
                </h1>
                <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                  {user?.email || 'user@example.com'}
                </div>

                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '24px' 
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Role
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {getRoleDisplay(user?.role)}
                    </div>
                  </div>
                  {user?.batch && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Batch
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {user.batch}
                      </div>
                    </div>
                  )}
                  {user?.department && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Department
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {user.department}
                      </div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Photos Posted
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {photos.length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: 600, 
              lineHeight: 1.2, 
              color: 'var(--text-primary)', 
              marginBottom: '8px' 
            }}>
              My Photos
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px' }}>
              Photos you have uploaded
            </p>

            {loading ? (
              <div style={{ 
                background: 'var(--bg)', 
                border: '1px solid var(--border)', 
                borderRadius: '10px', 
                padding: '48px', 
                textAlign: 'center' 
              }}>
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    border: '2px solid var(--accent)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    animation: 'spin 1s linear infinite'
                  }}
                />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Loading photos...</p>
              </div>
            ) : photos.length === 0 ? (
              <div style={{ 
                background: 'var(--bg)', 
                border: '1px solid var(--border)', 
                borderRadius: '10px', 
                padding: '48px', 
                textAlign: 'center' 
              }}>
                <Camera size={48} style={{ color: 'var(--text-secondary)', margin: '0 auto 16px', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  You haven't uploaded any photos yet.
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
                      alt={photo.caption || `Photo ${photo.id}`}
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
    </div>
  )
}

