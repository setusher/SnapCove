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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <TopNav />
      
      <div className="pt-16" style={{ paddingTop: '64px', padding: '48px 64px', minHeight: '100vh' }}>
        <div className="max-w-[800px] mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => nav("/dashboard")}
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
            Back to Events
          </button>

          {/* Page Header */}
          <div className="mb-10" style={{ marginBottom: '40px' }}>
            <h1 className="text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)', lineHeight: '1.2', fontSize: '32px' }}>
              Create Event
            </h1>
            <p className="text-base" style={{ color: 'var(--text-tertiary)', fontSize: '16px' }}>
              Add a new event to your gallery
            </p>
          </div>

          {/* Form */}
          <div className="card">
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Event Title *
                </label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Annual Tech Conference 2024"
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
                  placeholder="Tell us about this event..."
                  rows={5}
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Start Date *
                  </label>
                  <input 
                    type="date"
                    value={start}
                    onChange={e => setStart(e.target.value)} 
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-meta mb-2" style={{ color: 'var(--text-secondary)' }}>
                    End Date *
                  </label>
                  <input 
                    type="date"
                    value={end}
                    onChange={e => setEnd(e.target.value)} 
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => nav("/dashboard")}
                  className="btn btn-ghost flex-1"
                >
                  Cancel
                </button>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
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
