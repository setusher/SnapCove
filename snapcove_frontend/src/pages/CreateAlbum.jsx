import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/api"

export default function CreateAlbum(){
  const { eventId } = useParams()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const nav = useNavigate()

  const submit = async() => {
    await api.post(`/events/${eventId}/albums/`, { title, description })
    nav(`/events/${eventId}`)
  }

  return(
    <div className="min-h-screen flex justify-center items-center px-4 page-container"
         style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)' }}>
      <div className="glow-card p-10 rounded-2xl space-y-6 w-full max-w-lg"
           style={{ backgroundColor: '#1c2541' }}>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-2">Create Album</h2>
          <p className="text-gray-400">Add a new photo collection</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Album Title
            </label>
            <input 
              onChange={e => setTitle(e.target.value)} 
              placeholder="Summer Memories 2024" 
              className="glow-input w-full p-4 rounded-xl text-white"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Description (Optional)
            </label>
            <textarea 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Add a description for this album..." 
              className="glow-input w-full p-4 rounded-xl text-white min-h-32 resize-none"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => nav(`/events/${eventId}`)}
            className="flex-1 p-4 rounded-xl font-semibold border-2 hover:bg-opacity-10"
            style={{ borderColor: '#3a506b', color: '#5bc0be', backgroundColor: 'transparent' }}>
            Cancel
          </button>
          
          <button 
            onClick={submit} 
            className="glow-button flex-1 p-4 rounded-xl font-semibold relative z-10"
            style={{ background: 'linear-gradient(135deg, #5bc0be, #6fffe9)', color: '#0b132b' }}>
            Create Album
          </button>
        </div>
      </div>
    </div>
  )
}