import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import NavRail from "../components/NavRail"
import TopNav from "../components/TopNav"

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
    <div className="min-h-screen animate-pageFade" style={{ background: 'var(--ink)' }}>
      <NavRail />
      
      <div className="dashboard-container" style={{ paddingTop: '120px' }}>
        <TopNav 
          title="Create Event"
          subtitle="Add a new event to your gallery"
        />

        <div className="px-16 py-12 max-w-4xl">
          <form onSubmit={submit} className="card p-14 space-y-12 animate-slideUp">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
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

              <div className="md:col-span-2">
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Tell us about this event..."
                  rows={6}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
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
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
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

            <div className="flex gap-6 pt-8">
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
  )
}
