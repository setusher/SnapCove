import { useParams,useNavigate } from "react-router-dom"
import { useState } from "react"
import { api } from "../api/api"

export default function CreateAlbum(){
  const { id } = useParams()
  const [title,setTitle]=useState("")
  const nav = useNavigate()

  const submit = async()=>{
    await api.post(`/events/${id}/albums/`, { title })
    nav(`/events/${id}`)
  }

  return(
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="bg-gray-900 p-8 rounded-xl space-y-4 w-96">
        <h2 className="text-xl font-bold">Create Album</h2>
        <input onChange={e=>setTitle(e.target.value)} placeholder="Album Title" className="w-full p-3 bg-black rounded"/>
        <button onClick={submit} className="bg-indigo-600 w-full p-3 rounded">Create</button>
      </div>
    </div>
  )
}
