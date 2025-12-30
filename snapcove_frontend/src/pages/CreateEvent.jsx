import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function CreateEvent(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    <div className="app-layout animate-pageFade">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Create Event"
          subtitle="Add a new event to your gallery"
        />

        <div className="p-8 lg:p-12 max-w-4xl mx-auto">
          <form onSubmit={submit} className="card p-10 space-y-8 animate-slideUp">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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
                <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Tell us about this event..."
                  rows={5}
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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
                <label className="block text-sm font-medium text-[#e8eaed]/80 mb-3">
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

            <div className="flex gap-4 pt-6">
              <button 
                type="button"
                onClick={() => nav("/dashboard")}
                className="btn btn-ghost flex-1">
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1">
                {loading ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
