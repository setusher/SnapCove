import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/api"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function CreateAlbum(){
  const { eventId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Create Album"
          subtitle="Add a new photo collection"
        />

        <div className="p-6 max-w-2xl mx-auto">
          <form onSubmit={submit} className="card p-8 space-y-6 animate-slideUp">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Add a description for this album..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => nav(`/events/${eventId}`)}
                className="btn btn-ghost flex-1">
                Cancel
              </button>
              
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1">
                {loading ? 'Creating...' : 'Create Album'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}