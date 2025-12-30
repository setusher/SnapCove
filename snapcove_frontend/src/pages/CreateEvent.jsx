import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function CreateEvent(){
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const nav = useNavigate()

  const submit = async () => {
    await api.post("/events/", {
      title,
      description,
      start_date: start,
      end_date: end
    })
    nav("/dashboard")
  }

  return(
    <div className="min-h-screen flex justify-center items-center px-4 page-container"
         style={{ background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 100%)' }}>
      <div className="glow-card p-10 rounded-2xl w-full max-w-lg space-y-6"
           style={{ backgroundColor: '#1c2541' }}>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-2">Create Event</h2>
          <p className="text-gray-400">Fill in the details for your new event</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Event Title
            </label>
            <input 
              placeholder="Annual Tech Conference 2024" 
              onChange={e => setTitle(e.target.value)} 
              className="glow-input w-full p-4 rounded-xl text-white"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
              Description
            </label>
            <textarea 
              placeholder="Tell us about your event..." 
              onChange={e => setDescription(e.target.value)} 
              className="glow-input w-full p-4 rounded-xl text-white min-h-32 resize-none"
              style={{ backgroundColor: '#0b132b' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
                Start Date
              </label>
              <input 
                type="date" 
                onChange={e => setStart(e.target.value)} 
                className="glow-input w-full p-4 rounded-xl text-white"
                style={{ backgroundColor: '#0b132b' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#5bc0be' }}>
                End Date
              </label>
              <input 
                type="date" 
                onChange={e => setEnd(e.target.value)} 
                className="glow-input w-full p-4 rounded-xl text-white"
                style={{ backgroundColor: '#0b132b' }}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            onClick={() => nav("/dashboard")}
            className="flex-1 p-4 rounded-xl font-semibold border-2 hover:bg-opacity-10"
            style={{ borderColor: '#3a506b', color: '#5bc0be', backgroundColor: 'transparent' }}>
            Cancel
          </button>
          
          <button 
            onClick={submit} 
            className="glow-button flex-1 p-4 rounded-xl font-semibold relative z-10"
            style={{ background: 'linear-gradient(135deg, #5bc0be, #6fffe9)', color: '#0b132b' }}>
            Create Event
          </button>
        </div>
      </div>
    </div>
  )
}