import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"

export default function Dashboard(){
  const [events,setEvents] = useState([])
  const { user } = useAuth()
  const nav = useNavigate()

  useEffect(()=>{
    api.get("/events/")
      .then(r=>setEvents(r.data))
  },[])

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between mb-8 items-center">
        <h1 className="text-4xl font-bold">Events</h1>

        {["admin","coordinator"].includes(user?.role) && (
          <button onClick={()=>nav("/events/create")}
            className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">
            + Create Event
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(e=>(
          <div key={e.id} onClick={()=>nav(`/events/${e.id}`)}
            className="cursor-pointer bg-gray-900 rounded-xl p-6 hover:bg-gray-800">
            <h2 className="font-semibold mb-1">{e.title}</h2>
            <p className="text-gray-400 text-sm">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
