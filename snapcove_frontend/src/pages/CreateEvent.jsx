import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function CreateEvent(){
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const nav = useNavigate()

  const submit = async()=>{
    await api.post("/events/", { title, description })
    nav("/dashboard")
  }

  return(
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold">Create Event</h2>
        <input onChange={e=>setTitle(e.target.value)} placeholder="Event Title"
          className="w-full p-3 bg-black border border-gray-700 rounded"/>
        <textarea onChange={e=>setDescription(e.target.value)} placeholder="Description"
          className="w-full p-3 bg-black border border-gray-700 rounded"/>
        <button onClick={submit}
          className="w-full p-3 bg-indigo-600 rounded hover:bg-indigo-500">
          Create
        </button>
      </div>
    </div>
  )
}
