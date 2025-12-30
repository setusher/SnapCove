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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div className="max-w-[800px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="flex items-center gap-1.5 mb-6 transition-colors"
            style={{ 
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--text-tertiary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)'
            }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          {/* Page Header */}
          <div className="mb-10" style={{ marginBottom: '40px' }}>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.2', fontSize: '32px' }}>
              Create Album
            </h1>
            <p className="text-base" style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
              Add a new photo collection
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Album Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Summer Memories 2024"
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Add a description for this album..."
                  rows={5}
                  className="input-field"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => nav(`/events/${eventId}`)}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
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
