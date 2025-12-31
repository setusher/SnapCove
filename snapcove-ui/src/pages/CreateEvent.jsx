import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import TopNav from "../components/TopNav"
import { ChevronLeft } from "lucide-react"

export default function CreateEvent(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post("/events/", {
        title,
        description,
        start_date: start,
        end_date: end
      })
      nav("/dashboard")
    } catch(err) {
      alert("Failed to create event")
    } finally {
      setLoading(false)
    }
  }

  return(
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <TopNav />
      
      <div className="container" style={{ paddingTop: '64px', padding: `var(--space-12) var(--space-6)`, minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost"
            style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            Back to Events
          </button>

          <div style={{ marginBottom: 'var(--space-10)' }}>
            <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>Create Event</h1>
            <p className="text-body" style={{ color: 'var(--secondary-text)' }}>Add a new event to your gallery</p>
          </div>

          <div className="card">
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                  Event Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Annual Tech Conference 2024"
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
                  placeholder="Tell us about this event..."
                  rows={5}
                  className="input"
                />
              </div>

              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                    Start Date *
                  </label>
                  <input 
                    type="date"
                    value={start}
                    onChange={e => setStart(e.target.value)} 
                    required
                    className="input"
                  />
                </div>

                <div>
                  <label className="text-caption" style={{ display: 'block', marginBottom: 'var(--space-2)', color: 'var(--secondary-text)' }}>
                    End Date *
                  </label>
                  <input 
                    type="date"
                    value={end}
                    onChange={e => setEnd(e.target.value)} 
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="flex" style={{ gap: 'var(--space-4)', paddingTop: 'var(--space-4)' }}>
                <button 
                  type="button"
                  onClick={() => nav("/dashboard")}
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
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

