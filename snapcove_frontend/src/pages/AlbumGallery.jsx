import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../api/api"

export default function AlbumGallery(){
  const { eventId, albumId } = useParams()
  const [photos,setPhotos] = useState([])

  useEffect(()=>{
    api.get(`/events/${eventId}/albums/${albumId}/photos/`)
      .then(r=>setPhotos(r.data))
  },[eventId, albumId])

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8">Photos</h1>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
        {photos.map(p=>(
          <img key={p.id} src={p.image} className="mb-4 rounded-xl"/>
        ))}
      </div>
    </div>
  )
}
