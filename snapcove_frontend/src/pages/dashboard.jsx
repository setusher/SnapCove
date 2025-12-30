import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"

export default function Dashboard(){
  const [events,setEvents] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    api.get("/events/")
      .then(r=>setEvents(r.data))
  },[])

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Events</h1>
        <button onClick={()=>nav("/events/create")}
          className="px-5 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500">
          + Create Event
        </button>
      </div>

      {events.length===0 && (
        <p className="text-gray-400">No events yet. Create your first one!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {events.map(e=>(
          <div key={e.id} className="bg-gray-900 p-6 rounded-xl">
            <h2 className="font-semibold mb-2">{e.title}</h2>
            <p className="text-gray-400 text-sm">{e.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
