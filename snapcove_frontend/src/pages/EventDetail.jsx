import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"
import Sidebar from "../components/Sidebar"
import TopBar from "../components/TopBar"

export default function EventDetail(){
  const { eventId } = useParams()
  const { user } = useAuth()
  const [albums, setAlbums] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    api.get(`/events/${eventId}/albums/`)
      .then(r => setAlbums(r.data))
  }, [eventId])

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="main-content">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)}
          title="Albums"
          subtitle={`${albums.length} photo collections`}
          action={
            ["admin", "coordinator", "photographer"].includes(user?.role) && (
              <button 
                onClick={() => nav(`/events/${eventId}/albums/create`)}
                className="btn btn-primary">
                <span>➕</span>
                New Album
              </button>
            )
          }
        />

        <div className="p-6">
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost mb-6">
            <span>←</span>
            Back to Events
          </button>

          {albums.length === 0 ? (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-800 flex items-center justify-center text-4xl">
                📸
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No albums yet</h3>
              <p className="text-gray-400 mb-6">Create your first album to organize photos</p>
              {["admin", "coordinator", "photographer"].includes(user?.role) && (
                <button 
                  onClick={() => nav(`/events/${eventId}/albums/create`)}
                  className="btn btn-primary">
                  <span>➕</span>
                  Create Album
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <div 
                  key={album.id}
                  onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                  className="card p-6 cursor-pointer stagger-item group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-400/20 flex items-center justify-center text-2xl">
                      📷
                    </div>
                    <span className="text-xs text-gray-500 group-hover:text-cyan-400">View →</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg text-white mb-2">
                    {album.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {album.description || "No description"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}