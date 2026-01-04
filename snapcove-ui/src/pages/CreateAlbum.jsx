import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft } from "lucide-react"

export default function CreateAlbum(){
  const { eventId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async(e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/events/${eventId}/albums/`, { title, description })
      nav(`/events/${eventId}`)
    } catch(err) {
      alert("Failed to create album")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div style={{ paddingTop: '64px', padding: 'var(--section-padding-y) var(--page-padding-x)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            style={{ 
              marginBottom: 'var(--card-gap)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '12px 0',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          <div style={{ 
            background: 'var(--elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-card)',
            padding: 'var(--card-padding)'
          }}>
            <div style={{ marginBottom: 'var(--card-padding)' }}>
              <h1 style={{ fontSize: '36px', fontWeight: 600, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '8px' }}>Create Album</h1>
              <p style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>Add a new photo collection</p>
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--form-field-gap)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Album Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Summer Memories 2024"
                  required
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
                  onFocus={(e) => {
                    e.target.style.outline = '2px solid var(--accent)'
                    e.target.style.outlineOffset = '0'
                    e.target.style.borderColor = 'transparent'
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = 'none'
                    e.target.style.borderColor = 'var(--border-subtle)'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Add a description for this album..."
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'var(--surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-button)',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    transition: 'border-color 0.2s ease, outline 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.outline = '2px solid var(--accent)'
                    e.target.style.outlineOffset = '0'
                    e.target.style.borderColor = 'transparent'
                  }}
                  onBlur={(e) => {
                    e.target.style.outline = 'none'
                    e.target.style.borderColor = 'var(--border-subtle)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', paddingTop: 'var(--form-field-gap)' }}>
                <button 
                  type="button"
                  onClick={() => nav(`/events/${eventId}`)}
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
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: 'var(--button-padding)',
                    background: 'var(--accent)',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-button)',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = '#1a9bc2'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'var(--accent)'
                    }
                  }}
                >
                  {loading ? 'Creating...' : 'Create Album'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

