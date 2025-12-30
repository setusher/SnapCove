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
    <div className="app-layout animate-pageFade">
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

        <div className="p-8 lg:p-12">
          <button 
            onClick={() => nav("/dashboard")}
            className="btn btn-ghost mb-8">
            <span>←</span>
            Back to Events
          </button>

          {albums.length === 0 ? (
            <div className="text-center py-32 animate-fadeIn">
              <div className="w-24 h-24 mx-auto mb-8 rounded-[28px] bg-navy border border-slate/30 flex items-center justify-center text-5xl shadow-floating">
                📸
              </div>
              <h3 className="text-section text-[#e8eaed] mb-3 tracking-tight">No albums yet</h3>
              <p className="text-meta text-[#e8eaed]/60 mb-8">Create your first album to organize photos</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album, idx) => (
                <div 
                  key={album.id}
                  onClick={() => nav(`/events/${eventId}/albums/${album.id}`)}
                  className="card p-8 cursor-pointer stagger-item group"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-[20px] bg-aqua/10 border border-aqua/20 flex items-center justify-center text-3xl group-hover:bg-aqua/20 group-hover:border-aqua/40 transition-all">
                      📷
                    </div>
                    <span className="text-meta text-[#e8eaed]/50 group-hover:text-aqua transition-colors">View →</span>
                  </div>
                  
                  <h3 className="text-card-title text-[#e8eaed] mb-3 tracking-tight">
                    {album.title}
                  </h3>
                  <p className="text-meta text-[#e8eaed]/60 line-clamp-2 leading-relaxed">
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
