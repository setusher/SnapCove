import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/api"
import NavRail from "../components/NavRail"
import TopNav from "../components/TopNav"

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
    <div className="min-h-screen animate-pageFade" style={{ background: 'var(--ink)' }}>
      <NavRail />
      
      <div className="dashboard-container" style={{ paddingTop: '120px' }}>
        <TopNav 
          title="Create Album"
          subtitle="Add a new photo collection"
        />

        <div className="px-16 py-12 max-w-3xl">
          <form onSubmit={submit} className="card p-14 space-y-12 animate-slideUp">
            <div className="space-y-10">
              <div>
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
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
                <label 
                  className="block text-sm font-medium mb-5"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Description
                </label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Add a description for this album..."
                  rows={6}
                  className="input-field resize-none"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-8">
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
  )
}
