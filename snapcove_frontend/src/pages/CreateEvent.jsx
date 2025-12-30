import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { api } from "../api/api"

export default function CreateEvent(){
  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [start,setStart] = useState("")
  const [end,setEnd] = useState("")
  const nav = useNavigate()

  const submit = async ()=>{
    await api.post("/events/", {
      title,
      description,
      start_date:start,
      end_date:end
    })
    nav("/dashboard")
  }

  return(
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-xl w-96 space-y-4">
        <h2 className="text-xl font-bold">Create Event</h2>
        <input type="date" onChange={e=>setStart(e.target.value)} className="w-full p-3 bg-black rounded"/>
        <input type="date" onChange={e=>setEnd(e.target.value)} className="w-full p-3 bg-black rounded"/>
        <input placeholder="Title" onChange={e=>setTitle(e.target.value)} className="w-full p-3 bg-black rounded"/>
        <textarea placeholder="Description" onChange={e=>setDescription(e.target.value)} className="w-full p-3 bg-black rounded"/>
        <button onClick={submit} className="w-full bg-indigo-600 p-3 rounded">Create</button>
      </div>
    </div>
  )
}
