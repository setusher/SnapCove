import { useParams,useNavigate } from "react-router-dom"
import { useEffect,useState } from "react"
import { api } from "../api/api"
import { useAuth } from "../auth/AuthProvider"

export default function EventDetail(){
  const { id } = useParams()
  const { user } = useAuth()
  const [albums,setAlbums] = useState([])
  const nav = useNavigate()

  useEffect(()=>{
    api.get(`/events/${id}/albums/`)
      .then(r=>setAlbums(r.data))
  },[])

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Albums</h1>

        {["admin","coordinator","photographer"].includes(user?.role) && (
          <button onClick={()=>nav(`/events/${id}/albums/create`)}
            className="bg-indigo-600 px-4 py-2 rounded">
            + Create Album
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {albums.map(a=>(
          <div key={a.id} onClick={()=>nav(`/albums/${a.id}`)}
            className="bg-gray-900 p-5 rounded-xl cursor-pointer hover:bg-gray-800">
            <h2 className="font-semibold">{a.title}</h2>
            <p className="text-gray-400 text-sm">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
