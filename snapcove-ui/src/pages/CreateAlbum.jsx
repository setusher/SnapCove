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
    <div style={{ minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <TopNav />
      
      <div className="container" style={{ paddingTop: '64px', padding: `var(--space-12) var(--space-6)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="btn btn-ghost"
            style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Albums
          </button>

          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>Create Album</h1>
            <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Add a new photo collection</p>
          </div>

          <div className="card">
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                  Album Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Summer Memories 2024"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Add a description for this album..."
                  rows={5}
                  className="input"
                />
              </div>

              <div className="flex" style={{ gap: 'var(--space-4)', paddingTop: 'var(--space-4)' }}>
                <button 
                  type="button"
                  onClick={() => nav(`/events/${eventId}`)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
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

